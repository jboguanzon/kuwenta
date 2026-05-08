import { os } from "@orpc/server";
import { and, desc, eq, sql, sum } from "drizzle-orm";
import type {
	NodePgDatabase,
	NodePgQueryResultHKT,
} from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import * as z from "zod";
import {
	budgets,
	createBudgetsSchema,
	updateBudgetsSchema,
} from "#/db/budgets-schema";
import { categories } from "#/db/categories-schema";
import { db, type schema } from "#/db/index";

type Tx = PgTransaction<NodePgQueryResultHKT, typeof schema>;
type DbOrTx = NodePgDatabase<typeof schema> | Tx;

// Cast to db type for .query calls — PgTransaction supports the same API at runtime
function asQueryable(dbOrTx: DbOrTx): NodePgDatabase<typeof schema> {
	return dbOrTx as NodePgDatabase<typeof schema>;
}

async function updateParentBudgets(
	categoryId: string,
	month: string,
	dbOrTx: DbOrTx = db,
): Promise<void> {
	const q = asQueryable(dbOrTx);

	const category = await q.query.categories.findFirst({
		where: eq(categories.id, categoryId),
	});

	if (!category?.parentId) return;

	const parentId = category.parentId;

	const childBudgetsResult = await dbOrTx
		.select({ total: sum(budgets.amount) })
		.from(budgets)
		.where(
			sql`${budgets.categoryId} IN (
        SELECT id FROM ${categories} WHERE ${categories.parentId} = ${parentId}
      ) AND ${budgets.month} = ${month}`,
		);

	const totalAmount = Number(childBudgetsResult[0]?.total) ?? 0;

	const existingParentBudget = await q.query.budgets.findFirst({
		where: (b) => and(eq(b.categoryId, parentId), eq(b.month, month)),
	});

	if (existingParentBudget) {
		await dbOrTx
			.update(budgets)
			.set({ amount: totalAmount })
			.where(eq(budgets.id, existingParentBudget.id));
	} else if (totalAmount > 0) {
		await dbOrTx.insert(budgets).values({
			id: crypto.randomUUID(),
			month,
			categoryId: parentId,
			amount: totalAmount,
		});
	}

	await updateParentBudgets(parentId, month, dbOrTx);
}

export const listBudgets = os.input(z.object({})).handler(() => {
	return db.query.budgets.findMany({
		orderBy: [desc(budgets.createdAt)],
	});
});

export const addBudget = os
	.input(createBudgetsSchema)
	.handler(async ({ input }) => {
		const newBudget = await db.insert(budgets).values({ ...input });
		await updateParentBudgets(input.categoryId, input.month);
		return newBudget;
	});

export const updateBudget = os
	.input(updateBudgetsSchema)
	.handler(async ({ input }) => {
		const result = await db.transaction(async (tx) => {
			const q = asQueryable(tx);

			const budgetBeforeUpdate = await q.query.budgets.findFirst({
				where: eq(budgets.id, input.id),
			});

			const [updatedBudget] = await tx
				.update(budgets)
				.set({ ...input })
				.where(eq(budgets.id, input.id))
				.returning();

			if (budgetBeforeUpdate) {
				const categoryId = input.categoryId ?? budgetBeforeUpdate.categoryId;
				const month = input.month ?? budgetBeforeUpdate.month;
				await updateParentBudgets(categoryId, month, tx);
			}

			const txidResult = await tx.execute<{ txid: string }>(
				sql`SELECT txid_current()::text AS txid`,
			);

			return { ...updatedBudget, txid: Number(txidResult.rows[0].txid) };
		});

		return result;
	});

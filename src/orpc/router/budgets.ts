import { os } from "@orpc/server";
import { desc, eq } from "drizzle-orm";
import * as z from "zod";
import {
	budgets,
	createBudgetsSchema,
	updateBudgetsSchema,
} from "#/db/budgets-schema";
import { db } from "#/db/index";

export const listBudgets = os.input(z.object({})).handler(() => {
	return db.query.budgets.findMany({
		orderBy: [desc(budgets.createdAt)],
	});
});

export const addBudget = os
	.input(createBudgetsSchema)
	.handler(async ({ input }) => {
		const newBudget = await db.insert(budgets).values({ ...input });
		return newBudget;
	});

export const updateBudget = os
	.input(updateBudgetsSchema)
	.handler(async ({ input }) => {
		const updatedBudget = await db
			.update(budgets)
			.set({ ...input })
			.where(eq(budgets.id, input.id));
		return updatedBudget;
	});

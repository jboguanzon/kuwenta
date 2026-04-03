import { os } from "@orpc/server";
import { desc } from "drizzle-orm";
import * as z from "zod";
import { db } from "#/db/index";
import { budgets, createBudgetsSchema } from "#/db/schema";

export const listBudgets = os.input(z.object({})).handler(() => {
	return db.query.budgets.findMany({
		orderBy: [desc(budgets.id)],
	});
});

export const addBudgets = os
	.input(createBudgetsSchema)
	.handler(async ({ input }) => {
		const newBudget = await db.insert(budgets).values({ ...input });
		return newBudget;
	});

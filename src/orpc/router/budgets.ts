import { os } from "@orpc/server";
import { desc } from "drizzle-orm";
import * as z from "zod";
import { budgets, createBudgetsSchema } from "#/db/budgets-schema";
import { db } from "#/db/index";

export const listBudgets = os.input(z.object({})).handler(() => {
	return db.query.budgets.findMany({
		orderBy: [desc(budgets.createdAt)],
	});
});

export const addBudgets = os
	.input(createBudgetsSchema)
	.handler(async ({ input }) => {
		const newBudget = await db.insert(budgets).values({ ...input });
		return newBudget;
	});

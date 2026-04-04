import { os } from "@orpc/server";
import { desc } from "drizzle-orm";
import * as z from "zod";
import { budgetPlans, createBudgetPlansSchema } from "#/db/budget-plans-schema";
import { db } from "#/db/index";

export const listBudgetPlans = os.input(z.object({})).handler(() => {
	return db.query.budgetPlans.findMany({
		orderBy: [desc(budgetPlans.createdAt)],
	});
});

export const addBudgetPlan = os
	.input(createBudgetPlansSchema)
	.handler(async ({ input }) => {
		const newBudgetPlan = await db.insert(budgetPlans).values({ ...input });
		return newBudgetPlan;
	});

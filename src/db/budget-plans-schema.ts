import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

const { createSelectSchema, createInsertSchema } = createSchemaFactory({
	zodInstance: z,
});

export const budgetPlans = pgTable("budget_plans", {
	id: uuid().primaryKey(),
	name: text().notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const selectBudgetPlansSchema = createSelectSchema(budgetPlans);
export const createBudgetPlansSchema = createInsertSchema(budgetPlans).omit({
	createdAt: true,
});

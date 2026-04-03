import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

const { createSelectSchema, createInsertSchema } = createSchemaFactory({
	zodInstance: z,
});

export const budgets = pgTable("budgets", {
	id: uuid().primaryKey(),
	name: text().notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const selectBudgetsSchema = createSelectSchema(budgets);
export const createBudgetsSchema = createInsertSchema(budgets).omit({
	createdAt: true,
});

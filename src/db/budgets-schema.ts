import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";
import { categories } from "./categories-schema";

const { createSelectSchema, createInsertSchema } = createSchemaFactory({
	zodInstance: z,
});

export const budgets = pgTable("budgets", {
	id: uuid().primaryKey(),
	name: text().notNull(),
	month: text().notNull(),
	categoryId: uuid("category_id").references(() => categories.id),
	amount: integer().default(0), // centi-units (cents * 100, e.g. 123.45 = 12345)
	createdAt: timestamp("created_at").defaultNow(),
});

export const selectBudgetsSchema = createSelectSchema(budgets);
export const createBudgetsSchema = createInsertSchema(budgets).omit({
	createdAt: true,
});

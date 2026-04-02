import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

const { createSelectSchema } = createSchemaFactory({ zodInstance: z });

export const budgets = pgTable("budgets", {
	id: serial().primaryKey(),
	name: text().notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const selectBudgetsSchema = createSelectSchema(budgets);

import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

const { createSelectSchema, createInsertSchema } = createSchemaFactory({
	zodInstance: z,
});

export const financialAccounts = pgTable("financial_accounts", {
	id: uuid().primaryKey(),
	name: text().notNull(),
	currentBalance: integer("current_balance"), // centi-units (cents * 100, e.g. 123.45 = 12345)
	createdAt: timestamp("created_at").defaultNow(),
});

export const selectFinancialAccountsSchema =
	createSelectSchema(financialAccounts);
export const createFinancialAccountsSchema = createInsertSchema(
	financialAccounts,
).omit({
	createdAt: true,
});

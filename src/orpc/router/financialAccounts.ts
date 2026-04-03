import { os } from "@orpc/server";
import { desc } from "drizzle-orm";
import * as z from "zod";
import {
	createFinancialAccountsSchema,
	financialAccounts,
} from "#/db/financial-accounts-schema";
import { db } from "#/db/index";

export const listFinancialAccounts = os.input(z.object({})).handler(() => {
	return db.query.financialAccounts.findMany({
		orderBy: [desc(financialAccounts.createdAt)],
	});
});

export const addFinancialAccount = os
	.input(createFinancialAccountsSchema)
	.handler(async ({ input }) => {
		const newFinancialAccount = await db
			.insert(financialAccounts)
			.values({ ...input });
		return newFinancialAccount;
	});

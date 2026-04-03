import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { selectFinancialAccountsSchema } from "#/db/financial-accounts-schema";
import { orpc } from "#/orpc/client";

export const financialAccountsCollection = createCollection(
	electricCollectionOptions({
		id: "financialAccounts",
		shapeOptions: {
			url: new URL(
				`/api/financialAccounts`,
				typeof window !== `undefined`
					? window.location.origin
					: `http://localhost:5173`,
			).toString(),
			columnMapper: snakeCamelMapper(),
		},
		schema: selectFinancialAccountsSchema,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			console.log(transaction);
			const { modified: newFinancialAccount } = transaction.mutations[0];
			orpc.addFinancialAccount.call({
				id: newFinancialAccount.id,
				name: newFinancialAccount.name,
				currentBalance: newFinancialAccount.currentBalance,
			});
		},
	}),
);

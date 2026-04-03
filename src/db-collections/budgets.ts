import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { selectBudgetsSchema } from "#/db/budgets-schema";
import { orpc } from "#/orpc/client";

export const budgetsCollection = createCollection(
	electricCollectionOptions({
		id: "budgets",
		shapeOptions: {
			url: new URL(
				`/api/budgets`,
				typeof window !== `undefined`
					? window.location.origin
					: `http://localhost:5173`,
			).toString(),
			columnMapper: snakeCamelMapper(),
		},
		schema: selectBudgetsSchema,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			console.log(transaction);
			const { modified: newBudget } = transaction.mutations[0];
			orpc.addBudgets.call({
				id: newBudget.id,
				name: newBudget.name,
			});
		},
	}),
);

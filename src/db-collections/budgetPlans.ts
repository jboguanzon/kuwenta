import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { selectBudgetPlansSchema } from "#/db/budget-plans-schema";
import { orpc } from "#/orpc/client";

export const budgetPlansCollection = createCollection(
	electricCollectionOptions({
		id: "budgetPlans",
		shapeOptions: {
			url: new URL(
				`/api/budgetPlans`,
				typeof window !== `undefined`
					? window.location.origin
					: `http://localhost:5173`,
			).toString(),
			columnMapper: snakeCamelMapper(),
		},
		schema: selectBudgetPlansSchema,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			const { modified: newBudgetPlan } = transaction.mutations[0];
			orpc.addBudgetPlan.call({
				id: newBudgetPlan.id,
				name: newBudgetPlan.name,
			});
		},
	}),
);

import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { selectCategoriesSchema } from "#/db/categories-schema";
import { orpc } from "#/orpc/client";

export const categoriesCollection = createCollection(
	electricCollectionOptions({
		id: "categories",
		shapeOptions: {
			url: new URL(
				`/api/categories`,
				typeof window !== `undefined`
					? window.location.origin
					: `http://localhost:5173`,
			).toString(),
			columnMapper: snakeCamelMapper(),
		},
		schema: selectCategoriesSchema,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			const { modified: newCategory } = transaction.mutations[0];
			orpc.addCategory.call({
				id: newCategory.id,
				name: newCategory.name,
				parentId: newCategory.parentId,
			});
		},
	}),
);

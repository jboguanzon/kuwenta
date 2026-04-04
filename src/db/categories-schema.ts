import {
	foreignKey,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

const { createSelectSchema, createInsertSchema } = createSchemaFactory({
	zodInstance: z,
});

export const categories = pgTable(
	"categories",
	{
		id: uuid().primaryKey(),
		name: text().notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		parentId: uuid("parent_id"),
	},
	(table) => [
		foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "parentCategoryId",
		}),
	],
);

export const selectCategoriesSchema = createSelectSchema(categories);
export const createCategoriesSchema = createInsertSchema(categories).omit({
	createdAt: true,
});

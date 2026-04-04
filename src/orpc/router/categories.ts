import { os } from "@orpc/server";
import { desc } from "drizzle-orm";
import * as z from "zod";
import { categories, createCategoriesSchema } from "#/db/categories-schema";
import { db } from "#/db/index";

export const listCategories = os.input(z.object({})).handler(() => {
	return db.query.categories.findMany({
		orderBy: [desc(categories.createdAt)],
	});
});

export const addCategory = os
	.input(createCategoriesSchema)
	.handler(async ({ input }) => {
		const newCategory = await db.insert(categories).values({ ...input });
		return newCategory;
	});

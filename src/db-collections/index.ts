import { onError } from "@orpc/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import {
	createCollection,
	localOnlyCollectionOptions,
} from "@tanstack/react-db";
import { z } from "zod";
import { selectBudgetsSchema } from "#/db/schema";

const MessageSchema = z.object({
	id: z.number(),
	text: z.string(),
	user: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export const messagesCollection = createCollection(
	localOnlyCollectionOptions({
		getKey: (message) => message.id,
		schema: MessageSchema,
	}),
);

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
			parser: {
				createdAt: (date: string) => {
					return new Date(date);
				},
			},
		},
		schema: selectBudgetsSchema,
		getKey: (item) => item.id,
	}),
);

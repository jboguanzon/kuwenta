import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "./auth-schema.ts";
import * as budgetPlansSchema from "./budget-plans-schema.ts";
import * as budgetsSchema from "./budgets-schema.ts";
import * as categoriesSchema from "./categories-schema.ts";
import * as financialAccountsSchema from "./financial-accounts-schema.ts";

const schema = {
	...authSchema,
	...budgetPlansSchema,
	...budgetsSchema,
	...categoriesSchema,
	...financialAccountsSchema,
};

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

export const db = drizzle(process.env.DATABASE_URL, { schema });

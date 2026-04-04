ALTER TABLE "financial_accounts" ALTER COLUMN "current_balance" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "month" text NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "amount" bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "budgets" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "name";
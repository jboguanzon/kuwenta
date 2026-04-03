CREATE TABLE "financial_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"current_balance" double precision,
	"created_at" timestamp DEFAULT now()
);

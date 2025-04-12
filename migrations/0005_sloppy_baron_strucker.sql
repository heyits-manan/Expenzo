ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "category_id";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "category_id";
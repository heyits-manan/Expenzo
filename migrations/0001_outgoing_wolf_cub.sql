ALTER TABLE "transactions" DROP CONSTRAINT "transactions_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "category_id";
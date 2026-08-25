CREATE TABLE "copilot_corrections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exchange_id" uuid NOT NULL,
	"corrected_primary_category_id" text NOT NULL,
	"corrected_secondary_category_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"correction_reason" text,
	"advisor_identifier" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- Phase 6B: classifier_version is added in four steps rather than a single
-- "ADD COLUMN ... NOT NULL" statement. Historical rows predate classifier
-- version tracking and were produced across multiple, materially different
-- classifier engine revisions (Phase 5C through 5F.1 all changed taxonomy or
-- scoring behavior) — backfilling them all as "phase5f.1" would fabricate
-- provenance that was never actually recorded. Instead:
--   1) add the column with a temporary default of the explicit, honest
--      'legacy-unversioned' sentinel so every existing row is backfilled
--      truthfully, not with today's classifier version;
--   2) a redundant explicit UPDATE for any row the DEFAULT backfill somehow
--      missed (defense in depth; expected to affect 0 rows);
--   3) enforce NOT NULL now that every row has a value;
--   4) drop the column default entirely, so every future INSERT (see
--      lib/copilot/persistence.ts's recordCopilotExchange) is *forced* to
--      explicitly supply a real classifierVersion value (CLASSIFIER_VERSION
--      from lib/copilot/classifier-version.ts) — there is no silent fallback
--      a future bug could rely on.
ALTER TABLE "copilot_exchanges" ADD COLUMN "classifier_version" text DEFAULT 'legacy-unversioned';--> statement-breakpoint
UPDATE "copilot_exchanges" SET "classifier_version" = 'legacy-unversioned' WHERE "classifier_version" IS NULL;--> statement-breakpoint
ALTER TABLE "copilot_exchanges" ALTER COLUMN "classifier_version" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "copilot_exchanges" ALTER COLUMN "classifier_version" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "copilot_corrections" ADD CONSTRAINT "copilot_corrections_exchange_id_copilot_exchanges_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."copilot_exchanges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "copilot_corrections_exchange_id_idx" ON "copilot_corrections" USING btree ("exchange_id");--> statement-breakpoint
CREATE INDEX "copilot_corrections_created_at_idx" ON "copilot_corrections" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "copilot_exchanges_classifier_version_idx" ON "copilot_exchanges" USING btree ("classifier_version");

CREATE TYPE "public"."copilot_confidence_band" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."copilot_feedback_rating" AS ENUM('thumbs-up', 'neutral', 'thumbs-down');--> statement-breakpoint
CREATE TYPE "public"."copilot_outcome_reason" AS ENUM('price', 'trust', 'timing', 'competitor', 'other');--> statement-breakpoint
CREATE TYPE "public"."copilot_outcome_status" AS ENUM('enrolled', 'follow-up', 'lost');--> statement-breakpoint
CREATE TYPE "public"."copilot_session_status" AS ENUM('active', 'completed', 'abandoned');--> statement-breakpoint
CREATE TABLE "copilot_exchanges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"objection_text" text NOT NULL,
	"is_refusal" boolean DEFAULT false NOT NULL,
	"primary_objection_id" text,
	"secondary_objection_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"numeric_confidence" real NOT NULL,
	"confidence_band" "copilot_confidence_band" NOT NULL,
	"matched_script_id" text,
	"selected_level" integer,
	"safety_fallback" boolean DEFAULT false NOT NULL,
	"is_personalized" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "copilot_exchanges_selected_level_check" CHECK ("copilot_exchanges"."selected_level" IS NULL OR "copilot_exchanges"."selected_level" IN (1, 2))
);
--> statement-breakpoint
CREATE TABLE "copilot_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exchange_id" uuid NOT NULL,
	"advisor_identifier" text,
	"rating" "copilot_feedback_rating" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "copilot_feedback_exchange_id_unique" UNIQUE("exchange_id")
);
--> statement-breakpoint
CREATE TABLE "copilot_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"advisor_identifier" text NOT NULL,
	"context_module_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "copilot_session_status" DEFAULT 'active' NOT NULL,
	"outcome_status" "copilot_outcome_status",
	"outcome_reason" "copilot_outcome_reason",
	"outcome_notes" text,
	"outcome_recorded_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "copilot_exchanges" ADD CONSTRAINT "copilot_exchanges_session_id_copilot_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."copilot_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "copilot_feedback" ADD CONSTRAINT "copilot_feedback_exchange_id_copilot_exchanges_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."copilot_exchanges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "copilot_exchanges_session_id_idx" ON "copilot_exchanges" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "copilot_exchanges_primary_objection_idx" ON "copilot_exchanges" USING btree ("primary_objection_id");--> statement-breakpoint
CREATE INDEX "copilot_exchanges_created_at_idx" ON "copilot_exchanges" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "copilot_exchanges_confidence_band_idx" ON "copilot_exchanges" USING btree ("confidence_band");--> statement-breakpoint
CREATE INDEX "copilot_sessions_advisor_idx" ON "copilot_sessions" USING btree ("advisor_identifier");--> statement-breakpoint
CREATE INDEX "copilot_sessions_created_at_idx" ON "copilot_sessions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "copilot_sessions_outcome_status_idx" ON "copilot_sessions" USING btree ("outcome_status");
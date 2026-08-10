CREATE TABLE "copilot_exchanges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"objection_text" text NOT NULL,
	"is_refusal" boolean DEFAULT false NOT NULL,
	"primary_objection_id" text,
	"secondary_objection_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"numeric_confidence" real NOT NULL,
	"confidence_band" text NOT NULL,
	"matched_script_id" text,
	"selected_level" integer,
	"safety_fallback" boolean DEFAULT false NOT NULL,
	"is_personalized" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "copilot_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exchange_id" uuid NOT NULL,
	"advisor_identifier" text,
	"rating" text NOT NULL,
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
	"status" text DEFAULT 'active' NOT NULL,
	"outcome_status" text,
	"outcome_reason" text,
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
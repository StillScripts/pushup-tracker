DO $$ BEGIN
 CREATE TYPE "exercise_category" AS ENUM('distance', 'sport', 'reps');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"exercise_category" "exercise_category",
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_sets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"reps" integer,
	"sets" integer DEFAULT 1,
	"exercise_event_id" uuid,
	"exercise_session_id" uuid,
	"exercise_title" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_events" ADD CONSTRAINT "exercise_events_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_sets" ADD CONSTRAINT "exercise_sets_exercise_event_id_exercise_sessions_id_fk" FOREIGN KEY ("exercise_event_id") REFERENCES "exercise_sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_sets" ADD CONSTRAINT "exercise_sets_exercise_session_id_exercise_sessions_id_fk" FOREIGN KEY ("exercise_session_id") REFERENCES "exercise_sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "mobility_mode" AS ENUM('standard', 'wheelchair', 'reduced_mobility', 'visual_impairment', 'family_stroller');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "path_segments" RENAME COLUMN "current_crowd_level" TO "crowd_level";--> statement-breakpoint
ALTER TABLE "points_of_interest" RENAME COLUMN "current_crowd_level" TO "crowd_level";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "mobility_mode" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "mobility_mode" SET DATA TYPE mobility_mode USING "mobility_mode"::text::mobility_mode;
ALTER TABLE "users" ALTER COLUMN "mobility_mode" SET DEFAULT 'standard';
--> statement-breakpoint
DROP TYPE "mobility_profile";
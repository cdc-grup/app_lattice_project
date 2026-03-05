CREATE TABLE "nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"location" geometry(Point, 4326) NOT NULL,
	"name" varchar
);
--> statement-breakpoint
CREATE SEQUENCE IF NOT EXISTS path_segments_id_seq;
ALTER TABLE "path_segments" ALTER COLUMN "id" SET DEFAULT nextval('path_segments_id_seq');
ALTER TABLE "path_segments" ALTER COLUMN "id" SET NOT NULL;
ALTER SEQUENCE path_segments_id_seq OWNED BY "path_segments"."id";--> statement-breakpoint
ALTER TABLE "path_segments" ALTER COLUMN "surface" SET DEFAULT 'asphalt';--> statement-breakpoint
ALTER TABLE "path_segments" ALTER COLUMN "slope_percentage" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "path_segments" ALTER COLUMN "has_stairs" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "path_segments" ADD COLUMN "source_node_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "path_segments" ADD COLUMN "target_node_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "path_segments" ADD COLUMN "distance" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_source_node_id_nodes_id_fk" FOREIGN KEY ("source_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_target_node_id_nodes_id_fk" FOREIGN KEY ("target_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_segments" DROP COLUMN "start_node";--> statement-breakpoint
ALTER TABLE "path_segments" DROP COLUMN "end_node";
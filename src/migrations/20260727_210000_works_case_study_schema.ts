import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres/drizzle";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "works"
    ADD COLUMN IF NOT EXISTS "series_label" varchar;

    ALTER TABLE "_works_v"
    ADD COLUMN IF NOT EXISTS "version_series_label" varchar;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "works_brand_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer
    );

    CREATE TABLE IF NOT EXISTS "_works_v_version_brand_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "works_deliverables" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar
    );

    CREATE TABLE IF NOT EXISTS "_works_v_version_deliverables" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "works_results" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar
    );

    CREATE TABLE IF NOT EXISTS "_works_v_version_results" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar,
      "_uuid" varchar
    );
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "works_brand_images"
      ADD CONSTRAINT "works_brand_images_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "works_brand_images"
      ADD CONSTRAINT "works_brand_images_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id")
      ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_works_v_version_brand_images"
      ADD CONSTRAINT "_works_v_version_brand_images_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_works_v_version_brand_images"
      ADD CONSTRAINT "_works_v_version_brand_images_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id")
      ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "works_deliverables"
      ADD CONSTRAINT "works_deliverables_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id")
      ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_works_v_version_deliverables"
      ADD CONSTRAINT "_works_v_version_deliverables_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id")
      ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "works_results"
      ADD CONSTRAINT "works_results_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id")
      ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_works_v_version_results"
      ADD CONSTRAINT "_works_v_version_results_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id")
      ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "works_brand_images_order_idx"
      ON "works_brand_images" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "works_brand_images_parent_id_idx"
      ON "works_brand_images" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "works_brand_images_image_idx"
      ON "works_brand_images" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "_works_v_version_brand_images_order_idx"
      ON "_works_v_version_brand_images" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_works_v_version_brand_images_parent_id_idx"
      ON "_works_v_version_brand_images" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_works_v_version_brand_images_image_idx"
      ON "_works_v_version_brand_images" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "works_deliverables_order_idx"
      ON "works_deliverables" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "works_deliverables_parent_id_idx"
      ON "works_deliverables" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_works_v_version_deliverables_order_idx"
      ON "_works_v_version_deliverables" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_works_v_version_deliverables_parent_id_idx"
      ON "_works_v_version_deliverables" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "works_results_order_idx"
      ON "works_results" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "works_results_parent_id_idx"
      ON "works_results" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_works_v_version_results_order_idx"
      ON "_works_v_version_results" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_works_v_version_results_parent_id_idx"
      ON "_works_v_version_results" USING btree ("_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "works_brand_images" CASCADE;
    DROP TABLE IF EXISTS "_works_v_version_brand_images" CASCADE;
    DROP TABLE IF EXISTS "works_deliverables" CASCADE;
    DROP TABLE IF EXISTS "_works_v_version_deliverables" CASCADE;
    DROP TABLE IF EXISTS "works_results" CASCADE;
    DROP TABLE IF EXISTS "_works_v_version_results" CASCADE;

    ALTER TABLE "works" DROP COLUMN IF EXISTS "series_label";
    ALTER TABLE "_works_v" DROP COLUMN IF EXISTS "version_series_label";
  `);
}

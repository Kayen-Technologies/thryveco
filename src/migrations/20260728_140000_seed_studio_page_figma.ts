import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

import {
  clearStudioPageMedia,
  linkStudioPageContent,
  seedAllStudioMedia,
} from "./lib/seedStudioPageMedia";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "studio_page"
      ADD COLUMN IF NOT EXISTS "hero_image_id" integer,
      ADD COLUMN IF NOT EXISTS "services_section_title" varchar,
      ADD COLUMN IF NOT EXISTS "how_it_works_section_title" varchar,
      ADD COLUMN IF NOT EXISTS "how_it_works_section_image_id" integer,
      ADD COLUMN IF NOT EXISTS "cta_subtext" varchar,
      ADD COLUMN IF NOT EXISTS "cta_image_id" integer;
  `);

  await db.execute(sql`
    ALTER TABLE "studio_page_services"
      ADD COLUMN IF NOT EXISTS "service_label" varchar,
      ADD COLUMN IF NOT EXISTS "display_title_prefix" varchar,
      ADD COLUMN IF NOT EXISTS "display_title_accent" varchar,
      ADD COLUMN IF NOT EXISTS "cta_label" varchar,
      ADD COLUMN IF NOT EXISTS "cta_href" varchar;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "studio_page_services_stack_images" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL
    );
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "studio_page"
        ADD CONSTRAINT "studio_page_hero_image_id_media_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "studio_page"
        ADD CONSTRAINT "studio_page_how_it_works_section_image_id_media_id_fk"
        FOREIGN KEY ("how_it_works_section_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "studio_page"
        ADD CONSTRAINT "studio_page_cta_image_id_media_id_fk"
        FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "studio_page_services_stack_images"
        ADD CONSTRAINT "studio_page_services_stack_images_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "studio_page_services_stack_images"
        ADD CONSTRAINT "studio_page_services_stack_images_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."studio_page_services"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "studio_page_hero_image_idx" ON "studio_page" USING btree ("hero_image_id");
    CREATE INDEX IF NOT EXISTS "studio_page_how_it_works_section_image_idx" ON "studio_page" USING btree ("how_it_works_section_image_id");
    CREATE INDEX IF NOT EXISTS "studio_page_cta_image_idx" ON "studio_page" USING btree ("cta_image_id");
    CREATE INDEX IF NOT EXISTS "studio_page_services_stack_images_order_idx" ON "studio_page_services_stack_images" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "studio_page_services_stack_images_parent_id_idx" ON "studio_page_services_stack_images" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "studio_page_services_stack_images_image_idx" ON "studio_page_services_stack_images" USING btree ("image_id");
  `);

  const mediaByFilename = await seedAllStudioMedia({ payload, req });
  await linkStudioPageContent({ payload, req, mediaByFilename });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await clearStudioPageMedia({ payload, req });

  await db.execute(sql`
    DROP TABLE IF EXISTS "studio_page_services_stack_images" CASCADE;
  `);

  await db.execute(sql`
    ALTER TABLE "studio_page_services"
      DROP COLUMN IF EXISTS "service_label",
      DROP COLUMN IF EXISTS "display_title_prefix",
      DROP COLUMN IF EXISTS "display_title_accent",
      DROP COLUMN IF EXISTS "cta_label",
      DROP COLUMN IF EXISTS "cta_href";
  `);

  await db.execute(sql`
    ALTER TABLE "studio_page"
      DROP COLUMN IF EXISTS "hero_image_id",
      DROP COLUMN IF EXISTS "services_section_title",
      DROP COLUMN IF EXISTS "how_it_works_section_title",
      DROP COLUMN IF EXISTS "how_it_works_section_image_id",
      DROP COLUMN IF EXISTS "cta_subtext",
      DROP COLUMN IF EXISTS "cta_image_id";
  `);
}

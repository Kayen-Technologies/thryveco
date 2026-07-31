import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

import {
  clearContactPageMedia,
  linkContactPageContent,
  seedAllContactMedia,
} from "./lib/seedContactPageMedia";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_page" (
      "id" serial PRIMARY KEY NOT NULL,
      "seo_title" varchar DEFAULT 'Contact',
      "seo_description" varchar,
      "hero_headline" varchar DEFAULT 'You''ve found your people.',
      "hero_body" varchar,
      "hero_image_id" integer,
      "form_heading" varchar DEFAULT 'Tell us about your brand.',
      "form_intro" varchar,
      "form_name_label" varchar DEFAULT 'Full Name',
      "form_email_label" varchar DEFAULT 'Email Address',
      "form_service_label" varchar DEFAULT 'Service You''re Interested In',
      "form_brand_name_label" varchar DEFAULT 'Brand Name',
      "form_social_link_label" varchar DEFAULT 'Link to Main Social Account',
      "form_challenge_label" varchar,
      "form_brand_goal_label" varchar,
      "form_timeline_label" varchar DEFAULT 'Timeline or Project Date',
      "form_referral_label" varchar DEFAULT 'How did you hear about Thryve & Co.?',
      "form_additional_notes_label" varchar DEFAULT 'Anything else you''d like us to know before the call?',
      "form_submit_label" varchar DEFAULT 'Submit Enquiry',
      "form_success_title" varchar DEFAULT 'Enquiry received.',
      "form_success_body" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_page_form_service_options" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_page_form_timeline_options" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_page_form_referral_options" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL
    );
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "contact_page"
        ADD CONSTRAINT "contact_page_hero_image_id_media_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "contact_page_form_service_options"
        ADD CONSTRAINT "contact_page_form_service_options_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "contact_page_form_timeline_options"
        ADD CONSTRAINT "contact_page_form_timeline_options_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "contact_page_form_referral_options"
        ADD CONSTRAINT "contact_page_form_referral_options_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "contact_page_hero_image_idx"
      ON "contact_page" USING btree ("hero_image_id");
    CREATE INDEX IF NOT EXISTS "contact_page_form_service_options_order_idx"
      ON "contact_page_form_service_options" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "contact_page_form_service_options_parent_id_idx"
      ON "contact_page_form_service_options" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "contact_page_form_timeline_options_order_idx"
      ON "contact_page_form_timeline_options" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "contact_page_form_timeline_options_parent_id_idx"
      ON "contact_page_form_timeline_options" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "contact_page_form_referral_options_order_idx"
      ON "contact_page_form_referral_options" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "contact_page_form_referral_options_parent_id_idx"
      ON "contact_page_form_referral_options" USING btree ("_parent_id");
  `);

  await db.execute(sql`
    ALTER TABLE "contact_inquiries"
      ADD COLUMN IF NOT EXISTS "service" varchar,
      ADD COLUMN IF NOT EXISTS "brand_name" varchar,
      ADD COLUMN IF NOT EXISTS "social_link" varchar,
      ADD COLUMN IF NOT EXISTS "challenge" varchar,
      ADD COLUMN IF NOT EXISTS "brand_goal" varchar,
      ADD COLUMN IF NOT EXISTS "timeline" varchar,
      ADD COLUMN IF NOT EXISTS "referral_source" varchar,
      ADD COLUMN IF NOT EXISTS "additional_notes" varchar;
  `);

  await db.execute(sql`
    ALTER TABLE "contact_inquiries" ALTER COLUMN "message" DROP NOT NULL;
  `);

  const mediaByFilename = await seedAllContactMedia({ payload, req });
  await linkContactPageContent({ payload, req, mediaByFilename });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Fail loudly before any destructive clear/drop work when null messages
  // would block restoring NOT NULL.
  await db.execute(sql`
    DO $$
    DECLARE
      null_count integer;
    BEGIN
      SELECT COUNT(*) INTO null_count
      FROM "contact_inquiries"
      WHERE "message" IS NULL;

      IF null_count > 0 THEN
        RAISE EXCEPTION
          'Cannot restore contact_inquiries.message NOT NULL: % row(s) still have null message. Replace nulls before rolling back.',
          null_count;
      END IF;
    END $$;
  `);

  await clearContactPageMedia({ payload, req });

  await db.execute(sql`
    ALTER TABLE "contact_inquiries" ALTER COLUMN "message" SET NOT NULL;
  `);

  await db.execute(sql`
    ALTER TABLE "contact_inquiries"
      DROP COLUMN IF EXISTS "service",
      DROP COLUMN IF EXISTS "brand_name",
      DROP COLUMN IF EXISTS "social_link",
      DROP COLUMN IF EXISTS "challenge",
      DROP COLUMN IF EXISTS "brand_goal",
      DROP COLUMN IF EXISTS "timeline",
      DROP COLUMN IF EXISTS "referral_source",
      DROP COLUMN IF EXISTS "additional_notes";
  `);

  await db.execute(sql`
    DROP TABLE IF EXISTS "contact_page_form_referral_options" CASCADE;
    DROP TABLE IF EXISTS "contact_page_form_timeline_options" CASCADE;
    DROP TABLE IF EXISTS "contact_page_form_service_options" CASCADE;
    DROP TABLE IF EXISTS "contact_page" CASCADE;
  `);
}

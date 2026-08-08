import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Figma node 439:1043 — replaces the journal hero backdrop and the four entry
 * photos with the new Figma exports. The bytes live in `public/media/`
 * (reconcile to Blob with `npm run media:upload`) and `public/assets/journal/`;
 * this migration only refreshes the `media` metadata and bumps `updated_at` so
 * the Next image optimizer cache-busts.
 */
type MediaMeta = { filename: string; width: number; height: number; filesize: number };

const NEXT: MediaMeta[] = [
  { filename: "journal-hero-backdrop.jpg", width: 1200, height: 1600, filesize: 326729 },
  { filename: "journal-post-01.jpg", width: 1600, height: 1068, filesize: 208827 },
  { filename: "journal-post-02.jpg", width: 1280, height: 1600, filesize: 588900 },
  { filename: "journal-post-03.jpg", width: 1600, height: 1066, filesize: 275556 },
  { filename: "journal-post-04.jpg", width: 1600, height: 1066, filesize: 276211 },
];

const PREVIOUS: MediaMeta[] = [
  { filename: "journal-hero-backdrop.jpg", width: 1378, height: 1837, filesize: 358316 },
  { filename: "journal-post-01.jpg", width: 1287, height: 858, filesize: 138306 },
  { filename: "journal-post-02.jpg", width: 1287, height: 858, filesize: 170633 },
  { filename: "journal-post-03.jpg", width: 1287, height: 858, filesize: 173014 },
  { filename: "journal-post-04.jpg", width: 1288, height: 1217, filesize: 334767 },
];

async function apply(db: MigrateUpArgs["db"], rows: MediaMeta[]): Promise<void> {
  for (const row of rows) {
    await db.execute(sql`
      UPDATE "media"
      SET
        "width" = ${row.width},
        "height" = ${row.height},
        "filesize" = ${row.filesize},
        "updated_at" = now()
      WHERE "filename" = ${row.filename}
    `);
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await apply(db, NEXT);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await apply(db, PREVIOUS);
}

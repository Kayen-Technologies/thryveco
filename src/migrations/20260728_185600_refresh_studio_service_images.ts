import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import fs from "node:fs";
import path from "node:path";

type MediaDoc = {
  id: number;
  filename: string;
};

const STUDIO_SERVICE_IMAGES = [
  "studio-svc01-stack-01.jpg",
  "studio-svc01-stack-02.jpg",
  "studio-svc01-stack-03.jpg",
  "studio-svc01-stack-04.jpg",
  "studio-svc02-stack-01.jpg",
  "studio-svc02-stack-02.jpg",
  "studio-svc02-stack-03.jpg",
  "studio-svc02-stack-04.jpg",
  "studio-svc03-stack-01.jpg",
  "studio-svc03-stack-02.jpg",
  "studio-svc03-stack-03.jpg",
  "studio-svc03-stack-04.jpg",
  "studio-svc04-stack-01.jpg",
  "studio-svc04-stack-02.jpg",
  "studio-svc04-stack-03.jpg",
  "studio-svc04-stack-04.jpg",
];

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "studio", filename);
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  console.log("[Migration] Refreshing studio service images...");

  for (const filename of STUDIO_SERVICE_IMAGES) {
    const filePath = sourcePath(filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`[Migration] Skipping ${filename} - file not found`);
      continue;
    }

    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    if (existing.docs.length > 0) {
      const doc = existing.docs[0] as MediaDoc;
      console.log(`[Migration] Updating ${filename} (id: ${doc.id})`);
      
      await payload.update({
        collection: "media",
        id: doc.id,
        data: { alt: `Studio service image - ${filename}` },
        filePath,
        overrideAccess: true,
        req,
        depth: 0,
      });
    } else {
      console.log(`[Migration] Creating ${filename}`);
      
      await payload.create({
        collection: "media",
        data: { alt: `Studio service image - ${filename}` },
        filePath,
        overrideAccess: true,
        req,
        depth: 0,
      });
    }
  }

  console.log("[Migration] Done refreshing studio service images");
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  console.log("[Migration] No rollback for refresh operation");
}

import fs from "node:fs";

import type { MigrateUpArgs } from "@payloadcms/db-postgres";
import { del } from "@vercel/blob";

type MediaDoc = { id: number; filesize?: number | null; filename?: string | null };

/**
 * Upsert a seeded media file into Payload.
 *
 * On Vercel Blob, Payload's adapter `put()` does not set `allowOverwrite`.
 * If the key already exists (prior migrate attempt / media:upload), create/update
 * with `filePath` throws. Clear the key first when we intend to re-upload.
 */
export async function upsertSeedMedia({
  payload,
  req,
  filePath,
  filename,
  alt,
  caption,
}: {
  payload: MigrateUpArgs["payload"];
  req: MigrateUpArgs["req"];
  filePath: string;
  filename: string;
  alt: string;
  caption?: string;
}): Promise<number> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing seeded media file: ${filePath}`);
  }

  const sourceSize = fs.statSync(filePath).size;
  const data = caption ? { alt, caption } : { alt };

  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  const clearBlob = async () => {
    if (!token) return;
    try {
      await del(filename, { token });
    } catch {
      // Missing blob is fine — create/update will upload.
    }
  };

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as MediaDoc;
    if (doc.filesize !== sourceSize) {
      await clearBlob();
      await payload.update({
        collection: "media",
        id: doc.id,
        data,
        filePath,
        overrideAccess: true,
        req,
        depth: 0,
      });
    } else {
      await payload.update({
        collection: "media",
        id: doc.id,
        data,
        overrideAccess: true,
        req,
        depth: 0,
      });
    }
    return doc.id;
  }

  // Blob may exist without a matching media row (partial migrate / media:upload).
  await clearBlob();

  const created = await payload.create({
    collection: "media",
    data,
    filePath,
    overrideAccess: true,
    req,
    depth: 0,
  });

  return created.id as number;
}

import fs from "node:fs";

import type { MigrateUpArgs } from "@payloadcms/db-postgres";
import { del, head } from "@vercel/blob";

type MediaDoc = { id: number; filesize?: number | null; filename?: string | null };

/**
 * The cloud-storage plugin copies `req.file` onto `req.context._payloadCloudStorage`
 * and only clears it when the adapter returns metadata — which the Vercel Blob
 * adapter never does with `addRandomSuffix` disabled. Migrations reuse a single
 * `req`, so a leftover file leaks into the next save, where the plugin pairs the
 * stale buffer with the new doc's filename: either the wrong bytes land under the
 * right name, or the upload fails with "this blob already exists".
 */
function resetUploadState(req: MigrateUpArgs["req"]): void {
  const uploadReq = req as { file?: unknown; payloadUploadSizes?: unknown };
  uploadReq.file = undefined;
  uploadReq.payloadUploadSizes = undefined;

  if (req.context) {
    delete (req.context as Record<string, unknown>)._payloadCloudStorage;
  }
}

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

  // A previous upsert (or any other seeder sharing this req) may have left a file behind.
  resetUploadState(req);

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
      // Resolve the canonical URL first: `del` is most reliable given a blob URL.
      const existingBlob = await head(filename, { token });
      await del(existingBlob.url, { token });
    } catch {
      // Missing blob is fine — create/update will upload.
    }
  };

  try {
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
  } finally {
    resetUploadState(req);
  }
}

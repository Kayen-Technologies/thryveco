import fs from "node:fs";
import path from "node:path";

import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

async function upsertMediaFile({
  payload,
  req,
  sourcePath,
  filename,
  alt,
  caption,
}: {
  payload: MigrateUpArgs["payload"];
  req: MigrateUpArgs["req"];
  sourcePath: string;
  filename: string;
  alt: string;
  caption: string;
}): Promise<number> {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing seeded media file: ${sourcePath}`);
  }

  const mediaPath = path.resolve(process.cwd(), "public", "media", filename);
  fs.copyFileSync(sourcePath, mediaPath);

  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length > 0) {
    return (existing.docs[0] as { id: number }).id;
  }

  const created = await payload.create({
    collection: "media",
    data: { alt, caption },
    filePath: mediaPath,
    overrideAccess: true,
    req,
    depth: 0,
  });

  return (created as { id: number }).id;
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const logoId = await upsertMediaFile({
    payload,
    req,
    sourcePath: path.resolve(
      process.cwd(),
      "public",
      "assets",
      "home",
      "nav-monogram-dark.svg",
    ),
    filename: "nav-monogram-dark.svg",
    alt: "Thryve & Co monogram",
    caption: "Figma nav monogram for cream backgrounds",
  });

  const current = await payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    overrideAccess: true,
    req,
  });

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      logo: logoId,
      logoDark: current.logoDark ?? null,
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const current = await payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    overrideAccess: true,
    req,
  });

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      logo: null,
      logoDark: current.logoDark ?? null,
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

  const result = await payload.find({
    collection: "media",
    where: { filename: { equals: "nav-monogram-dark.svg" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (result.docs.length === 0) return;

  await payload.delete({
    collection: "media",
    id: (result.docs[0] as { id: number }).id,
    overrideAccess: true,
    req,
  });
}

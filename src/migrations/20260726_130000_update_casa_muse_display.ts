import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: "casa-muse" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length === 0) return;

  await payload.update({
    collection: "works",
    id: (existing.docs[0] as { id: number }).id,
    data: {
      title: "Casa Muse",
      client: "Casa muse",
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: "casa-muse" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length === 0) return;

  await payload.update({
    collection: "works",
    id: (existing.docs[0] as { id: number }).id,
    data: {
      title: "CASA MUSE",
      client: "CASA MUSE",
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}

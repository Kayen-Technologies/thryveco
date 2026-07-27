import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

const ACCENT_MAP: Record<string, string> = {
  "Founder, SOLE Skincare": "Founder, SÓLÉ Skincare",
  "Founder, MELO Cafe": "Founder, MÉLO Café",
  "Founder, ELAN Lifestyle": "Founder, ÉLAN Lifestyle",
};

const REVERT_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ACCENT_MAP).map(([plain, accented]) => [accented, plain]),
);

async function patchRoles(
  { payload, req }: MigrateUpArgs | MigrateDownArgs,
  map: Record<string, string>,
): Promise<void> {
  const homepage = await payload.findGlobal({
    slug: "home-page",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const testimonials = (homepage as { testimonials?: { name: string; role?: string | null; quote?: string }[] }).testimonials;
  if (!Array.isArray(testimonials) || testimonials.length === 0) return;

  const updated = testimonials.map((t) => ({
    ...t,
    role: t.role && map[t.role] ? map[t.role] : t.role,
  }));

  await payload.updateGlobal({
    slug: "home-page",
    data: { testimonials: updated },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function up(args: MigrateUpArgs): Promise<void> {
  await patchRoles(args, ACCENT_MAP);
}

export async function down(args: MigrateDownArgs): Promise<void> {
  await patchRoles(args, REVERT_MAP);
}

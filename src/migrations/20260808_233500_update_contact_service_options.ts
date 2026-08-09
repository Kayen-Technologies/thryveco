import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { CONTACT_SERVICE_OPTIONS } from "@/components/contact/defaults";

const PREVIOUS_SERVICE_OPTIONS = [
  { label: "The Thryve Blueprint" },
  { label: "The Thryve Aesthetic" },
  { label: "The Thryve Edit" },
  { label: "The Thryve Moment" },
  { label: "Not sure / Multiple" },
];

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: "contact-page",
    data: {
      form: {
        serviceOptions: CONTACT_SERVICE_OPTIONS,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.updateGlobal({
    slug: "contact-page",
    data: {
      form: {
        serviceOptions: PREVIOUS_SERVICE_OPTIONS,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

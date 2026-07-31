import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import {
  CONTACT_DEFAULTS,
  CONTACT_REFERRAL_OPTIONS,
  CONTACT_SERVICE_OPTIONS,
  CONTACT_TIMELINE_OPTIONS,
} from "@/components/contact/defaults";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type MediaDoc = {
  id: number;
  filesize?: number | null;
};

export type ContactMediaSeed = {
  filename: string;
  alt: string;
  caption: string;
};

export const CONTACT_MEDIA_SEED: ContactMediaSeed[] = [
  {
    filename: "contact-hero.jpg",
    alt: "Thryve & Co contact hero",
    caption: "Figma contact hero",
  },
];

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "contact", filename);
}

function publicMediaPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "media", filename);
}

export async function upsertContactMedia({
  payload,
  req,
  seed,
}: {
  payload: Payload;
  req: Req;
  seed: ContactMediaSeed;
}): Promise<number> {
  const filePath = sourcePath(seed.filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing seeded media file: ${filePath}`);
  }

  const sourceSize = fs.statSync(filePath).size;
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: seed.filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as MediaDoc;
    const fileChanged = doc.filesize !== sourceSize;
    const missingOnDisk = !fs.existsSync(publicMediaPath(seed.filename));

    if (fileChanged || missingOnDisk) {
      await payload.delete({
        collection: "media",
        id: doc.id,
        overrideAccess: true,
        req,
      });
    } else {
      const updated = await payload.update({
        collection: "media",
        id: doc.id,
        data: { alt: seed.alt, caption: seed.caption },
        overrideAccess: true,
        req,
        depth: 0,
      });
      return (updated as MediaDoc).id;
    }
  }

  const created = await payload.create({
    collection: "media",
    data: { alt: seed.alt, caption: seed.caption },
    filePath,
    overrideAccess: true,
    req,
    depth: 0,
  });

  return (created as MediaDoc).id;
}

export async function seedAllContactMedia({
  payload,
  req,
}: {
  payload: Payload;
  req: Req;
}): Promise<Map<string, number>> {
  const mediaByFilename = new Map<string, number>();

  for (const seed of CONTACT_MEDIA_SEED) {
    mediaByFilename.set(
      seed.filename,
      await upsertContactMedia({ payload, req, seed }),
    );
  }

  return mediaByFilename;
}

type ContactGlobal = {
  seo?: {
    title?: string | null;
    description?: string | null;
  };
  hero?: {
    headline?: string | null;
    body?: string | null;
    image?: number | null;
  };
  form?: {
    heading?: string | null;
    intro?: string | null;
    nameLabel?: string | null;
    emailLabel?: string | null;
    serviceLabel?: string | null;
    brandNameLabel?: string | null;
    socialLinkLabel?: string | null;
    challengeLabel?: string | null;
    brandGoalLabel?: string | null;
    timelineLabel?: string | null;
    referralLabel?: string | null;
    additionalNotesLabel?: string | null;
    submitLabel?: string | null;
    successTitle?: string | null;
    successBody?: string | null;
    serviceOptions?: { label: string }[] | null;
    timelineOptions?: { label: string }[] | null;
    referralOptions?: { label: string }[] | null;
  };
};

function withOptions(
  current: { label: string }[] | null | undefined,
  fallback: { label: string }[],
) {
  return current?.length ? current : fallback;
}

export async function linkContactPageContent({
  payload,
  req,
  mediaByFilename,
}: {
  payload: Payload;
  req: Req;
  mediaByFilename: Map<string, number>;
}): Promise<void> {
  const current = (await payload.findGlobal({
    slug: "contact-page",
    depth: 0,
    overrideAccess: true,
    req,
  })) as ContactGlobal;

  await payload.updateGlobal({
    slug: "contact-page",
    data: {
      seo: {
        title: current.seo?.title ?? CONTACT_DEFAULTS.seo.title,
        description: current.seo?.description ?? CONTACT_DEFAULTS.seo.description,
      },
      hero: {
        headline: current.hero?.headline ?? CONTACT_DEFAULTS.hero.headline,
        body: current.hero?.body ?? CONTACT_DEFAULTS.hero.body,
        image:
          mediaByFilename.get("contact-hero.jpg") ?? current.hero?.image ?? null,
      },
      form: {
        heading: current.form?.heading ?? CONTACT_DEFAULTS.form.heading,
        intro: current.form?.intro ?? CONTACT_DEFAULTS.form.intro,
        nameLabel: current.form?.nameLabel ?? CONTACT_DEFAULTS.form.nameLabel,
        emailLabel: current.form?.emailLabel ?? CONTACT_DEFAULTS.form.emailLabel,
        serviceLabel:
          current.form?.serviceLabel ?? CONTACT_DEFAULTS.form.serviceLabel,
        brandNameLabel:
          current.form?.brandNameLabel ?? CONTACT_DEFAULTS.form.brandNameLabel,
        socialLinkLabel:
          current.form?.socialLinkLabel ?? CONTACT_DEFAULTS.form.socialLinkLabel,
        challengeLabel:
          current.form?.challengeLabel ?? CONTACT_DEFAULTS.form.challengeLabel,
        brandGoalLabel:
          current.form?.brandGoalLabel ?? CONTACT_DEFAULTS.form.brandGoalLabel,
        timelineLabel:
          current.form?.timelineLabel ?? CONTACT_DEFAULTS.form.timelineLabel,
        referralLabel:
          current.form?.referralLabel ?? CONTACT_DEFAULTS.form.referralLabel,
        additionalNotesLabel:
          current.form?.additionalNotesLabel ??
          CONTACT_DEFAULTS.form.additionalNotesLabel,
        submitLabel: current.form?.submitLabel ?? CONTACT_DEFAULTS.form.submitLabel,
        successTitle:
          current.form?.successTitle ?? CONTACT_DEFAULTS.form.successTitle,
        successBody: current.form?.successBody ?? CONTACT_DEFAULTS.form.successBody,
        serviceOptions: withOptions(
          current.form?.serviceOptions,
          CONTACT_SERVICE_OPTIONS,
        ),
        timelineOptions: withOptions(
          current.form?.timelineOptions,
          CONTACT_TIMELINE_OPTIONS,
        ),
        referralOptions: withOptions(
          current.form?.referralOptions,
          CONTACT_REFERRAL_OPTIONS,
        ),
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function clearContactPageMedia({
  payload,
  req,
}: {
  payload: Payload | MigrateDownArgs["payload"];
  req: Req | MigrateDownArgs["req"];
}): Promise<void> {
  const current = (await payload.findGlobal({
    slug: "contact-page",
    depth: 0,
    overrideAccess: true,
    req,
  })) as ContactGlobal;

  await payload.updateGlobal({
    slug: "contact-page",
    data: {
      seo: {
        title: current.seo?.title ?? CONTACT_DEFAULTS.seo.title,
        description: current.seo?.description ?? CONTACT_DEFAULTS.seo.description,
      },
      hero: {
        headline: current.hero?.headline ?? CONTACT_DEFAULTS.hero.headline,
        body: current.hero?.body ?? CONTACT_DEFAULTS.hero.body,
        image: null,
      },
      form: {
        heading: current.form?.heading ?? CONTACT_DEFAULTS.form.heading,
        intro: current.form?.intro ?? CONTACT_DEFAULTS.form.intro,
        nameLabel: current.form?.nameLabel ?? CONTACT_DEFAULTS.form.nameLabel,
        emailLabel: current.form?.emailLabel ?? CONTACT_DEFAULTS.form.emailLabel,
        serviceLabel:
          current.form?.serviceLabel ?? CONTACT_DEFAULTS.form.serviceLabel,
        brandNameLabel:
          current.form?.brandNameLabel ?? CONTACT_DEFAULTS.form.brandNameLabel,
        socialLinkLabel:
          current.form?.socialLinkLabel ?? CONTACT_DEFAULTS.form.socialLinkLabel,
        challengeLabel:
          current.form?.challengeLabel ?? CONTACT_DEFAULTS.form.challengeLabel,
        brandGoalLabel:
          current.form?.brandGoalLabel ?? CONTACT_DEFAULTS.form.brandGoalLabel,
        timelineLabel:
          current.form?.timelineLabel ?? CONTACT_DEFAULTS.form.timelineLabel,
        referralLabel:
          current.form?.referralLabel ?? CONTACT_DEFAULTS.form.referralLabel,
        additionalNotesLabel:
          current.form?.additionalNotesLabel ??
          CONTACT_DEFAULTS.form.additionalNotesLabel,
        submitLabel: current.form?.submitLabel ?? CONTACT_DEFAULTS.form.submitLabel,
        successTitle:
          current.form?.successTitle ?? CONTACT_DEFAULTS.form.successTitle,
        successBody: current.form?.successBody ?? CONTACT_DEFAULTS.form.successBody,
        serviceOptions: withOptions(
          current.form?.serviceOptions,
          CONTACT_SERVICE_OPTIONS,
        ),
        timelineOptions: withOptions(
          current.form?.timelineOptions,
          CONTACT_TIMELINE_OPTIONS,
        ),
        referralOptions: withOptions(
          current.form?.referralOptions,
          CONTACT_REFERRAL_OPTIONS,
        ),
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

  for (const seed of CONTACT_MEDIA_SEED) {
    const result = await payload.find({
      collection: "media",
      where: { filename: { equals: seed.filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    if (result.docs.length === 0) continue;

    await payload.delete({
      collection: "media",
      id: (result.docs[0] as MediaDoc).id,
      overrideAccess: true,
      req,
    });
  }
}

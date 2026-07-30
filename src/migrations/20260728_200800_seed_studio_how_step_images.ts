import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import fs from "node:fs";
import path from "node:path";

type MediaDoc = {
  id: number;
  filename: string;
};

const STEP_IMAGES = [
  { filename: "studio-how-step-01.jpg", alt: "Vintage telephone representing discovery call" },
  { filename: "studio-how-step-02.jpg", alt: "iPad showing creative work" },
  { filename: "studio-how-step-03.jpg", alt: "Founder reviewing work on tablet" },
  { filename: "studio-how-step-04.jpg", alt: "Strategic planning with jewelry and magazine" },
  { filename: "studio-how-step-05.jpg", alt: "Laptop displaying Thryve Co brand on books" },
  { filename: "studio-how-step-06.jpg", alt: "Founder relaxed in chair showing brand success" },
];

const STEPS = [
  {
    step: 1,
    title: "Discovery Call",
    description: "We get on a call, learn your brand inside out, and figure out exactly what you need.",
  },
  {
    step: 2,
    title: "The Proposal",
    description: "We put together a tailored proposal based on everything you've shared. You sign off and we are good to go.",
  },
  {
    step: 3,
    title: "Onboarding",
    description: "You're officially a Thryve client. We get all the good stuff — assets, access, and everything we need to hit the ground running.",
  },
  {
    step: 4,
    title: "Strategize",
    description: "This is where we do the thinking. Deep diving into your brand, your audience, and building the plan that's going to make it all click.",
  },
  {
    step: 5,
    title: "We Get to Work",
    description: "Strategy becomes content. Content becomes presence. Presence becomes something people actually notice.",
  },
  {
    step: 6,
    title: "Your Brand Thrives",
    description: "You show up online with intention, consistency, and an aesthetic that's undeniably yours. That's the Thryve effect.",
  },
];

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "studio", filename);
}

async function upsertMedia(
  payload: MigrateUpArgs["payload"],
  req: MigrateUpArgs["req"],
  filename: string,
  alt: string
): Promise<number | null> {
  const filePath = sourcePath(filename);

  if (!fs.existsSync(filePath)) {
    console.log(`[Migration] Skipping ${filename} - file not found`);
    return null;
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
      data: { alt },
      filePath,
      overrideAccess: true,
      req,
      depth: 0,
    });
    return doc.id;
  }

  console.log(`[Migration] Creating ${filename}`);

  const created = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    overrideAccess: true,
    req,
    depth: 0,
  });
  return created.id;
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  console.log("[Migration] Seeding How It Works step images...");

  const imageIds: (number | null)[] = [];

  for (const stepImage of STEP_IMAGES) {
    const imageId = await upsertMedia(payload, req, stepImage.filename, stepImage.alt);
    imageIds.push(imageId);
  }

  console.log("[Migration] Updating Studio Page with step images...");

  const howItWorks = STEPS.map((step, index) => ({
    step: step.step,
    title: step.title,
    description: step.description,
    image: imageIds[index] ?? undefined,
  }));

  await payload.updateGlobal({
    slug: "studio-page",
    data: {
      howItWorksSection: {
        title: "How it Works",
      },
      howItWorks,
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

  console.log("[Migration] Done seeding How It Works step images");
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  console.log("[Migration] No rollback for How It Works step images");
}

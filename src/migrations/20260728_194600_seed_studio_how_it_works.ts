import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import fs from "node:fs";
import path from "node:path";

type MediaDoc = {
  id: number;
  filename: string;
};

const HOW_IT_WORKS_IMAGE = "studio-how-it-works.jpg";

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "studio", filename);
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  console.log("[Migration] Seeding How It Works image...");

  const filePath = sourcePath(HOW_IT_WORKS_IMAGE);

  if (!fs.existsSync(filePath)) {
    console.log(`[Migration] Skipping ${HOW_IT_WORKS_IMAGE} - file not found`);
    return;
  }

  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: HOW_IT_WORKS_IMAGE } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  let imageId: number;

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as MediaDoc;
    console.log(`[Migration] Updating ${HOW_IT_WORKS_IMAGE} (id: ${doc.id})`);

    await payload.update({
      collection: "media",
      id: doc.id,
      data: { alt: "Founder reviewing work on a tablet" },
      filePath,
      overrideAccess: true,
      req,
      depth: 0,
    });
    imageId = doc.id;
  } else {
    console.log(`[Migration] Creating ${HOW_IT_WORKS_IMAGE}`);

    const created = await payload.create({
      collection: "media",
      data: { alt: "Founder reviewing work on a tablet" },
      filePath,
      overrideAccess: true,
      req,
      depth: 0,
    });
    imageId = created.id;
  }

  console.log("[Migration] Linking How It Works image to Studio Page...");

  await payload.updateGlobal({
    slug: "studio-page",
    data: {
      howItWorksSection: {
        title: "How it Works",
      },
      howItWorks: [
        {
          step: 1,
          title: "Discovery Call",
          description:
            "We get on a call, learn your brand inside out, and figure out exactly what you need.",
          image: imageId,
        },
        {
          step: 2,
          title: "The Proposal",
          description:
            "We put together a tailored proposal based on everything you've shared. You sign off and we are good to go.",
        },
        {
          step: 3,
          title: "Onboarding",
          description:
            "You're officially a Thryve client. We get all the good stuff — assets, access, and everything we need to hit the ground running.",
        },
        {
          step: 4,
          title: "Strategize",
          description:
            "This is where we do the thinking. Deep diving into your brand, your audience, and building the plan that's going to make it all click.",
        },
        {
          step: 5,
          title: "We Get to Work",
          description:
            "Strategy becomes content. Content becomes presence. Presence becomes something people actually notice.",
        },
        {
          step: 6,
          title: "Your Brand Thrives",
          description:
            "You show up online with intention, consistency, and an aesthetic that's undeniably yours. That's the Thryve effect.",
        },
      ],
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

  console.log("[Migration] Done seeding How It Works section");
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  console.log("[Migration] No rollback for How It Works seed");
}

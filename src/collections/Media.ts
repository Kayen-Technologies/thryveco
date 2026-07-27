import path from "node:path";

import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";

const mediaStaticDir = path.resolve(process.cwd(), "public/media");

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    mimeTypes: ["image/*"],
    staticDir: mediaStaticDir,
  },
  admin: {
    useAsTitle: "alt",
    group: "Content",
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "text",
    },
  ],
};

import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    mimeTypes: ["image/*"],
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

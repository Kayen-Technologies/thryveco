import type { GlobalConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicRead } from "@/access/publicRead";

export const JournalPage: GlobalConfig = {
  slug: "journal-page",
  label: "Journal Page",
  admin: {
    group: "Pages",
  },
  access: {
    read: publicRead,
    update: isAdmin,
  },
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        {
          name: "headline",
          type: "text",
          defaultValue: "Thoughts, perspective & a little creative obsession.",
        },
        { name: "tagline", type: "textarea" },
      ],
    },
  ],
};

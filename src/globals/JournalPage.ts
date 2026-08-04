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
        {
          name: "tagline",
          type: "textarea",
          defaultValue:
            "We write about the things we care about: aesthetics, strategy, social media, and everything happening in the creative world around us. Pull up a seat.",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "entriesSection",
      type: "group",
      label: "Entries Section",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "Journal Entry",
        },
      ],
    },
  ],
};

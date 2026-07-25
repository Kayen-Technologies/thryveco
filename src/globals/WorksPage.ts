import type { GlobalConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicRead } from "@/access/publicRead";

export const WorksPage: GlobalConfig = {
  slug: "works-page",
  label: "Works Page",
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
          defaultValue: "Good brands are built. Great brands are Thryved.",
        },
        { name: "tagline", type: "textarea" },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "CTA",
      fields: [
        { name: "headline", type: "text", defaultValue: "Let's build something great." },
        { name: "ctaLabel", type: "text", defaultValue: "Book a Call" },
        { name: "ctaHref", type: "text", defaultValue: "/contact" },
      ],
    },
  ],
};

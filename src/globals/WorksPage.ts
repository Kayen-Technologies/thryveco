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
        {
          name: "subheadline",
          type: "textarea",
          defaultValue:
            "A collection of brands we've helped find their voice, their aesthetic, and their people.",
        },
        {
          name: "heroImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Decorative backdrop image on the right side of the hero.",
          },
        },
      ],
    },
    {
      name: "portfolio",
      type: "group",
      label: "Portfolio Section",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "Brands We've Built",
        },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "CTA Section",
      fields: [
        {
          name: "headline",
          type: "text",
          defaultValue: "Your Next Brand Move Starts Here.",
        },
        {
          name: "subtext",
          type: "textarea",
          defaultValue:
            "Your brand deserves more than content that fills a feed. Let’s build a strategy, presence, and visual identity people actually remember.",
        },
        { name: "ctaLabel", type: "text", defaultValue: "Book My Discovery Call" },
        { name: "ctaHref", type: "text", defaultValue: "/contact" },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};

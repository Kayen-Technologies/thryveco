import type { GlobalConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicRead } from "@/access/publicRead";

export const StudioPage: GlobalConfig = {
  slug: "studio-page",
  label: "Studio Page",
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
        { name: "headline", type: "text", defaultValue: "The Studio" },
        { name: "tagline", type: "textarea" },
      ],
    },
    {
      name: "services",
      type: "array",
      label: "Services (The Four Offerings)",
      admin: {
        description: "Stacked service cards on the Studio page.",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          admin: { description: "e.g. The Thryve Blueprint" },
        },
        {
          name: "tagline",
          type: "text",
          admin: { description: "Short descriptor shown on the card." },
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "includes",
          type: "array",
          label: "What's Included",
          fields: [
            { name: "item", type: "text", required: true },
          ],
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "howItWorks",
      type: "array",
      label: "How It Works (6 Steps)",
      fields: [
        { name: "step", type: "number", required: true },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "CTA",
      fields: [
        { name: "headline", type: "text", defaultValue: "Ready to start?" },
        { name: "ctaLabel", type: "text", defaultValue: "Book a Call" },
        { name: "ctaHref", type: "text", defaultValue: "/contact" },
      ],
    },
  ],
};

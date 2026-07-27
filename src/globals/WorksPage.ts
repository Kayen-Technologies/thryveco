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
          name: "topLine",
          type: "text",
          defaultValue: "READY TO BUILD A BRAND",
        },
        {
          name: "topLineAccent",
          type: "text",
          defaultValue: "PEOPLE REMEMBER?",
        },
        {
          name: "bottomLine",
          type: "text",
          defaultValue: "BEAUTIFUL BRANDS",
        },
        {
          name: "bottomLineAccent",
          type: "text",
          defaultValue: "START HERE",
        },
        {
          name: "ctaLabel",
          type: "text",
          defaultValue: "Book A Discovery Call",
        },
        {
          name: "ctaHref",
          type: "text",
          defaultValue: "/contact",
        },
        {
          name: "backgroundImage",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};

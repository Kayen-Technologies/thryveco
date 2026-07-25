import type { GlobalConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicRead } from "@/access/publicRead";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Page",
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
        { name: "headline", type: "text", defaultValue: "About Thryve Co." },
        { name: "tagline", type: "textarea" },
      ],
    },
    {
      name: "founderSection",
      type: "group",
      label: "Meet the Founder",
      fields: [
        { name: "headline", type: "text", defaultValue: "Meet the Founder" },
        { name: "name", type: "text", defaultValue: "Michelle Teschmaker" },
        {
          name: "title",
          type: "text",
          defaultValue: "Founder & Creative Director",
        },
        {
          name: "bio",
          type: "richText",
          label: "Bio",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: { description: "Primary founder portrait." },
        },
      ],
    },
    {
      name: "founderStory",
      type: "group",
      label: "Founder Story Section",
      fields: [
        {
          name: "body",
          type: "richText",
          label: "Story Body",
        },
        {
          name: "photos",
          type: "array",
          label: "Photo Collage",
          admin: {
            description: "Images arranged in the collage grid alongside the story text.",
          },
          fields: [
            {
              name: "photo",
              type: "upload",
              relationTo: "media",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "founderQuote",
      type: "group",
      label: "Founder Quote (Burgundy Block)",
      fields: [
        { name: "quote", type: "textarea" },
        {
          name: "attribution",
          type: "text",
          defaultValue: "Michelle Teschmaker",
        },
      ],
    },
    {
      name: "whatThryve",
      type: "group",
      label: "What Thryve Means",
      fields: [
        {
          name: "headline",
          type: "text",
          defaultValue: "What Thryve Means",
        },
        {
          name: "body",
          type: "richText",
        },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "CTA",
      fields: [
        {
          name: "headline",
          type: "text",
          defaultValue: "Ready to build something together?",
        },
        { name: "ctaLabel", type: "text", defaultValue: "Book a Call" },
        { name: "ctaHref", type: "text", defaultValue: "/contact" },
      ],
    },
  ],
};

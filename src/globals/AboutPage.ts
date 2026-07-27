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
        {
          name: "headline",
          type: "text",
          defaultValue: "We're not here to fit in",
        },
        {
          name: "tagline",
          type: "text",
          defaultValue: "We never were",
          admin: {
            description: "Italic champagne line below the headline.",
          },
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
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
          name: "headlineLead",
          type: "text",
          defaultValue: "It started, like ",
        },
        {
          name: "headlineMuted",
          type: "text",
          defaultValue: "most good things do, with a camera and a ",
        },
        {
          name: "headlineEnd",
          type: "text",
          defaultValue: "lot of curiosity.",
        },
        {
          name: "paragraphOne",
          type: "textarea",
          label: "Story Paragraph 1",
        },
        {
          name: "paragraphTwo",
          type: "textarea",
          label: "Story Paragraph 2",
        },
        {
          name: "storyImage",
          type: "upload",
          relationTo: "media",
          label: "Story Portrait",
        },
        {
          name: "photos",
          type: "array",
          label: "Photo Collage",
          admin: {
            description: "Three images arranged in the staggered collage.",
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
          defaultValue: "Michelle Teschmaker, Founder & Creative Director",
        },
      ],
    },
    {
      name: "whatThryve",
      type: "group",
      label: "What Thryve Means",
      fields: [
        {
          name: "intro",
          type: "textarea",
          label: "Intro Paragraph",
        },
        {
          name: "agencyCopy",
          type: "textarea",
          label: "Agency Paragraph",
        },
        {
          name: "aspirationCopy",
          type: "textarea",
          label: "Aspiration Paragraph",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
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
          defaultValue: "Ready to build a brand people remember?",
        },
        {
          name: "subtext",
          type: "text",
          defaultValue: "Beautiful brands start here",
        },
        { name: "ctaLabel", type: "text", defaultValue: "Book A Discovery Call" },
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

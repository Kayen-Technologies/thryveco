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
          defaultValue:
            "Before Thryve, Michelle was a digital creator learning the language of content, aesthetics and storytelling one post at a time. She had an eye for what looked good and an instinct for what felt right. That combination led her into social media management, where she discovered something she hadn't expected: a love for strategy. For the thinking behind the making. For the way a well-built brand presence could change how a business was perceived overnight.",
        },
        {
          name: "paragraphTwo",
          type: "textarea",
          label: "Story Paragraph 2",
          defaultValue:
            "Five years, multiple clients, and countless content pieces later, it became clear that what she was building wasn't just a freelance career. It was something bigger. Something with a name, a vision, and a standard.",
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
          defaultValue:
            "Thriving isn’t passive. It’s putting yourself out there, taking up space, and doing it on your own terms. And the & Co.? That’s the part that says we’re always doing more. More than just thriving. More ideas, more possibilities, more of what your brand deserves.",
        },
        {
          name: "agencyCopy",
          type: "textarea",
          label: "Agency Paragraph",
          defaultValue:
            "We call ourselves a Creative Agency because that’s exactly what we are. A team of people whose job is to make your brand impossible to ignore. A creative partner with a point of view, in your corner, invested in what you’re building.",
        },
        {
          name: "aspirationCopy",
          type: "textarea",
          label: "Aspiration Paragraph",
          defaultValue:
            "We aspire to be the agency that changes how lifestyle, wellness and product brands show up. The name people mention when they talk about brands that look different. The agency behind the brands you can’t stop watching.",
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

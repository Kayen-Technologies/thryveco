import type { GlobalConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicRead } from "@/access/publicRead";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
  admin: {
    group: "Pages",
  },
  access: {
    read: publicRead,
    update: isAdmin,
  },
  fields: [
    // ── Hero ─────────────────────────────────────────────────────
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        {
          name: "headline",
          type: "text",
          defaultValue: "Your Brand's New Creative Friend",
        },
        {
          name: "headlineEmphasis",
          type: "text",
          defaultValue: "Creative Friend",
          admin: {
            description: "Words within the headline to render in gold accent. Must match part of the headline exactly.",
          },
        },
        {
          name: "tagline",
          type: "textarea",
          defaultValue: "We build brands that grow with intention.",
        },
        {
          name: "ctaLabel",
          type: "text",
          defaultValue: "Book a Discovery Call",
        },
        {
          name: "ctaHref",
          type: "text",
          defaultValue: "/contact",
        },
        {
          name: "heroImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Poster / static fallback image shown under the video and for reduced-motion.",
          },
        },
        {
          name: "heroVideo",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Full-bleed muted looping background video (mp4/webm). Falls back to hero image when empty.",
          },
        },
      ],
    },

    // ── Intro ─────────────────────────────────────────────────────
    {
      name: "intro",
      type: "group",
      label: "Intro Section",
      fields: [
        {
          name: "headline",
          type: "text",
          defaultValue: "Growth should look as good as it performs.",
        },
        {
          name: "body",
          type: "textarea",
        },
        {
          name: "ctaLabel",
          type: "text",
          defaultValue: "Book a Discovery Call",
        },
        {
          name: "ctaHref",
          type: "text",
          defaultValue: "/contact",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },

    // ── Marquee ───────────────────────────────────────────────────
    {
      name: "marquee",
      type: "group",
      label: "Marquee",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Fallback portrait when a marquee item has no image. Prefer per-item images on Marquee Items.",
          },
        },
      ],
    },
    {
      name: "marqueeWords",
      type: "array",
      label: "Marquee Items",
      admin: {
        description:
          "Word + image clusters that scroll together (Figma Social → Cultured → Curated).",
      },
      defaultValue: [
        { word: "Social" },
        { word: "Cultured" },
        { word: "Curated" },
      ],
      fields: [
        { name: "word", type: "text", required: true },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Portrait paired with this word (slides with the text).",
          },
        },
      ],
    },

    // ── Story ─────────────────────────────────────────────────────
    {
      name: "story",
      type: "group",
      label: "Story Section",
      fields: [
        {
          name: "headline",
          type: "text",
          defaultValue: "Every brand has a story worth telling.",
        },
        {
          name: "body",
          type: "textarea",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },

    // ── Featured Work ─────────────────────────────────────────────
    {
      name: "featuredWork",
      type: "group",
      label: "Featured Work",
      fields: [
        {
          name: "headline",
          type: "text",
          defaultValue: "Every brand has a story. We make sure it's one worth remembering.",
        },
        {
          name: "works",
          type: "relationship",
          relationTo: "works",
          hasMany: true,
          maxRows: 3,
          admin: {
            description: "Select up to 3 case studies to feature on the homepage (Figma order).",
          },
        },
      ],
    },

    // ── Quote Band ────────────────────────────────────────────────
    {
      name: "quoteBand",
      type: "group",
      label: "Quote Band (Burgundy)",
      fields: [
        {
          name: "quote",
          type: "textarea",
          defaultValue: "Growth should look as good as it performs.",
        },
        {
          name: "attribution",
          type: "text",
          defaultValue: "Thryve & Co Creative Agency",
        },
      ],
    },

    // ── Testimonials ──────────────────────────────────────────────
    {
      name: "testimonials",
      type: "array",
      label: "Testimonials",
      admin: {
        description: "Client testimonials shown in the carousel.",
      },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text" },
        { name: "quote", type: "textarea", required: true },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },

    // ── Final CTA ─────────────────────────────────────────────────
    {
      name: "finalCta",
      type: "group",
      label: "Final CTA",
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
        {
          name: "ctaLabel",
          type: "text",
          defaultValue: "Book a Discovery Call",
        },
        {
          name: "ctaHref",
          type: "text",
          defaultValue: "/contact",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};

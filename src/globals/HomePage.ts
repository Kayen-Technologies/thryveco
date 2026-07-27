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
          defaultValue: "Book a Call",
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
            description: "Portrait photo used in the scrolling marquee strip.",
          },
        },
      ],
    },
    {
      name: "marqueeWords",
      type: "array",
      label: "Marquee Words",
      admin: {
        description: "Words that scroll across the marquee strip between sections.",
      },
      defaultValue: [
        { word: "Cultured" },
        { word: "Intentional" },
        { word: "Creative" },
        { word: "Bold" },
        { word: "Strategic" },
        { word: "Purposeful" },
      ],
      fields: [
        { name: "word", type: "text", required: true },
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
          admin: {
            description: "Select up to 4 case studies to feature on the homepage.",
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
          defaultValue: "Ready to build a brand people remember?",
        },
        {
          name: "subtext",
          type: "textarea",
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
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};

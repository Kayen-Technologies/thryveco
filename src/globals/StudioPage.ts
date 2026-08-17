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
        {
          name: "headline",
          type: "text",
          defaultValue: "This is Where The Magic Happens",
        },
        {
          name: "tagline",
          type: "textarea",
          defaultValue:
            "Four ways to work with us. One non-negotiable standard your brand leaves here looking and feeling undeniably itself.",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "servicesSection",
      type: "group",
      label: "Services Section",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "The Four Services",
        },
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
          name: "serviceLabel",
          type: "text",
          required: true,
          admin: { description: "e.g. Service 01 - The Thryve Blueprint" },
        },
        {
          name: "title",
          type: "text",
          required: true,
          admin: { description: "Internal service name, e.g. The Thryve Blueprint" },
        },
        {
          name: "displayTitlePrefix",
          type: "text",
          required: true,
          admin: { description: "Large display title before accent, e.g. Strategy & Con" },
        },
        {
          name: "displayTitleAccent",
          type: "text",
          required: true,
          admin: { description: "Accent portion overlaid on image stack, e.g. sulting" },
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "includes",
          type: "array",
          label: "What's Included",
          fields: [{ name: "item", type: "text", required: true }],
        },
        {
          name: "stackImages",
          type: "array",
          label: "Stacked Images",
          minRows: 4,
          maxRows: 4,
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
          ],
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
      ],
    },
    {
      name: "howItWorksSection",
      type: "group",
      label: "How It Works Section",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "How it Works",
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
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: { description: "Image displayed when this step is active" },
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
        { name: "ctaLabel", type: "text", defaultValue: "Book a Discovery Call" },
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

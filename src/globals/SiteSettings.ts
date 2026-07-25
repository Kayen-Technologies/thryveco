import type { GlobalConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicRead } from "@/access/publicRead";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: publicRead,
    update: isAdmin,
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "Thryve Co.",
      required: true,
    },
    {
      name: "tagline",
      type: "text",
      defaultValue: "Your Brand's New Creative Friend",
    },
    {
      name: "location",
      type: "text",
      defaultValue: "Accra, Ghana",
    },
    {
      name: "email",
      type: "email",
      defaultValue: "hello@thryve&co.agency",
    },
    {
      name: "phone",
      type: "text",
      defaultValue: "+233 53 762 2693",
    },
    {
      name: "bookingLink",
      type: "text",
      defaultValue: "/contact",
      admin: {
        description: "URL for the 'Book a Call' CTA button in the nav.",
      },
    },
    {
      name: "navLinks",
      type: "array",
      labels: {
        singular: "Nav Link",
        plural: "Nav Links",
      },
      admin: {
        description: "Main navigation links (Studio, Works, Journal, About).",
      },
      defaultValue: [
        { label: "Studio", href: "/studio" },
        { label: "Works", href: "/works" },
        { label: "Journal", href: "/journal" },
        { label: "About", href: "/about" },
      ],
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      labels: {
        singular: "Social Link",
        plural: "Social Links",
      },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "footerLinks",
      type: "array",
      labels: {
        singular: "Footer Link",
        plural: "Footer Links",
      },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Primary logo (shown on cream/light backgrounds).",
      },
    },
    {
      name: "logoDark",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Logo for dark/burgundy backgrounds.",
      },
    },
    {
      name: "copyrightYear",
      type: "number",
      defaultValue: 2026,
      required: true,
    },
  ],
};

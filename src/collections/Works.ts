import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicOrPublished } from "@/access/publicOrPublished";

export const Works: CollectionConfig = {
  slug: "works",
  labels: {
    singular: "Work",
    plural: "Works",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "sortOrder", "updatedAt"],
    group: "Content",
  },
  versions: {
    drafts: true,
  },
  access: {
    create: isAdmin,
    read: publicOrPublished,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-safe identifier (e.g. casa-muse). Used in /works/[slug].",
      },
    },
    {
      name: "client",
      type: "text",
      required: true,
    },
    {
      name: "tagline",
      type: "text",
      admin: {
        description: "Short brand tagline shown on the case study hero.",
      },
    },
    {
      name: "tags",
      type: "array",
      admin: {
        description: "Service tags shown on the case study card (e.g. Branding, Strategy).",
      },
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Thumbnail shown on the Works listing page.",
      },
    },
    {
      name: "overview",
      type: "richText",
      label: "Client Overview",
    },
    {
      name: "problem",
      type: "richText",
      label: "The Problem",
    },
    {
      name: "solution",
      type: "richText",
      label: "The Solution",
    },
    {
      name: "feedback",
      type: "group",
      label: "Client Feedback",
      fields: [
        {
          name: "quote",
          type: "textarea",
        },
        {
          name: "attribution",
          type: "text",
          admin: {
            description: "Name and role, e.g. Jane D., Founder of CASA MUSE",
          },
        },
      ],
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Project Gallery",
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
      name: "sortOrder",
      type: "number",
      defaultValue: 99,
      admin: {
        description: "Lower numbers appear first on the Works page.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayOnly" },
      },
    },
  ],
};

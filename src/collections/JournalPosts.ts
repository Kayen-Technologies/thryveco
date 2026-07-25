import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicOrPublished } from "@/access/publicOrPublished";

export const JournalPosts: CollectionConfig = {
  slug: "journal-posts",
  labels: {
    singular: "Journal Post",
    plural: "Journal Posts",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "author", "publishedAt"],
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
        description: "URL-safe identifier. Used in /journal/[slug].",
      },
    },
    {
      name: "category",
      type: "text",
      required: true,
      admin: {
        description: "e.g. Branding, Strategy, Creative Obsession",
      },
    },
    {
      name: "readTime",
      type: "number",
      admin: {
        description: "Estimated read time in minutes.",
      },
    },
    {
      name: "author",
      type: "text",
      defaultValue: "Michelle Teschmaker",
    },
    {
      name: "excerpt",
      type: "textarea",
      admin: {
        description: "Short summary shown on the Journal listing grid.",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "body",
      type: "richText",
      label: "Article Body",
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "dayOnly" },
      },
    },
  ],
};

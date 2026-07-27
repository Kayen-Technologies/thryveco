import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicOrPublished } from "@/access/publicOrPublished";
import { formatSlug } from "@/lib/formatSlug";

export const Works: CollectionConfig = {
  slug: "works",
  labels: {
    singular: "Case Study",
    plural: "Case Studies",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "publishedAt", "updatedAt"],
    group: "Content",
    description: "Create case studies that appear on /works and /works/[slug].",
    livePreview: {
      url: ({ data }) => {
        const slug = typeof data?.slug === "string" ? data.slug : "";
        const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
        return slug ? `${base}/works/${slug}` : `${base}/works`;
      },
    },
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
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data?.title || data.slug) return data;

        if (operation === "create") {
          return {
            ...data,
            slug: formatSlug(String(data.title)),
          };
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Project name (e.g. Casa Muse). Slug auto-fills from this.",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description: "URL path: /works/[slug]",
      },
    },
    {
      name: "client",
      type: "text",
      required: true,
      admin: {
        description: "Client or brand name shown on the listing card.",
      },
    },
    {
      name: "industry",
      type: "text",
      admin: {
        description: "e.g. Interior Design, Skincare, Fine Jewellery",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Full-width image at the top of the case study page.",
      },
    },
    {
      name: "overview",
      type: "richText",
      label: "The Brand",
      admin: {
        description: "Introduce the brand. Who they are, what makes them special.",
      },
    },
    {
      name: "problem",
      type: "richText",
      label: "The Challenge",
      admin: {
        description: "What problem or opportunity brought them to you?",
      },
    },
    {
      name: "solution",
      type: "richText",
      label: "The Approach",
      admin: {
        description: "How did you solve it? Multiple paragraphs welcome.",
      },
    },
    {
      name: "deliverables",
      type: "array",
      label: "What We Delivered",
      admin: {
        description: "List of deliverables (e.g. Brand Strategy, Social Content).",
        initCollapsed: true,
      },
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "results",
      type: "array",
      label: "The Results",
      admin: {
        description: "Outcomes and metrics (e.g. 42% engagement increase).",
        initCollapsed: true,
      },
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "feedback",
      type: "group",
      label: "Client Quote",
      admin: {
        description: "Optional testimonial quote from the client.",
      },
      fields: [
        {
          name: "quote",
          type: "textarea",
          admin: {
            description: "The quote text.",
          },
        },
        {
          name: "attribution",
          type: "text",
          admin: {
            description: "e.g. Jane D., Founder of Casa Muse",
          },
        },
      ],
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Project Gallery",
      admin: {
        description: "Images shown in the burgundy gallery section.",
        initCollapsed: true,
      },
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
      name: "brandImages",
      type: "array",
      label: "Brand Section Images",
      maxRows: 2,
      admin: {
        description: "Two images below The Brand section.",
        initCollapsed: true,
      },
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
      name: "seriesLabel",
      type: "text",
      defaultValue: "The Thryve Edit",
      admin: {
        position: "sidebar",
        description: "Series pill on the case study page.",
      },
    },
    {
      name: "tags",
      type: "array",
      label: "Listing Tags",
      admin: {
        position: "sidebar",
        description: "Tags shown on the /works card.",
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
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Thumbnail for /works listing.",
      },
    },
    {
      name: "tagline",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Optional short tagline for metadata.",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 99,
      admin: {
        position: "sidebar",
        description: "Lower = appears first.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        description: "Date shown on the case study page.",
        date: { pickerAppearance: "dayOnly" },
      },
    },
  ],
};

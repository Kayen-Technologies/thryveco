import type { Block } from "payload";

export const journalArticleBlocks: Block[] = [
  {
    slug: "paragraphs",
    labels: {
      singular: "Paragraph group",
      plural: "Paragraph groups",
    },
    fields: [
      {
        name: "items",
        type: "array",
        label: "Paragraphs",
        minRows: 1,
        fields: [
          {
            name: "text",
            type: "textarea",
            required: true,
          },
        ],
      },
    ],
  },
  {
    slug: "headingGroup",
    labels: {
      singular: "Heading section",
      plural: "Heading sections",
    },
    fields: [
      {
        name: "heading",
        type: "text",
        required: true,
      },
      {
        name: "paragraphs",
        type: "array",
        label: "Paragraphs",
        minRows: 1,
        fields: [
          {
            name: "text",
            type: "textarea",
            required: true,
          },
        ],
      },
    ],
  },
  {
    slug: "image",
    labels: {
      singular: "Image",
      plural: "Images",
    },
    fields: [
      {
        name: "media",
        type: "upload",
        relationTo: "media",
        required: true,
      },
    ],
  },
  {
    slug: "imageGrid",
    labels: {
      singular: "Image Grid",
      plural: "Image Grids",
    },
    fields: [
      {
        name: "columns",
        type: "select",
        defaultValue: "2",
        options: [
          { label: "2 Columns", value: "2" },
          { label: "3 Columns", value: "3" },
          { label: "4 Columns", value: "4" },
        ],
        admin: {
          description: "Number of images per row",
        },
      },
      {
        name: "images",
        type: "array",
        label: "Images",
        minRows: 2,
        maxRows: 6,
        fields: [
          {
            name: "media",
            type: "upload",
            relationTo: "media",
            required: true,
          },
        ],
      },
    ],
  },
  {
    slug: "closingCta",
    labels: {
      singular: "Closing CTA",
      plural: "Closing CTAs",
    },
    fields: [
      {
        name: "lead",
        type: "text",
        required: true,
        admin: {
          description: "Opening sentence in full opacity.",
        },
      },
      {
        name: "muted",
        type: "textarea",
        required: true,
        admin: {
          description: "Middle sentence shown at reduced opacity.",
        },
      },
      {
        name: "end",
        type: "text",
        required: true,
        admin: {
          description: "Closing sentence in full opacity.",
        },
      },
      {
        name: "ctaLabel",
        type: "text",
        defaultValue: "Book a Discovery Call",
        required: true,
      },
      {
        name: "ctaHref",
        type: "text",
        defaultValue: "/contact",
        required: true,
      },
    ],
  },
];

import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";

export const ContactInquiries: CollectionConfig = {
  slug: "contact-inquiries",
  labels: {
    singular: "Contact Inquiry",
    plural: "Contact Inquiries",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "service", "brandName", "createdAt"],
    group: "Submissions",
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "subject",
      type: "text",
      admin: {
        description: "Legacy subject field. Kept for older submissions.",
      },
    },
    {
      name: "message",
      type: "textarea",
      admin: {
        description:
          "Legacy message field (nullable). New form submissions may store a readable summary here.",
      },
    },
    {
      name: "service",
      type: "text",
    },
    {
      name: "brandName",
      type: "text",
    },
    {
      name: "socialLink",
      type: "text",
    },
    {
      name: "challenge",
      type: "textarea",
    },
    {
      name: "brandGoal",
      type: "textarea",
    },
    {
      name: "timeline",
      type: "text",
    },
    {
      name: "referralSource",
      type: "text",
    },
    {
      name: "additionalNotes",
      type: "textarea",
    },
  ],
};

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
    defaultColumns: ["name", "email", "subject", "createdAt"],
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
    },
    {
      name: "message",
      type: "textarea",
      required: true,
    },
  ],
};

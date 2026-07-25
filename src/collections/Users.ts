import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Admin",
  },
  access: {
    create: async ({ req }) => {
      if (req.user) {
        return true;
      }

      const users = await req.payload.find({
        collection: "users",
        limit: 1,
        overrideAccess: true,
      });

      return users.totalDocs === 0;
    },
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Full name",
    },
    {
      name: "role",
      type: "select",
      defaultValue: "admin",
      options: [{ label: "Admin", value: "admin" }],
      required: true,
    },
  ],
};

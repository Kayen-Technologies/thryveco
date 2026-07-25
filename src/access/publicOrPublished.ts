import type { Access } from "payload";

export const publicOrPublished: Access = ({ req }) => {
  if (req.user) {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
  };
};

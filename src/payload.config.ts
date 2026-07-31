import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { Works } from "./collections/Works";
import { JournalPosts } from "./collections/JournalPosts";
import { ContactInquiries } from "./collections/ContactInquiries";

import { SiteSettings } from "./globals/SiteSettings";
import { HomePage } from "./globals/HomePage";
import { StudioPage } from "./globals/StudioPage";
import { WorksPage } from "./globals/WorksPage";
import { JournalPage } from "./globals/JournalPage";
import { AboutPage } from "./globals/AboutPage";
import { ContactPage } from "./globals/ContactPage";

import {
  revalidateSiteAfterChange,
  revalidateSiteGlobalAfterChange,
} from "./hooks/revalidateSite";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const contentCollections = [Media, Works, JournalPosts].map((collection) => ({
  ...collection,
  hooks: {
    ...collection.hooks,
    afterChange: [
      ...(collection.hooks?.afterChange ?? []),
      revalidateSiteAfterChange,
    ],
  },
}));

const contentGlobals = [
  SiteSettings,
  HomePage,
  StudioPage,
  WorksPage,
  JournalPage,
  AboutPage,
  ContactPage,
].map((global) => ({
  ...global,
  hooks: {
    ...global.hooks,
    afterChange: [
      ...(global.hooks?.afterChange ?? []),
      revalidateSiteGlobalAfterChange,
    ],
  },
}));

function getDatabasePoolConfig(): {
  connectionString: string;
  ssl?: { rejectUnauthorized: boolean };
} {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URI ||
    "";

  const connectionString = raw.trim().replace(/\.+$/, "");
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  let uri = connectionString;

  if (uri && !uri.includes("sslmode=")) {
    const separator = uri.includes("?") ? "&" : "?";
    uri = `${uri}${separator}${isLocal ? "sslmode=disable" : "sslmode=require"}`;
  }

  const needsSsl = Boolean(uri) && !isLocal;

  return {
    connectionString: uri,
    ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  };
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    theme: "light",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " - Thryve Co. Admin",
    },
  },
  collections: [Users, ...contentCollections, ContactInquiries],
  globals: contentGlobals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: getDatabasePoolConfig(),
    push: false,
    blocksAsJSON: true,
  }),
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
            clientUploads: true,
          }),
        ]
      : []),
  ],
  sharp,
});

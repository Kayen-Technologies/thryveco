import { getPayload } from "payload";
import { cache } from "react";
import config from "@payload-config";

import type { JournalPost, Work } from "@/payload-types";

export const getPayloadClient = cache(async () => {
  return getPayload({ config });
});

const publishedQuery = { draft: false } as const;

type Paginated<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

function emptyPaginated<T>(): Paginated<T> {
  return {
    docs: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 1,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[payload] CMS query failed:", error);
    }
    return fallback;
  }
}

export async function getHomePage() {
  return safe(async () => {
    const payload = await getPayloadClient();
    return payload.findGlobal({ slug: "home-page", depth: 2 });
  }, null);
}

export async function getStudioPage() {
  return safe(async () => {
    const payload = await getPayloadClient();
    return payload.findGlobal({ slug: "studio-page", depth: 2 });
  }, null);
}

export async function getWorksPage() {
  return safe(async () => {
    const payload = await getPayloadClient();
    return payload.findGlobal({ slug: "works-page", depth: 2 });
  }, null);
}

export async function getJournalPage() {
  return safe(async () => {
    const payload = await getPayloadClient();
    return payload.findGlobal({ slug: "journal-page", depth: 2 });
  }, null);
}

export async function getAboutPage() {
  return safe(async () => {
    const payload = await getPayloadClient();
    return payload.findGlobal({ slug: "about-page", depth: 2 });
  }, null);
}

export async function getWorks(options?: { limit?: number }) {
  return safe(async () => {
    const payload = await getPayloadClient();
    return payload.find({
      collection: "works",
      ...publishedQuery,
      limit: options?.limit ?? 100,
      sort: "sortOrder",
      depth: 2,
    });
  }, emptyPaginated<Work>());
}

export async function getWork(slug: string) {
  return safe(async () => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "works",
      ...publishedQuery,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    return result.docs[0] ?? null;
  }, null);
}

export async function getJournalPosts(options?: { limit?: number }) {
  return safe(async () => {
    const payload = await getPayloadClient();
    return payload.find({
      collection: "journal-posts",
      ...publishedQuery,
      limit: options?.limit ?? 100,
      sort: "-publishedAt",
      depth: 2,
    });
  }, emptyPaginated<JournalPost>());
}

export async function getJournalPost(slug: string) {
  return safe(async () => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "journal-posts",
      ...publishedQuery,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    return result.docs[0] ?? null;
  }, null);
}

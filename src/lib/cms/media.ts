import type { Media } from "@/payload-types";

export function normalizeMediaUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("/")) {
    return url;
  }

  try {
    const parsed = new URL(url);

    if (parsed.pathname.startsWith("/api/media/file/")) {
      return parsed.pathname;
    }

    return url;
  } catch {
    return url;
  }
}

export function getMediaUrl(
  media: number | Media | null | undefined,
): string | undefined {
  if (!media || typeof media === "number") {
    return undefined;
  }

  return normalizeMediaUrl(media.url);
}

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

  const url = normalizeMediaUrl(media.url);
  if (!url) return undefined;

  // Bust Next.js image optimizer cache when CMS media is replaced in place.
  const version = media.updatedAt ?? String(media.id);
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}v=${encodeURIComponent(version)}`;
}

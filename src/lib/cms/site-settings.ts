import { getMediaUrl } from "@/lib/cms/media";
import { getPayloadClient } from "@/lib/payload";
import { site as staticSite, type SiteConfig } from "@/lib/site";
import type { SiteSetting } from "@/payload-types";

export type { SiteConfig };

function getStaticSiteConfig(): SiteConfig {
  return {
    ...staticSite,
    navLinks: staticSite.navLinks.map((link) => ({ ...link })),
    socialLinks: staticSite.socialLinks.map((link) => ({ ...link })),
    footerLinks: staticSite.footerLinks.map((link) => ({ ...link })),
  };
}

function mapSiteSettings(doc: SiteSetting | null): SiteConfig {
  if (!doc) {
    return getStaticSiteConfig();
  }

  const fallback = getStaticSiteConfig();

  return {
    siteName: doc.siteName || fallback.siteName,
    tagline: doc.tagline || fallback.tagline,
    location: doc.location || fallback.location,
    email: doc.email || fallback.email,
    phone: doc.phone || fallback.phone,
    bookingLink: doc.bookingLink || fallback.bookingLink,
    bookingLabel: fallback.bookingLabel,
    navLinks:
      doc.navLinks?.length && doc.navLinks.every((link) => link.label && link.href)
        ? doc.navLinks.map((link) => ({
            label: link.label!,
            href: link.href!,
          }))
        : fallback.navLinks,
    socialLinks:
      doc.socialLinks?.length &&
      doc.socialLinks.every((link) => link.label && link.href)
        ? doc.socialLinks.map((link) => ({
            label: link.label!,
            href: link.href!,
          }))
        : fallback.socialLinks,
    footerLinks:
      doc.footerLinks?.length &&
      doc.footerLinks.every((link) => link.label && link.href)
        ? doc.footerLinks.map((link) => ({
            label: link.label!,
            href: link.href!,
          }))
        : fallback.footerLinks,
    copyrightYear: doc.copyrightYear ?? fallback.copyrightYear,
    logoUrl: getMediaUrl(doc.logo),
    logoDarkUrl: getMediaUrl(doc.logoDark),
    footerImageUrl: getMediaUrl(doc.footerImage),
  };
}

export async function getSiteSettings(): Promise<SiteConfig> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({
      slug: "site-settings",
      depth: 2,
    });

    return mapSiteSettings(doc);
  } catch {
    return getStaticSiteConfig();
  }
}

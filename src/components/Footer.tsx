import Image from "next/image";
import Link from "next/link";

import { getSiteSettings } from "@/lib/cms/site-settings";

export default async function Footer() {
  const site = await getSiteSettings();

  return (
    <footer className="bg-[var(--color-primary)] text-[var(--color-text-on-dark)]">
      <div className="container-x py-24">
        <div className="mx-auto max-w-[900px] text-center">
          {site.logoDarkUrl ? (
            <Image
              src={site.logoDarkUrl}
              alt={site.siteName}
              width={96}
              height={103}
              className="mx-auto mb-8 h-[103px] w-auto object-contain"
            />
          ) : (
            <p className="font-decorative mb-8 text-6xl text-[var(--color-accent)]">
              &amp;
            </p>
          )}
          <p className="font-heading text-[clamp(2rem,4vw,4rem)] leading-tight">
            {site.tagline}
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-[900px] gap-12 md:grid-cols-3">
          <div>
            <p className="mb-8 text-xl font-semibold">Menu</p>
            <ul className="space-y-6 text-xl">
              {site.footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-opacity hover:opacity-80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-8 text-xl font-semibold">Get In Touch</p>
            <ul className="space-y-6 text-xl">
              <li>{site.location}</li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-opacity hover:opacity-80"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="transition-opacity hover:opacity-80"
                >
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-8 text-xl font-semibold">Socials</p>
            <ul className="space-y-4">
              {site.socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-full bg-[var(--color-bg-surface)] py-1 pl-3 pr-1 text-base text-[var(--color-text)]"
                  >
                    <span>{social.label}</span>
                    <span className="flex size-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs text-white">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-20 flex max-w-[900px] flex-col gap-4 border-t border-white/20 pt-8 text-sm opacity-70 md:flex-row md:items-center md:justify-between">
          <Link href="/terms">Terms of Service</Link>
          <p>
            © {site.copyrightYear} {site.siteName} All rights reserved
          </p>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}

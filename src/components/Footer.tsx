import Image from "next/image";
import Link from "next/link";

import { getSiteSettings } from "@/lib/cms/site-settings";

const FOOTER_LOGO_FALLBACK = "/assets/footer/logo-ampersand.svg";
const FOOTER_BRAND_CARD_FALLBACK = "/assets/footer/brand-card.jpg";

const SOCIAL_ICONS: Record<string, string> = {
  Instagram: "/assets/footer/social-instagram.svg",
  TikTok: "/assets/footer/social-tiktok.svg",
};

export default async function Footer() {
  const site = await getSiteSettings();
  const brandCardSrc = site.footerImageUrl ?? FOOTER_BRAND_CARD_FALLBACK;

  return (
    <footer className="site-footer">
      <div className="site-footer__hero">
        <Image
          src={FOOTER_LOGO_FALLBACK}
          alt={site.siteName}
          width={96}
          height={103}
          className="site-footer__logo"
        />
        <p className="site-footer__tagline">{site.tagline}</p>
      </div>

      <div className="site-footer__divider" aria-hidden="true" />

      <div className="site-footer__lower">
        <div className="site-footer__brand-card">
          <Image
            src={brandCardSrc}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 295px"
            className="site-footer__brand-card-image"
          />
        </div>

        <div className="site-footer__columns">
          <div className="site-footer__column">
            <p className="site-footer__column-title">Menu</p>
            <ul className="site-footer__list">
              {site.footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="site-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__column">
            <p className="site-footer__column-title">Get In Touch</p>
            <ul className="site-footer__list">
              <li>{site.location}</li>
              <li>
                <a href={`mailto:${site.email}`} className="site-footer__link">
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="site-footer__link"
                >
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__column site-footer__column--socials">
            <p className="site-footer__column-title">Socials</p>
            <ul className="site-footer__social-list">
              {site.socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-footer__social-pill"
                  >
                    <span>{social.label}</span>
                    <span className="site-footer__social-icon" aria-hidden="true">
                      {SOCIAL_ICONS[social.label] ? (
                        <Image
                          src={SOCIAL_ICONS[social.label]}
                          alt=""
                          width={14}
                          height={14}
                        />
                      ) : (
                        <span>↗</span>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__legal">
        <Link href="/terms" className="site-footer__legal-link">
          Terms of Service
        </Link>
        <p className="site-footer__copyright">
          © {site.copyrightYear} {site.siteName} All rights reserved
        </p>
        <Link href="/privacy" className="site-footer__legal-link">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}

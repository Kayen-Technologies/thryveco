"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import type { SiteConfig } from "@/lib/cms/site-settings";

type NavbarProps = {
  site: SiteConfig;
  variant?: "light" | "dark";
  /** Pass from server component to avoid hydration mismatch with usePathname */
  currentPath?: string;
};

function LogoMark({
  src,
  alt,
  className = "",
}: Readonly<{
  src: string;
  alt: string;
  className?: string;
}>) {
  const classes = `h-[50px] w-[49px] object-contain ${className}`.trim();

  if (src.endsWith(".svg")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={49} height={50} className={classes} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={49}
      height={50}
      priority
      className={classes}
    />
  );
}

/** Past this many pixels the bar goes solid, so a stray pixel of trackpad
 *  scroll doesn't flicker it against the hero. */
const SOLID_BAR_SCROLL_THRESHOLD = 24;

export default function Navbar({ site, variant = "light", currentPath }: NavbarProps) {
  const clientPathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Force re-render after mount to ensure correct client-side state
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SOLID_BAR_SCROLL_THRESHOLD);

    // Browsers restore scroll position on reload and back, so read it now
    // rather than waiting for the visitor to move.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Use client pathname once mounted; before mount, use server-provided or default to "/"
  const rawPathname = mounted ? clientPathname : (currentPath || clientPathname);
  const pathname = rawPathname && rawPathname.length > 0 ? rawPathname : "/";

  const isJournalPage = pathname === "/journal";
  const isWorksListingPage = pathname === "/works";
  const isContactPage = pathname === "/contact";
  const isHomePage = pathname === "/";
  
  // Before mount, default to overlay mode (correct for home, about, studio)
  // This prevents wrong colors flash on the most important pages
  const isOverlayNav = !mounted ? true : (
    isHomePage ||
    pathname === "/about" ||
    pathname === "/studio" ||
    isContactPage
  );
  const overlayVariant = isOverlayNav ? "light" : variant;
  // Contact sits on cream under the nav — charcoal links, not light-on-dark.
  const effectiveVariant = isContactPage ? "dark" : overlayVariant;
  const bookingLabel =
    isOverlayNav && !isContactPage ? "Book a Call" : site.bookingLabel;
  // The solid bar is burgundy over whatever is scrolling past, so the
  // per-route colours stop applying and everything goes light.
  const textColor =
    isScrolled || effectiveVariant === "light"
      ? "text-[var(--color-text-on-dark)]"
      : "text-[var(--color-text)]";
  const overlayLogoSrc = "/assets/home/nav-monogram.svg";
  const creamBgLogoSrc = "/assets/home/nav-monogram-dark.svg";
  const useWhiteLogo =
    isJournalPage ||
    isWorksListingPage ||
    (isOverlayNav && !isContactPage && effectiveVariant === "light");
  const logoSrc = useWhiteLogo
    ? overlayLogoSrc
    : effectiveVariant === "light"
      ? site.logoDarkUrl ?? overlayLogoSrc
      : site.logoUrl ?? creamBgLogoSrc;
  // On burgundy the white monogram is the only legible mark, including on
  // contact, which otherwise splits marks by breakpoint.
  const resolvedLogoSrc = isScrolled ? overlayLogoSrc : logoSrc;
  const showsContactDesktopLogo = isContactPage && !isScrolled;

  useEffect(() => {
    setIsOpen(false);
  }, [clientPathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <header
      className={`site-nav${isOverlayNav ? " site-nav--overlay" : ""}`}
      data-scrolled={isScrolled ? "true" : undefined}
    >
      <div className="site-nav__bar container-x flex items-center justify-between gap-6">
        <nav className="hidden items-center gap-[50px] lg:flex" aria-label="Main">
          {site.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-base leading-none transition-opacity hover:opacity-80 ${textColor} ${
                pathname === link.href ? "font-semibold" : "font-normal"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
          aria-label={`${site.siteName} home`}
        >
          {resolvedLogoSrc ? (
            <>
              <LogoMark
                src={resolvedLogoSrc}
                alt={site.siteName}
                className={showsContactDesktopLogo ? "lg:hidden" : ""}
              />
              {showsContactDesktopLogo && (
                <LogoMark src={overlayLogoSrc} alt="" className="hidden lg:block" />
              )}
            </>
          ) : (
            <span
              className={`font-heading text-xl font-medium tracking-tight ${textColor}`}
            >
              T&amp;C
            </span>
          )}
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:block">
            <Button href={site.bookingLink} variant="primary">
              {bookingLabel}
            </Button>
          </div>

          <button
            type="button"
            className={`inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden ${textColor}`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--color-primary)] px-6 pb-10 pt-[var(--nav-h-current)] lg:hidden">
          <button
            type="button"
            className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center text-[var(--color-text-on-dark)]"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          >
            <span className="absolute block h-0.5 w-5 rotate-45 bg-current" />
            <span className="absolute block h-0.5 w-5 -rotate-45 bg-current" />
          </button>
          <nav className="flex flex-col gap-6" aria-label="Mobile">
            {site.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl text-[var(--color-text-on-dark)]"
              >
                {link.label}
              </Link>
            ))}
            <Button
              href={site.bookingLink}
              variant="primary"
              className="mt-4 w-full"
            >
              {bookingLabel}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

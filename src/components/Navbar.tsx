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
};

export default function Navbar({ site, variant = "light" }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isJournalPage = pathname === "/journal";
  const isWorksListingPage = pathname === "/works";
  const isOverlayNav = pathname === "/" || pathname === "/about";
  const effectiveVariant = isOverlayNav ? "light" : variant;
  const bookingLabel = isOverlayNav ? "Book a Call" : site.bookingLabel;
  const textColor =
    effectiveVariant === "light"
      ? "text-[var(--color-text-on-dark)]"
      : "text-[var(--color-text)]";
  const overlayLogoSrc = "/assets/home/nav-monogram.svg";
  const creamBgLogoSrc = "/assets/home/nav-monogram-dark.svg";
  const useWhiteLogo =
    isJournalPage || isWorksListingPage || (isOverlayNav && effectiveVariant === "light");
  const logoSrc = useWhiteLogo
    ? overlayLogoSrc
    : effectiveVariant === "light"
      ? site.logoDarkUrl ?? overlayLogoSrc
      : site.logoUrl ?? creamBgLogoSrc;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <header className={`${isOverlayNav ? "absolute inset-x-0 top-0" : "relative"} z-50 w-full`}>
      <div className="container-x relative flex h-[var(--spacing-nav-h)] items-center justify-between gap-6">
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
          {logoSrc ? (
            logoSrc.endsWith(".svg") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={site.siteName}
                width={49}
                height={50}
                className="h-[50px] w-[49px] object-contain"
              />
            ) : (
              <Image
                src={logoSrc}
                alt={site.siteName}
                width={49}
                height={50}
                priority
                className="h-[50px] w-[49px] object-contain"
              />
            )
          ) : (
            <span
              className={`font-heading text-xl font-medium tracking-tight ${textColor}`}
            >
              T&amp;C
            </span>
          )}
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <Button
            href={site.bookingLink}
            variant="primary"
            className="hidden lg:inline-flex"
          >
            {bookingLabel}
          </Button>

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
        <div className="fixed inset-0 z-50 bg-[var(--color-primary)] px-6 pb-10 pt-[var(--spacing-nav-h)] lg:hidden">
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

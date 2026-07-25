"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { SiteConfig } from "@/lib/cms/site-settings";

type NavbarProps = {
  site: SiteConfig;
  variant?: "light" | "dark";
};

export default function Navbar({ site, variant = "light" }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const textColor = variant === "light" ? "text-[var(--color-text-on-dark)]" : "text-[var(--color-text)]";
  const logoSrc = variant === "light" ? site.logoDarkUrl : site.logoUrl;

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
    <header className="relative z-50 w-full">
      <div className="container-x flex h-[130px] items-center justify-between gap-6">
        <nav className="hidden items-center gap-12 md:flex" aria-label="Main">
          {site.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base transition-opacity hover:opacity-80 ${textColor} ${
                pathname === link.href ? "font-semibold" : "font-normal"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2"
          aria-label={`${site.siteName} home`}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={site.siteName}
              width={50}
              height={50}
              priority
              className="h-[50px] w-auto object-contain"
            />
          ) : (
            <span
              className={`font-heading text-xl font-medium tracking-tight ${textColor}`}
            >
              T&amp;C
            </span>
          )}
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href={site.bookingLink}
            className="hidden h-[50px] items-center justify-center bg-[var(--color-bg-surface)] px-8 text-base text-[var(--color-text)] transition-opacity hover:opacity-90 md:inline-flex"
          >
            {site.bookingLabel}
          </Link>

          <button
            type="button"
            className={`inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden ${textColor}`}
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
        <div className="fixed inset-0 z-50 bg-[var(--color-primary)] px-6 pb-10 pt-[130px] md:hidden">
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
            <Link
              href={site.bookingLink}
              className="mt-4 inline-flex h-[50px] w-full items-center justify-center bg-[var(--color-bg-surface)] text-base text-[var(--color-text)]"
            >
              {site.bookingLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

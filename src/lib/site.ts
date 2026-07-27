export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  siteName: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  bookingLink: string;
  bookingLabel: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  footerLinks: NavLink[];
  copyrightYear: number;
  logoUrl?: string;
  logoDarkUrl?: string;
  footerImageUrl?: string;
};

export const site: SiteConfig = {
  siteName: "Thryve Co.",
  tagline: "Making brands feel as good as they look.",
  location: "Accra, Ghana",
  email: "hello@thryve&co.agency",
  phone: "+233 53 762 2693",
  bookingLink: "/contact",
  bookingLabel: "Book a Call",
  navLinks: [
    { label: "Studio", href: "/studio" },
    { label: "Works", href: "/works" },
    { label: "Journal", href: "/journal" },
    { label: "About", href: "/about" },
  ],
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ],
  footerLinks: [
    { label: "Home", href: "/" },
    { label: "Studio", href: "/studio" },
    { label: "Works", href: "/works" },
    { label: "Journal", href: "/journal" },
    { label: "About", href: "/about" },
  ],
  copyrightYear: 2026,
  logoUrl: "/assets/home/nav-monogram-dark.svg",
  logoDarkUrl: "/assets/home/nav-monogram.svg",
};

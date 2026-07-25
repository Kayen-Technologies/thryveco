import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a call or get in touch with Thryve Co.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="bg-cream-section container-x section-y">
        <h1 className="font-heading mb-3 text-[var(--text-h1)]">Let&apos;s talk.</h1>
        <p className="mb-12 max-w-xl text-[var(--text-lead)] text-[var(--color-text-muted)]">
          Ready to build a brand people remember? Start here.
        </p>
        <ContactForm />
      </section>
    </main>
  );
}

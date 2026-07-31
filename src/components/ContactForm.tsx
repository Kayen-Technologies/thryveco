"use client";

import ContactForm from "@/components/contact/ContactForm";
import { CONTACT_DEFAULTS } from "@/components/contact/defaults";

/** @deprecated Prefer `@/components/contact/ContactForm` with CMS copy. */
export default function LegacyContactForm() {
  return <ContactForm copy={CONTACT_DEFAULTS.form} />;
}

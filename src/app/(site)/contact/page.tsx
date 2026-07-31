import type { Metadata } from "next";

import ContactFormSection from "@/components/contact/ContactFormSection";
import ContactHero from "@/components/contact/ContactHero";
import {
  CONTACT_DEFAULTS,
  CONTACT_REFERRAL_OPTIONS,
  CONTACT_SERVICE_OPTIONS,
  CONTACT_TIMELINE_OPTIONS,
  type ContactFormCopy,
  type ContactMediaSrc,
  type ContactSelectOption,
} from "@/components/contact/defaults";
import { getMediaUrl } from "@/lib/cms/media";
import { getContactPage } from "@/lib/payload";
import type { ContactPage, Media } from "@/payload-types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();

  return {
    title: page?.seo?.title ?? CONTACT_DEFAULTS.seo.title,
    description: page?.seo?.description ?? CONTACT_DEFAULTS.seo.description,
  };
}

function mediaSource(
  media: number | Media | null | undefined,
  fallback: ContactMediaSrc,
): ContactMediaSrc {
  const src = getMediaUrl(media);
  if (!src || !media || typeof media === "number") return fallback;
  return { src, alt: media.alt || fallback.alt };
}

function mapOptions(
  options: { label?: string | null }[] | null | undefined,
  fallback: ContactSelectOption[],
): ContactSelectOption[] {
  if (!options?.length) return fallback;
  const mapped = options
    .map((option) => option.label?.trim())
    .filter((label): label is string => Boolean(label))
    .map((label) => ({ label }));
  return mapped.length > 0 ? mapped : fallback;
}

function resolveFormCopy(
  form: ContactPage["form"] | null | undefined,
): ContactFormCopy {
  return {
    heading: form?.heading ?? CONTACT_DEFAULTS.form.heading,
    intro: form?.intro ?? CONTACT_DEFAULTS.form.intro,
    nameLabel: form?.nameLabel ?? CONTACT_DEFAULTS.form.nameLabel,
    emailLabel: form?.emailLabel ?? CONTACT_DEFAULTS.form.emailLabel,
    serviceLabel: form?.serviceLabel ?? CONTACT_DEFAULTS.form.serviceLabel,
    brandNameLabel: form?.brandNameLabel ?? CONTACT_DEFAULTS.form.brandNameLabel,
    socialLinkLabel: form?.socialLinkLabel ?? CONTACT_DEFAULTS.form.socialLinkLabel,
    challengeLabel: form?.challengeLabel ?? CONTACT_DEFAULTS.form.challengeLabel,
    brandGoalLabel: form?.brandGoalLabel ?? CONTACT_DEFAULTS.form.brandGoalLabel,
    timelineLabel: form?.timelineLabel ?? CONTACT_DEFAULTS.form.timelineLabel,
    referralLabel: form?.referralLabel ?? CONTACT_DEFAULTS.form.referralLabel,
    additionalNotesLabel:
      form?.additionalNotesLabel ?? CONTACT_DEFAULTS.form.additionalNotesLabel,
    submitLabel: form?.submitLabel ?? CONTACT_DEFAULTS.form.submitLabel,
    successTitle: form?.successTitle ?? CONTACT_DEFAULTS.form.successTitle,
    successBody: form?.successBody ?? CONTACT_DEFAULTS.form.successBody,
    serviceOptions: mapOptions(form?.serviceOptions, CONTACT_SERVICE_OPTIONS),
    timelineOptions: mapOptions(form?.timelineOptions, CONTACT_TIMELINE_OPTIONS),
    referralOptions: mapOptions(form?.referralOptions, CONTACT_REFERRAL_OPTIONS),
  };
}

export default async function ContactPageRoute() {
  const page = await getContactPage();
  const form = resolveFormCopy(page?.form);

  return (
    <main className="contact-page">
      <ContactHero
        headline={page?.hero?.headline ?? CONTACT_DEFAULTS.hero.headline}
        body={page?.hero?.body ?? CONTACT_DEFAULTS.hero.body}
        image={mediaSource(page?.hero?.image, CONTACT_DEFAULTS.hero.image)}
      />
      <ContactFormSection
        heading={form.heading}
        intro={form.intro}
        form={form}
      />
    </main>
  );
}

export type ContactMediaSrc = {
  src: string;
  alt: string;
};

export type ContactSelectOption = {
  label: string;
};

export const CONTACT_SERVICE_OPTIONS: ContactSelectOption[] = [
  { label: "The Thryve Blueprint (Strategy & Consulting)" },
  { label: "The Thryve Aesthetic (Content Creation)" },
  { label: "The Thryve Edit (Social Media Management)" },
  { label: "The Thryve Moment (Creative Direction)" },
];

export const CONTACT_TIMELINE_OPTIONS: ContactSelectOption[] = [
  { label: "ASAP" },
  { label: "Within 1 month" },
  { label: "1–3 months" },
  { label: "3–6 months" },
  { label: "6+ months" },
  { label: "Flexible" },
];

export const CONTACT_REFERRAL_OPTIONS: ContactSelectOption[] = [
  { label: "Instagram" },
  { label: "TikTok" },
  { label: "Referral" },
  { label: "Google" },
  { label: "Journal / Blog" },
  { label: "Other" },
];

export const CONTACT_DEFAULTS = {
  seo: {
    title: "Contact",
    description:
      "Tell us about your brand. Fill in the form and we'll be in touch to schedule your discovery call.",
  },
  hero: {
    headline: "You've found your people.",
    body: "At Thryve & Co. we are intentional about who we work with and how many brands we take on at a time. Because when we're in, we're fully in. If you feel like Thryve might be what your brand needs we'd love to hear from you. Fill in the form below and we'll be in touch to schedule your discovery call.",
    image: {
      src: "/assets/contact/contact-hero.jpg",
      alt: "Thryve & Co contact hero",
    } satisfies ContactMediaSrc,
  },
  form: {
    heading: "Tell us about your brand.",
    intro:
      "We read every submission personally. The more honest you are, the better the conversation will be.",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    serviceLabel: "Service You're Interested In",
    brandNameLabel: "Brand Name",
    socialLinkLabel: "Link to Main Social Account",
    challengeLabel:
      "What's your biggest creative or social media challenge right now?…",
    brandGoalLabel: "Where do you want your brand to be in the next 6 months?…",
    timelineLabel: "Timeline or Project Date",
    referralLabel: "How did you hear about Thryve & Co.?",
    additionalNotesLabel: "Anything else you'd like us to know before the call?",
    submitLabel: "Submit Enquiry",
    successTitle: "Enquiry received.",
    successBody:
      "Thanks for reaching out. We'll read your submission and be in touch to schedule your discovery call.",
    serviceOptions: CONTACT_SERVICE_OPTIONS,
    timelineOptions: CONTACT_TIMELINE_OPTIONS,
    referralOptions: CONTACT_REFERRAL_OPTIONS,
  },
};

export type ContactFormCopy = typeof CONTACT_DEFAULTS.form;

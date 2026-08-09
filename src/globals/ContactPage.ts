import type { GlobalConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";
import { publicRead } from "@/access/publicRead";

const SERVICE_DEFAULTS = [
  "The Thryve Blueprint (Strategy & Consulting)",
  "The Thryve Aesthetic (Content Creation)",
  "The Thryve Edit (Social Media Management)",
  "The Thryve Moment (Creative Direction)",
];

const TIMELINE_DEFAULTS = [
  "ASAP",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "6+ months",
  "Flexible",
];

const REFERRAL_DEFAULTS = [
  "Instagram",
  "TikTok",
  "Referral",
  "Google",
  "Journal / Blog",
  "Other",
];

function optionDefaults(labels: string[]) {
  return labels.map((label) => ({ label }));
}

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact Page",
  admin: {
    group: "Pages",
  },
  access: {
    read: publicRead,
    update: isAdmin,
  },
  fields: [
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "Contact",
        },
        {
          name: "description",
          type: "textarea",
          defaultValue:
            "Tell us about your brand. Fill in the form and we'll be in touch to schedule your discovery call.",
        },
      ],
    },
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        {
          name: "headline",
          type: "text",
          defaultValue: "You've found your people.",
        },
        {
          name: "body",
          type: "textarea",
          defaultValue:
            "At Thryve & Co. we are intentional about who we work with and how many brands we take on at a time. Because when we're in, we're fully in. If you feel like Thryve might be what your brand needs we'd love to hear from you. Fill in the form below and we'll be in touch to schedule your discovery call.",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "form",
      type: "group",
      label: "Form",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "Tell us about your brand.",
        },
        {
          name: "intro",
          type: "textarea",
          defaultValue:
            "We read every submission personally. The more honest you are, the better the conversation will be.",
        },
        {
          name: "nameLabel",
          type: "text",
          defaultValue: "Full Name",
        },
        {
          name: "emailLabel",
          type: "text",
          defaultValue: "Email Address",
        },
        {
          name: "serviceLabel",
          type: "text",
          defaultValue: "Service You're Interested In",
        },
        {
          name: "brandNameLabel",
          type: "text",
          defaultValue: "Brand Name",
        },
        {
          name: "socialLinkLabel",
          type: "text",
          defaultValue: "Link to Main Social Account",
        },
        {
          name: "challengeLabel",
          type: "text",
          defaultValue:
            "What's your biggest creative or social media challenge right now?…",
        },
        {
          name: "brandGoalLabel",
          type: "text",
          defaultValue: "Where do you want your brand to be in the next 6 months?…",
        },
        {
          name: "timelineLabel",
          type: "text",
          defaultValue: "Timeline or Project Date",
        },
        {
          name: "referralLabel",
          type: "text",
          defaultValue: "How did you hear about Thryve & Co.?",
        },
        {
          name: "additionalNotesLabel",
          type: "text",
          defaultValue: "Anything else you'd like us to know before the call?",
        },
        {
          name: "submitLabel",
          type: "text",
          defaultValue: "Submit Enquiry",
        },
        {
          name: "successTitle",
          type: "text",
          defaultValue: "Enquiry received.",
        },
        {
          name: "successBody",
          type: "textarea",
          defaultValue:
            "Thanks for reaching out. We'll read your submission and be in touch to schedule your discovery call.",
        },
        {
          name: "serviceOptions",
          type: "array",
          label: "Service Options",
          labels: { singular: "Option", plural: "Options" },
          defaultValue: optionDefaults(SERVICE_DEFAULTS),
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "timelineOptions",
          type: "array",
          label: "Timeline Options",
          labels: { singular: "Option", plural: "Options" },
          defaultValue: optionDefaults(TIMELINE_DEFAULTS),
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "referralOptions",
          type: "array",
          label: "Referral Options",
          labels: { singular: "Option", plural: "Options" },
          defaultValue: optionDefaults(REFERRAL_DEFAULTS),
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};

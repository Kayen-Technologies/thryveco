import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function getContactToEmail(): string {
  return process.env.CONTACT_TO_EMAIL ?? "hello@thryveco.agency";
}

export function getContactFromEmail(): string {
  const from = process.env.CONTACT_FROM_EMAIL;

  // No resend.dev fallback: it silently downgrades sends to sandbox mode,
  // which only delivers to the Resend account owner.
  if (!from) {
    throw new Error(
      "CONTACT_FROM_EMAIL is not configured. Set it to an address on a domain verified in Resend.",
    );
  }

  return from;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

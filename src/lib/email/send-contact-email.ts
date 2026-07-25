import type { ContactPayload } from "@/lib/validation/contact";
import {
  escapeHtml,
  getContactFromEmail,
  getContactToEmail,
  getResendClient,
} from "@/lib/email/resend";

export function buildContactEmailText(payload: ContactPayload): string {
  const lines = [
    "New contact inquiry — Thryve Co.",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
  ];

  if (payload.subject) {
    lines.push(`Subject: ${payload.subject}`);
  }

  lines.push("", "Message:", payload.message);

  return lines.join("\n");
}

export function buildContactEmailHtml(payload: ContactPayload): string {
  const subjectRow = payload.subject
    ? `<p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>`
    : "";

  return `
    <h2>New contact inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${subjectRow}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
  `;
}

export async function sendContactEmail(payload: ContactPayload) {
  const resend = getResendClient();
  const to = getContactToEmail();
  const from = getContactFromEmail();
  const subject = payload.subject
    ? `[Thryve Co.] ${payload.subject}`
    : `[Thryve Co.] New inquiry from ${payload.name}`;

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: payload.email,
    subject,
    text: buildContactEmailText(payload),
    html: buildContactEmailHtml(payload),
  });

  if (error) {
    throw new Error(error.message);
  }
}

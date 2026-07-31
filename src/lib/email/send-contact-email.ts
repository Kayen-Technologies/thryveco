import type { ContactPayload } from "@/lib/validation/contact";
import {
  escapeHtml,
  getContactFromEmail,
  getContactToEmail,
  getResendClient,
} from "@/lib/email/resend";

const COLORS = {
  burgundy: "#6B0F1A",
  cream: "#F5EFE0",
  warmWhite: "#FCFAF7",
  charcoal: "#1A1A1A",
  muted: "#929292",
} as const;

function pushIfPresent(lines: string[], label: string, value?: string) {
  if (value?.trim()) lines.push(`${label}: ${value}`);
}

export function buildContactEmailText(payload: ContactPayload): string {
  const lines = [
    "New brand enquiry — Thryve & Co.",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
  ];

  if (payload.kind === "legacy") {
    pushIfPresent(lines, "Subject", payload.subject);
    lines.push("", "Message:", payload.message);
    return lines.join("\n");
  }

  // Field order must match HTML (spec: Name, Email, Service, Brand, Social, …)
  lines.push(
    `Service: ${payload.service}`,
    `Brand: ${payload.brandName}`,
    `Social: ${payload.socialLink}`,
  );
  pushIfPresent(lines, "Subject", payload.subject);
  pushIfPresent(lines, "Timeline", payload.timeline);
  pushIfPresent(lines, "Referral", payload.referralSource);
  lines.push(
    "",
    "Challenge:",
    payload.challenge,
    "",
    "6-month goal:",
    payload.brandGoal,
  );

  if (isPresent(payload.additionalNotes)) {
    lines.push("", "Additional notes:", payload.additionalNotes);
  }

  return lines.join("\n");
}

function withLineBreaks(value: string): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />");
}

function isPresent(value?: string): value is string {
  return Boolean(value?.trim());
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 0 0 18px 0; vertical-align: top;">
        <div style="margin: 0 0 5px 0; color: ${COLORS.muted}; font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 700; line-height: 1.4; letter-spacing: 1.1px; text-transform: uppercase;">${escapeHtml(label)}</div>
        <div style="margin: 0; color: ${COLORS.charcoal}; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.55;">${withLineBreaks(value)}</div>
      </td>
    </tr>`;
}

function emailRow(email: string): string {
  const escapedEmail = escapeHtml(email);
  const mailto = `mailto:${encodeURIComponent(email)}`;

  return `
    <tr>
      <td style="padding: 0 0 18px 0; vertical-align: top;">
        <div style="margin: 0 0 5px 0; color: ${COLORS.muted}; font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 700; line-height: 1.4; letter-spacing: 1.1px; text-transform: uppercase;">Email</div>
        <div style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.55;"><a href="${escapeHtml(mailto)}" style="color: ${COLORS.burgundy}; text-decoration: underline;">${escapedEmail}</a></div>
      </td>
    </tr>`;
}

function socialRow(social: string): string {
  let linkedValue = "";

  try {
    const url = new URL(social);
    if (url.protocol === "http:" || url.protocol === "https:") {
      // Use normalized href so raw newlines/control chars never land in the attribute.
      linkedValue = `<a href="${escapeHtml(url.href)}" style="color: ${COLORS.burgundy}; text-decoration: underline;">${withLineBreaks(social)}</a>`;
    }
  } catch {
    // Invalid or non-absolute values remain escaped plain text.
  }

  const value = linkedValue || withLineBreaks(social);

  return `
    <tr>
      <td style="padding: 0 0 18px 0; vertical-align: top;">
        <div style="margin: 0 0 5px 0; color: ${COLORS.muted}; font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 700; line-height: 1.4; letter-spacing: 1.1px; text-transform: uppercase;">Social</div>
        <div style="margin: 0; color: ${COLORS.charcoal}; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.55;">${value}</div>
      </td>
    </tr>`;
}

function renderEmailLayout(rows: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New brand enquiry</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: ${COLORS.cream};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.cream}" style="width: 100%; border-collapse: collapse; background-color: ${COLORS.cream};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.warmWhite}" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: ${COLORS.warmWhite};">
            <tr>
              <td bgcolor="${COLORS.burgundy}" style="padding: 34px 40px; background-color: ${COLORS.burgundy};">
                <div style="margin: 0 0 8px 0; color: ${COLORS.cream}; font-family: Georgia, 'Times New Roman', Times, serif; font-size: 28px; line-height: 1.2;">Thryve &amp; Co.</div>
                <div style="margin: 0; color: ${COLORS.warmWhite}; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 700; line-height: 1.4; letter-spacing: 1.6px; text-transform: uppercase;">New brand enquiry</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 38px 40px 20px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
                  ${rows}
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="${COLORS.cream}" style="padding: 18px 40px; background-color: ${COLORS.cream}; color: ${COLORS.muted}; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.5;">
                Sent from the Thryve &amp; Co. contact form.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildContactEmailHtml(payload: ContactPayload): string {
  if (payload.kind === "legacy") {
    return renderEmailLayout(
      [
        detailRow("Name", payload.name),
        emailRow(payload.email),
        isPresent(payload.subject)
          ? detailRow("Subject", payload.subject)
          : "",
        detailRow("Message", payload.message),
      ].join(""),
    );
  }

  return renderEmailLayout(
    [
      detailRow("Name", payload.name),
      emailRow(payload.email),
      detailRow("Service", payload.service),
      detailRow("Brand", payload.brandName),
      socialRow(payload.socialLink),
      isPresent(payload.subject) ? detailRow("Subject", payload.subject) : "",
      isPresent(payload.timeline)
        ? detailRow("Timeline", payload.timeline)
        : "",
      isPresent(payload.referralSource)
        ? detailRow("Referral", payload.referralSource)
        : "",
      detailRow("Challenge", payload.challenge),
      detailRow("6-month goal", payload.brandGoal),
      isPresent(payload.additionalNotes)
        ? detailRow("Additional notes", payload.additionalNotes)
        : "",
    ].join(""),
  );
}

function sanitizeHeaderPart(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function buildContactEmailSubject(payload: ContactPayload): string {
  const name = sanitizeHeaderPart(payload.name);

  if (payload.kind === "legacy") {
    return payload.subject
      ? `[Thryve Co.] ${sanitizeHeaderPart(payload.subject)}`
      : `[Thryve Co.] New inquiry from ${name}`;
  }

  return `[Thryve & Co.] ${name} · ${sanitizeHeaderPart(payload.brandName)} — ${sanitizeHeaderPart(payload.service)}`;
}

export async function sendContactEmail(payload: ContactPayload) {
  const resend = getResendClient();
  const to = getContactToEmail();
  const from = getContactFromEmail();

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: sanitizeHeaderPart(payload.email),
    subject: buildContactEmailSubject(payload),
    text: buildContactEmailText(payload),
    html: buildContactEmailHtml(payload),
  });

  if (error) {
    throw new Error(error.message);
  }
}

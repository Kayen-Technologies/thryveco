export type LegacyContactPayload = {
  kind: "legacy";
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type NewContactPayload = {
  kind: "new";
  name: string;
  email: string;
  service: string;
  brandName: string;
  socialLink: string;
  challenge: string;
  brandGoal: string;
  timeline: string;
  referralSource: string;
  additionalNotes: string;
  subject: string;
  message: string;
};

export type ContactPayload = LegacyContactPayload | NewContactPayload;

export type ContactValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; error: string; errors?: Record<string, string> };

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  if (email.length > 254 || email.includes(" ")) return false;

  const atIndex = email.indexOf("@");
  const dotIndex = email.indexOf(".", atIndex + 2);

  return (
    atIndex > 0 &&
    atIndex === email.lastIndexOf("@") &&
    dotIndex > atIndex + 1 &&
    dotIndex < email.length - 1
  );
}

function looksLikeNewShape(body: Record<string, unknown>): boolean {
  // Key off required new-path fields only. Optional timeline/referral/notes
  // alone must not force the new validator (legacy path stays compatible).
  return (
    typeof body.service === "string" ||
    typeof body.brandName === "string" ||
    typeof body.socialLink === "string" ||
    typeof body.challenge === "string" ||
    typeof body.brandGoal === "string"
  );
}

function buildNewMessageSummary(data: {
  service: string;
  brandName: string;
  challenge: string;
  brandGoal: string;
}): string {
  return [
    `Service: ${data.service}`,
    `Brand: ${data.brandName}`,
    "",
    "Challenge:",
    data.challenge,
    "",
    "6-month goal:",
    data.brandGoal,
  ].join("\n");
}

export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const website = body.website;
  return typeof website === "string" && website.trim().length > 0;
}

function validateLegacyPayload(
  body: Record<string, unknown>,
): ContactValidationResult {
  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const subject = asTrimmedString(body.subject);
  const message = asTrimmedString(body.message);
  const errors: Record<string, string> = {};

  if (!name) errors.name = "Please enter your name.";
  if (!email || !isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!message) errors.message = "Please enter a message.";

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      error: Object.values(errors)[0] ?? "Please fix the highlighted fields.",
      errors,
    };
  }

  return {
    ok: true,
    data: { kind: "legacy", name, email, subject, message },
  };
}

function validateNewPayload(
  body: Record<string, unknown>,
): ContactValidationResult {
  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const service = asTrimmedString(body.service);
  const brandName = asTrimmedString(body.brandName);
  const socialLink = asTrimmedString(body.socialLink);
  const challenge = asTrimmedString(body.challenge);
  const brandGoal = asTrimmedString(body.brandGoal);
  const timeline = asTrimmedString(body.timeline);
  const referralSource = asTrimmedString(body.referralSource);
  const additionalNotes = asTrimmedString(body.additionalNotes);
  const subject = asTrimmedString(body.subject);
  const errors: Record<string, string> = {};

  if (!name) errors.name = "Please enter your full name.";
  if (!email || !isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!service) errors.service = "Please select a service.";
  if (!brandName) errors.brandName = "Please enter your brand name.";
  if (!socialLink) {
    errors.socialLink = "Please enter a link to your main social account.";
  }
  if (!challenge) {
    errors.challenge = "Please tell us about your biggest challenge.";
  }
  if (!brandGoal) {
    errors.brandGoal = "Please share where you want your brand to be.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      errors,
    };
  }

  return {
    ok: true,
    data: {
      kind: "new",
      name,
      email,
      service,
      brandName,
      socialLink,
      challenge,
      brandGoal,
      timeline,
      referralSource,
      additionalNotes,
      subject,
      message: buildNewMessageSummary({
        service,
        brandName,
        challenge,
        brandGoal,
      }),
    },
  };
}

export function validateContactPayload(
  body: Record<string, unknown>,
): ContactValidationResult {
  if (looksLikeNewShape(body)) {
    return validateNewPayload(body);
  }

  return validateLegacyPayload(body);
}

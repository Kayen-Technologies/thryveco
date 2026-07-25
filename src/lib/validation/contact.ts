export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const website = body.website;
  return typeof website === "string" && website.trim().length > 0;
}

export function validateContactPayload(
  body: Record<string, unknown>,
):
  | { ok: true; data: ContactPayload }
  | { ok: false; error: string } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name) {
    return { ok: false, error: "Please enter your name." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (!message) {
    return { ok: false, error: "Please enter a message." };
  }

  return {
    ok: true,
    data: { name, email, subject, message },
  };
}

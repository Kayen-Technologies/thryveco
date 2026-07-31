import { getPayloadClient } from "@/lib/payload";
import type { ContactPayload } from "@/lib/validation/contact";

export async function saveContactInquiry(payload: ContactPayload) {
  const client = await getPayloadClient();

  if (payload.kind === "legacy") {
    await client.create({
      collection: "contact-inquiries",
      data: {
        name: payload.name,
        email: payload.email,
        subject: payload.subject || undefined,
        message: payload.message,
      },
    });
    return;
  }

  await client.create({
    collection: "contact-inquiries",
    data: {
      name: payload.name,
      email: payload.email,
      subject: payload.subject || undefined,
      message: payload.message || undefined,
      service: payload.service,
      brandName: payload.brandName,
      socialLink: payload.socialLink,
      challenge: payload.challenge,
      brandGoal: payload.brandGoal,
      timeline: payload.timeline || undefined,
      referralSource: payload.referralSource || undefined,
      additionalNotes: payload.additionalNotes || undefined,
    },
  });
}

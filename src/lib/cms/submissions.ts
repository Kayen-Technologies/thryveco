import { getPayloadClient } from "@/lib/payload";
import type { ContactPayload } from "@/lib/validation/contact";

export async function saveContactInquiry(payload: ContactPayload) {
  const client = await getPayloadClient();

  await client.create({
    collection: "contact-inquiries",
    data: {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    },
  });
}

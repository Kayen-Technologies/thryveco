import { NextResponse } from "next/server";

import { saveContactInquiry } from "@/lib/cms/submissions";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import { isRateLimited } from "@/lib/rate-limit";
import {
  isHoneypotFilled,
  validateContactPayload,
} from "@/lib/validation/contact";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (isHoneypotFilled(body)) {
      return NextResponse.json({ ok: true });
    }

    if (isRateLimited(request)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const validation = validateContactPayload(body);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await saveContactInquiry(validation.data);

    if (process.env.RESEND_API_KEY) {
      try {
        await sendContactEmail(validation.data);
      } catch (emailError) {
        console.error("[contact] email failed after save:", emailError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again later." },
      { status: 500 },
    );
  }
}

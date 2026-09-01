import { NextResponse, type NextRequest } from "next/server";
import { LRUCache } from "lru-cache";
import { Resend } from "resend";
import { ContactSchema, MIN_FORM_AGE_MS } from "@/lib/contact-schema";

/*
 * Contact form endpoint. POST { name, email, phone?, message, consent,
 * website, t0 } → validates (same zod schema the client uses), checks
 * honeypot + time-trap, rate-limits by IP, dispatches via Resend, and
 * returns { ok: true } or { ok: false, error }.
 *
 * When RESEND_API_KEY is not set (dev / preview), we log the payload
 * and return success — the UI's mailto: fallback stays wired at the
 * form level for the case where the request itself fails.
 */
export const runtime = "nodejs";

// In-memory rate limit — 3 requests per IP per 5 min. Suitable for a
// single-node deploy (Hostinger Node.js). Swap for Upstash/KV when
// multi-node.
const RATE_LIMIT = new LRUCache<string, number[]>({
  max: 5000,
  ttl: 5 * 60 * 1000,
});
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (RATE_LIMIT.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) return true;
  hits.push(now);
  RATE_LIMIT.set(ip, hits);
  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parse = ContactSchema.safeParse(body);
  if (!parse.success) {
    // Field-mapped errors so client can surface each inline.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parse.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, fieldErrors }, { status: 400 });
  }

  const { name, email, phone, message, website, t0 } = parse.data;

  // Honeypot re-check (belt + braces — schema already enforces empty).
  if (website && website.length > 0) {
    return NextResponse.json({ ok: false, error: "Bot detected" }, { status: 400 });
  }

  // Time-trap: form must have been on the client for at least
  // MIN_FORM_AGE_MS.
  if (Date.now() - t0 < MIN_FORM_AGE_MS) {
    return NextResponse.json({ ok: false, error: "Form submitted too quickly" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "ramsudarsan@gmail.com";

  if (!apiKey) {
    // Dev fallback — log the payload and pretend success so local
    // testing doesn't require a live Resend key.
    console.info("[contact] dev mode (no RESEND_API_KEY):", { name, email, phone, message });
    return NextResponse.json({ ok: true, delivered: false, mode: "dev" });
  }

  const resend = new Resend(apiKey);
  const html = `<h2>New PlatformOpsStudio contact message</h2>
<p><strong>Name:</strong> ${escape(name)}</p>
<p><strong>Email:</strong> ${escape(email)}</p>
${phone ? `<p><strong>Phone:</strong> ${escape(phone)}</p>` : ""}
<p><strong>Message:</strong></p>
<pre style="white-space:pre-wrap;font-family:inherit">${escape(message)}</pre>`;

  const text = `New PlatformOpsStudio contact message

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ""}
Message:
${message}`;

  try {
    const { error } = await resend.emails.send({
      // TODO: switch `from` to a verified domain once
      // platformopsstudio.com is verified in Resend.
      from: "PlatformOpsStudio <onboarding@resend.dev>",
      to,
      subject: `Contact form — ${name}`,
      replyTo: email,
      html,
      text,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return NextResponse.json(
        { ok: false, error: "Delivery failed. Please try again shortly." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send threw", err);
    return NextResponse.json(
      { ok: false, error: "Delivery failed. Please try again shortly." },
      { status: 502 }
    );
  }
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

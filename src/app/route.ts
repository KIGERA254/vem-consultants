// ============================================================
// VEM Consultants — src/app/api/contact/route.ts
// POST handler for the homepage contact form.
// Validates the request body with Zod, rate-limits by IP,
// sends email via lib/email.ts, and returns typed JSON responses.
//
// Server-side only — never imported by Client Components.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { z, ZodError }               from "zod";
import { sendContactEmail }           from "@/lib/email";

// ─── Request schema ───────────────────────────────────────────
//
// Keep this in sync with the Zod schema inside Contact.tsx so
// client-side and server-side validation rules never diverge.

const contactSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2,   "Name must be at least 2 characters.")
    .max(80,  "Name must be 80 characters or fewer.")
    .trim(),

  email: z
    .string({ required_error: "Email address is required." })
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long.")
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long.")
    .regex(
      /^[\d\s\+\-\(\)]{7,20}$/,
      "Please enter a valid phone number.",
    )
    .optional()
    .or(z.literal("")),

  service: z
    .string()
    .max(100, "Service name is too long.")
    .trim()
    .optional()
    .or(z.literal("")),

  message: z
    .string({ required_error: "A message is required." })
    .min(10,   "Message must be at least 10 characters.")
    .max(2000, "Message must be 2 000 characters or fewer.")
    .trim(),
});

// Infer the validated type from the schema
type ContactPayload = z.infer<typeof contactSchema>;

// ─── Typed response helpers ───────────────────────────────────

interface SuccessResponse {
  success: true;
  message: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  /** Field-level validation errors keyed by field name */
  errors?: Record<string, string[]>;
  /** Short machine-readable error code */
  code?: string;
}

function ok(message: string): NextResponse<SuccessResponse> {
  return NextResponse.json(
    { success: true, message },
    { status: 200 },
  );
}

function badRequest(
  message: string,
  errors?: Record<string, string[]>,
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, message, errors, code: "VALIDATION_ERROR" },
    { status: 400 },
  );
}

function tooManyRequests(): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      message: "Too many requests. Please wait a moment and try again.",
      code:    "RATE_LIMITED",
    },
    {
      status:  429,
      headers: { "Retry-After": "60" },
    },
  );
}

function serverError(message: string): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, message, code: "SERVER_ERROR" },
    { status: 500 },
  );
}

function methodNotAllowed(): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, message: "Method not allowed.", code: "METHOD_NOT_ALLOWED" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

// ─── Simple in-memory rate limiter ───────────────────────────
//
// Allows MAX_REQUESTS per IP within WINDOW_MS.
// In production, replace with Redis (Upstash) for multi-instance safety.

const WINDOW_MS    = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3;         // max 3 submissions per minute per IP

const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now    = Date.now();
  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetAt) {
    // First request or window expired — reset
    ipRequestMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS) return true;

  record.count += 1;
  return false;
}

// Periodically clean up stale entries to avoid memory leaks.
// Only runs server-side, safe for Next.js edge/node runtimes.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRequestMap.entries()) {
      if (now > record.resetAt) ipRequestMap.delete(ip);
    }
  }, WINDOW_MS * 5);
}

// ─── Honeypot check ───────────────────────────────────────────
//
// The Contact form renders a hidden "website" field that real users
// never fill in. If it's present in the body, it's a bot — reject silently.

function isHoneypotTripped(body: Record<string, unknown>): boolean {
  const honeypot = body["website"];
  return typeof honeypot === "string" && honeypot.length > 0;
}

// ─── Format Zod errors ────────────────────────────────────────

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "general";
    if (!fieldErrors[field]) fieldErrors[field] = [];
    fieldErrors[field].push(issue.message);
  }

  return fieldErrors;
}

// ─── GET — not supported ──────────────────────────────────────

export function GET(): NextResponse<ErrorResponse> {
  return methodNotAllowed();
}

// ─── POST handler ─────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {

  // 1️⃣  Extract client IP for rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip        = forwarded?.split(",")[0]?.trim() ?? "unknown";

  // 2️⃣  Rate limit check
  if (isRateLimited(ip)) {
    console.warn(`[contact/route] Rate limited: ${ip}`);
    return tooManyRequests();
  }

  // 3️⃣  Parse JSON body — guard against malformed requests
  let rawBody: Record<string, unknown>;

  try {
    rawBody = await request.json();
  } catch {
    return badRequest("Invalid request body. Expected JSON.");
  }

  // 4️⃣  Honeypot — silently succeed to fool bots
  if (isHoneypotTripped(rawBody)) {
    console.info(`[contact/route] Honeypot triggered from ${ip} — silently discarded.`);
    // Return 200 so bots don't retry
    return ok("Message received. Thank you!");
  }

  // 5️⃣  Zod validation
  let payload: ContactPayload;

  const result = contactSchema.safeParse(rawBody);

  if (!result.success) {
    const errors = formatZodErrors(result.error);
    console.info("[contact/route] Validation failed:", errors);
    return badRequest(
      "Please check the highlighted fields and try again.",
      errors,
    );
  }

  payload = result.data;

  // 6️⃣  Sanitise optional fields — convert empty strings to undefined
  const emailData = {
    name:    payload.name,
    email:   payload.email,
    phone:   payload.phone   || undefined,
    service: payload.service || undefined,
    message: payload.message,
  };

  // 7️⃣  Send email
  let emailResult: Awaited<ReturnType<typeof sendContactEmail>>;

  try {
    emailResult = await sendContactEmail(emailData);
  } catch (err) {
    // Unexpected throw (not caught inside sendContactEmail)
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[contact/route] sendContactEmail threw unexpectedly:", msg);
    return serverError(
      "We couldn't send your message due to a server error. " +
      "Please try calling or WhatsApp-ing us directly.",
    );
  }

  // 8️⃣  Handle email send failure
  if (!emailResult.success) {
    console.error("[contact/route] Email delivery failed:", emailResult.error);
    return serverError(
      "Your message was received but we had trouble delivering the email. " +
      "Please contact us directly at info@vemconsultants.com.",
    );
  }

  // 9️⃣  Log success (server-side only — never exposes PII to the client)
  console.info(
    `[contact/route] ✅ Contact email sent | messageId=${emailResult.messageId} | ` +
    `from=${payload.email} | ip=${ip}`,
  );

  // 🔟  Return success
  return ok(
    "Thank you for reaching out! We'll be in touch within 1 business day.",
  );
}

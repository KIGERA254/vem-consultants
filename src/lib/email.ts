// ============================================================
// VEM Consultants — src/lib/email.ts
// Server-side only. Never import this in a Client Component.
// Sends a formatted HTML contact email via Nodemailer (SMTP).
// ============================================================

import nodemailer from "nodemailer";
import type { Transporter, TransportOptions } from "nodemailer";
import { siteConfig } from "@/data/site";

// ─── Types ────────────────────────────────────────────────────

export interface ContactFormData {
  name:     string;
  email:    string;
  phone?:   string;
  service?: string;   // which service they are enquiring about
  message:  string;
}

export interface EmailResult {
  success:   boolean;
  messageId?: string;
  error?:    string;
}

// ─── Transporter (singleton) ───────────────────────────────────

let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (_transporter) return _transporter;

  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_SECURE,
  } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Email environment variables are missing. " +
      "Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in .env.local",
    );
  }

  _transporter = nodemailer.createTransport({
    host:   EMAIL_HOST,
    port:   Number(EMAIL_PORT ?? 587),
    secure: EMAIL_SECURE === "true",   // true for port 465, false for 587
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    // Needed for some corporate SMTP servers
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  } as TransportOptions);

  return _transporter;
}

// ─── HTML email template ───────────────────────────────────────

function buildHtmlEmail(data: ContactFormData): string {
  const { name, email, phone, service, message } = data;
  const brand    = siteConfig.brand;
  const contact  = siteConfig.contact;
  const received = new Date().toLocaleString("en-KE", {
    timeZone:     "Africa/Nairobi",
    dateStyle:    "full",
    timeStyle:    "short",
  });

  // Escape user input to prevent injection in the HTML
  const esc = (s: string) =>
    s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  const row = (label: string, value: string) =>
    value
      ? `<tr>
           <td style="padding:10px 16px;background:#f1f5f9;border-radius:6px;
                      font-weight:600;font-size:13px;color:#475569;
                      white-space:nowrap;vertical-align:top;width:140px;">
             ${label}
           </td>
           <td style="padding:10px 16px;font-size:14px;color:#1e293b;
                      vertical-align:top;">
             ${value}
           </td>
         </tr>
         <tr><td colspan="2" style="height:6px;"></td></tr>`
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>New Contact Enquiry — ${brand.name}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;
             font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:580px;">

          <!-- ── Header ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#172554 0%,#2563eb 100%);
                       border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:22px;font-weight:800;
                         color:#ffffff;letter-spacing:-0.5px;">
                ${esc(brand.name)}
              </p>
              <p style="margin:0;font-size:13px;color:#93c5fd;font-weight:400;">
                ${esc(brand.tagline)}
              </p>
            </td>
          </tr>

          <!-- ── Alert bar ── -->
          <tr>
            <td style="background:#f59e0b;padding:10px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;font-weight:700;
                         color:#ffffff;letter-spacing:0.5px;text-transform:uppercase;">
                📬 &nbsp; New Contact Form Enquiry
              </p>
            </td>
          </tr>

          <!-- ── Body ── -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;
                       border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">

              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
                A new enquiry has been submitted through the website contact form.
                The details are below — please follow up within <strong>24 hours</strong>.
              </p>

              <!-- Detail table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="border-collapse:separate;border-spacing:0 0;">
                ${row("Full Name",  esc(name))}
                ${row("Email",      `<a href="mailto:${esc(email)}"
                                        style="color:#2563eb;text-decoration:none;">
                                       ${esc(email)}
                                     </a>`)}
                ${phone   ? row("Phone",    `<a href="tel:${esc(phone)}"
                                               style="color:#2563eb;text-decoration:none;">
                                              ${esc(phone)}
                                            </a>`) : ""}
                ${service ? row("Service",  esc(service)) : ""}
              </table>

              <!-- Message -->
              <div style="margin-top:24px;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:600;
                           color:#475569;text-transform:uppercase;letter-spacing:0.5px;">
                  Message
                </p>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;
                            border-radius:8px;padding:16px 20px;">
                  <p style="margin:0;font-size:14px;color:#1e293b;
                             line-height:1.75;white-space:pre-wrap;">
                    ${esc(message)}
                  </p>
                </div>
              </div>

              <!-- Quick reply CTA -->
              <div style="margin-top:28px;text-align:center;">
                <a href="mailto:${esc(email)}?subject=Re: Your enquiry to ${esc(brand.name)}"
                   style="display:inline-block;background:#2563eb;color:#ffffff;
                          font-size:14px;font-weight:600;text-decoration:none;
                          padding:12px 28px;border-radius:8px;
                          letter-spacing:0.3px;">
                  Reply to ${esc(name)} →
                </a>
              </div>

            </td>
          </tr>

          <!-- ── Metadata strip ── -->
          <tr>
            <td style="background:#f1f5f9;padding:14px 40px;
                       border:1px solid #e2e8f0;border-top:none;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:12px;color:#94a3b8;">
                    🕐 &nbsp;Received: ${received}
                  </td>
                  <td align="right" style="font-size:12px;color:#94a3b8;">
                    🌍 &nbsp;Nairobi, Kenya
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="background:#172554;border-radius:0 0 12px 12px;
                       padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#93c5fd;">
                ${esc(contact.address)}&nbsp;&nbsp;·&nbsp;&nbsp;
                <a href="tel:${esc(contact.phone)}"
                   style="color:#93c5fd;text-decoration:none;">
                  ${esc(contact.phoneDisplay)}
                </a>&nbsp;&nbsp;·&nbsp;&nbsp;
                <a href="mailto:${esc(contact.email)}"
                   style="color:#93c5fd;text-decoration:none;">
                  ${esc(contact.email)}
                </a>
              </p>
              <p style="margin:0;font-size:11px;color:#475569;">
                This email was sent automatically from the ${esc(brand.name)} website.
                Do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

// ─── Plain-text fallback ───────────────────────────────────────

function buildPlainText(data: ContactFormData): string {
  const { name, email, phone, service, message } = data;
  const received = new Date().toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
  });
  return [
    `New Contact Enquiry — ${siteConfig.brand.name}`,
    "=".repeat(50),
    `Name:     ${name}`,
    `Email:    ${email}`,
    phone   ? `Phone:    ${phone}`   : null,
    service ? `Service:  ${service}` : null,
    "",
    "Message:",
    "-".repeat(50),
    message,
    "-".repeat(50),
    "",
    `Received: ${received}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

// ─── Auto-reply to the visitor ────────────────────────────────

function buildAutoReplyHtml(name: string): string {
  const brand   = siteConfig.brand;
  const contact = siteConfig.contact;
  const esc = (s: string) =>
    s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Thank you — ${esc(brand.name)}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;
             font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#172554 0%,#2563eb 100%);
                       border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#fff;">
                ${esc(brand.name)}
              </p>
              <p style="margin:0;font-size:13px;color:#93c5fd;">
                ${esc(brand.tagline)}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;padding:36px 40px;
                       border:1px solid #e2e8f0;border-top:none;">
              <h2 style="margin:0 0 16px;font-size:20px;color:#172554;
                          font-weight:700;">
                Thank you, ${esc(name)}! 🎉
              </h2>
              <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.7;">
                We have received your message and a member of our team will get
                back to you within <strong>1 business day</strong>.
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
                In the meantime, feel free to reach us directly:
              </p>

              <!-- Contact info -->
              <table role="presentation" cellpadding="0" cellspacing="0"
                     style="margin-bottom:28px;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#1e293b;">
                    📞 &nbsp;
                    <a href="tel:${esc(contact.phone)}"
                       style="color:#2563eb;text-decoration:none;font-weight:500;">
                      ${esc(contact.phoneDisplay)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#1e293b;">
                    ✉️ &nbsp;
                    <a href="mailto:${esc(contact.email)}"
                       style="color:#2563eb;text-decoration:none;font-weight:500;">
                      ${esc(contact.email)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#1e293b;">
                    💬 &nbsp;
                    <a href="https://wa.me/${esc(contact.whatsapp)}"
                       style="color:#25d366;text-decoration:none;font-weight:500;">
                      WhatsApp Us
                    </a>
                  </td>
                </tr>
              </table>

              <div style="text-align:center;">
                <a href="https://www.vemconsultants.com"
                   style="display:inline-block;background:#2563eb;color:#fff;
                          font-size:14px;font-weight:600;text-decoration:none;
                          padding:12px 28px;border-radius:8px;">
                  Visit Our Website →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#172554;border-radius:0 0 12px 12px;
                       padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                © ${new Date().getFullYear()} ${esc(brand.name)} · ${esc(contact.address)}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ─── Public API ────────────────────────────────────────────────

/**
 * Send the internal notification email to the VEM team
 * and an auto-reply confirmation to the visitor.
 *
 * Called from: src/app/api/contact/route.ts
 *
 * @example
 * const result = await sendContactEmail({ name, email, phone, service, message });
 * if (!result.success) console.error(result.error);
 */
export async function sendContactEmail(
  data: ContactFormData,
): Promise<EmailResult> {
  const toAddress   = process.env.EMAIL_TO ?? siteConfig.contact.email;
  const fromAddress = `${siteConfig.brand.name} <${process.env.EMAIL_USER}>`;

  try {
    const transporter = getTransporter();

    // 1️⃣  Internal notification → VEM team inbox
    const internalInfo = await transporter.sendMail({
      from:     fromAddress,
      to:       toAddress,
      replyTo:  data.email,              // one click to reply to the visitor
      subject:  `New Enquiry from ${data.name} — ${siteConfig.brand.name}`,
      text:     buildPlainText(data),
      html:     buildHtmlEmail(data),
    });

    // 2️⃣  Auto-reply → visitor's inbox
    await transporter.sendMail({
      from:    fromAddress,
      to:      data.email,
      subject: `We received your message — ${siteConfig.brand.name}`,
      html:    buildAutoReplyHtml(data.name),
      text:    [
        `Hi ${data.name},`,
        "",
        `Thank you for reaching out to ${siteConfig.brand.name}.`,
        "We have received your message and will get back to you within 1 business day.",
        "",
        `Phone:    ${siteConfig.contact.phoneDisplay}`,
        `Email:    ${siteConfig.contact.email}`,
        `WhatsApp: https://wa.me/${siteConfig.contact.whatsapp}`,
      ].join("\n"),
    });

    return { success: true, messageId: internalInfo.messageId };

  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown email error";
    console.error("[email.ts] sendContactEmail failed:", message);
    return { success: false, error: message };
  }
}

/**
 * Verify the SMTP connection — useful in a health-check route
 * or to confirm credentials during development.
 *
 * @example
 * const ok = await verifyEmailConnection();
 * console.log(ok ? "SMTP ready" : "SMTP failed");
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}

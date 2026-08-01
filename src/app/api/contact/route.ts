import { Resend } from "resend";

/**
 * Contact form endpoint. Delivers the brief by email via Resend.
 *
 * Config lives in .env.local: RESEND_API_KEY, CONTACT_TO, CONTACT_FROM.
 * With no API key set the submission is validated and logged instead of sent,
 * so local development works without credentials.
 */

type Payload = {
  name?: string;
  business?: string;
  email?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Escape anything that goes into the email body — this is visitor input. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderEmail(brief: {
  name: string;
  business: string;
  email: string;
  message: string;
  at: Date;
}): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #1d2334;vertical-align:top;width:120px;">
        <span style="font:600 11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#8b95ad;">${label}</span>
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #1d2334;vertical-align:top;">
        <span style="font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#e9edf6;">${value}</span>
      </td>
    </tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#050506;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050506;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#070b16;border:1px solid #1d2334;border-radius:6px;">

            <tr>
              <td style="padding:20px 28px;border-bottom:1px solid #1d2334;">
                <span style="display:inline-block;width:18px;height:18px;background:#ff6a1a;border-radius:3px;color:#050506;font:700 11px/18px ui-monospace,monospace;text-align:center;">A</span>
                <span style="font:400 12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;color:#ff6a1a;padding-left:8px;">new brief</span>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 28px 8px;">
                <h1 style="margin:0 0 4px;font:600 22px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#e9edf6;">
                  ${esc(brief.name)}${brief.business ? ` <span style="color:#8b95ad;font-weight:400;">· ${esc(brief.business)}</span>` : ""}
                </h1>
                <a href="mailto:${esc(brief.email)}" style="font:400 14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:#2dd4bf;text-decoration:none;">${esc(brief.email)}</a>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 28px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("what they need", esc(brief.message).replace(/\n/g, "<br />"))}
                  ${row("business", brief.business ? esc(brief.business) : "not given")}
                  ${row("received", brief.at.toUTCString())}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 28px 28px;">
                <a href="mailto:${esc(brief.email)}?subject=Re:%20your%20project"
                   style="display:inline-block;background:#ff6a1a;color:#050506;text-decoration:none;padding:12px 20px;border-radius:4px;font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;">
                  reply to ${esc(brief.name.split(" ")[0])}
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 28px;border-top:1px solid #1d2334;">
                <span style="font:400 11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:#8b95ad;">sent from the contact form on your portfolio</span>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const business = body.business?.trim() ?? "";

  if (!name || !message) {
    return Response.json({ error: "Name and message are required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (message.length > 5000) {
    return Response.json({ error: "Message is too long" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM ?? "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.info("[contact] no mail credentials, logging instead", {
      name,
      business,
      email,
      message: message.slice(0, 200),
    });
    return Response.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      // Replies go straight back to the visitor.
      replyTo: email,
      subject: `New brief - ${name}${business ? ` (${business})` : ""}`,
      html: renderEmail({ name, business, email, message, at: new Date() }),
      text: [
        `New brief from ${name}`,
        business ? `Business: ${business}` : null,
        `Email: ${email}`,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("[contact] resend rejected the message", error);
      return Response.json(
        { error: "Could not send right now. Email me directly?" },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send failed", err);
    return Response.json(
      { error: "Could not send right now. Email me directly?" },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}

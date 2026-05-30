// Cloudflare Pages Function — POST /api/subscribe
// Captures an email into a Cloudflare D1 (SQLite) database after verifying a
// Cloudflare Turnstile token. No third party touches the list; the data is yours.
//
// Required bindings (configure in the Pages project → Settings):
//   - D1 database binding named  DB
//   - environment variable       TURNSTILE_SECRET_KEY  (server-side Turnstile secret)
//
// Privacy: stores email + source + timestamp only. No IP is persisted (it is used
// transiently for Turnstile verification and then discarded). No tracking cookies.

interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let email = "";
  let token = "";

  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = (await request.json()) as Record<string, string>;
      email = (body.email || "").trim().toLowerCase();
      token = body["cf-turnstile-response"] || "";
    } else {
      const form = await request.formData();
      email = String(form.get("email") || "").trim().toLowerCase();
      token = String(form.get("cf-turnstile-response") || "");
    }
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }

  // --- Turnstile verification (bot protection) ---
  if (!token) return json({ ok: false, error: "captcha_required" }, 400);
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const verify = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    },
  );
  const outcome = (await verify.json()) as { success: boolean };
  if (!outcome.success) return json({ ok: false, error: "captcha_failed" }, 400);

  // --- Store (idempotent on email) ---
  try {
    await env.DB.prepare(
      "INSERT INTO subscribers (email, source) VALUES (?, ?) ON CONFLICT(email) DO NOTHING",
    )
      .bind(email, "arcanalang.org")
      .run();
  } catch {
    return json({ ok: false, error: "store_failed" }, 500);
  }

  return json({ ok: true });
};

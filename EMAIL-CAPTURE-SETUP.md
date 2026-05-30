# Email capture — setup (Cloudflare D1)

The form, the serverless endpoint, and the schema are all in the repo. Email capture
**self-activates once you provide the keys/bindings below** — until then the form renders
nothing, so the live site never shows a broken form.

| Piece | File | What it does |
|-------|------|--------------|
| Form component | `src/components/EmailCapture.astro` | The UI; posts JSON to `/api/subscribe`. Hidden unless `PUBLIC_TURNSTILE_SITE_KEY` is set. |
| Endpoint | `functions/api/subscribe.ts` | Cloudflare Pages Function. Verifies Turnstile, inserts into D1. |
| Schema | `db/schema.sql` | The `subscribers` table. |
| Embed | `src/content/docs/index.mdx` → "Stay in the loop" | `<EmailCapture />` on the home page. |

## One-time setup (you do this — I can't create accounts or hold keys)

1. **Create the D1 database**
   ```sh
   npx wrangler d1 create arcanalang
   ```
   Note the `database_id` it prints.

2. **Apply the schema**
   ```sh
   npx wrangler d1 execute arcanalang --file=db/schema.sql --remote
   ```

3. **Create a Turnstile widget** (Cloudflare dashboard → Turnstile) for `arcanalang.org`.
   You get a **site key** (public) and a **secret key** (private).

4. **Wire the bindings in the Pages project** (Cloudflare dashboard → your Pages project → Settings):
   - **D1 binding**: variable name `DB` → the `arcanalang` database.
   - **Environment variable** (Production + Preview): `TURNSTILE_SECRET_KEY` = your Turnstile secret key.
   - **Build environment variable**: `PUBLIC_TURNSTILE_SITE_KEY` = your Turnstile site key.
     (This must be present at *build* time for the form to render — it's baked into the static HTML.)

5. **Redeploy.** The form appears on the home page and writes confirmed sign-ups to D1.

## Reading the list

```sh
npx wrangler d1 execute arcanalang --command="SELECT email, source, created_at FROM subscribers ORDER BY created_at DESC" --remote
```

## Local preview

Cloudflare publishes always-pass Turnstile **test keys** for development:
`PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA` (site) and
`TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA` (secret). Use those with
`npx wrangler pages dev` to exercise the full flow locally without real keys.

## Notes / options

- **Privacy**: stores email + source + timestamp only; the IP is used transiently for Turnstile
  verification and not persisted. No tracking cookies. The consent line is in the form.
- **Double opt-in** (recommended for strict GDPR): add a confirmation-email step — store a
  `confirmed` flag + a token, email a confirm link via an email API (e.g. Resend/MailChannels).
  Single opt-in is what's shipped; tell me if you want the double-opt-in upgrade.
- **Placement**: currently the home page. The same `<EmailCapture />` tag can be dropped into any
  `.mdx` page (e.g. the origin essay) with the import path adjusted.

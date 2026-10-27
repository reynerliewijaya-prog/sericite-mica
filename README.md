# Sericite Mica — Next.js application

Responsive public site, database-backed catalog, contact/sample inquiries, and authenticated admin CMS. This is a production-oriented implementation, not a claim of a completed security audit or live service readiness.

## Local checks

`npm ci`, `npm run dev`, `npm run typecheck`, `npm test`, `npm run build`.

## Required deployment setup

1. Create a Supabase project. Run `database/001_initial.sql` once. All browser database privileges are revoked; only the backend accesses data. Never expose the secret/service-role key.
2. Disable public user signups. Create and verify the designated admin account using Supabase Auth. Set ADMIN_EMAIL to its exact email. Use a unique password and enable provider-side authentication rate limits. MFA enforcement is not yet implemented; do not store high-sensitivity secrets.
3. Configure Resend with a verified sender domain. Set EMAIL_FROM and RESEND_API_KEY. Inquiry notifications are addressed only to serciteindo@gmail.com. Set ADMIN_EMAIL to the separately verified administrator account through protected environment inputs. No credentials are committed.
4. Configure Cloudflare Turnstile for the deployment hostname. Set both Turnstile keys. Set APP_ORIGIN to the exact canonical origin (no trailing slash). Other preview origins deliberately cannot submit until explicitly configured separately.
5. Add the variables in `.env.example` to Vercel for the intended environment. NEXT_PUBLIC values are public and must never contain secret keys. Rebuild after changing these values.
6. Deploy a preview and test login/logout, unauthorized requests, product create/delete, published vs draft visibility, inquiry persistence and notification success/failure, anti-bot behavior, and narrow/mobile layouts. Then promote only after validation.

## Security and behavior

Every CMS request verifies the Supabase access token, confirmed email and server-side admin allowlist. Sessions stay in memory (no localStorage) and are lost on reload. All admin requests are no-store. Mutations require same-origin requests. Inputs are validated and escaped by React. User text is never rendered as raw HTML. No request payloads or credentials are logged. Turnstile tokens are verified server-side with expected hostname/action before writes. A successful insert is acknowledged even if email fails, and notification state is visible to admin. Notifications contain an ID only, not customer message data. No automatic email retry worker is included.

## Operational requirements before real customer data

Configure backups, retention/deletion procedures, incident response, provider spending limits, and verified privacy contact/policy. Add shared rate limiting/WAF rules appropriate to traffic and run independent security review. CMS supports product creation/editing/deletion and inquiry deletion; admin MFA enforcement and audit logs remain follow-up work. Admin sees latest 100 inquiries only. Never collect passwords, payment information, or trade secrets in contact forms. No service resources are provisioned by this repository.

Original supplied assets and font license are preserved under `public/assets/`; live pages use system fonts and do not depend on the original design runtime. Layout is rebuilt responsively rather than iframe-rendered. Visual browser and live provider tests require a configured deployment.

## Original ZIP design

The homepage now redirects to `/desain/index.html`, serving the supplied ZIP design and original navigation/assets. Original contact/document prototype forms are replaced with a link to `/kontak` (real application form), and `/admin` remains the authenticated CMS. Desktop and mobile design files remain separate, as in the ZIP; this is not a claim of responsive parity or production readiness. The original design catalog uses bundled example data, not the CMS catalog at `/katalog`.

## Brand alignment

Public email and inquiry notification recipient: serciteindo@gmail.com only. Uploaded logo is used in the application header, including document requests, and original design headers. Public profile, surface, catalog, and product routes open their ZIP designs. CMS-published products remain separately accessible at /produk-database; original example catalog is labeled accordingly. Document/contact forms retain real API validation, not simulated ZIP success. Service configuration and visual browser verification are still outstanding.

## No-code text editor

Run database/002_site_content.sql after the initial migration. After configuring Supabase/login, open Admin > Editor Konten, load the stored draft, choose a ZIP page, edit its main title/description, save draft or publish. The preview is text-only; use the website link to review the published result. Reload the public page after publishing. Published text is loaded from /api/content with textContent (no HTML injection); drafts require server-verified admin authorization. Existing original design remains if content/database is unavailable. Image uploads, colors, rearranging sections, contact/document/admin copy, and drag-and-drop are not supported by this first editor. Desktop/mobile variants are edited separately.

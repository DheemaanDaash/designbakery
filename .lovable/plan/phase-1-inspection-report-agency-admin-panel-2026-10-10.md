# Phase 1 Inspection Report — Agency Admin Panel

No code or database changes were made. Approving this report starts Phase 2 (a detailed schema/RLS design for approval), not implementation.

## 1. Existing architecture
- React 18 + Vite + TypeScript SPA, Tailwind + shadcn/ui, react-router v6, TanStack Query, react-hook-form + zod, react-helmet-async (per-page SEO via `Seo` component).
- Public routes: `/`, `/pricing`, `/free-trial`, `/contact`, `/about`, `/design-request`, `/brand-guidelines`, `/our-works`. Sitemap generated at build time from a script.
- Deployment: Lovable hosting plus a GitHub to Vercel deploy with `vercel.json` SPA rewrites (new `/admin` and `/portal` routes will work on refresh without changes).
- Backend: Lovable Cloud (Postgres, Auth, Storage, Edge Functions). No edge functions exist yet. No auth users exist. Email/password sign-in is not enabled yet.

## 2. Reusable pieces
- UI kit: full shadcn set already installed (table, dialog, tabs, select, calendar, badge, form, sonner, etc.). No new UI packages needed.
- `Navbar`, `Footer`, `Seo`, brand tokens in `index.css`, `brand-assets.ts` storage URL helper.
- `DesignRequestForm` (zod validation, file upload to `design-references` bucket, insert into `design_requests`).
- Existing Supabase client and generated types.

## 3. Blog storage
- No blog exists. Navbar links to `#blog` and Footer to `#`; there is no blog page, data file or table.
- Therefore no content migration and no existing blog URLs/SEO to preserve. A new `blog_posts` table plus public `/blog` and `/blog/:slug` routes are needed (and added to the sitemap).

## 4. Current form handling
- Design request: writes to `design_requests` (anonymous insert allowed, no read access). No owner, status, notes or dates beyond `created_at`. Currently 0 rows.
- Free trial: writes to `free_trial_signups` (anonymous insert only). 0 rows. Out of scope but remains working.
- Contact form: does NOT save anything — it fakes a 400ms delay and shows success. Messages are currently lost. Needs a real table.
- Validation is client-side only (zod); database has no length/format checks. No rate limiting on any form.

## 5. Storage setup
- `brand-assets` (public read) — fine as is.
- `design-references` (private) with an "anyone can upload" policy and no read policy. Uploaded paths are random UUIDs, not tied to an owner.

## 6. Proposed database changes (to be detailed in Phase 2)
Kept to the minimum; extend rather than duplicate.

| Logical entity | Proposal |
|---|---|
| profiles | New `profiles` table (id = auth user, name, email, created/updated) with signup trigger |
| admin_users | Use a `user_roles` table + `app_role` enum + `has_role()` security-definer function (standard secure pattern; no public admin signup) |
| design_requests | Extend existing table: `client_id` (nullable for guest submissions), `status` (7 values, default New), `updated_at`, `completed_at`, `delivery_link`. Internal notes in a separate admin-only table so clients can never read them |
| request_status_history | New table: request_id, from/to status, changed_by, changed_at; written by trigger so it cannot be forged |
| contact_submissions | New table: name, email, phone, message, status (New/In Progress/Replied/Archived), private notes; anonymous insert only, admin read/update |
| blog_posts | New table: title, slug (unique), excerpt, content, featured image, SEO title/description, published flag, published_at; public reads published only, admin full access. New public `blog-images` bucket, admin-only write |

Client linkage: requests submitted while signed in get `client_id`; guest submissions can be linked to an account by matching verified email (decision for Phase 2).

## 7. Compatibility risks
- Adding columns with defaults/nullable keeps existing forms working; no destructive changes needed (tables are empty).
- Tightening `design-references` upload policy must not break guest uploads — keep guest upload, add owner/admin read.
- Content in blog posts must be rendered safely (Markdown or sanitized HTML) to avoid XSS; may need one small package (e.g. a Markdown renderer or DOMPurify).
- Rate limiting: no built-in per-IP limit for direct database inserts; moving public form submissions through an edge function with basic throttling is the realistic option.
- Emails: requires setting up a sender email domain (manual DNS step by you). Auth emails (signup, password reset) work with defaults before that.
- Initial admin: you will sign up once, then the admin role is granted via a one-time database update I run with your approval.
- Social link previews for blog posts stay site-wide (SPA limitation, noted earlier).

## Manual actions you will need later
- Choose/verify an email sending domain (e.g. designbakerybd.com) for notifications.
- Create the admin account and confirm which email gets admin.

# Project rules

- Roles live in `public.user_roles` and are checked via `public.has_role()` in RLS; never trust client-side role checks — prevents privilege escalation.
- Design request ownership, initial status and status history are set by database triggers, not the client — prevents spoofed owners/statuses and forged history.
- Admin-only internal notes live in `request_notes`, separate from `design_requests` — clients can read their own requests without ever seeing notes.
- Blog images are stored under `blog/` in the public `brand-assets` bucket (admin-only write) — workspace policy blocks creating new public buckets.
- Schema changes go through migrations in `drizzle/migrations` — keeps the database history reproducible.

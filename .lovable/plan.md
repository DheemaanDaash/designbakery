## Goal

Add a new `/contact` page that reuses the Home page's hero treatment (beige `#A7792E10` background with the bottom notched-polygon clip), shows only a title on that hero, and renders a basic Contact Us form positioned so its top 10% overlaps the hero background.

## Files to create / edit

### 1. `src/pages/Contact.tsx` (new)

Layout:

- `<Navbar />`
- **Hero wrapper** — same `bg-[#A7792E10]` and the same `clipPath: polygon(0 0, 100% 0, 100% calc(100% - 40px), 50% 100%, 0 calc(100% - 40px))` as `Index.tsx`.
  - Inside: a centered title only — `Get in Touch` (h1, primary color, same type scale as the home hero: `text-4xl md:text-5xl lg:text-6xl font-bold`), with a short supporting line `We'd love to hear from you.` in muted text.
  - Hero gets generous vertical padding so the form can overlap the bottom portion (~`pb-40 md:pb-56`) without crowding the title.
- **Form section** — wrapped in a container with **negative top margin** so the form card visually starts inside the hero area. The card height is the reference: we'll use `-mt-[10%]` on the form container (Tailwind arbitrary value) so ~10% of the card sits over the hero background. Card itself: white/`bg-card`, rounded, shadowed, `max-w-2xl mx-auto`, padded.
- `<Footer />`

### 2. `src/components/ContactForm.tsx` (new)

A basic, working contact form using shadcn `Input`, `Textarea`, `Label`, and `Button`. Fields:

- **Name** (required)
- **Email** (required, email validation)
- **Phone Number** (optional, phone number validation and option to choose country)
- **Message** (required, textarea)
- **Submit** button → "Send Message"

Validation with `zod` + `react-hook-form` (already used by `FreeTrialForm`). On submit:

- For now, show a success toast via `sonner` ("Message sent — we'll get back to you shortly.") and reset the form. *(No DB write — keeps this scope minimal. If you want submissions stored in Lovable Cloud like the free-trial form, say the word and I'll add a `contact_messages` table + insert call.)*

### 3. `src/App.tsx` (edit)

- Import `Contact` and add `<Route path="/contact" element={<Contact />} />` above the catch-all.

### 4. `src/components/Navbar.tsx` (edit)

- Change the existing Contact nav item from `href: "#contact"` to a real route: `{ label: "Contact", href: "/contact" }` so the navbar's routing logic picks it up as an active route.

### 5. `src/components/Footer.tsx` (edit)

- Change the footer's "Contact" link from `<a href="#">` to `<Link to="/contact">`.

## Visual notes

- Title color: `text-primary` (matches home hero).
- Form card overlap: `-mt-[10%]` on the form's container means the card's top edge sits 10% of the container's width above the section boundary — visually placing roughly the top sliver of the card over the hero's beige background, just like the request. We'll fine-tune to `-mt-24 md:-mt-32` if the percentage feels off at common breakpoints.
- Z-index: form card gets `relative z-10` so it sits above the clipped hero shape.

## Out of scope (ask if you want these)

- Storing submissions in the database
- Email notifications on submit
- Map / address block / phone block alongside the form
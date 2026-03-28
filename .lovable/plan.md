

# Extend Hero Background Through Trusted By Section with Arrow Shape

## What Changes

1. **Merge Hero + TrustedBy into one continuous background block** — Wrap both sections in a single container with `bg-[#A7792E10]`, removing the individual background from HeroSection.

2. **Add downward arrow shape at the bottom** — Use a CSS clip-path on the wrapper div to create a downward-pointing arrow/chevron at the bottom edge, so the background naturally ends in an arrow shape (not a separate SVG element).

## Technical Approach

**In `src/pages/Index.tsx`:**
- Wrap `<HeroSection />` and `<TrustedBy />` in a `<div>` with:
  - `bg-[#A7792E10]`
  - `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 40px), 50% 100%, 0 calc(100% - 40px))` — creates a downward arrow/chevron at the bottom

**In `src/components/HeroSection.tsx`:**
- Remove `bg-[#A7792E10]` from the section (parent handles it now)

**In `src/components/TrustedBy.tsx`:**
- Add bottom padding to give space for the arrow clip


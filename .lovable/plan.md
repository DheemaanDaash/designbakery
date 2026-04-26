# Hero — Infinite auto-scrolling 9:16 image column

Add a column of multiple 9:16 (portrait) image placeholders on the **right side** of the hero that auto-scrolls **infinitely (vertical loop)**, sitting **behind** the hero text on the left.

## Layout changes — `src/components/HeroSection.tsx`
- Widen container: `max-w-4xl` → `max-w-6xl`, make it `relative overflow-hidden`.
- Wrap text in a `relative z-10` block constrained to the **left half** on `md+` (`md:max-w-xl lg:max-w-2xl`). On mobile, text stays full width and the image column sits behind it (low opacity) so it doesn't crowd the copy.
- Add the scrolling column as an `absolute` element on the right:
  - `absolute right-0 md:right-8 top-0 bottom-0 w-[220px] lg:w-[260px] z-0`
  - `pointer-events-none` so it never blocks the "Watch Demo" link.
  - Top/bottom fade mask via `mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)` so images softly fade in/out at the edges.
  - On mobile, lower opacity (`opacity-30 md:opacity-100`) so text remains readable.

## Infinite vertical auto-scroll
Pure CSS marquee — no JS, no extra libraries:

1. Render the image list **twice** back-to-back inside a flex column.
2. Animate the inner wrapper with `translateY(0)` → `translateY(-50%)` on a linear infinite loop. Because the list is duplicated, the seam is invisible and the loop is seamless.
3. Add a new keyframe in `tailwind.config.ts`:
   ```ts
   keyframes: {
     "scroll-y": {
       "0%": { transform: "translateY(0)" },
       "100%": { transform: "translateY(-50%)" },
     },
   },
   animation: {
     "scroll-y": "scroll-y 25s linear infinite",
   }
   ```
4. Pause on hover: `hover:[animation-play-state:paused]` on the track.
5. Respect reduced motion: `motion-reduce:animate-none`.

## Image placeholders
- 6 placeholder cards (so duplicated = 12, plenty to fill the viewport).
- Each card: `AspectRatio` (already in the project) with ratio `9/16`, `rounded-2xl`, soft border, subtle gradient bg (`bg-gradient-to-br from-muted to-muted/40`), and a centered `ImageIcon` from lucide so it's clearly a placeholder ready to be swapped for real images later.
- Vertical gap between cards: `gap-4`.

## Files touched
- `src/components/HeroSection.tsx` — restructure + add scrolling column.
- `tailwind.config.ts` — add `scroll-y` keyframe + animation.

## Notes / future
- Swap placeholders for real images by replacing the array contents with `<img src=... className="h-full w-full object-cover rounded-2xl" />`.
- Speed is controlled by the `25s` duration in the animation — easy to tune.

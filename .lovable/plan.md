# Hero right column — single horizontal-scrolling 9:16 row (right → left)

Replace the current two-column vertical scrolling stack in the hero's right column with **one horizontal row** of 9:16 portrait placeholders that scrolls infinitely from right to left.

## Layout — `src/components/HeroSection.tsx`

Keep the existing responsive 2-column grid (text left, scroller right; stacks on mobile). Only the right column's contents change.

Right column wrapper:
- Replace the current `h-[420px] md:h-[480px] lg:h-[560px]` vertical container with a horizontal one:
  - `w-full overflow-hidden`
  - Fixed height matching one 9:16 card, e.g. `h-[360px] md:h-[420px] lg:h-[480px]`.
  - Horizontal fade mask (left + right edges):
    ```
    maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)"
    WebkitMaskImage: same
    ```
  - Keep `aria-hidden` and `pointer-events-none`.

Track:
- A single flex row: `flex flex-row gap-4 h-full w-max animate-scroll-x motion-reduce:animate-none hover:[animation-play-state:paused]`.
- Render the placeholder array twice (`[...placeholders, ...placeholders]`) so the `translateX(0) → translateX(-50%)` loop is seamless.
- Each card:
  - `h-full shrink-0 rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-gradient-to-br from-muted to-muted/40`
  - Width derived from height via aspect ratio. Since AspectRatio is width-driven, simplest is to set width directly using Tailwind arbitrary values matching the height × 9/16:
    - `w-[202px] md:w-[236px] lg:w-[270px]` (≈ height × 9/16)
  - Inside, an empty div with the centered `ImageIcon` (no `AspectRatio` wrapper needed since width/height are fixed and already 9:16).

Direction (right → left):
- The existing `scroll-x` keyframe in `tailwind.config.ts` already animates `translateX(0) → translateX(-50%)`, which moves the track leftward — i.e. visually content scrolls right-to-left. ✅ No Tailwind config change needed.

## Cleanup
- Remove the two vertical column blocks (Column A / Column B) and their `animate-scroll-y` usage from `HeroSection.tsx`.
- Remove the unused `AspectRatio` import from `HeroSection.tsx`.

## Files touched
- `src/components/HeroSection.tsx` — swap right-column contents to a single horizontal row.

## Notes
- Speed is controlled by the `scroll-x` animation duration (currently `40s`) in `tailwind.config.ts` — easy to tune later if needed.
- To swap placeholders for real images later: replace each card's inner content with `<img className="h-full w-full object-cover" />`.

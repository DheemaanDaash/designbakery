

# Update Hero & Brand Colors

## Changes

### 1. Remove SVG wave divider from TrustedBy
Delete the wave SVG block (lines 29–43) in `src/components/TrustedBy.tsx`.

### 2. Add hero background color
Update `src/components/HeroSection.tsx` section to use `bg-[#A7792E10]` (very light gold tint).

### 3. Update primary brand color to #00378E
`#00378E` in HSL ≈ `216 100% 28%`. Update `--primary` in `src/index.css` from `224 73% 20%` to `216 100% 28%`. Also update `--foreground`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--ring` to match since they currently reference the old navy value.

### Files Modified
- `src/components/TrustedBy.tsx` — remove SVG wave
- `src/components/HeroSection.tsx` — add background color
- `src/index.css` — update primary color variables


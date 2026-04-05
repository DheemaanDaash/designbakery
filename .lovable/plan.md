

# Fix: Pricing Page 404 on Refresh

## Diagnosis

The routing configuration is correct:
- `BrowserRouter` is used (correct for Lovable hosting)
- `/pricing` route is properly defined in `App.tsx`
- Lovable hosting has built-in SPA fallback that should serve `index.html` for deep links

## Root Cause

The published site likely needs to be **republished** to include the new `/pricing` route in the build output. The current published build predates the pricing page addition.

## Solution

**No code changes needed.** Simply republish the site to deploy the latest build that includes the `/pricing` route. After republishing, refreshing `/pricing` will work correctly because:
1. Lovable's SPA fallback serves `index.html`
2. React Router picks up the `/pricing` path and renders the correct component


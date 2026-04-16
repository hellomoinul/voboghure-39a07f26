

## Plan: Rearrange Landing Page CTAs + Fix Build Error

### Build Error Fix
`src/main.tsx` line 2 imports `"./App.tsx"` with explicit `.tsx` extension, causing a TS5097 error. Change to `"./App"`.

### Landing Page CTA Changes

**1. Add "Request Membership" button to hero (lines 77-93)**
After the "Try Demo" button, add a third button:
```tsx
<Button
  variant="outline"
  size="lg"
  onClick={() => navigate('/request-access')}
  className="border-primary/30 text-primary hover:bg-primary/10 px-8 h-12 text-base"
>
  Request Membership
</Button>
```
Same styling as "Try Demo" for consistency.

**2. Remove the "Demo Access Section" (lines 227-277)**
Delete the entire `{/* Demo Access Section */}` block. The "Launch Demo" and "Request Membership" buttons there are now redundant since both CTAs exist in the hero.

### Files Changed
- `src/main.tsx` — remove `.tsx` extension from import
- `src/pages/LandingPage.tsx` — add Request Membership button to hero, remove bottom demo section


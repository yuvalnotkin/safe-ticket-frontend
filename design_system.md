# Safe Ticket — Design System

> **For Claude Code:** Read this file before any UI work. It defines the **constraints and principles** for this project's UI, not the full implementation. You are expected to make the practical design decisions (scale, spacing values, shadow intensities, component internals) yourself, within the boundaries below. After Phase 1's first screens, the concrete values you land on should be consolidated into the `@theme` block in `src/app/globals.css` (Tailwind v4 CSS-first config) and become the locked design system for the rest of the project.

---

## 1. Aesthetic Direction

Safe Ticket is a **trust platform disguised as a marketplace**. Every visual decision should make the user feel the product is:

- **Calm, not loud** — no aggressive deal-hunting energy, no "bargain bazaar" feel
- **Premium, not luxury** — Revolut/Wolt fintech polish, not gold-gilded exclusivity
- **Transparent, not minimalist-for-its-own-sake** — whitespace serves clarity, not fashion

**Reference points:** StubHub (search UX structure), Revolut (trust-through-polish), Wolt (card hierarchy & mobile-first density).

**Hard aesthetic rules:**

- No purple gradients on white. No pastel clouds. No "AI SaaS 2023" look.
- No maximalist chaos, brutalism, or retro-futurism — the `frontend-design` skill suggests these as defaults; they are wrong for this product.
- No emoji-heavy UI. Icons only.
- No stock illustration characters (no Lottie people with floating laptops).
- No animated gradients or auto-playing motion on the homepage hero.

**When in doubt:** err toward calm, quiet, and readable. A ticket marketplace is a high-anxiety context for users worried about fraud. Every visual decision should reduce anxiety, not create excitement.

---

## 2. Brand Tokens (locked — do not change)

These come from the product brief and are not up for negotiation.

```css
:root {
  /* Brand core */
  --color-navy: #1B2A4A;    /* Primary — headlines, primary text, logo */
  --color-green: #2D6A4F;   /* Trust — verification badges, success, trust-critical CTAs */
  --color-bg: #FAFAFA;      /* Page background — never pure #FFF */
  --color-surface: #FFFFFF; /* Cards/surfaces sitting on the #FAFAFA bg */

  /* Fonts */
  --font-display: 'Rubik', system-ui, sans-serif;   /* Headlines, prices, CTAs */
  --font-body: 'Assistant', system-ui, sans-serif;  /* Body text, forms */
}
```

**Color usage principles:**

- **Navy dominates.** It carries authority — use it for headlines, primary text, and most buttons.
- **Green is the trust accent.** Reserved for: verification badges, "transfer completed" states, trust-critical CTAs like "Buy ticket" and "List ticket". Do NOT use green as a generic highlight color.
- **Background is `#FAFAFA`, not pure white.** Pure white feels clinical; `#FAFAFA` feels warmer and more premium.
- You may derive a scale from these base colors (lighter/darker variants for borders, muted text, hover states) — decide the exact values yourself and document them in the `@theme` block in `src/app/globals.css`.

**Font usage principles:**

- Both are Hebrew-first typefaces with strong Latin coverage. Hebrew is the primary language; Latin-first fonts with bolted-on Hebrew (Inter, Roboto, Open Sans) render Hebrew poorly and are forbidden.
- Load via `next/font/google` in `src/app/layout.tsx` (self-hosted by Next.js, no runtime request, no layout shift):

  ```ts
  import { Rubik, Assistant } from 'next/font/google';

  const rubik = Rubik({
    subsets: ['latin', 'hebrew'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-display',
    display: 'swap',
  });

  const assistant = Assistant({
    subsets: ['latin', 'hebrew'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-body',
    display: 'swap',
  });
  ```
  Apply `${rubik.variable} ${assistant.variable}` on `<html>` and wire the CSS variables into the `@theme` block in `globals.css` (e.g. `--font-display: var(--font-rubik);`).
- **Prices always use Rubik** (display font) — they are the most important numbers on every screen.
- No italics — Hebrew doesn't support them natively; Rubik/Assistant italics are auto-generated slants and look cheap.

---

## 3. Design Decisions You Own

Pick concrete values for the following during Phase 1, based on what fits the first screens best. Document them in the `@theme` block in `src/app/globals.css` so the rest of the project uses the same scale.

- **Spacing scale** — pick a base unit (4px or 8px is standard) and a consistent scale. Use it everywhere; don't introduce one-off values.
- **Type scale** — define sizes for display, h1–h3, body, small, and caption. Mobile-first, scale up for desktop. Ensure prices read as the most prominent non-heading elements.
- **Border radii** — pick a small set (e.g., sm / md / lg / xl). Nothing should have hard 90° corners except possibly table rows.
- **Shadows** — keep them subtle and tint them with navy (not black). Safe Ticket is flat-ish; avoid Material Design shadow stacking.
- **State colors** — define success / warning / error that harmonize with the brand palette. Success should be the brand green; warning and error are yours to pick.

**Consistency rule:** once you pick a value for something (e.g., card radius), use it everywhere that role applies. If you later decide a different value fits better, update the token — don't leave two values floating around.

---

## 4. Layout & Density

- **Mobile-first.** Design the mobile layout first, then scale up for tablet/desktop.
- **Max content width on desktop:** around 1200px centered. Adjust if a specific page needs more.
- **Readable density over crammed density.** A ticket card on mobile should breathe — prioritize price readability and verification-badge visibility over fitting more cards on screen.

---

## 5. RTL (Hebrew) Support — Non-Negotiable

- Root direction: `dir="rtl"` on `<html>` when Hebrew is active.
- Use **logical properties** everywhere: `padding-inline-start`, `margin-inline-end`, `border-inline-start`. Never `padding-left` / `padding-right` in components that need to mirror.
- Icons with directional meaning (arrows, chevrons, "back" indicators) must flip in RTL. Use CSS `transform: scaleX(-1)` on `[dir="rtl"]` or swap icon components.
- Numbers and Latin brand names ("Safe Ticket", "₪350") stay LTR even inside RTL text. Wrap in `<span dir="ltr">` when needed.
- For Tailwind v4: use the built-in logical-property utilities (`ps-4`/`pe-4` instead of `pl-4`/`pr-4`, `ms-*`/`me-*`, `border-s-*`/`border-e-*`). No plugin needed.

---

## 6. Motion

Minimal and functional. No page-load choreography. No animated hero backgrounds.

**Allowed:** button/card hover transitions, dropdown/modal enter animations, subtle status-change animations (e.g., checkmark on transfer completion).

**Forbidden:** parallax scrolling, scroll-jacking, auto-playing carousels, particle/sparkle effects, animated SVG illustrations on the homepage.

---

## 7. Component Tone (principles, not specs)

Pick exact values yourself — these are the qualitative constraints:

- **Buttons:** primary = solid navy or solid green (for trust-critical actions); secondary = outlined navy. No drop shadows on buttons.
- **Cards:** white surface on the `#FAFAFA` background, thin border, subtle shadow. Hover state should lift slightly but not dramatically.
- **Verification badges:** green-tinted, pill-shaped, with a small shield or checkmark icon. Should read as reassuring, not decorative.
- **Inputs:** thin border, clear focus state (outline, not glow). Focus color = navy.
- **Price display:** face value, service fee, and total must always be shown separately — never a single combined number. Face value and total use Rubik display font; service fee can be lighter/muted to de-emphasize without hiding it.

---

## 8. Anti-patterns — do not ship

- Any purple, teal, or orange that isn't a derived state color
- Generic Unsplash hero photos of concert crowds
- "Trusted by 10,000+ users" claims without real numbers
- Animated gradient text
- Floating WhatsApp/Messenger chat bubbles
- Cookie banners that aren't minimal
- Dark mode (out of scope for MVP — revisit in Phase 6)
- Default Inter, Roboto, Arial, or system-ui as the primary font
- Pure-black shadows (always tint with navy)
- Hard 90° corners on cards, buttons, or inputs

---

## 9. Deliverable at the End of Phase 1

After building the first screens, consolidate your concrete decisions into the `@theme` block in `src/app/globals.css` (Tailwind v4 CSS-first config):

- All color tokens (base + derived scales + state colors)
- Font family tokens
- Spacing scale
- Type scale (sizes + line-heights + weights per role)
- Border radius scale
- Shadow scale
- Any custom utilities needed for RTL

Once consolidated, treat `globals.css`'s `@theme` block as the source of truth and update this document's token section to reference it.

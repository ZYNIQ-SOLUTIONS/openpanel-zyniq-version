# 🎨 Branding Brief – Zyniq Solutions Design Agent

> **Purpose**: This document is prepared specifically for a **Design AI Agent** to rebrand this OpenPanel fork to the Zyniq Solutions brand.
> **Recipient**: Second AI Agent responsible for UI/UX redesign
> **Date**: 2026-02-28

---

## Mission

Transform the visual identity of this analytics platform from the default **OpenPanel** branding to the **Zyniq Solutions** brand. This includes colors, logos, fonts, naming, and any brand-specific assets.

---

## What Needs to Be Changed

### 1. 🎨 Color System (TailwindCSS v4)

**File to modify**: `apps/start/src/styles.css`

This file contains all CSS custom properties and Tailwind configuration. Look for `:root` and `@theme` CSS blocks.

The current brand uses a blue-primary palette. You need to replace it with Zyniq's brand palette.

**Your task**:
- Identify all primary, secondary, accent, and neutral color tokens in `styles.css`
- Replace with Zyniq brand colors (to be provided by Zyniq Solutions team)
- Ensure dark mode tokens are also updated (look for `.dark` class overrides)
- Tailwind color tokens follow the pattern: `--color-primary`, `--color-secondary`, etc.

**Reference palette format expected** (update these with Zyniq brand colors):
```css
:root {
  /* Replace these with Zyniq brand values */
  --color-primary: /* Zyniq primary brand color (HEX/HSL) */;
  --color-primary-foreground: /* Text on primary */;
  --color-secondary: /* Secondary brand color */;
  --color-accent: /* Accent color */;
  --color-background: /* Main background */;
  --color-foreground: /* Main text */;
}
```

---

### 2. 🖼️ Logo Replacement

#### Dashboard Logo (SVG)
**File**: `apps/start/src/logo.svg`
- Current: OpenPanel logo (SVG, 8.6KB)
- Action: **Replace** with Zyniq Solutions logo in SVG format
- Keep the filename `logo.svg` or update all import references

**Import locations** — search in codebase for logo references:
```bash
grep -r "logo.svg" apps/start/src/
grep -r "openpanel" apps/start/src/ --include="*.tsx" --include="*.ts" -i
```

#### Marketing Site Logo
**Location**: `apps/public/public/` — contains all static assets including OG images, logos
- Replace any OpenPanel logo files with Zyniq versions
- Update `apps/public/public/ogimage.png` — used in README and social previews

#### Favicon / App Icons
**Location**: `apps/start/public/`
- Contains favicon, apple-touch-icon, and other icon files
- Replace all with Zyniq brand icons

---

### 3. ✏️ Text / Brand Name Replacement

#### In the Dashboard App (`apps/start/`)
Search for all text instances of:
- `"OpenPanel"` — replace with `"Zyniq Analytics"` (or your brand name)
- `"openpanel"` — replace with `"zyniq"` (lowercase, for CSS classes, slugs, etc.)
- `"openpanel.dev"` — replace with your domain
- Any other brand references

**Recommended grep**:
```bash
grep -r "OpenPanel\|openpanel\.dev" apps/start/src/ --include="*.tsx" --include="*.ts" -l
```

#### Page `<title>` and meta tags
**File**: `apps/start/src/routes/__root.tsx` (or similar root route file)
- Update `<title>` and `<meta name="description">` tags

#### Footer / About sections
- Look for any "Powered by OpenPanel" or similar attribution text
- Update per TRADEMARK.md guidelines (you may need to keep attribution)

---

### 4. 🔤 Typography (Optional Enhancement)

**Current**: Uses system font stack + Tailwind defaults

**File**: `apps/start/src/styles.css`

To add a custom Google Font for Zyniq:
```css
/* Add to top of styles.css */
@import url('https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@300;400;500;600;700&display=swap');

:root {
  --font-sans: 'YOUR_FONT', system-ui, sans-serif;
}
```

---

### 5. 📧 Email Templates

**Location**: `packages/email/`

Email templates are React Email components. They may contain:
- OpenPanel logo images
- Brand colors
- "OpenPanel" name references

**Action**: Update email sender name, logo, and colors to match Zyniq brand.

---

### 6. 🌐 Public Website (`apps/public/`)

This is the marketing/documentation site.

**Key files**:
- `apps/public/src/` — source files
- `apps/public/content/` — 132 MDX documentation pages
- `apps/public/public/` — static assets

**Action**: Update all branding, logos, copy. This is a separate Next.js app.

---

## Component Library Context

The UI is built with:
- **Shadcn UI** components (see `apps/start/components.json`)
- **Radix UI** primitives
- **TailwindCSS v4** (utility classes + CSS custom properties)
- **Lucide React** for icons

All Shadcn components use CSS custom properties for colors — so updating `styles.css` will automatically cascade to all components.

---

## Shadcn Components Config

**File**: `apps/start/components.json`
```json
{
  "style": "...",
  "tailwind": { ... },
  "aliases": { ... }
}
```

Review this file to understand the component setup before making changes.

---

## Files Priority List

Start with these files first (highest visual impact):

| Priority | File | Change |
|---------|------|--------|
| 🔴 1 | `apps/start/src/styles.css` | All color tokens |
| 🔴 2 | `apps/start/src/logo.svg` | Replace logo |
| 🔴 3 | `apps/start/public/` | Favicon + icons |
| 🟠 4 | `apps/start/src/routes/__root.tsx` | Page title + meta |
| 🟠 5 | `packages/email/` | Email templates |
| 🟡 6 | `apps/public/` | Marketing site |
| 🟡 7 | `README.md` | Documentation |

---

## What to ASK the Zyniq Team Before Starting

1. **Brand colors**: Primary, secondary, accent (HEX or HSL values)?
2. **Logo files**: Provide SVG + PNG versions of the Zyniq logo
3. **Brand name**: How should the product be called? "Zyniq Analytics"? "Zyniq Dashboard"? "Zyniq Insights"?
4. **Font**: Is there a preferred Zyniq typeface?
5. **Domain**: What will be the production URL for the dashboard?
6. **Dark mode**: Does Zyniq have a dark mode brand palette?

---

## Trademark Considerations

Per `TRADEMARK.md`, the name "OpenPanel" and its logos are trademarked. This fork **must**:
- Remove all "OpenPanel" branding from user-facing UI
- Not represent this as an official OpenPanel product
- Maintain the MIT license and attribution in `LICENSE.md` (the code license)
- Review `TRADEMARK.md` fully before finalizing branding decisions

---

## Development Command Reference (for the Design Agent)

```bash
# Start the dashboard in dev mode to preview changes live
pnpm install
cp .env.example .env
pnpm dock:up          # Start databases (runs in background)
pnpm codegen          # Generate Prisma client
pnpm migrate:deploy   # Set up database
pnpm dev:public       # OR just pnpm --filter start dev for dashboard only
```

Dashboard previews at: **http://localhost:3000**

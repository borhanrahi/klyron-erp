# Klyron ERP — Design System & Conversion Guide

Version: 1.0
Framework: Next.js 16 + Tailwind CSS v4 + shadcn/ui
Design Source: `frontend/stitch_klyron_premium_erp_system/`

---

## Custom Breakpoints (MANDATORY)

Always use these breakpoints — never default Tailwind values.

```css
@theme {
  --breakpoint-xs: 30rem;     /* 480px */
  --breakpoint-sm: 40rem;     /* 640px */
  --breakpoint-md: 48rem;     /* 768px */
  --breakpoint-lg: 64rem;     /* 1024px */
  --breakpoint-xl: 82.5rem;   /* 1320px */
  --breakpoint-2xl: 100rem;   /* 1600px */
}
```

### Usage

| Breakpoint | Prefix | Target |
|------------|--------|--------|
| xs (480px) | `xs:` | Large phones |
| sm (640px) | `sm:` | Small tablets |
| md (768px) | `md:` | Tablets, sidebar shows |
| lg (1024px) | `lg:` | Small desktops |
| xl (1320px) | `xl:` | Standard desktops |
| 2xl (1600px) | `2xl:` | Large screens |

---

## Color System

### Brand Colors

| Token | Hex | Tailwind Class |
|-------|-----|----------------|
| Primary | `#4F46E5` | `bg-primary` |
| Primary Hover | `#4338CA` | `hover:bg-primary-hover` |
| Primary Light | `#EEF2FF` | `bg-primary-light` |
| Accent | `#06B6D4` | `bg-accent` |
| Accent Light | `#ECFEFF` | `bg-accent-light` |

### Status Colors

| Token | Hex | Tailwind Class |
|-------|-----|----------------|
| Success | `#10B981` | `bg-success` |
| Warning | `#F59E0B` | `bg-warning` |
| Danger | `#EF4444` | `bg-danger` |
| Info | `#3B82F6` | `bg-info` |

### Background Colors (Light Mode)

| Token | Hex | Tailwind Class |
|-------|-----|----------------|
| Background | `#F8FAFC` | `bg-background` |
| Card | `#FFFFFF` | `bg-card` |
| Border | `#E2E8F0` | `border-border` |
| Muted | `#94A3B8` | `text-muted` |

### Background Colors (Dark Mode)

| Token | Hex | Tailwind Class |
|-------|-----|----------------|
| Background | `#0F172A` | `dark:bg-background` |
| Card | `#111827` | `dark:bg-card` |
| Border | `#1F2937` | `dark:border-border` |
| Surface | `#1E293B` | `dark:bg-surface` |

---

## CSS Variables (globals.css)

```css
@theme {
  /* Breakpoints */
  --breakpoint-xs: 30rem;
  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 82.5rem;
  --breakpoint-2xl: 100rem;

  /* Brand */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-primary-light: #EEF2FF;
  --color-accent: #06B6D4;
  --color-accent-light: #ECFEFF;

  /* Status */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;

  /* Background Light */
  --color-background: #F8FAFC;
  --color-card: #FFFFFF;
  --color-border: #E2E8F0;
  --color-muted: #94A3B8;

  /* Foreground */
  --color-foreground: #0F172A;
  --color-foreground-muted: #64748B;

  /* Radius */
  --radius: 0.75rem;
}

.dark {
  --color-background: #0F172A;
  --color-card: #111827;
  --color-border: #1F2937;
  --color-surface: #1E293B;
  --color-foreground: #F1F5F9;
  --color-foreground-muted: #94A3B8;
}
```

---

## Typography

Font: **Inter** (400, 500, 600, 700)

| Scale | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| display-lg | 48px | 56px | 700 | Hero numbers, page titles |
| headline-lg | 32px | 40px | 600 | Section headings |
| headline-md | 24px | 32px | 600 | Card titles |
| title-lg | 20px | 28px | 600 | Component titles |
| body-lg | 16px | 24px | 400 | Body text |
| body-md | 14px | 20px | 400 | Table cells, standard |
| body-sm | 13px | 18px | 400 | Captions |
| label-md | 12px | 16px | 500 | Buttons, nav labels |
| label-sm | 11px | 12px | 600 | Badges, table headers |

---

## Layout

### Sidebar

- Width: `280px` (expanded), `72px` (collapsed)
- Background: `bg-card/80 backdrop-blur-md`
- Border: `border-r border-border`
- Hidden on mobile (`hidden md:flex`)

### Top Navbar

- Height: `64px` (`h-16`)
- Position: `sticky top-0`
- Background: `bg-background/80 backdrop-blur-md`
- Border: `border-b border-border`

### Content Area

- Padding: `p-4 md:p-6 lg:p-8`
- Max width: `1440px`
- Margin: `mx-auto`

---

## Component Patterns

### Cards

```tsx
<div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
  {children}
</div>
```

### Buttons

```tsx
// Primary
<button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95">

// Secondary
<button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10">

// Ghost
<button className="text-foreground-muted px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10">
```

### Status Badges

```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
  Active
</span>
```

### Input Fields

```tsx
<input className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
```

### Data Tables

```tsx
<table className="w-full">
  <thead>
    <tr className="border-b border-border">
      <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">Header</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-border/50">
    <tr className="hover:bg-muted/5 transition-colors">
      <td className="py-3 px-4 text-sm">Cell</td>
    </tr>
  </tbody>
</table>
```

---

## Animations

Always use these transitions:

```css
/* Base transition */
transition-all duration-200

/* Hover lift */
hover:shadow-md hover:-translate-y-0.5

/* Click feedback */
active:scale-95

/* Fade in */
animate-in fade-in-0 duration-200

/* Slide in from right */
animate-in slide-in-from-right-4 duration-200
```

---

## Design Source: stitch_klyron_premium_erp_system/

### Pages Ready to Convert (22 with code.html)

| Folder | Page | Route |
|--------|------|-------|
| `forgot_password_klyron_erp/` | Forgot Password | `/forgot-password` |
| `register_fixed_color/` | Register | `/register` |
| `login_klyron_erp/` | Login | `/login` |
| `company_creation_wizard/` | Company Wizard | `/onboarding/company` |
| `team_dashboard/` | Team Dashboard | `/dashboard/team` |
| `activity_feed/` | Activity Feed | `/dashboard/activity` |
| `executive_dashboard/` | Executive Dashboard | `/dashboard` |
| `portal_invoices_fixed/` | Portal Invoices | `/portal/invoices` |
| `portal_orders/` | Portal Orders | `/portal/orders` |
| `portal_payments/` | Portal Payments | `/portal/payments` |
| `portal_quotations_fixed/` | Portal Quotations | `/portal/quotations` |
| `portal_documents/` | Portal Documents | `/portal/documents` |
| `portal_support_tickets/` | Portal Tickets | `/portal/tickets` |
| `rfq_list/` | RFQ List | `/procurement/rfq` |
| `lead_details_crm/` | Lead Details | `/sales/leads/[id]` |
| `bom_details/` | BOM Details | `/manufacturing/bom/[id]` |
| `sales_order_details/` | Sales Order Detail | `/sales/orders/[id]` |
| `sales_order_list/` | Sales Orders | `/sales/orders` |
| `supplier_profile/` | Supplier Profile | `/procurement/suppliers/[id]` |
| `currencies_fixed/` | Currencies | `/settings/currencies` |
| `journal_entries/` | Journal Entries | `/finance/journal` |
| `knowledge_base_fixed/` | Knowledge Base | `/support/knowledge` |
| `leave_approval_fixed/` | Leave Approval | `/hr/leaves` |

### Pages Needing Design (22 screenshot only)

These have `screen.png` only — create HTML from screenshot using design system patterns, then convert to Next.js.

---

## Conversion Rules

1. **Mobile First** — Always start with mobile layout, add `md:`, `lg:`, `xl:` for larger screens
2. **Use Custom Breakpoints** — Never use default Tailwind `sm:`, `md:`, `lg:` — use our custom values
3. **Component Based** — Extract reusable components: `DataTable`, `StatusBadge`, `KPICard`, `PageHeader`, `Sidebar`, `TopNav`
4. **Dark Mode** — Every component must have `dark:` variants
5. **Animations** — Use `transition-all duration-200` and `active:scale-95` for interactive elements
6. **Glass Effect** — Sidebar and navbar use `bg-card/80 backdrop-blur-md`
7. **Icons** — Use `lucide-react` icons (already installed)
8. **No Inline Styles** — All styling via Tailwind classes

---
name: Klyron Enterprise
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 12px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  stack-xl: 48px
---

## Brand & Style

The design system is engineered for the next generation of high-growth enterprises. It balances the density required for complex resource planning with the aesthetic polish of premium fintech products. The visual direction is **Modern Corporate Minimalism**—drawing inspiration from high-performance tools like Linear and Stripe.

The personality is **Intelligent, Fast, and Trustworthy**. The interface prioritizes clarity and speed of thought, using whitespace not just for aesthetics but as a functional separator for high-density data. A subtle "Glassmorphic" layer is applied to persistent navigation elements to provide a sense of depth and material continuity, while the core workspace remains grounded and focused.

## Colors

The palette is anchored by a high-authority Indigo primary, supported by a technical Cyan accent. The design system uses a sophisticated scale of neutrals to differentiate between background, surface, and interactive states. 

- **Primary & Interaction:** Use Indigo (#4F46E5) for primary actions. Hover states should shift to a deeper shade (#4338CA).
- **Surface Strategy:** In Dark Mode, the primary canvas is #0F172A, while elevated cards and panels use #111827 to create subtle hierarchy.
- **Data Visualization:** Use the primary and secondary colors for charts, supplemented by a secondary palette of emerald, amber, and rose for semantic status indicators (Success, Warning, Danger).
- **Translucency:** Sidebars and utility panels should utilize a 70-80% opacity fill of the background color with a 20px backdrop blur to achieve the glassmorphic effect.

## Typography

The typography system utilizes **Inter** exclusively to ensure maximum legibility across dense data tables and complex dashboards. 

- **Weight Strategy:** Use Semibold (600) for headers to provide clear hierarchy without the visual heaviness of Bold (700) in dark mode.
- **Micro-copy:** `body-sm` (13px) is the workhorse for data table cells and side-panel descriptions.
- **Tracking:** Apply negative letter spacing to larger headlines (-0.01em to -0.02em) to maintain a compact, "engineered" feel.
- **Labels:** Use `label-sm` with uppercase transformation for category headers and table column titles to differentiate them from interactive content.

## Layout & Spacing

This design system uses a **Fluid-Fixed Hybrid** grid. The main content area lives within a 1440px max-width container, while side navigation and utility bars are anchored to the viewport edges.

- **Grid:** A 12-column grid is used for dashboard layouts. Gutters are fixed at 24px to maintain high information density while preventing visual clutter.
- **The 4px Rule:** All spacing (padding, margins, gap) must be a multiple of 4px.
- **Responsive Behavior:** 
  - **Desktop (1280px+):** Sidebar expanded, 24px gutters, 32px outer margins.
  - **Tablet (768px - 1279px):** Sidebar collapsed to icons, 16px gutters, 24px outer margins.
  - **Mobile (<767px):** Single column reflow, 16px outer margins.

## Elevation & Depth

Hierarchy is established through a combination of **Tonal Layering** and **Subtle Shadows**. 

1. **Background (Level 0):** The base canvas color.
2. **Surface (Level 1):** Main content cards and navigation bars. These use a 1px border (#E2E8F0 in light, #1F2937 in dark).
3. **Elevated (Level 2):** Modals, dropdowns, and popovers. These utilize "Shadow-lg"—a soft, wide-dispersion shadow with low opacity (10-15%) and a slight tint of the primary color in dark mode to simulate ambient light.
4. **Interactive (Hover):** When hovering over a card or button, the shadow should transition from `shadow-sm` to `shadow-md`, and the border color should brighten slightly to indicate focus.

Glassmorphism is reserved for global navigation (Sidebars and Topbars), using a 0.5px white/gray inner-stroke to simulate the edge of the glass.

## Shapes

The shape language is sophisticated and modern, characterized by **"Rounded-2xl"** (1rem / 16px) for major containers and cards. 

- **Primary Containers:** 16px (rounded-2xl) for dashboard widgets and main content areas.
- **Components:** 8px (rounded-lg) for buttons, input fields, and smaller UI elements.
- **Utility:** 4px (rounded-sm) for small tags or checkboxes.
- **Exceptions:** Pills are used for status badges (Success/Warning) to distinguish them from interactive buttons.

## Components

- **Buttons:** Primary buttons use a solid Indigo background with white text. Ghost buttons use a subtle border and no background until hover. All buttons feature a 1px top-highlight stroke to add a "tactile" premium feel.
- **Data Tables:** Tables are "Shadcn-style"—minimalist with no vertical borders. Horizontal borders are 1px and very low contrast. Header cells use `label-sm` typography. Rows feature a subtle background shift on hover.
- **Input Fields:** Use a 1px border with a 4px inner shadow (inset) to provide depth. On focus, the border transitions to the primary Indigo with a 3px soft-glow outer ring.
- **Chips & Badges:** Low-saturation backgrounds with high-saturation text (e.g., Light Emerald background with Dark Emerald text). Use pill shapes for statuses and 4px rounded rectangles for filters.
- **Charts:** Leverage "Recharts-style" aesthetics: thin line weights (2px), subtle area gradients that fade to transparent at the baseline, and tooltips that follow the glassmorphic elevation style.
- **Cards:** Cards are the primary container. They must have a 1px border and the `rounded-2xl` corner radius. Do not use heavy shadows unless the card is being dragged or is a floating modal.
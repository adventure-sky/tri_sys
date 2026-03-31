# High-End Design System: Three-Tier Data Precision

## 1. Overview & Creative North Star: "The Digital Architect"
This design system moves beyond the rigid, "boxed-in" nature of traditional enterprise software. Our Creative North Star is **The Digital Architect**. We treat data maintenance not as a series of forms, but as a structured, high-end editorial experience. 

By utilizing intentional asymmetry, tonal layering, and sophisticated typography scales, we eliminate the "template" feel of standard Ant Design implementations. The goal is to provide a sense of authoritative calm. We break the grid using breathing room (whitespace) as a functional element, ensuring that complex three-tier data structures feel light, breathable, and premium.

---

## 2. Colors & Surface Philosophy
The palette is rooted in professional trust but elevated through tonal depth. We use a "No-Line" rule to maintain a modern, seamless aesthetic.

### Tonal Logic
- **Primary (`#005daa`):** Our "Command Blue." Used for high-intent actions. 
- **Secondary (`#7431d3`):** Used for analytical or secondary data paths to provide a "Signature" feel.
- **Surface Tiers:** 
    - `surface`: The base canvas (`#f7f9fc`).
    - `surface_container_low`: Used for large grouped content areas.
    - `surface_container_highest`: Used for active, hovering, or high-focus elements.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid hex borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a data table should sit on `surface_container_lowest` while the surrounding page area is `surface`. This creates a sophisticated, "borderless" look that reduces visual noise.

### The Glass & Gradient Rule
To prevent the UI from feeling flat, use **Glassmorphism** for floating panels (Modals, Popovers). 
- **Recipe:** `surface_container_lowest` + 80% Opacity + 20px Backdrop Blur.
- **Signature Texture:** Apply a subtle linear gradient to Primary Buttons: `primary` to `primary_container` (Top-to-Bottom). This adds a "jewel" polish that signifies premium quality.

---

## 3. Typography: Editorial Authority
We use a Traditional Chinese-optimized scale that prioritizes legibility and hierarchy.

| Level | Token | Size | Role |
| :--- | :--- | :--- | :--- |
| **Display** | `display-md` | 2.75rem | High-level data dashboard summaries. |
| **Headline** | `headline-sm` | 1.5rem | Section headers for the Three-Tier categories. |
| **Title** | `title-md` | 1.125rem | Card titles and modal headers. |
| **Body** | `body-md` | 0.875rem | Standard data entry and descriptions (14px equivalent). |
| **Label** | `label-md` | 0.75rem | Metadata, timestamps, and micro-copy. |

**Hierarchy Strategy:** Use `on_surface` (Dark) for titles and `on_surface_variant` (Medium Gray) for body text. This 20% contrast difference naturally guides the eye without requiring bold fonts.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." In this system, we achieve depth through **Ambient Light** and **Material Stacking**.

- **The Layering Principle:** Place a `surface_container_lowest` card (Pure White) on a `surface_container_low` background. The difference in hex value creates a "soft lift" that feels architectural.
- **Ambient Shadows:** For floating elements, use a diffused shadow: `box-shadow: 0 12px 32px rgba(0, 93, 170, 0.06);`. Note the blue tint in the shadow—this mimics natural light better than pure gray.
- **The Ghost Border Fallback:** If a divider is essential for accessibility, use the `outline_variant` token at **15% opacity**. It should be a suggestion of a line, not a barrier.

---

## 5. Components: Precision Primitives

### Buttons (The Interaction Core)
- **Primary:** Gradient fill (`primary` to `primary_container`), `DEFAULT` (4px) roundedness. 
- **Secondary:** Transparent background with a `Ghost Border` and `primary` text.
- **States:** On hover, increase the gradient intensity. On press, shift to `on_primary_fixed_variant`.

### Data Cards
- **Forbid Dividers:** Do not use lines to separate header from body. Use a `1.5` (0.3rem) spacing gap or a subtle background shift to `surface_container_high` for the header area.
- **Structure:** Use `xl` (0.75rem) internal padding for high-density data and `20` (4.5rem) for hero-level cards.

### Input Fields
- **Surface:** Use `surface_container_highest` for the input background to make it look "etched" into the page.
- **Interaction:** On focus, the "Ghost Border" becomes a 2px `primary` glow with a 4% opacity spread.

### Three-Tier Navigation (The Sidebar)
- **Visuals:** Use the Dark `001529` background. Active states should not be a box, but a "Vertical Indicator"—a 3px wide line of `primary` color on the far left of the menu item, with the text shifting to `on_primary`.

---

## 6. Do's and Don'ts

### Do
- **Use "Asymmetric Breathing":** Give more whitespace to the top and left of a container than the bottom and right to create a "pushed" editorial feel.
- **Use Traditional Chinese Vertical Alignment:** Ensure line-height for `body-md` is at least 1.6 to account for the density of Chinese characters.
- **Nesting:** Only nest up to three levels of surface containers (e.g., Page > Section > Card).

### Don't
- **Don't use 100% Black:** Always use `on_background` (`#191c1e`) for text. Pure black creates "eye vibrate" on light gray backgrounds.
- **Don't use standard Tooltips:** Use the Glassmorphism recipe for tooltips to ensure they feel like part of the atmosphere, not a "system error."
- **Don't use hard corners:** Even in an enterprise "structured" environment, the `sm` (2px) or `DEFAULT` (4px) radius is required to soften the "industrial" feel.
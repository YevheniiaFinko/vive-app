# Design System Specification: Liquid Luxury & Tech-Wellness

## 1. Overview & Creative North Star
**Creative North Star: "The Ethereal Pulse"**

This design system transcends traditional UI by treating the interface as a living, breathing organism. Moving away from the "app-as-a-tool" mentality, we are building an "app-as-an-atmosphere." By combining the high-fidelity precision of **iOS 26 Liquid Glass** with an editorial, wellness-focused layout, we achieve a sense of "Tech-Wellness Luxury."

The system breaks the "template" look by rejecting rigid, opaque containers in favor of **Bento-style asymmetric compositions** and **overlapping translucent layers**. We prioritize depth, motion, and light over structure and lines. Every element should feel like a polished gemstone resting on a soft, silk surface.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a near-white foundation, enriched by phase-specific "Aurora" accents that communicate biological shifts through ambient light rather than clinical labels.

### Phase-Specific Tints (The Aurora Engine)
*   **Menstrual (Rose):** `secondary` (#FBCFE8) / `secondary_container` (#FDD0EA)
*   **Follicular (Mint):** `tertiary` (#D0E2B2) / `tertiary_container` (#CBFAF0)
*   **Ovulation (Gold):** Custom Accent (Blended Surface-Tint)
*   **Luteal (Lavender):** `primary` (#A9D0ED) / `primary_container` (#8B9DFF)

### The "No-Line" Rule
Strictly prohibit 1px solid opaque borders for sectioning. Boundaries are defined exclusively through:
1.  **Tonal Transitions:** Moving from `surface` (#F7F6FE) to `surface_container_low` (#F0F0F9).
2.  **Liquid Glass Contours:** Using a 1px white border at 40% opacity (`rgba(255, 255, 255, 0.4)`) to catch the light, never to "box in" content.

### The Glass & Gradient Rule
All interactive cards must utilize **Liquid Glassmorphism**:
*   **Fill:** `rgba(255, 255, 255, 0.60)`
*   **Backdrop Blur:** 24px
*   **Inner Highlight:** A 1px inset top-border (white, 60% opacity) to mimic the thickness of glass.
*   **Background Blobs:** Use soft-focus radial gradients of Rose, Mint, and Sky Blue behind the glass layer to create a sense of deep, liquid space.

---

## 3. Typography: Editorial Authority
We utilize **Inter Variable** to create a sophisticated typographic hierarchy that feels like a premium health journal.

*   **Metric Numbers:** Use `display-lg` or `display-md` but forced to **Font Weight: 200 (Ultra-light)**. This conveys precision and elegance.
*   **Headlines:** `headline-lg` (Weight: 500) for section titles. Use tight letter-spacing (-0.02em) to maintain an editorial feel.
*   **Body:** `body-md` (Weight: 400). Use `on_surface_variant` (#5A5B62) to reduce visual noise and improve reading comfort.
*   **Labels:** `label-md` (Weight: 600, Uppercase). Used sparingly for high-context data points.

---

## 4. Elevation & Depth: Tonal Layering
In this system, "Elevation" is a measure of light refraction, not shadow height.

*   **The Layering Principle:** Stack `surface_container_lowest` (#FFFFFF) components atop `surface` (#F7F6FE) backgrounds. The contrast is felt, not seen.
*   **Ambient Shadows:** For floating elements, use a "Cloud Shadow": 
    *   `box-shadow: 0 20px 40px rgba(65, 84, 176, 0.06)`
    *   Notice the tint—the shadow uses a hint of the `primary` color to maintain the "Aurora" glow.
*   **The Ghost Border:** For accessibility on input fields, use `outline_variant` (#ACACB4) at **15% opacity**.

---

## 5. Components: The Bento Collection

### The Bento Card
*   **Radius:** 28px (`xl` scale).
*   **Styling:** Liquid Glass (60% white, 24px blur).
*   **Rule:** No dividers. Separate content using the `spacing-6` (2rem) scale.

### Buttons (Fluid Interaction)
*   **Primary:** Never solid. Use a linear gradient from `primary` to `primary_container` at 80% opacity with a heavy backdrop blur.
*   **Secondary:** Ghost style. No fill, `surface_tint` text, and a `Ghost Border` (1px white @ 30%).
*   **Shape:** Full pill-shape (`rounded-full`).

### Chips & Tags
*   **Style:** `surface_container_highest` (#DCDCE7) at 40% opacity. 
*   **Interaction:** On tap, the chip should "fill" with the phase-specific aurora color (e.g., Rose for Menstrual phase).

### Inputs & Fields
*   **Background:** `surface_container_low` (#F0F0F9) with a subtle inset shadow to suggest a "carved" glass look.
*   **Typography:** All user input defaults to `title-md`.

### Specialized Wellness Components
*   **The Phase Orb:** A large, blurred radial gradient in the center of the dashboard that pulses slowly. It acts as the primary "state" indicator for the user's cycle.
*   **Ultra-Light Metrics:** Large-scale numbers (Weight 200) paired with tiny, bold labels (Weight 700) to create a high-contrast data visualization style.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a structural element. If in doubt, add more padding.
*   **DO** allow background gradients to bleed through components.
*   **DO** use "Apple-style" spring animations for all card expansions.
*   **DO** treat the UI as a single, continuous canvas.

### Don't
*   **DON'T** use #000000 for text. Use `on_surface` (#2D2E34).
*   **DON'T** use 90-degree corners. Everything must be `md` (1.5rem) or higher.
*   **DON'T** use standard Material or Bootstrap-style shadows. 
*   **DON'T** use "divider lines" to separate list items; use `surface-container` shifts instead.
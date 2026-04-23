# Design System Document: The Digital Conservatory

## 1. Overview & Creative North Star
The visual identity of this design system is built upon the **"Digital Conservatory"** concept—a high-end editorial experience that marries the precision of modern architectural glass with the raw, untamed beauty of the natural world.

Unlike traditional wellness apps that rely on soft pastels and symmetry, this system embraces **Organic Brutalism**. We break the "template" look through intentional asymmetry, overlapping glass surfaces, and a high-contrast typography scale. By placing hyper-functional UI elements over 3D moss renders and macro nature photography, we create a sense of depth that feels immersive rather than decorative.

The goal is to provide a "breathing" interface where the UI doesn't sit *on* the content, but lives *within* it.

---

## 2. Colors
Our palette is a sophisticated curation of earth-born tones designed to reduce cognitive load while maintaining a premium, "gallery-like" aesthetic.

* **Background (#E2E8E4):** A muted sage grey that acts as our limestone base.
* **Surface (#CDD7D7):** Our primary canvas for cards and UI containers.
* **Deep Teal (#667D7A):** Used for primary actions and grounding elements.
* **Near-Black (#20211D):** Reserved for high-impact typography and dark glass variants.
* **Lime Accent (#C0F988):** A high-visibility "bio-luminescent" spark for CTAs and data points.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through background color shifts or tonal transitions. For example, a `surface-container-low` card should sit on a `surface` background, using the change in value to define its edge.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of stacked material. Use the surface-container tiers (Lowest to Highest) to create nested depth:
* **Deepest Layer:** Macro photography or 3D Moss Renders.
* **Middle Layer:** Glass containers (Light or Dark).
* **Top Layer:** Content cards using `surface-container-highest` for maximum prominence.

### Signature Textures
While the system avoids decorative gradients, we utilize "Visual Soul" transitions. This involves a subtle shift from `primary` to `primary-container` in large action buttons to mimic the way light hits an organic surface, providing a professional polish that flat color lacks.

---

## 3. Typography
We utilize **Helvetica Neue** to provide a sharp, Swiss-inspired contrast against the organic background textures. This juxtaposition of "Man-made Precision" and "Natural Chaos" is central to our identity.

* **Display (Manrope Scale/Helvetica Neue Type):** Used for hero headers and large numerical data (e.g., Mood scores). These should be tracked slightly tight (-2%) for an editorial look.
* **Headline & Title:** Set in `Near-Black` to command authority. Use asymmetric placement (e.g., left-aligned with a wide right margin) to break the grid.
* **Body & Labels:** Set in `Deep Teal` or `Near-Black` depending on hierarchy. `Body-md` is the workhorse for all instructional text.

The hierarchy is designed to feel like a high-end magazine; large, bold statements followed by generous negative space and precise, functional metadata.

---

## 4. Elevation & Depth
In the Digital Conservatory, depth is achieved through light and transparency, not structural shadows.

### The Layering Principle
Stacking `surface-container` tiers creates a soft, natural lift. A `surface-container-lowest` card placed on a `surface-container-low` section creates a gentle "recessed" effect that feels tactile and premium.

### Glassmorphism
Use the two specific glass tokens for floating elements:
* **Light Glass:** `rgba(205, 215, 215, 0.5)` with `backdrop-blur: 16px`. Use this for top navigation bars and secondary overlays.
* **Dark Glass:** `rgba(32, 33, 29, 0.85)` with `backdrop-blur: 16px`. Use this for high-contrast "Day Plan" modules or focused modal states.

### Ambient Shadows
When a floating effect is required (e.g., a primary CTA), use extra-diffused shadows with 4%-8% opacity. The shadow color should be a tinted version of `Near-Black` or `Deep Teal`, never a neutral grey, to maintain the "nature-rooted" tonal warmth.

---

## 5. Components

### Buttons
* **Primary:** Filled with `Lime Accent (#C0F988)` or `Deep Teal (#667D7A)`. Corners are always `full` or `xl (3rem)`.
* **Glass Buttons:** Light glass backgrounds with `Near-Black` icons. Used for secondary actions (e.g., "View Statistics").

### Navigation (Floating Dock)
The bottom navigation must be a floating glass pill. Use the `full` roundedness scale. Icons should be `Near-Black` with a `White` circular "active" state indicator, mimicking a pebble in a stream.

### Cards & Lists
* **The Divider Ban:** Never use horizontal lines to separate list items. Use vertical white space (`Spacing 4` or `Spacing 6`) or subtle shifts from `surface-container-low` to `surface-container-high`.
* **Corners:** All cards must use the `28px` corner radius to maintain the soft, organic feel defined in the aesthetic brief.

### Wellness Specific Components
* **Mood Sliders:** Utilize a thick, glass track with a `Lime Accent` thumb. The track should feel substantial and tactile.
* **Data Viz:** Graphs should use the `Lime Accent` for the data line, with points glowing slightly to represent "vitality." Avoid harsh grid lines; use the "Ghost Border" (10% opacity `outline-variant`) if axis markers are required.

---

## 6. Do's and Don'ts

### Do:
* **Do** allow background 3D renders to peek through glass elements.
* **Do** use extreme asymmetry in layouts (e.g., a large image on the left overlapping a glass card on the right).
* **Do** use the `28px` corner radius consistently across all containers to reinforce the "soft-modern" brand voice.
* **Do** prioritize legibility by using `White` text on `Dark Glass` and `Near-Black` text on `Light Glass`.

### Don't:
* **Don't** use 1px solid borders. They break the organic immersion.
* **Don't** use pink, purple, or any "synthetic" colors outside the defined palette.
* **Don't** use standard drop shadows. Always use ambient, diffused blurs.
* **Don't** crowd the interface. If a screen feels full, increase the spacing scale by one increment (e.g., move from `12` to `16`).
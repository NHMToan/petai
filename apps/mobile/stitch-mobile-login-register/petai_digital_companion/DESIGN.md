---
name: PetAI Digital Companion
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#859399'
  outline-variant: '#3c494e'
  surface-tint: '#47d6ff'
  primary: '#a5e7ff'
  on-primary: '#003543'
  primary-container: '#00d2ff'
  on-primary-container: '#00566a'
  inverse-primary: '#00677f'
  secondary: '#d9b9ff'
  on-secondary: '#450086'
  secondary-container: '#6c04ca'
  on-secondary-container: '#d3b0ff'
  tertiary: '#dcdddf'
  on-tertiary: '#2f3132'
  tertiary-container: '#c0c1c3'
  on-tertiary-container: '#4d4f51'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b6ebff'
  primary-fixed-dim: '#47d6ff'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004e60'
  secondary-fixed: '#eedcff'
  secondary-fixed-dim: '#d9b9ff'
  on-secondary-fixed: '#2a0054'
  on-secondary-fixed-variant: '#6300bb'
  tertiary-fixed: '#e2e2e4'
  tertiary-fixed-dim: '#c6c6c8'
  on-tertiary-fixed: '#1a1c1d'
  on-tertiary-fixed-variant: '#454749'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  section-gap: 160px
  section-gap-mobile: 80px
  container-padding: 24px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system centers on the intersection of high-technology and emotional intelligence. The brand personality is "Sentient Tech"—it feels like a sophisticated piece of hardware from the near future that possesses a warm, rhythmic soul. It targets tech-optimists and early adopters who value both aesthetic precision and emotional connection.

The visual style is a hybrid of **Apple-inspired Minimalism** and **Glassmorphism**, infused with **Futuristic/Vaporwave** accents. The UI should feel airy and expansive despite the dark canvas, using light as a primary functional material rather than just an accent. Surfaces should appear as floating layers of "digital crystal" suspended in a deep obsidian void.

## Colors
The palette is rooted in a "Deep Space" hierarchy. The **Primary Background (#050505)** is a true obsidian, providing the necessary contrast for luminosity. **Neon Blue** and **Vibrant Purple** are used for interactive states, biological-style "status" pulses, and data visualization.

**Warm White** is reserved for high-priority legibility and branding, while **Muted Silver** handles secondary metadata. Use radial gradients of the primary and secondary colors at low opacity (5–15%) behind glass cards to create a sense of internal light and "life" within the hardware.

## Typography
The system uses **Inter** for its systematic, clean, and highly legible characteristics. For display headings, tight tracking and heavy weights create an authoritative, premium "Apple-esque" impact.

A secondary font, **Geist**, is introduced for labels and technical data to provide a "developer-tool" precision that balances the emotional softness of the interface. Line heights are kept generous (1.6x) for body copy to ensure the dark-mode text remains approachable and easy to scan.

## Layout & Spacing
This design system utilizes a **12-column fixed grid** on desktop (max-width 1280px) and a **4-column fluid grid** on mobile. The philosophy is "Extreme Breathability."

Sections are separated by significant vertical gaps (160px) to allow each feature to feel like a standalone experience. Content within glass cards should maintain generous internal padding (min 40px) to prevent the "high-tech" look from feeling cluttered or cramped.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and **Backdrop Blurs**. There are no traditional drop shadows; instead, we use:
1.  **Backdrop Filter:** A heavy blur (20px - 40px) on surface layers.
2.  **Inner Glows:** A subtle 1px white-to-transparent top-left border to simulate a light source hitting the edge of the "glass."
3.  **Atmospheric Glows:** Large, soft radial gradients (200px+ radius) positioned *underneath* transparent surfaces to create "z-axis" separation.

## Shapes
Shapes are defined by "Organic Precision." While the grid is rigid, the corners are comfortably rounded. 
- Standard UI elements (inputs, small buttons) use a **0.5rem (8px)** radius.
- Feature cards and main containers use **1.5rem (24px)** for a friendlier, more tactile feel.
- Interactive status indicators (voice waves, active avatars) use **full pill-rounding** to suggest fluid motion.

## Components
- **Sticky Navbar:** A floating, pill-shaped container with a high-intensity backdrop blur (saturate 180%, blur 20px) and a 1px border.
- **Glass Cards:** Semi-transparent surfaces (Background: rgba(255, 255, 255, 0.03)) with a subtle "noise" texture overlay to add physical grain.
- **Voice Waves:** Animated SVG paths using the Neon Blue and Vibrant Purple accents, featuring variable stroke widths to represent audio frequency.
- **Primary Buttons:** High-contrast Warm White backgrounds with Obsidian text. On hover, they should emit a soft outer glow of the accent color.
- **Input Fields:** Darker than the background (#000000) with a 1px muted silver border that glows Neon Blue on focus.
- **Status Chips:** Small, pill-shaped labels with a Geist Mono typeface and a 4px circular "heartbeat" light indicator.
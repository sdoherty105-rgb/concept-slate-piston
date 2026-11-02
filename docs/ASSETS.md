# Assets and licensing

Slate Piston is an OFF/SHIFT Studio concept, not a real workshop. Every figure, price, bay and address on the site is invented. No photograph of a customer car, no real business name, and no third-party logo is used.

| Asset | Where | Source | Licence |
| --- | --- | --- | --- |
| Side, front, rear and plan elevations, six hotspot markers | `components/vehicle-views.tsx` | Drawn for this concept. The side elevation continues the earlier hatchback line drawing. | Original work |
| Symptom gauge | `components/console.tsx` | Inline SVG, drawn for this concept. Decorative. The result is also written in text. | Original work |
| Workshop floor plan | `components/floor-plan.tsx` | Schematic of a fictional four-bay workshop. Streets and the address are invented. | Original work |
| Rail and tab icons | `components/rail.tsx` | Inline SVG, one stroke weight, drawn for this concept. | Original work |
| Favicon gauge | `app/icon.svg` | Drawn for this concept. | Original work |
| Brake disc and caliper render | `public/art/brake-caliper.avif`, `public/art/brake-caliper.webp` | Generated on 2 Nov 2026 for this concept. Prompt: "Studio product photograph of one ventilated cast-iron brake disc standing upright beside a single aluminium brake caliper, seamless solid charcoal background, one hard key light from camera left, crisp machined metal, no text, no logo, no people, no hands." Used once, on the brake specification sheet. Not a photograph of a customer's car. | Original generated artwork for this concept. No third-party licence. |
| Barlow Semi Condensed 600, Latin subset | `app/fonts/BarlowSemiCondensed-600.woff2` | Jeremy Tribby, Barlow, via `@fontsource/barlow-semi-condensed`. Subset with fontTools (Latin, kerning, no hinting). | SIL Open Font License 1.1 |
| IBM Plex Mono 500, Latin subset | `app/fonts/IBMPlexMono-500.woff2` | IBM Corp., via `@fontsource/ibm-plex-mono`. Subset the same way. | SIL Open Font License 1.1 |
| IBM Plex Sans 400 and 600, Latin subset | `app/fonts/IBMPlexSans-Regular.woff2`, `app/fonts/IBMPlexSans-SemiBold.woff2` | IBM Corp., via `@fontsource/ibm-plex-sans`. | SIL Open Font License 1.1 |

Fonts are self-hosted with `next/font/local`. The pages do not request Google Fonts or any other third party. `scripts/subset-fonts.sh` records the subset command. The OFL allows subsetting and embedding. The fonts are not sold on their own.

Space Grotesk is no longer used.

## Fictional content

The services, price bands, bay board and scheduler are demonstration data. Bay status is computed from the clock in Australia/Perth so the console changes through the day. It is not a live workshop diary. The address (Unit 4, 18 Anvil Road, Welshpool WA 6106), phone ((08) 5550 0142, in the range reserved for fiction) and email (`bookings@slatepiston.example`) are invented. Welshpool is a real suburb, used only as a setting.

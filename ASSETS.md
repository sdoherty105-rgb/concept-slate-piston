# Assets and licensing

Every visual on this site is original artwork or CSS. There are no photographs, no stock images, no faces, and no third-party logos.

| Asset | Where | Source | Licence |
| --- | --- | --- | --- |
| Hero piston, connecting rod and crankshaft drawing | `components/hero-art.tsx` (inline SVG) | Drawn from scratch for this concept by OFF/SHIFT Studio | Original work, no third-party licence |
| Schematic street diagram | `components/site-map.tsx` (inline SVG). Invented streets, not a real map. | Drawn from scratch for this concept | Original work |
| Slate Piston logo mark | `components/logo.tsx`, `app/icon.svg` | Drawn from scratch for this concept | Original work |
| Grid and blueprint backgrounds, step markers, tick marks | `app/globals.css` (CSS gradients and pseudo-elements) | Written for this concept | Original work |
| Space Grotesk (display font), subset to Latin, variable weight | `app/fonts/SpaceGrotesk-Variable.woff2` | Space Grotesk Project Authors, via the Fontsource npm package `@fontsource-variable/space-grotesk` | SIL Open Font License 1.1 |
| IBM Plex Sans (body font), Regular 400 and SemiBold 600, subset to Latin | `app/fonts/IBMPlexSans-Regular.woff2`, `app/fonts/IBMPlexSans-SemiBold.woff2` | IBM Corp., via the Fontsource npm package `@fontsource/ibm-plex-sans` | SIL Open Font License 1.1 |

The fonts are self-hosted and loaded through `next/font/local`. Nothing is requested from Google Fonts or any other third party at runtime. `scripts/subset-fonts.sh` documents how the subset files were produced. The OFL permits subsetting and embedding, and the fonts are not sold on their own.

## Fictional content

Slate Piston is not a real business. The services, prices, opening hours, address (Unit 4, 18 Anvil Road, Welshpool WA 6106), phone number ((08) 5550 0142, a number in the range reserved for fiction) and email (`bookings@slatepiston.example`) are invented. The suburb is a real Perth suburb used only for local flavour. No real business names, reviews, testimonials, awards, ratings, statistics or client logos are used.

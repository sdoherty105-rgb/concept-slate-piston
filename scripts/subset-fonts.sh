#!/usr/bin/env bash
# Rebuilds the subset web fonts in app/fonts from the Fontsource packages (SIL OFL 1.1).
# Needs: npm i --no-save @fontsource-variable/space-grotesk @fontsource/ibm-plex-sans, and pip install fonttools brotli
set -euo pipefail
UNICODES="U+0020-007E,U+00A0,U+00B0,U+00B1,U+00B7,U+00D7,U+00D8,U+00E9,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026,U+2192"
OUT="app/fonts"
mkdir -p "$OUT"
subset() {
  pyftsubset "$1" --unicodes="$UNICODES" --flavor=woff2 --layout-features='kern,liga,calt,tnum,case' --output-file="$2"
}
subset node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2 "$OUT/SpaceGrotesk-Variable.woff2"
subset node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2 "$OUT/IBMPlexSans-Regular.woff2"
subset node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2 "$OUT/IBMPlexSans-SemiBold.woff2"

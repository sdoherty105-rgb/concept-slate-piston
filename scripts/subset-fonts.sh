#!/usr/bin/env bash
# Rebuilds the subset web fonts in app/fonts from the Fontsource packages (SIL OFL 1.1).
# Needs: npm i --no-save @fontsource-variable/space-grotesk @fontsource/ibm-plex-sans, and pip install fonttools brotli
# The subsets are deliberately small: Latin only, no hinting, kerning only, and the display
# font's weight axis is limited to the 400-700 range the site uses. Fewer font bytes keep
# mobile LCP down.
set -euo pipefail
UNICODES="U+0020-007E,U+00A0,U+00B0,U+00B1,U+00B7,U+00D7,U+00D8,U+00E9,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026"
OUT="app/fonts"
TMP="$(mktemp -d)"
mkdir -p "$OUT"
subset() {
  python3 -m fontTools.subset "$1" --unicodes="$UNICODES" --flavor=woff2 --layout-features='kern' \
    --no-hinting --desubroutinize --name-IDs= --no-notdef-outline --output-file="$2"
}
python3 -m fontTools.varLib.instancer node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2 wght=400:700 -o "$TMP/sg.woff2"
subset "$TMP/sg.woff2" "$OUT/SpaceGrotesk-Variable.woff2"
subset node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2 "$OUT/IBMPlexSans-Regular.woff2"
subset node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2 "$OUT/IBMPlexSans-SemiBold.woff2"

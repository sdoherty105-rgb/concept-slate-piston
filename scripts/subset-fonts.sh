#!/usr/bin/env bash
# Rebuilds the subset web fonts in app/fonts from the Fontsource packages (SIL OFL 1.1).
# Needs: npm i --no-save @fontsource/barlow-semi-condensed @fontsource/ibm-plex-mono @fontsource/ibm-plex-sans
# and pip install fonttools brotli
set -euo pipefail
UNICODES="U+0020-007E,U+00A0,U+00B0,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026"
OUT="app/fonts"
mkdir -p "$OUT"
subset() {
  python3 -m fontTools.subset "$1" --unicodes="$UNICODES" --flavor=woff2 --layout-features='kern' \
    --no-hinting --desubroutinize --name-IDs='*' --output-file="$2"
}
subset node_modules/@fontsource/barlow-semi-condensed/files/barlow-semi-condensed-latin-600-normal.woff2 "$OUT/BarlowSemiCondensed-600.woff2"
subset node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2 "$OUT/IBMPlexMono-500.woff2"
subset node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2 "$OUT/IBMPlexSans-Regular.woff2"
subset node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2 "$OUT/IBMPlexSans-SemiBold.woff2"

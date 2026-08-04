#!/usr/bin/env bash
# Empaqueta la extensión para subirla a la Chrome Web Store.
# El manifest.json queda en la raíz del zip, que es como lo exige el panel.
set -euo pipefail

VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' manifest.json | cut -d'"' -f4)
OUT="dist/dark-veil-store-${VERSION}.zip"

mkdir -p dist
rm -f "$OUT"

zip -qr "$OUT" \
  manifest.json src popup icons \
  -x "*.DS_Store" "*/.*"

echo "Listo: $OUT"
unzip -l "$OUT" | tail -3

#!/usr/bin/env bash
# Rebuild the customer page from exported stock-app bottles.
# Usage (from the repo root): build/update.sh build/data/bottles
# Writes build/rushup-order.html (claude.ai page) and index.html (website). Never commit build/data: it holds costs.
set -euo pipefail
BOTTLES="$(cd "$1" && pwd)"
cd "$(dirname "$0")"
node snapshot.js "$BOTTLES" stock.json
node build.js
node site.js
cp site/index.html ../index.html
echo "Built. Changed files:"; git -C .. status --short

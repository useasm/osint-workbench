#!/usr/bin/env bash
# builds the macos .app + .dmg with tauri, installs rust via rustup if it's missing
# output: frontend/src-tauri/target/release/bundle/
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT/frontend"

cyan() { printf "\033[36m%s\033[0m\n" "$1"; }
red() { printf "\033[31m%s\033[0m\n" "$1"; }

command -v node >/dev/null 2>&1 || {
  red "✗ Node.js not found. Install it from https://nodejs.org"
  exit 1
}
cyan "▸ Node $(node -v)"

if ! command -v cargo >/dev/null 2>&1; then
  cyan "▸ Rust not found — installing via rustup…"
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal
fi
# make cargo available in this shell without reopening the terminal
[ -f "$HOME/.cargo/env" ] && source "$HOME/.cargo/env"
command -v cargo >/dev/null 2>&1 || {
  red "✗ cargo is still unavailable. Open a new terminal and run the script again."
  exit 1
}
cyan "▸ $(cargo --version)"

cd "$APP_DIR"

cyan "[1/3] Installing dependencies (npm install)…"
npm install

cyan "[2/3] App icons…"
if command -v python3 >/dev/null 2>&1; then
  python3 scripts/make_icon.py || true
fi
# generate the full tauri icon set from build/icon.png
npx tauri icon build/icon.png >/dev/null 2>&1 || npx tauri icon build/icon.png

cyan "[3/3] Building .app/.dmg (tauri build)…"
npm run app:build

echo
BUNDLE="$APP_DIR/src-tauri/target/release/bundle"
cyan "✓ Done. Output in: $BUNDLE/"
{ ls -1 "$BUNDLE/macos" 2>/dev/null; ls -1 "$BUNDLE/dmg" 2>/dev/null; } | sed 's/^/  • /' || true

# OSINT Workbench — desktop app (macOS, Tauri)

The frontend is wrapped into a native app with **Tauri v2** (a lightweight webview runtime; the final `.app` is many times smaller than an Electron build). It's the same UI as the web version; there is no backend yet.

## Requirements

- **Node.js**
- **Rust**, required by Tauri. If it's missing, `build-app.sh` installs it automatically via `rustup`. Manually: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`.
- Xcode Command Line Tools (`xcode-select --install`).

## Building the `.app` / `.dmg`

```bash
./build-app.sh
```

The script installs Rust (if needed) → runs `npm install` → generates icons → runs `tauri build`.
Output goes to `frontend/src-tauri/target/release/bundle/`:

- `dmg/OSINT Workbench_0.1.0_aarch64.dmg`: the installer image
- `macos/OSINT Workbench.app`: the app itself

> The app is **not code-signed** (personal use). On first launch macOS Gatekeeper may warn you: open it with **right-click → "Open"**.

## Developing inside the app window (with hot reload)

```bash
cd frontend
npm install
npm run app:dev      # tauri dev: starts Vite + a Tauri window with HMR
```

## How it works

- `frontend/src-tauri/`: the native Tauri part
  - `tauri.conf.json`: window (1440×900, dark background), `frontendDist: ../dist`,
    `devUrl: http://localhost:5173`, `beforeBuildCommand: npm run build`
  - `src/main.rs`: entry point, registers the `opener` plugin
  - `Cargo.toml`: Rust dependencies
  - `capabilities/default.json`: permissions (`core:default`, `opener:default`)
  - `icons/`: app icons (generated with `npx tauri icon build/icon.png`)
- `frontend/src/main.tsx`: external links (resource cards, `target="_blank"`) open in the system browser, via `@tauri-apps/plugin-opener` in Tauri and via `window.open` on the web.
- Icon source: `frontend/build/icon.png` (`npm run icon` → `python3 scripts/make_icon.py`).

## Windows / Linux

Build on the target OS: `npm run app:build` produces `.msi/.exe` on Windows and `.AppImage/.deb` on Linux (Tauri picks the bundle targets based on the platform).

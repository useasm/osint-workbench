# OSINT Workbench

A dark, keyboard-friendly desktop workbench for OSINT investigations. It organizes open-source intelligence work into **15 branches** (identity, social media, domains & DNS, web, network, threat intel, vulnerabilities, documents, media, geo, companies, code, breaches, blockchain, analytics), each with sub-branches, functions and a **curated catalog of 150+ free and open-source OSINT tools**. On top of that it has an investigation workspace: cases, entities, findings, relations and global search.

Runs in the browser (Vite) or as a native desktop app (Tauri v2, macOS `.app` / `.dmg`).

> **Status:** the frontend is fully working with demo data. The Go backend and worker are a scaffold (config, logging, data models, DB schema): real connectors and scanning are on the roadmap.

> **Disclaimer:** built as a university cybersecurity project. The tool catalog points to public third-party services. Use it only for legal, authorized and educational purposes (OSINT research, contracted pentesting, CTFs). Follow each service's terms and the applicable law.

## Features

- **OSINT modules hub**: 15 branches → sub-branches → functions, generated from a single data file (`frontend/src/data/osint.ts`)
- **Curated tool catalog**: 150+ free / freemium / open-source resources, filterable per branch; links open in the system browser
- **Investigation workspace**: dashboard, cases list and case detail (overview, entities, findings, relations, reports)
- **Entities & findings**: tables with search, filters, severity / status badges, confidence bars
- **Global search** across scopes (email, phone, domain, IP, name, …) with scanning / empty / no-result states
- **Auth screens**: sign in, register with password strength meter, profile
- **UI**: custom component kit (Button, Card, Table, Modal, Toast, Tabs, Select, Input, Badge), CRT-style scanlines and glow effects, responsive sidebar
- **Desktop app** via Tauri v2 with the `opener` plugin and a generated app icon

## Tech stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, TypeScript 5, Vite 5, Tailwind CSS 3, React Router 6, lucide-react, clsx |
| Desktop | Tauri v2 (Rust), `@tauri-apps/plugin-opener` |
| Backend (WIP) | Go 1.23, chi, pgx, GORM, golang-migrate, zap, viper, JWT |
| Worker (WIP) | Go, asynq job queue, Redis |
| Database | PostgreSQL 16 (initial schema in `backend/migrations`) |
| DevOps | Docker, Docker Compose |

## Project structure

```
.
├── frontend/              # React + TypeScript + Vite app
│   ├── src/
│   │   ├── data/osint.ts  # OSINT taxonomy + tool catalog (source of truth)
│   │   ├── mocks/         # demo data for cases, entities, findings
│   │   ├── pages/         # Dashboard, Modules, Cases, Entities, Findings, Search, Auth…
│   │   └── components/    # UI kit + layout (Sidebar, Header)
│   ├── src-tauri/         # Tauri v2 desktop shell (Rust)
│   └── scripts/make_icon.py
├── backend/               # Go REST API scaffold (config, logger, models, migrations)
├── worker/                # Go background worker scaffold
├── docker/demo-target/    # small demo web app for local testing
├── docker-compose.yml
├── build-app.sh           # one-command macOS .app/.dmg build
└── DESKTOP_APP.md         # desktop build details
```

## Getting started

### Web (development)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Desktop app (macOS)

```bash
./build-app.sh     # installs Rust if needed, builds .app + .dmg
```

Output: `frontend/src-tauri/target/release/bundle/`. See [DESKTOP_APP.md](DESKTOP_APP.md) for details and hot-reload dev mode.

### Adding a tool to the catalog

Append an entry to the `resources` array of the relevant branch in `frontend/src/data/osint.ts`:

```ts
{ name: 'Tool name', url: 'https://example.com', description: 'What it does', tier: 'opensource' }
```

Menus, counters and pages update automatically.

## Roadmap

- [ ] Backend REST API: auth (JWT), cases, entities, findings
- [ ] Wire the frontend to the API instead of mock data
- [ ] Worker connectors (DNS, WHOIS/RDAP, HTTP headers, TLS, crt.sh)
- [ ] Link graph view and risk scoring
- [ ] PDF / CSV / JSON report export
- [ ] Windows and Linux builds

## License

[MIT](LICENSE)

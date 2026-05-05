# Formula Insights — Project Context for Claude

> This file provides context about the current state of the project for AI assistants. Update it as the project evolves.

---

## Project Overview

**Formula Insights** is an F1 analytics dashboard built for Vodacom Work. The goal is to deliver a rich, interactive data visualization experience for Formula 1 race data — surfacing driver performance, race results, telemetry, team standings, and related analytics in a polished, premium dark-mode UI.

---

## Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Framework     | React 19 + TypeScript             |
| Build Tool    | Vite 8                            |
| Styling       | Tailwind CSS v3 + Vanilla CSS     |
| Charting      | Recharts v3, D3.js v7             |
| Icons         | Lucide React                      |
| Routing       | React Router DOM v7               |
| Font          | Inter (Google Fonts)              |
| Linting       | ESLint 10 + TypeScript ESLint     |

---

## Design System

The design system is established in `tailwind.config.js` with the following custom color tokens:

| Token             | Value       | Usage                   |
|-------------------|-------------|-------------------------|
| `background`      | `#0a0a0a`   | Page background         |
| `surface`         | `#111111`   | Section/layout surfaces |
| `card`            | `#1a1a1a`   | Card backgrounds        |
| `border`          | `#2a2a2a`   | Borders and dividers    |
| `accent`          | `#00d2ff`   | Primary accent (cyan)   |
| `text-primary`    | `#ffffff`   | Primary text            |
| `text-secondary`  | `#888888`   | Muted/secondary text    |

**Base styles** (`src/index.css`):
- Tailwind directives loaded (`base`, `components`, `utilities`)
- Body background locked to `#0a0a0a`
- Inter font set as the global font family

---

## Current Project Status

### ✅ Done

- [x] Project scaffolded with Vite + React + TypeScript
- [x] Tailwind CSS v3 configured with F1-themed dark-mode color palette
- [x] Inter font integrated via Google Fonts in `index.html`
- [x] Page title set to **"Formula Insights"**
- [x] Routing library (`react-router-dom`) installed and ready
- [x] Charting libraries (`recharts`, `d3`) installed and ready
- [x] Barrel export files stubbed for `src/components/` and `src/pages/`
- [x] ESLint configured for TypeScript + React

### 🚧 In Progress / Not Yet Started

- [ ] `App.tsx` — Still showing Vite default boilerplate; needs to be replaced with the actual application shell (layout, router, nav)
- [ ] `src/pages/` — No pages created yet (Dashboard, Race Results, Driver Stats, etc.)
- [ ] `src/components/` — No components created yet (Navbar, Sidebar, KPI Cards, Charts, etc.)
- [ ] Data layer — No API integration or mock data defined yet
- [ ] `App.css` — Currently contains Vite default styles; needs to be replaced or cleared

---

## Planned Architecture

```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── layout/          #   Navbar, Sidebar, PageWrapper
│   ├── charts/          #   LapTimeChart, PositionChart, TelemetryChart
│   └── cards/           #   KPICard, DriverCard, TeamCard
├── pages/               # Route-level page components
│   ├── Dashboard.tsx    #   Home / overview page
│   ├── RaceResults.tsx  #   Race-by-race results
│   ├── DriverStats.tsx  #   Driver performance deep-dive
│   └── TeamStandings.tsx
├── data/                # Mock data / API hooks (to be created)
├── hooks/               # Custom React hooks
├── App.tsx              # App shell with Router + Layout
├── index.css            # Global styles (Tailwind)
└── main.tsx             # Entry point
```

---

## Key Files

| File                    | Purpose                                    |
|-------------------------|--------------------------------------------|
| `index.html`            | HTML entry point, font preloads, page title |
| `src/main.tsx`          | React DOM render entry                     |
| `src/App.tsx`           | ⚠️ Currently Vite boilerplate — needs replacement |
| `src/App.css`           | ⚠️ Currently Vite boilerplate styles        |
| `src/index.css`         | Global Tailwind + body styles              |
| `tailwind.config.js`    | Design tokens (colors, theme)              |
| `vite.config.ts`        | Vite build config                          |
| `tsconfig.app.json`     | TypeScript config for app source           |

---

## Next Steps (Priority Order)

1. **Replace `App.tsx`** with a proper layout shell — React Router `<BrowserRouter>`, a persistent `<Navbar>` / `<Sidebar>`, and `<Routes>` for page rendering.
2. **Create the Dashboard page** (`src/pages/Dashboard.tsx`) with KPI cards and summary charts.
3. **Build reusable components** — start with `KPICard`, `Navbar`, and a chart wrapper.
4. **Wire up mock data** — define TypeScript interfaces for race, driver, and team data; populate with realistic F1 data.
5. **Expand to additional pages** — Race Results, Driver Stats, Team Standings.
6. **Polish & animations** — hover effects, smooth transitions, loading states.

---

## Developer Notes

- Run locally: `npm run dev` (Vite dev server, HMR enabled)
- Build: `npm run build` (TypeScript compile + Vite production bundle)
- Lint: `npm run lint`
- The project is **not** yet connected to any real F1 API (e.g., Ergast, FastF1). All data should be mocked initially.
- The accent color `#00d2ff` (electric cyan) is the primary brand color — use it consistently for highlights, active states, and data emphasis.

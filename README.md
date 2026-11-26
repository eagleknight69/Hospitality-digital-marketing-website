# Camera Cloud — Luxury Hospitality Digital Marketing Platform

[![CI](https://github.com/eagleknight69/Hospitality-digital-marketing-website/actions/workflows/ci.yml/badge.svg)](https://github.com/eagleknight69/Hospitality-digital-marketing-website/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Angular 21](https://img.shields.io/badge/Angular-21_SSR-DD0031.svg)](https://angular.dev/)
[![Node.js 22](https://img.shields.io/badge/Node.js-22_LTS-339933.svg)](https://nodejs.org/)

A full-stack **Angular 21 (SSR + Zoneless)** and **Express 5** web application built for luxury hospitality digital marketing, visual production showcases, direct consultation scheduling, and **Gemini-powered AI Hospitality Growth Audits**.

> **Live Production Website:** [https://cameracloud.co.in/](https://cameracloud.co.in/)
>
> A streamlined production version of this website is hosted live at **[cameracloud.co.in](https://cameracloud.co.in/)**. This repository contains the expanded full-stack edition — adding the interactive **Gemini AI Growth Audit Engine** (`POST /api/audit`), multi-step consultation booking workflow (`POST /api/consult`), SSR Express API layer, Docker setup, and automated CI/test suite.

---

## Live Site vs. This Repository

| Capability | Live Production ([cameracloud.co.in](https://cameracloud.co.in/)) | This Repository (Full-Featured Edition) |
| --- | :---: | :---: |
| Editorial Hospitality Agency Landing Page | Yes | Yes |
| Interactive Portfolio, Category Filters & Reels Showcase | Streamlined | Full Lightbox, Video Carousel & Vertical Reels |
| Multi-Step Consultation Booking Modal (`POST /api/consult`) | Basic Contact | Full 3-Step Interactive Booking & Confirmation Flow |
| Gemini AI Luxury Digital Growth Audit (`POST /api/audit`) | — | Yes (Live Gemini API + Graceful Demo Fallback) |
| Angular 21 SSR + Express 5 Containerized Runtime | — | Yes (`Dockerfile` + `docker-compose.yml`) |
| Automated Lint, Unit/API Tests & GitHub Actions CI | — | Yes (ESLint + Vitest + Docker Build Check) |

---

## Key Features

- **Gemini AI Growth Audit Engine (`/api/audit`)**: Accepts property metadata (hotel name, property category, location, target guest profile, and primary digital challenge) and generates a structured 4-chapter luxury digital marketing blueprint using `@google/genai`. Falls back gracefully to a curated preview audit when `GEMINI_API_KEY` is not set.
- **3-Step Consultation & Audit Modal**: Signal-driven Angular Reactive Form flow allowing hoteliers to pick a consultation slot, provide property context, run an instant AI growth audit, and lock a booking with a generated meeting ID (`CC-...`).
- **Interactive Media Portfolio (`/portfolio`)**: Category-filtered case studies with lightbox navigation, animated hospitality metrics, intersection-observed 4K video showcase, and vertical video reels.
- **Server-Side Rendering & Prerendering**: Built with Angular 21's zoneless change detection, standalone components, `@angular/ssr`, and an Express 5 Node server with a `/api/health` readiness endpoint.

---

## Tech Stack

- **Frontend**: Angular 21 (Standalone Components, Signals, Zoneless Change Detection), TypeScript 5.9, Tailwind CSS v4, Angular Material Icons
- **Backend / SSR**: Express 5, `@angular/ssr/node`, Google GenAI SDK (`@google/genai`)
- **Testing & Quality**: Vitest 4, Angular TestBed, ESLint 9 + `angular-eslint` + `typescript-eslint`
- **DevOps**: Multi-stage Docker (`node:22-alpine`, non-root runtime, built-in healthcheck), Docker Compose, GitHub Actions CI

---

## Quick Start (1-Command Docker Run)

Run the full production SSR build locally in one command — no local Node.js installation or API key required (preview audit mode works out of the box):

```bash
docker compose up --build
```

Then open [http://localhost:4000](http://localhost:4000) (health endpoint: [http://localhost:4000/api/health](http://localhost:4000/api/health)).

To enable live Gemini AI audit generation, copy `.env.example` to `.env` and add your API key before starting Compose:

```bash
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=...
docker compose up --build
```

---

## Local Development (Without Docker)

**Prerequisites:** Node.js `>= 20.19` (Node 22 LTS recommended) and `npm`.

```bash
# 1. Install dependencies
npm ci

# 2. Configure environment variables (optional for fallback mode)
cp .env.example .env

# 3. Start the Angular dev server (http://localhost:3000)
npm run dev
```

To build and run the SSR production bundle locally:

```bash
npm run build
npm run serve:ssr:app
# Serves on http://localhost:4000
```

---

## Environment Variables

See [`.env.example`](.env.example) for a clean template:

| Variable | Required | Default | Description |
| --- | :---: | --- | --- |
| `PORT` | No | `4000` | Port for the Express SSR server |
| `GEMINI_API_KEY` | No | — | Google Gemini API key for live `/api/audit` generation (uses curated fallback report when unset) |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Gemini model ID used by the Growth Audit Engine |

---

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health check and Gemini configuration status |
| `POST` | `/api/audit` | Generates a 4-chapter hospitality digital marketing growth audit (Gemini API or curated fallback) |
| `POST` | `/api/consult` | Validates contact & property fields and returns a consultation confirmation with meeting ID |

---

## Testing & Linting

```bash
# Run ESLint across TypeScript files and Angular HTML templates
npm run lint

# Run Angular unit tests (Vitest)
npm run test:unit

# Run Express API integration tests (Vitest / Node)
npm run test:api

# Run the complete CI test suite
npm run test:ci
```

---

## Project Structure

```text
.
├── .github/workflows/ci.yml   # GitHub Actions CI (lint, unit + API tests, SSR build, Docker build)
├── Dockerfile                 # Multi-stage production Node 22 Alpine image (non-root)
├── docker-compose.yml         # 1-command local production run
├── .env.example               # Clean environment variable template
├── src/
│   ├── api.routes.ts          # Express REST API (/api/health, /api/audit, /api/consult)
│   ├── server.ts              # Angular SSR + Express server entry point
│   └── app/
│       ├── core/              # Layout (navbar, footer) and singleton services (API, booking, toast, SEO)
│       ├── features/          # Lazy-loaded Home & Portfolio feature modules
│       └── shared/            # Standalone Consultation Modal, AI Audit component, and brand Logo
└── tests/
    └── api.routes.spec.ts     # Express API integration tests
```

---

## License

This project is licensed under the [MIT License](LICENSE).

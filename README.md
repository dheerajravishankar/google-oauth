# Auth Starter

A ready-to-clone React + Node + Postgres starter with Google SSO (cookie sessions).

Use this as a base for any new app: clone it, rename the branding, add your features.

## Stack

- **Frontend:** Vite, React, TypeScript
- **Backend:** Express, TypeScript, Passport Google OAuth
- **Database:** Postgres (Docker) + Prisma
- **Sessions:** `express-session` + `connect-pg-simple` (httpOnly cookie)

## Prerequisites

- Node.js 20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (provides the `docker` CLI for Postgres)
- A Google Cloud OAuth 2.0 Web client

## Google OAuth setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an OAuth client ID (application type: **Web application**)
3. Add authorized JavaScript origin: `http://localhost:5173`
4. Add authorized redirect URI: `http://localhost:4000/auth/google/callback`
5. Copy the Client ID and Client Secret into `.env`

## Quick start

```bash
git clone <your-repo-url> auth-starter
cd auth-starter
cp .env.example .env
# Edit .env with GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and a strong SESSION_SECRET

npm install
npm run db:up          # requires Docker Desktop running
npm run db:migrate     # applies Prisma migrations
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health: http://localhost:4000/health

If `docker` is not available, install/start Docker Desktop first, then re-run `npm run db:up`.

## Make it yours

Before building your product on top of this template:

1. Rename the package in root `package.json` (`"name": "auth-starter"`)
2. Update the UI brand text in `frontend/src/pages/Login.tsx` and `Home.tsx`
3. Update the page title in `frontend/index.html`
4. Optionally rename Postgres credentials in `docker-compose.yml` and `.env` / `.env.example`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start backend + frontend |
| `npm run db:up` | Start Postgres container |
| `npm run db:down` | Stop Postgres container |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run build` | Build both packages |

## Auth endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/google` | Start Google sign-in |
| GET | `/auth/google/callback` | OAuth callback |
| GET | `/auth/me` | Current user (or 401) |
| POST | `/auth/logout` | Destroy session |
| GET | `/health` | Health check |

## Project structure

```
auth-starter/
├── backend/          # Express API + Prisma
├── frontend/         # Vite React app
├── docker-compose.yml
└── .env.example
```

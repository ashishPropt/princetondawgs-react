# Princeton Dawgs — React + Node/Express + PostgreSQL

Full-stack rewrite of the Princeton Dawgs PHP/MySQL site.

## Stack
- **Frontend**: React 18 + Vite + React Router v6 + Tailwind CSS
- **Backend**: Node.js + Express + pg (node-postgres)
- **Database**: PostgreSQL 15
- **Auth**: JWT (access + refresh tokens)
- **Deploy**: Vultr VPS via GitHub Actions CI/CD

## Project Structure
```
princetondawgs-react/
├── client/          # React/Vite frontend
├── server/          # Node/Express API
├── database/        # PostgreSQL schema + seed
└── .github/         # CI/CD workflows
```

## Local Development
```bash
npm run install:all
npm run dev
```

## Environment Variables — server/.env
```
DATABASE_URL=postgresql://dawgs:password@localhost:5432/princetondawgs
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-refresh
PORT=3001
CLIENT_URL=http://localhost:5173
```

## Deployment
Push to `main` triggers GitHub Actions → SSH deploy to Vultr VPS.

Required GitHub Secrets:
- `VULTR_HOST` — VPS IP
- `VULTR_USER` — SSH user
- `VULTR_SSH_KEY` — Private SSH key (base64)
- `DATABASE_URL` — Production PostgreSQL URL
- `JWT_SECRET` / `JWT_REFRESH_SECRET`

# Thryve Co.

Creative agency website — Next.js 16 + Payload CMS 3.

## Stack

- **Next.js** App Router
- **Payload CMS** (Postgres, optional Vercel Blob)
- **Tailwind CSS v4**

## Local setup

```bash
cp .env.local.example .env.local
# Edit .env.local — set PAYLOAD_SECRET and DATABASE_URL

createdb thryveco   # if using local Postgres
npm install
npm run db:migrate
npm run generate:types
npm run dev
```

Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — create the first user on initial visit.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run Payload migrations |
| `npm run generate:types` | Regenerate `payload-types.ts` |
| `npm run vercel-build` | Migrate + build (Vercel) |

## Environment

See `.env.local.example` for required variables.

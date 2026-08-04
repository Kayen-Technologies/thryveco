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
| `npm run db:clone-to-prod` | Replace the production database with a copy of local |
| `npm run media:upload` | Upload `public/media` files referenced by the DB into Vercel Blob |
| `npm run prod:verify` | Compare production against local (row counts + Blob coverage) |

## Environment

See `.env.local.example` for required variables.

## Deploying to Vercel

### One-time project setup

1. Import the repo at [vercel.com](https://vercel.com). Next.js is auto-detected.
2. Set **Build Command** to `npm run vercel-build` so migrations run before the build.
3. Create a **Blob** store under Storage and connect it (injects `BLOB_READ_WRITE_TOKEN`).
4. Add the environment variables from `.env.local.example` with production values.
   `NEXT_PUBLIC_SERVER_URL` and `NEXT_PUBLIC_SITE_URL` must be the live origin
   (e.g. `https://thryveco-wheat.vercel.app`), **exact match**, no trailing slash.
   If these still say `https://your-domain.vercel.app`, admin writes fail with
   "You are not allowed to perform this action" because CSRF drops the auth cookie.

### Seeding production with local content

The migration chain cannot be replayed from an empty database: several early
migrations seed content through the Payload local API, which builds its queries
from the *current* config, so they reference tables that later migrations create.
Production is therefore baselined from a copy of local rather than migrated from
scratch.

Create `.env.production.local` (gitignored) with the production values:

```bash
DATABASE_URL=postgresql://...          # production Postgres
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

Then:

```bash
CONFIRM=WIPE_PROD npm run db:clone-to-prod   # drops + replaces the prod schema
npm run media:upload -- --dry-run            # preview the Blob transfer
npm run media:upload                         # upload the media files
npm run prod:verify                          # confirm parity
```

The dump includes `payload_migrations`, so `payload migrate` is a no-op on the
next deploy and future migrations apply on top of this baseline.

Media is served through `/api/media/file/<filename>`, which the Blob adapter
resolves by filename. Blob keys must match the `filename` column exactly — the
adapter runs with `addRandomSuffix` disabled and no prefix.

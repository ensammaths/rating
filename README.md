# ENSAM MATHS · Session Feedback

Anonymous end-of-session feedback for the ENSAM MATHS club.

- **`/`**: admin dashboard. Create a session, copy its link or show a QR code, see all results.
- **`/s/<id>`**: the student page. One rating (5 faces) plus two optional comments, about 20 seconds.
- **`/results/<id>`**: per-session average, distribution and comments, plus CSV export. Refreshes live every 10 s.

Students are anonymous; the browser only remembers locally that it already answered.

The dashboard and results are protected by a single admin password (`ADMIN_PASSWORD`).
Student links (`/s/<id>`) need no password. If `ADMIN_PASSWORD` is not set, the dashboard
is open locally but locked in production.

## Run locally

```bash
npm install
npm run dev
```

Without database env vars the app uses an in-memory store (data is lost on restart).

## Deploy to Vercel

1. Push this folder to a GitHub repo and **Import** it at <https://vercel.com/new> (or run `npx vercel`).
2. In the Vercel project, open **Storage → Create / Connect → Upstash for Redis** (free tier is plenty) and connect it to the project.
   This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
3. In **Settings → Environment Variables**, add `ADMIN_PASSWORD` with the password you want for the dashboard.
4. **Redeploy** so the new env vars are picked up. The yellow "Running without a database" banner should be gone.

Any Upstash Redis database works. You can also set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` yourself (see `.env.example`).

## Data layout (Redis)

| Key | Type | Content |
| --- | --- | --- |
| `fb:sessions` | sorted set | session ids by creation time |
| `fb:session:<id>` | JSON | `{ id, title, createdAt, open }` |
| `fb:responses:<id>` | list | `{ rating, liked, improve, createdAt }` |

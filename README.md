# AI Education Hub

Static, GitHub-managed website for curated AI education news, research, resources, and tools.

## Local development

```bash
pnpm install
pnpm dev
```

## Content workflow

Production content lives in `client/public/data`. The scheduled GitHub Action runs every day at 06:00 Asia/Shanghai, adds only unseen URLs, and commits changed JSON files. Vercel then deploys the commit automatically.

To run the same update manually:

```bash
pnpm content:update
```

The original CSV exports can be regenerated into JSON with `pnpm content:import`; CSV exports are intentionally ignored because they are migration artifacts.

There is no public admin route, authentication service, application database, or Manus runtime dependency.

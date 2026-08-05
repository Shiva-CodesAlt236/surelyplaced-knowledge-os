# Deployment Guide — SurelyPlaced Knowledge OS

**Status:** Production Deployment Standard
**Applies to:** SurelyPlaced Knowledge OS (Career Advisor Academy)
**Target Platform:** Vercel / Node.js Serverless Container (SSG + Dynamic Search)
**Last updated:** 2026-08-04

---

## 1. Prerequisites & Specifications

| Property | Requirement |
|---|---|
| **Node.js Version** | `>= 18.18.0` (Recommended: Node 20.x LTS) |
| **Package Manager** | `pnpm` v11.x (or `npm` / `yarn` compatible) |
| **Build Engine** | Next.js Webpack Engine (`pnpm build --webpack`) |
| **Output Type** | Next.js SSG / Hybrid Serverless (`.next`) |

> **Note on Build Engine:** Always compile using the `--webpack` flag (`pnpm build --webpack`). The host Windows Application Control policy blocks native SWC node bindings (`swc-win32-x64-msvc.node`), making the Webpack engine mandatory.

---

## 2. Installation & Local Development

### Installation Command
```bash
pnpm install
```

### Local Development Server
```bash
pnpm dev
```
Access the application at `http://localhost:3000`.

### Linting & Type Checking
```bash
pnpm lint
```

---

## 3. Production Build Command

```bash
pnpm build --webpack
```

This command executes:
1. `eslint .` (Linting across all routes and components)
2. `next build "--webpack"` (MDX parsing, TypeScript compilation, Orama search index generation, and static page rendering for 348 pages)

---

## 4. Production Deployment (Vercel)

### Recommended Vercel Settings

- **Framework Preset:** Next.js
- **Build Command:** `pnpm build --webpack`
- **Install Command:** `pnpm install`
- **Output Directory:** `.next` (default)
- **Node.js Version:** `20.x`

### Environment Variables

No mandatory environment variables are required for standard static generation or local search. Optional variables for custom domain routing or telemetry:

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Optional | Canonical URL of the production web deployment | `https://academy.surelyplaced.com` |
| `CI` | Optional | Set to `true` during CI/CD build runs | `true` |

---

## 5. Deployment Verification Checklist

1. **Build Gate:** Verify `pnpm build --webpack` exits with code `0`.
2. **Page Count Gate:** Confirm 348 static pages are generated during build.
3. **Lint Gate:** Confirm 0 ESLint errors or warnings.
4. **Type Check Gate:** Confirm 0 TypeScript compilation errors.
5. **Search Index Gate:** Confirm `/api/search` Orama index renders results across all content pages.

---

## 6. Rollback Procedure

If a production regression occurs post-deployment:

### Instant Vercel Rollback
1. Navigate to the Vercel Dashboard -> **Deployments**.
2. Locate the last known good deployment commit (e.g. `d353704` or `5ad2256`).
3. Click `...` -> **Promote to Production**.

### Git Rollback
```bash
git checkout main
git revert <faulty-commit-hash>
git push origin main
```
Vercel will automatically trigger a clean build and deploy the reverted state.

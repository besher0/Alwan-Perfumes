# 🌸 علوان للعطور — Alwan Perfumes

**React Native / Expo SDK 58 + NestJS 12 + PostgreSQL + Prisma**

A native-first RTL tablet/phone app for the perfume shop owner. This repository is the **working source-code starting point** converted from the supplied responsive HTML prototype, not a finished deployed production app.

- `mobile/` — React Native app (no WebView), Almarai typography, real fragrance note images and floral artwork from the approved design.
- `backend/` — NestJS JWT-protected API with Prisma models, initial migration and seed.
- `docs/ANALYSIS_AR.md` — detailed Arabic UX / data / analytics analysis.
- `docs/API.md` — API routes and request/response examples.
- `docs/reference-design.html` — original HTML prototype for side-by-side visual review.
- `render.yaml` — Render Blueprint for the **backend only**.
- `docs/DEPLOY_RENDER_AR.md` — خطوة بخطوة نشر الـAPI على Render وربط Expo بـNeon.

## Backend — التشغيل

Requirements: **Node.js 22.13+**, npm, PostgreSQL 14+ (local Docker or Neon). NestJS 12 and Expo 58 both support modern Node 22. Use a new empty DB for this new project; do NOT point at another application's production database.

```bash
# Optional local PostgreSQL (from repository root):
docker compose up -d

cd backend
cp .env.example .env  # Windows PowerShell: Copy-Item .env.example .env
# EDIT .env: DATABASE_URL, JWT_SECRET (>= 32 random chars), OWNER_USERNAME, OWNER_PASSWORD (>= 12 chars)
npm install
npm run prisma:generate
npm run db:deploy
npm run db:seed
npm run start:dev
```

API health check: `http://localhost:3001/api/health`.

The seed adds fragrance notes and creates/updates the owner login. Set `SEED_DEMO=true` **only** if you want two sample customers for testing. Re-running seed resets the owner password to `OWNER_PASSWORD` (intentional and documented).

For Neon, replace `DATABASE_URL` with the project connection URL, enable TLS according to Neon instructions, then run the same migration and seed commands. Never commit `.env` or expose JWT secrets or Neon credentials in the mobile app.

## Expo mobile — التشغيل

```bash
cd mobile
cp .env.example .env  # Windows PowerShell: Copy-Item .env.example .env
# Set EXPO_PUBLIC_API_URL to a reachable server IP + /api, NOT localhost on physical phone
npm install
npx expo install --fix
npm run start
```

Example when testing on the same Wi-Fi:
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:3001/api
```
Replace `192.168.1.100` with the computer's LAN IP (e.g., `ipconfig` on Windows). Ensure TCP port 3001 is reachable through your firewall. For production configure a real **HTTPS** domain, and rebuild/restart Metro after changing `.env`.

Expo SDK 58 may require the corresponding **Expo Go** version or a **development build** on your phone/tablet. If Expo Go is not yet compatible, use a development build; do not downgrade project packages randomly. Expo guide: https://docs.expo.dev/develop/development-builds/introduction/

No actual font file is included in this repository: the Almarai variants are installed through the npm package `@expo-google-fonts/almarai` and loaded by Expo.

## Quick functional checklist

1. `GET /api/health` returns status ok.
2. Log in with the owner credentials configured in backend `.env`.
3. Create a customer and try to create another with the same phone (must show conflict).
4. Create a purchase, select multiple photo notes, select one as primary, choose 1–5 stars, and save.
5. Open that customer's profile; verify the new purchase and the date are present.
6. Open that customer's taste analytics; verify counts and averages; switch to another customer and confirm separation.
7. Tap WhatsApp share; review the message, then choose whether to send it.
8. Rotate the tablet; verify note cards and floral background stay visible and legible; test mobile portrait.
9. Log out and confirm customer data is not visible without the token.

### Known scope / before launch

This is a substantial starter implementation, but **dependency installation, database migration against your real database, Android/iOS builds, and on-device end-to-end testing were not run** in this environment. Before production: verify migrations against Neon, integration tests, login rate limits at proxy, backups, TLS, secure owner password rotation, access/audit logging, privacy consent, a paginated customer-list and purchase-history approach for larger datasets, and physical tablet UI regression testing.

## Technical notes

- Customer records use phone numbers as unique identifiers for deduplication (database primary key is UUID).
- Purchase notes and customer's declared favorite notes are separate join tables.
- Analytics are per customer, computed from actual purchases with every note counted once per purchase; `avgRating` is the average stars of purchases containing that note.
- Pressing 'save and share' saves the purchase in the backend **first**, then opens a WhatsApp composer. Sending is never automatic.
- Colors / floral art / imagery reflect the existing approved HTML design, but native UI spacing should be fine-tuned on target tablets.
Study

A friendly AI study tutor you can run as a website and install like an app (PWA).
Dark black / grey / navy theme, made for phones. **No OpenAI / ChatGPT is used anywhere.**

**Phone only? Read `GUIDE.md` first.** It has every step, one by one.

## What it does

- Sign up / log in (email + password). Works on any phone or computer. Questions, plan and codes follow the account.
- **20 free questions** (change with `FREE_QUESTIONS`). When they run out, a window asks for a code.
- **Redeem codes** (made by you at `/admin.html`):
  - `PLUS10` adds 10 questions
  - `PRO` unlocks Pro features + bonus questions (`PRO_QUESTIONS`, default 200)
  - `UNLIMITED_PRO` unlimited questions + all Pro features
- Boards (CBSE, ICSE, ISC, GSEB, Goa, Maharashtra, Karnataka, Tamil Nadu, Kerala, UP, Other state, IGCSE, IB, College), class 6-12 / UG / PG, subjects, chapter, 6 answer languages.
- Modes: Explain simply, Step-by-step solve, Quick revision notes, Practice quiz (answers hidden until you tap), Exam tips.
- **Pro:** photo questions, diagrams, short videos, "Understand deeply" with sources (needs a Perplexity key, otherwise Gemini answers), flashcards, 7-day planner, saved notes with search, print, longer answers, streak counter.
- Voice: mic button, and "Hey Study" hands-free mode. Works only while the app is open and the screen is on. No background listening. Safari/iPhone support is partial.

## The AIs (keys live only on the server)

| Job | Provider | Env vars |
|---|---|---|
| Chat, photo, diagrams, video | **Gemini** (main) | `GEMINI_API_KEY`, `GEMINI_MODEL` |
| "Understand deeply" + sources (optional) | Perplexity | `PERPLEXITY_API_KEY` |
| Backup chat if Gemini is busy/missing | Any OpenAI-compatible endpoint (a free-tier provider, or your own model) | `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL` |

If a key is missing, that feature shows a clear, friendly message instead of crashing.

## Run on a computer (optional)

```
npm install
cp .env.example .env      # then edit .env
node server.js
```
Open http://localhost:3000 . Make codes: `node tools/make-codes.js --type PRO --format strong --count 5`

## All settings

See `.env.example`. Most important: `GEMINI_API_KEY`, `ADMIN_KEY`, `JWT_SECRET`.
Cost guards: `USER_DAILY_CAP` (default 60), `GLOBAL_DAILY_CAP` (1500), `IMAGE_DAILY_CAP` (5), `VIDEO_DAILY_CAP` (1). Counts reset each day (UTC).

## Files

```
server.js                 the whole backend
package.json              5 dependencies only
.env.example  .gitignore  Dockerfile  LICENSE
README.md GUIDE.md SECURITY.md
tools/make-codes.js       make codes from a computer
generate_icons.py         makes the PNG icons
public/index.html         the app
public/admin.html         the code maker (phone friendly)
public/privacy.html       privacy policy template
public/manifest.webmanifest  public/sw.js  public/offline.html   (PWA)
public/icons/             icon-192.png icon-512.png maskable-512.png apple-touch-icon.png
```

## Important honest limits

- **Free hosting can erase files.** Accounts, notes and codes are stored in `data/db.json` (written safely, atomically). On free hosts (like Render free) that file is **deleted when the service redeploys or restarts**. Before real customers, move to Postgres (or a paid persistent disk). Only `server.js` talks to the database (the `loadDb`/`saveDb` functions and the `db` object), so that is the one place to change.
- **Payments are NOT built in.** The paywall shows a placeholder note. Add a Razorpay/Stripe webhook that, after verifying the payment signature, calls `mintCode('PRO','strong')` (search for `PAYMENT HOOK` in `server.js`) and shows the code to the buyer.
- Gemini free tier has limits that may change. Image and video generation (Veo) are often paid-only, so those can show an error on a free key.
- AI answers can be wrong. Study is not an official board resource.
- Store apps (Google Play / App Store) steps in `GUIDE.md` are **untested**.

## Tests that were run

Automated with stand-in modules and mock Gemini / Perplexity / fallback servers (npm install was not possible in the build sandbox). See the summary that came with this project. Please run a real smoke test after you deploy: sign up, ask a question, make a code at `/admin.html`, redeem it.

## License

MIT, see `LICENSE`.
MD
Name

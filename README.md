# Exam Prep Portal

Teacher uploads lectures (PDF / PowerPoint / Word / text) -> Claude reads them like the teacher -> student studies and practises -> mock tests -> teacher runs and marks the final test.
Works for any subject. Includes PF Lab (Labs 1-7) as ready-made starter content.

## What is in this repo
| Path | Purpose |
|---|---|
| `server.js` | API server: login, documents, AI proxy. Serves the website. |
| `public/index.html` | Page shell (frontend) |
| `public/style.css` | Frontend styles |
| `public/app.js` | Frontend logic: all teacher + student screens, tests, timer, grading |
| `public/shim.js` | Connects the page to the server (login screen, saving, AI calls) |
| `db/schema.sql` | Database table, created automatically on first start |
| `tests/api.test.js` | Checks login and permissions (`npm test`) |
| `render.yaml` | One-click settings for Render hosting |
| `.env.example` | Names of the settings you must provide |

## Deploy (about 15 minutes)
1. **Database (free):** create a project at https://neon.tech and copy the *connection string* (starts with `postgres://`). Any Postgres works.
2. **GitHub:** push this folder to your repository.
3. **Host:** on https://render.com choose *New > Blueprint* (or *Web Service*) and pick the repo. Set the environment variables:
   - `DATABASE_URL` : the Neon string
   - `TEACHER_PASSWORD` : your password
   - `STUDENT_CODE` : the code you will give the student
   - `ANTHROPIC_API_KEY` : from https://console.anthropic.com (AI features cost per use)
   - `SESSION_SECRET` : Render generates it; if not, use a long random string
4. Open the Render link. Teacher: choose Teacher + password. Send the same link and the student code to the student.

## Run on your laptop
```
npm install
cp .env.example .env     # fill it in; leave DATABASE_URL empty to use a local file
export $(grep -v '^#' .env | sed 's/#.*//' | xargs)
npm start                # http://localhost:3000
npm test
```

## Good to know
- Students sign in with their name + the shared code. Two students with the same name would share one record, so use full names.
- Free Render sleeps when idle; the first open can take ~30 seconds. Open the link yourself before the test.
- Data model: documents in one Postgres table (`docs`). Completed attempts keep a copy of their questions, so editing questions never changes old results. A normalised schema is the next step if you need reports across many students.
- Back up: use Neon's built-in branching/export, or `pg_dump $DATABASE_URL > backup.sql`.
- The AI key stays on the server. Never put it in `public/`.

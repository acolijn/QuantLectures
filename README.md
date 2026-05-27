# QuantLectures

A quantum physics learning app for students and teachers. Content is stored in **PocketBase** and rendered with KaTeX. Teachers can import Claude-generated chapters via the web UI without touching the codebase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Backend / DB | PocketBase 0.38+ |
| Math rendering | KaTeX |
| Deployment | Docker + nginx |

---

## Project Structure

```text
QuantLectures/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── ImportChapter.jsx   # Teacher UI: import chapter from Claude
│   │   ├── ChapterView.jsx
│   │   ├── GuidedExercise.jsx
│   │   ├── MathText.jsx            # KaTeX renderer ($...$ and $$...$$)
│   │   ├── Quiz.jsx
│   │   └── Sidebar.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx         # PocketBase auth (teacher / student / guest)
│   ├── data/
│   │   ├── chapter1.js … chapter11.js  # Local seed files (source of truth for seeding)
│   │   └── chapters.js             # Re-exports all chapters for the seed script
│   ├── lib/
│   │   ├── api.js                  # PocketBase CRUD helpers
│   │   └── pocketbase.js           # PocketBase singleton
│   ├── App.jsx                     # Root component, teacher toolbar
│   └── App.css
├── scripts/
│   ├── setup-pocketbase.js         # Create collections + add role field to users
│   ├── seed.js                     # Write chapter JS files → PocketBase
│   └── export-chapter.js           # Pull chapter from PocketBase → local JS file
├── docker-compose.yml
├── Dockerfile
├── .env                            # Not committed — see below
└── README.md
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# URL the browser uses to reach PocketBase (used at Vite build time)
VITE_POCKETBASE_URL=http://localhost:8090

# URL the Node scripts use to reach PocketBase (server-side only)
POCKETBASE_URL=http://localhost:8090

# PocketBase superuser credentials (for setup / seed / export scripts)
PB_ADMIN_EMAIL=admin@example.com
PB_ADMIN_PASSWORD=yourpassword
```

---

## First-Time Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start PocketBase

```bash
# Option A: via Homebrew (macOS)
brew install pocketbase
pocketbase serve --dir ./pb_data

# Option B: via Docker
docker compose up -d pocketbase
```

PocketBase admin UI is at **http://localhost:8090/_/**. Create a superuser account there if you haven't yet.

### 3. Create the database schema

```bash
npm run setup
```

This creates the `chapters` collection and adds a `role` select field (`student` / `teacher`) to the built-in `users` collection.

### 4. Seed all chapters from local JS files

```bash
npm run seed
```

Safe to run multiple times — it upserts by `chapter_number`.

### 5. Start the dev server

```bash
npm run dev
```

App is at **http://localhost:5173/quantlectures/**.

---

## NPM Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run setup` | Create PocketBase collections and schema |
| `npm run seed` | Seed **all** chapters from `src/data/chapter*.js` → PocketBase |
| `npm run seed <N>` | Seed only chapter **N** (e.g. `npm run seed 3`) |
| `npm run export-chapter <N>` | Pull chapter **N** from PocketBase → overwrite `src/data/chapter<N>.js` |

---

## Database Commands

### Seed all chapters
```bash
npm run seed
```

### Seed a single chapter
```bash
npm run seed 3
```

### Export a chapter from PocketBase to a local JS file
Useful before editing with Claude, or to inspect the stored data.
```bash
npm run export-chapter 11
# → writes src/data/chapter11.js
```

### Inspect a chapter directly via the PocketBase API
```bash
curl -s "http://localhost:8090/api/collections/chapters/records?filter=chapter_number=11" \
  | python3 -m json.tool
```

### Save a chapter to a JSON file
```bash
curl -s "http://localhost:8090/api/collections/chapters/records?filter=chapter_number=11" \
  | python3 -m json.tool > /tmp/chapter11.json
```

---

## User Roles

| Role | Access |
|---|---|
| **Guest** (not logged in) | Read all chapters, concepts, exercises, quiz |
| **Student** | Same as guest + login |
| **Teacher** | All of the above + teacher toolbar (edit, new chapter, import via Claude, delete) |

Assign the `teacher` role to a user in the PocketBase admin UI:
**http://localhost:8090/_/** → Collections → users → edit a record → set `role` = `teacher`.

---

## Adding / Importing a Chapter

### Option A: Teacher web UI (recommended)

1. Log in as a teacher
2. Click **⬆️ Importeer via Claude** in the toolbar
3. Copy the generated prompt and paste it into Claude along with your lecture notes
4. Copy Claude's JSON response and paste it into the import modal
5. Set the chapter number and click **Importeer**

### Option B: Manual seed file

1. Create `src/data/chapter<N>.js` following the structure of an existing chapter
2. Import and add it to `src/data/chapters.js`
3. Run `npm run seed <N>`

---

## Chapter Data Structure

```js
{
  id: 11,                     // chapter number
  title: "Quantum Entanglement",
  subtitle: "Short description…",
  formulas: [
    { name: "Bell-toestand", latex: "|\\Phi^{+}\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)" }
  ],
  concepts: [
    { title: "Concept title", content: "Text with $inline$ and $$display$$ LaTeX." }
  ],
  exercises: [
    {
      label: "Opgave 1",
      title: "Exercise title",
      intro: "Introduction text.",
      steps: [
        {
          question: "Step question with $LaTeX$.",
          hints: ["Hint 1.", "Hint 2."],
          answer: ["numeric answer"],   // optional
          solution: ["Step 1.", "$LaTeX$", "Conclusion."]
        }
      ]
    }
  ],
  quiz: [
    {
      question: "Multiple choice question with $LaTeX$?",
      options: ["$A$", "$B$", "C", "D"],
      correct: 1       // 0-based index of the correct option
    }
  ]
}
```

**LaTeX rules:** always wrap in `$...$` (inline) or `$$...$$` (display). Use proper LaTeX commands: `\alpha`, `\frac{a}{b}`, `|\psi\rangle`, `\hat{H}`. Never use plain text like `alpha` or `|psi>`.

---

## Docker Deployment

### Local

```bash
docker compose up -d
```

- App served by nginx at **http://localhost:3010/quantlectures/**
- PocketBase at **http://localhost:8090**
- PocketBase data persisted in `./pb_data/` (not committed to git)

After deploying, run setup and seed once:
```bash
POCKETBASE_URL=http://localhost:8090 \
PB_ADMIN_EMAIL=admin@example.com \
PB_ADMIN_PASSWORD=yourpassword \
npm run setup

npm run seed
```

---

## Remote Server Deployment

### Prerequisites on the server

- Docker + Docker Compose installed
- Git installed
- Port **80** (or whichever you expose) open in the firewall
- A `.env` file on the server (never commit this)

### 1. Clone the repo on the server

```bash
git clone https://github.com/acolijn/QuantLectures.git
cd QuantLectures
```

### 2. Create the `.env` file on the server

```bash
cat > .env << 'EOF'
VITE_POCKETBASE_URL=https://your-server.example.com/pb
POCKETBASE_URL=http://pocketbase:8090
PB_ADMIN_EMAIL=admin@example.com
PB_ADMIN_PASSWORD=yourpassword
EOF
```

> **Note:** `VITE_POCKETBASE_URL` is baked into the frontend at build time — set it to the public URL the *browser* uses to reach PocketBase. `POCKETBASE_URL` is used by the Node scripts and can be the internal Docker service name.

### 3. Build and start all containers

```bash
docker compose up -d --build
```

The `--build` flag rebuilds the React app with the correct `VITE_POCKETBASE_URL` from `.env`.

### 4. First-time: create schema and seed chapters

Run these once after the containers are up:

```bash
npm run setup
npm run seed
```

Or, if Node is not installed on the server, run the scripts inside the pocketbase container or from a machine that has network access to the server's PocketBase port with the correct `.env`.

### 5. Updating to a new version

```bash
git pull
docker compose up -d --build
```

This rebuilds the frontend with the latest code. PocketBase data in `./pb_data/` is preserved.

### Typical port layout

| Service | Internal | Exposed |
|---|---|---|
| App (nginx) | 80 | 3010 |
| PocketBase | 8090 | 8090 |

Adjust the `ports:` mapping in `docker-compose.yml` if you put nginx/Caddy in front as a reverse proxy.
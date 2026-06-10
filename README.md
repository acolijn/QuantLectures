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
│   │   ├── app/
│   │   │   ├── AppMainContent.jsx
│   │   │   ├── AppOverlays.jsx
│   │   │   └── TeacherToolbar.jsx
│   │   ├── ChapterView.jsx
│   │   ├── GuidedExercise.jsx
│   │   ├── MathText.jsx            # KaTeX renderer ($...$ and $$...$$)
│   │   ├── Quiz.jsx
│   │   └── Sidebar.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx         # PocketBase auth (teacher / student / guest)
│   ├── hooks/
│   │   ├── useChapters.js
│   │   ├── useCourseProgress.js
│   │   └── useCourses.js
│   ├── lib/
│   │   ├── api.js                  # PocketBase CRUD helpers
│   │   └── pocketbase.js           # PocketBase singleton
│   ├── App.jsx                     # Root composition layer
│   └── App.css
├── scripts/
│   ├── setup-pocketbase.js         # Create/update schema + access rules
│   └── (no seed/export scripts; content is managed in-app)
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

# PocketBase superuser credentials (for setup script)
PB_ADMIN_EMAIL=admin@example.com
PB_ADMIN_PASSWORD=yourpassword

# Optional: secret token for teacher signup links (?token=...)
TEACHER_SIGNUP_TOKEN=replace-with-a-long-random-secret
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

It also creates/updates Step 2 collections and rules:
- `courses` (with `published`, `language`, `subject_prompt`)
- `course_members` (`owner` / `editor`)
- `chapters.course_id` relation
- membership-based access rules for teachers and published-only visibility for students

### 4. Start the dev server

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

---

## Database Commands

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

### Export a chapter from the web UI
Teachers can export the currently open chapter as JSON directly from the toolbar via **⬇️ Exporteer**.

---

## User Roles

| Role | Access |
|---|---|
| **Guest** (not logged in) | No guaranteed course access (use a student/teacher account) |
| **Student** | Read invited published courses only (via invite code) |
| **Pending** | Signed up for teacher access; awaiting admin approval |
| **Teacher (editor)** | Access own member courses + chapter CRUD/import/export/reorder |
| **Teacher (owner)** | Editor rights + course settings + member management |
| **Admin** | Can approve/reject pending teachers |

Assign the `teacher` role to a user in the PocketBase admin UI:
**http://localhost:8090/_/** → Collections → users → edit a record → set `role` = `teacher`.

Step 2 permission model is membership-based:
- Teachers only see courses where they are in `course_members`
- Owners can add/remove editors
- Editors cannot manage members or owner-level settings

---

## Adding / Importing a Chapter

### Option A: Teacher web UI (recommended)

1. Log in as a teacher
2. Click **⬆️ Importeer** in the toolbar
3. Copy the generated prompt and paste it into Claude along with your lecture notes
4. Copy Claude's JSON response and paste it into the import modal
5. Set the chapter number and click **Importeer**

The generated import prompt automatically includes:
- selected course language
- course `subject_prompt` (teacher-provided instructions)

UI localization (Step 2e):
- The app UI supports Dutch and English
- UI language can be set in course settings
- UI language preference is persisted in localStorage
- "Follow course language automatically" is enabled by default

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

After deploying, run setup once:
```bash
POCKETBASE_URL=http://localhost:8090 \
PB_ADMIN_EMAIL=admin@example.com \
PB_ADMIN_PASSWORD=yourpassword \
npm run setup
```

If you update from an older single-course version, run `npm run setup` again after pulling changes so Step 2 collections/rules are applied.

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

### 4. First-time: create schema

Run these once after the containers are up:

```bash
npm run setup
```

Or, if Node is not installed on the server, run the scripts inside the pocketbase container or from a machine that has network access to the server's PocketBase port with the correct `.env`.

### 5. Updating to a new version

```bash
git pull
docker compose up -d --build
```

This rebuilds the frontend with the latest code. PocketBase data in `./pb_data/` is preserved.

After updates that touch schema or rules, run:

```bash
npm run setup
```

### One-command safe upgrade (recommended)

From the project root on the server:

```bash
./scripts/upgrade-server.sh
```

What it does:
- creates a timestamped backup of `pb_data/` and `.env` in `backups/<timestamp>/`
- pulls the latest `main`
- runs `docker compose up -d --build`
- runs `npm run setup` (or a one-off Node container fallback if `npm` is unavailable)
- prints container status and recent logs

### Repair missing teacher course visibility

If a course exists in PocketBase but is not visible to a teacher, the teacher is usually missing a `course_members` record for that course.

Use the repair script:

```bash
npm run fix:course-membership -- --course "QF1" --email "auke.pieter.colijn@gmail.com" --role owner
```

This command creates or updates the membership link without modifying chapter content.

### Typical port layout

| Service | Internal | Exposed |
|---|---|---|
| App (nginx) | 80 | 3010 |
| PocketBase | 8090 | 8090 |

Adjust the `ports:` mapping in `docker-compose.yml` if you put nginx/Caddy in front as a reverse proxy.
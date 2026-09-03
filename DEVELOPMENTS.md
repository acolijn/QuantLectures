# Development Roadmap

> **Primary goal:** lecture notes with optional exercises. Exercises are for self-study only — no formal grading or LMS integration intended.

## Implementation Tracker

Use this table as the single source of truth while we build. Update `Status`, `Owner`, `Last update`, `Est. AI time`, and `Notes` as work progresses.

| Item | Scope | Status | Est. AI time | Owner | Last update | Notes |
|---|---|---|---|---|---|---|
| Step 1 | Current MVP (single course, chapter editor, AI import/export, teacher toolbar, chapter reorder) | 🟢 Done | Implemented | - | 2026-05-28 | Baseline already in place |
| Step 2 | Multi-course support + course members + published flag + subject prompt/language | 🟢 Done | 2-3 days | AI + user | 2026-05-29 | Completed: members UI, my-courses filtering by membership, and membership-based PocketBase rules |
| Step 2e | UI localization (menus/buttons/messages) | 🟢 Done | 1-2 days | AI + user | 2026-05-29 | App-wide NL/EN i18n, persisted UI language, and auto-follow course language toggle implemented |
| Step 3 | Teacher registration via secret link | 🟢 Done | 2-3 hours | AI + user | 2026-05-29 | Signup supports `?token=` teacher path; token enforced in app flow with `TEACHER_SIGNUP_TOKEN` |
| Step 3a | Password management + email verification | 🟢 Done | 0.5-1 day | AI + user | 2026-05-29 | Added forgot/reset/change-password and verification request flows |
| Step 3b | Proper teacher approval flow | 🟢 Done | 1 day | AI + user | 2026-05-29 | Admin panel in sidebar for approve/reject of pending teachers |
| Step 3c | Student invite codes + student signup flow | 🟢 Done | 1-1.5 days | AI + user | 2026-05-29 | `course_invites` + `course_enrollments` + student code redemption |
| Step 3d | Student progress in PocketBase | ⚪ Planned | 1 day | - | 2026-05-28 | No grading; lightweight progress only |
| Step 3e | Editor management — teacher picker | 🟢 Done | 2-3 hours | AI + user | 2026-06-25 | Course owner adds editors from a searchable dropdown of existing teachers instead of typing an email. `users` listRule already lets teachers list teachers; add-by-userId (PocketBase hides other users' email) |
| Step 2f | Course settings as a page | 🟢 Done | 0.5 day | AI + user | 2026-06-25 | Settings moved out of the sidebar into a `CourseSettings.jsx` full-screen overlay opened from a ⚙️ toolbar button. Sectioned layout (General / Visibility / AI prompt / Editors / Invite codes / Danger zone). Sidebar slimmed to chapters + auth |
| Step 3f | Admin panel on landing | 🟢 Done | 1-2 hours | AI + user | 2026-06-25 | Pending-teacher approvals moved from the course sidebar into an `AdminPanel.jsx` overlay opened from a 🛡️ Admin button on the landing top bar (admin-only). Sidebar no longer carries admin tasks |
| Step 4 | Subscription tiers + admin manual overrides | ⚪ Planned | 1-2 days | - | 2026-05-28 | Gate content by tier |
| Step 5 | Payment integration (Paddle/Stripe) | ⚪ Planned | 2-3 days | - | 2026-05-28 | Requires webhook service |
| Step 5a | Optional concept deep dives | ⚪ Planned | 0.5-1 day | - | 2026-05-29 | Add `deepDive` to AI JSON and show expandable block only when non-empty |
| Step 6 | Figure support in chapters | 🟢 Done | 1-1.5 days | AI + user | 2026-06-19 | `chapter_figures` collection (file field, ref, caption). AI generates `[fig:ref]` placeholders + captions; import auto-creates placeholder records. Teacher uploads PNG/JPEG/PDF per placeholder in the editor figures tab. Renderer resolves `[fig:ref]` inline. Teachers also see missing placeholders as red clickable tags in the reading view → inline upload modal. |
| Step 7 | GDPR compliance | ⚪ Planned | 0.5-1 day (tech) + legal drafting time | - | 2026-05-28 | Account deletion + policy docs |
| Step 8 | Production deployment | ⚪ Planned | 0.5-1 day | - | 2026-05-28 | Domain, SSL, SMTP, backups |
| Step 9 | Landing page — min (hero + course grid + routing fix) | 🟢 Done | 0.5 day | AI + user | 2026-06-25 | `Landing.jsx` entry page: hero, published-course grid (flag/subtitle/draft badge), feature blurbs. `useCourses` no longer auto-opens first course; sidebar "← All courses" returns home. Brand "MiniLectures.app"; landing forced to English. NL/EN keys added |
| Step 9a | Landing page — polish (progress bars, resume, blurbs, teacher tile) | ⚪ Planned | 0.5 day | - | 2026-06-25 | Builds on Step 9; ties to Step 3d progress |
| Step 10 | Topic-based parts (chapter grouping in sidebar) | 🟢 Done | 1-1.5 days | AI + user | 2026-09-03 | `course_parts` collection + nullable `chapters.part_id`. Collapsible groups in the sidebar with per-part progress, drag within/between parts, parts CRUD in course settings, part dropdown in the chapter editor, and a display-only `chapter_numbering` flag (continuous / per-part). Authorship metadata + "only my chapters" filter not built |

Status values: `⚪ Planned`, `🟡 In progress`, `🔴 Blocked`, `🟢 Done`.
Step 1 is intentionally marked as complete because it represents the current app baseline.

## Already implemented

- Chapter editor (concepts, formulas, quiz) with live LaTeX preview
- AI import: copy a Claude prompt, paste the JSON output → chapter is created/updated in PocketBase
- AI export: download current chapter as `chapter<N>.json` for editing by AI and re-importing
- Drag-and-drop chapter reordering in the sidebar (teacher only)
- Teacher toolbar: new chapter, edit, import, export, delete

---

## Step 2 — Multi-course support

**What:** multiple courses can live in the same app, each owned by one or more teachers.

**New collections:**

```
courses
───────────────────────────────
id
name
subtitle
published          (boolean, default false — draft until teacher publishes)
language           (enum: nl, en, de, fr, es, it, pt, pl — default nl)
subject_prompt     (text — teacher-editable subject instructions for AI, see below)
```

**AI prompt design — fixed + editable split:**

The Claude import prompt is assembled from two parts at runtime:
- **Fixed part (hidden):** required JSON schema, LaTeX formatting rules, language instruction (`Write all content in: English`), "return only JSON" instruction — never editable, guarantees valid output
- **Editable part (`subject_prompt`):** teacher writes subject-specific instructions stored per course

Example teacher input for `subject_prompt`:
> Write in English. The subject is classical mechanics. Use SI units. Assume BSc level with first-year calculus. Prefer Newtonian notation.

The teacher fills this in via a textarea in course settings. The fixed part is appended invisibly before sending to Claude. Teachers cannot accidentally break the output format.

```
course_members
───────────────────────────────
course_id   → links to a course
user_id     → links to a user
role        ("owner" | "editor")
```

- **owner** — created the course; can delete it, manage members, and edit content
- **editor** — can add/edit/delete chapters but cannot delete the course or remove the owner
- Only the owner can add or remove editors (editors cannot manage membership)
- A teacher can own or co-edit any number of courses
- An owner can invite other teachers as editors via the course settings UI

**Other changes:**
- Add a `course_id` foreign key to the `chapters` collection
- Course picker / landing page before the sidebar loads chapters
- "New course" button and a small course-settings form (name, subtitle, language dropdown, subject prompt)
- Language dropdown: NL, EN, DE, FR, ES, IT, PT, PL — injected into the fixed prompt header automatically
- Subject prompt textarea in course settings with a placeholder example and a note explaining the fixed part is added automatically
- "My courses" view showing all courses where the user is owner or editor
- "Members" tab in course settings: list current editors, add by email, remove
- Published/draft toggle in course settings; unpublished courses invisible to students
- PocketBase access rules check `course_members` for read/write permissions
- Students can read published courses they were invited to (via invite code, see Step 3c)

**Note:** `chapter_number` stays per-course, so two different courses can both have a chapter 1.

### Step 2 status (2026-05-29)

Done:
- `courses` collection includes `published`, `language`, and `subject_prompt`
- `course_members` collection exists with `owner` and `editor` roles
- `chapters` collection uses required `course_id` relation
- App is course-scoped for chapter CRUD, import/export, and reorder
- Course picker + create course flow is available in the sidebar
- Course settings UI is available in the sidebar (`name`, `subtitle`, `published`, `language`, `subject_prompt`)
- Import prompt now auto-injects the active course language + `subject_prompt`
- Members management UI is available for owners (list/add/remove editors by email)
- Teacher course list behaves as "My courses" via `course_members`
- PocketBase rules now enforce membership-based access for courses/chapters/members
- Students only see published courses in Step 2

Remaining after Step 2:
- Invite-code based student enrollment remains in Step 3c

### Step 2e — UI localization

**What:** when English is selected, the app UI (menu items, buttons, labels, messages) can also render in English.

**Scope:**
- Introduce an app-wide i18n layer with translation dictionaries (start with NL + EN)
- Replace hardcoded UI strings with translation keys in core screens (sidebar, toolbars, modals, chapter/quiz UI)
- Persist selected UI language and apply it on reload
- Keep a fallback language for missing translations

**Important split:**
- `course.language` controls generated chapter content/import prompt behavior
- UI language controls labels/menu text
- These can be linked by default, but should remain separately configurable

**Status (done):**
- App-wide i18n layer added with NL + EN dictionaries
- UI language persists in localStorage
- Auto-follow toggle links UI language to course language by default
- Core screens migrated to translation keys (sidebar, toolbars, login/import modals, chapter/quiz/exercise/editor UI)

---

## Step 3 — Teacher registration via secret link

**What:** teachers can self-register using a secret link you control; no open signup.

**Changes:**
- Enable email/password signup in PocketBase
- Registration page accepts a `?token=` query parameter
- If the token matches a server-side secret (env variable), the new user gets role `teacher` immediately
- Without the token, signup is rejected or gets role `pending`
- You hand out the link to trusted people only; rotate the token to revoke access

**Effort:** ~2 hours. No approval queue needed for small trusted groups.

---

## Step 3a — Password management & email verification

**What:** forgot password, reset password, change password, and optional email verification on signup.

**All logic is built into PocketBase — UI only:**

| Flow | Trigger | API call |
|---|---|---|
| Forgot password | "Forgot password?" link on login form | `pb.collection('users').requestPasswordReset(email)` → PocketBase sends reset email |
| Reset password | User clicks link in email → `/reset-password?token=…` route | `pb.collection('users').confirmPasswordReset(token, newPass, newPassConfirm)` |
| Change password | "Change password" in user profile/settings | `pb.collection('users').update(userId, { oldPassword, password, passwordConfirm })` |
| Email verification | Triggered on signup if enabled in PocketBase settings | `pb.collection('users').requestVerification(email)` |

**Email sending:** PocketBase needs an SMTP server configured for production (Resend, Mailgun, or Gmail SMTP). Has a built-in mail preview for local dev.

**Effort:** ~half a day for all flows.

---

## Step 3b — Proper teacher approval flow

**What:** any visitor can apply to become a teacher; an admin approves or rejects via a UI in the web app.

**Changes:**
- Open signup creates users with role `pending`
- Add `pending_teachers` view in the admin section of the web app (visible to admins only)
- List shows name, email, signup date; buttons: Approve / Reject
- Approve → PocketBase API updates role to `teacher`, optionally sends a confirmation email
- Reject → deletes the user record or sets role `rejected`
- PocketBase access rules block `pending` users from accessing any content

**Effort:** ~1 day. Replaces the need to log into the PocketBase admin panel.

**Note:** implement Step 3 first; upgrade to Step 3b when teacher volume justifies it.

---

## Step 3c — Student invite codes & signup flow

**What:** teachers invite students to their course via a short code (e.g. `QM2026`). Students create a free account and enter the code to unlock the course.

**New collection:**
```
course_invites
──────────────
code          ("QM2026")
course_id     → links to a course
created_by    → teacher's user ID
expires_at    (optional)
max_uses      (optional)
```

**Student signup flow:**
1. Student visits the app and clicks "Create account"
2. Enters name, email, password → account created with role `student`
3. Enters invite code → gets read access to that specific course
4. Can enter multiple codes for multiple courses

**Teacher flow:**
- Teacher generates a code in the course settings UI
- Shares the code with students (e.g. in a first lecture)
- Can revoke or expire the code at any time

**Roles summary:**

| Role | How obtained | Can do |
|---|---|---|
| `pending` | Self-signup without token | Nothing; awaiting approval |
| `teacher` | Secret link or admin approval | Create and edit own courses |
| `student` | Self-signup + invite code | Read the invited course(s) |
| `admin` | Set manually in PocketBase | Everything |

---

## Step 3d — Student progress in PocketBase

**What:** move quiz/reading progress from browser localStorage to PocketBase so it persists across devices.

**Context:** exercises are for self-study only — no formal grading. Progress tracking is lightweight: did the student complete the quiz, and what was their best score?

**New collection:**
```
progress
──────────────────────────────
user_id        → links to a user
chapter_id     → links to a chapter (PocketBase ID)
quiz_completed (boolean)
best_score     (number, 0–100)
last_attempt   (datetime)
```

**Changes:**
- On quiz completion, write to `progress` collection instead of localStorage
- On load, fetch progress records for the current user
- localStorage can remain as a fallback for anonymous visitors (no account)
- PocketBase access rules: users can only read/write their own progress records

**Effort:** ~1 day. Low priority until multi-user is live.

---

## Step 2f — Course settings as a page

**What:** course settings live on their own page instead of cramped in the sidebar.

**Problem:** the sidebar settings block held name, subtitle, language, published/public, subject prompt, editors and invite codes all in a narrow column — messy and hard to scan.

**Approach (done, 2026-06-25):**
- New `CourseSettings.jsx` full-screen overlay, opened from a ⚙️ **Cursusinstellingen** button in the teacher toolbar (also shown in the no-chapters state so it's reachable on empty courses).
- Sectioned card layout: General (name/subtitle/language) · Visibility (published/public) · AI subject prompt · Editors (searchable teacher picker + member list) · Student invite codes · Danger zone (delete course, separated last).
- Closes on ✕, backdrop click, or Escape.
- Owner-only sections gated as before; non-owners see General read-only.
- Sidebar slimmed to chapter list, progress, auth, student invite redeem, and the admin pending-teachers panel. Course selector + "new course" button already moved to the landing page (Step 9).

---

## Step 3f — Admin panel on landing

**What:** global admin tasks live on the landing page, not inside a course.

**Problem:** the pending-teacher approval panel ("Docentenaanvragen") sat in the course sidebar — but it's a global admin task, only reachable after entering some course. Wrong place.

**Approach (done, 2026-06-25):**
- New `AdminPanel.jsx` overlay (same pattern as `CourseSettings`), opened from a 🛡️ **Admin** button in the landing top bar, shown only when `isAdmin`.
- Pending-teacher list + approve/reject moved there; removed from the sidebar entirely.
- Closes on ✕, backdrop click, or Escape.
- Scales: future admin tools (user management, tiers) go in the same overlay.

**Clean split now:**
- **Landing** = global (browse courses, create course, admin).
- **Sidebar** = within a course (chapters, progress, auth, student invite redeem).
- **CourseSettings** = one course's config.

---

## Step 3e — Editor management (teacher picker)

**What:** a course owner adds co-editors without typing an exact email.

**Problem:** the only way to add an editor was a free-text email field — error-prone (typos, wrong address) and requires knowing the colleague's exact address.

**Approach (done, 2026-06-25):**
- Owner opens course settings → Members panel.
- Searchable dropdown lists existing `teacher` accounts (filter by name/email as you type).
- Pick a teacher → added as `editor`. Already-members and the owner are hidden from the list.
- The `users` collection `listRule` already allows teachers to list teachers, so no rule change was needed.
- Reuses the existing `addCourseEditorByEmail` add path; only a `fetchTeachers()` read was added.

**Considered alternatives (not built):**
- Editor invite link/code (like student invite codes) — better when the colleague has no account yet.
- Request-to-join + owner approval — more UI than warranted at current scale.

---

## Step 4 — Subscription tiers (free / basic / pro)

**What:** content is gated by subscription level.

**Changes:**
- Add `subscription_tier` field to users (`free`, `basic`, `pro`)
- Tag courses or chapters with a minimum required tier
- PocketBase access rules enforce read access based on tier
- UI shows locked content with an upgrade prompt

**Admin override:** admins can manually set any user's `subscription_tier` to any level directly in PocketBase (or via an admin UI). Use this for beta testers, colleagues, or internal testing — no payment required.

**Note:** the tiered-access logic itself is small; the subscription lifecycle (upgrades, downgrades, cancellations, failed payments) adds overhead.

---

## Step 5 — Payment integration

**What:** users pay for basic/pro access via a hosted checkout.

**Recommended provider:** Paddle (handles EU VAT automatically as seller of record).  
**Alternative:** Stripe (more control, but you handle VAT yourself).

**Flow:**
1. User clicks "Upgrade" → redirected to Paddle/Stripe hosted checkout
2. Payment provider sends a webhook to a small backend endpoint
3. Backend updates `subscription_tier` in PocketBase
4. Access unlocks immediately

**Additional work:**
- Small webhook server (PocketBase alone cannot receive payment events)
- Pricing page in the UI
- Terms of service, privacy policy, refund policy (legally required in the EU)

---

## Step 6 — Figure support

**What:** teachers can attach figures referenced inline anywhere in chapter text.

**Approach:** `[fig:ref]` placeholder tags in content, resolved to uploaded files at render time. Files live in a separate `chapter_figures` collection (not base64, not on the chapter record).

**New collection:**
```
chapter_figures
───────────────────────────────
chapter_id  → links to a chapter
ref         ("fig1") — matches [fig:ref] tags in content
caption     (text)
file        (optional file: PNG/JPEG/GIF/WEBP/SVG/PDF)
```

**Status (done, 2026-06-19):**
- `chapter_figures` collection + access rules created in `setup-pocketbase.js`
- AI generates `[fig:ref]` placeholders + captions in concept content, exercise intros/steps
- Import auto-creates placeholder records (ref + caption, no file yet)
- Editor "Figures" tab: upload/replace/delete, edit ref + caption, thumbnail/PDF preview
- `MathText` resolves `[fig:ref]` inline wherever it appears (image + caption)
- Teachers see unuploaded `[fig:ref]` as red clickable tags in the reading view → inline upload modal (`FigureUploadModal`); auto-creates the record if the ref was typed manually. Students see a neutral non-clickable placeholder.

**Does not affect:** auth, routing, AI import/export logic.

---

## Step 5a — Optional concept deep dives

**What:** support a deeper optional explanation per concept without forcing long text for every student.

**Changes:**
- Extend AI JSON schema for each concept with a required `deepDive` field (string, may be empty)
- Update import prompt/schema examples so Claude always returns `deepDive`
- In the concept card UI, show an expandable "deeper explanation" block only when `deepDive` is non-empty
- Keep default concept view concise to preserve current fast-reading flow

**Why later:** this is a UX/content enhancement, not required for current Step 2 platform completion.

---

## Step 7 — GDPR compliance

**What:** EU legal requirements for a public-facing app with user accounts.

**Required:**
- **Right to erasure:** users can delete their own account and all associated data (progress records, course memberships) from their profile settings
- **Privacy policy:** document what data is stored, why, and for how long
- **Terms of service:** usage rules for teachers and students
- **Cookie/storage notice:** if analytics or non-essential storage is added

**PocketBase side:** deleting a user record should cascade to `progress`, `course_members`, and `course_invites`. Set up cascade delete rules in PocketBase.

**Effort:** legal documents are the main effort; the delete-account button itself is ~half a day.

---

## Step 8 — Production deployment

**What:** run the app on a public server with a domain and SSL.

**Current state:** Docker Compose is already in the repo (React app + PocketBase).

**Steps:**
- Choose a host (e.g. Hetzner, DigitalOcean, Fly.io — PocketBase is a single binary, very light)
- Point a domain at the server
- Add an SSL certificate (Let's Encrypt via Caddy or Nginx reverse proxy)
- Configure SMTP for transactional email (Resend recommended)
- Set env variables (`VITE_POCKETBASE_URL`, SMTP credentials, teacher registration token)
- Set up automated backups for the PocketBase `pb_data/` directory

**Effort:** half a day to a day depending on hosting familiarity.

---

## Step 9 — Landing page

**What:** a proper landing / welcome page as the app's entry point.

**Problem:** the app used to open directly on the default course (QF1). Not a nice first impression — no context, branding, or course overview.

**Wanted:**
- Dedicated landing page shown on app start instead of jumping straight into a course
- Welcome/intro content (title, short description, branding)
- Overview of available courses with entry into a chosen course
- Sensible entry points for logged-out vs. logged-in users (sign in / my courses)

**Layout (logged-out):**
```
┌─────────────────────────────────────────┐
│  [logo] MiniLectures.app     [Sign in]   │  ← top bar
├─────────────────────────────────────────┤
│   Hero title + 1-line tagline            │
│   "Interactive lecture notes"            │
├─────────────────────────────────────────┤
│   Course cards grid (published only)     │
│   ┌──────┐ ┌──────┐ ┌──────┐             │
│   │ QF1  │ │ ...  │ │ ...  │             │
│   │ subt │ │      │ │      │             │
│   └──────┘ └──────┘ └──────┘             │
├─────────────────────────────────────────┤
│   3 feature blurbs (LaTeX / quizzes /    │
│   self-study exercises)                  │
└─────────────────────────────────────────┘
```

**Course card:** title + subtitle + language flag (+ draft badge for teachers). Click → open course.

**Step 9 — min (done, 2026-06-25):**
- `Landing.jsx`: top bar (brand "MiniLectures.app" + sign in/user), hero, published-course grid, 3 feature blurbs.
- `useCourses` no longer auto-opens the first course → app starts on the landing page.
- Selecting a course enters it; sidebar header "← All courses" button returns to landing.
- Landing forces English UI; course language takes over once a course opens.
- NL/EN `landing_*` translation keys added.
- No persistence (reload → landing again).

**Step 9a — polish (planned):**
- Logged-in "My courses" first + per-card last-read chapter and progress bar (ties to Step 3d).
- Remember last course in localStorage → optional "Resume" button (never auto-jump).
- Teacher "+ New course" tile in the grid (currently a top-bar button).

---

---

## Step 10 — Topic-based parts

**What:** chapters can be grouped into teacher-defined **parts** (e.g. "Part 1: Formalism", "Part 2: Perturbation theory"), rendered as collapsible groups in the sidebar.

**Problem:** the sidebar is a flat chapter list ([`Sidebar.jsx`](src/components/Sidebar.jsx)). A 20-chapter course is one long scroll with no structure. Courses shared between teachers make this worse.

**Decision — group by topic, not by author.** Considered grouping chapters per teacher ("Alice's lectures / Bob's lectures") and rejected it:
- Students care about reading order, not authorship. Author grouping leaks the org chart into the curriculum.
- Breaks on co-authored chapters and on handover when a teacher leaves.
- Alternating teachers → students jump between groups, sequence lost.
- Ownership is already data; it does not need to be structural.

Authorship is surfaced as **metadata** instead (see below), and "show only my chapters" becomes a **filter**, not a structure.

**New collection:**
```
course_parts
───────────────────────────────
course_id   → links to a course
title       (text, e.g. "Formalism")
part_number (number — order within the course)
```

**Chapter change:**
```
chapters
───────────────────────────────
+ part_id   → links to course_parts (optional; null = ungrouped)
```

**Ordering rules (important):**
- `chapter_number` stays **course-global** — it is also the app-level chapter id (`api.js` maps `record.chapter_number → chapter.id`, and lookups filter on it). Do **not** scope it per part; that would create duplicate ids.
- Parts are ordered by `part_number`; chapters inside a part are ordered by `chapter_number`.
- Reorder must keep parts contiguous: after any drag, renumber `chapter_number` across the whole course in part order (extension of the existing `reorderChapters` renumbering).
- Ungrouped chapters (`part_id = null`) render at the top level, above the parts, so existing courses look unchanged.

**Renumbering algorithm.** Any structural change flattens the course in part order and reassigns:

```
flat = [...ungrouped, ...parts.sortBy(part_number).flatMap(p => p.chapters)]
flat.forEach((ch, i) => ch.chapter_number = i + 1)
```

Triggers: drag a chapter within a part, drag a chapter into another part, reorder parts, delete a part (chapters fall back to ungrouped), create a chapter, delete a chapter. This is today's `reorderChapters` with a different input order — the write path does not change.

**Numbering vs. display.** `chapter_number` is *storage and identity*; the label shown to the reader is derived at render time from position:

```
storage:  chapter_number = 1..N, contiguous per part
display:  'continuous' → "3"
          'per_part'   → "2.1"   (partIndex + 1 . indexWithinPart + 1)
```

- Optional course field `chapter_numbering` (`continuous` | `per_part`, default `continuous`) controls the label only.
- Nothing downstream sees the label: import upsert key (`chapter_number` + `course_id`), export filename `chapter<N>.json`, app-level `chapter.id`, and progress records (keyed on `pbId`) all keep the continuous number.
- Switching the flag is reversible: display-only, no migration, no data touched.
- Ungrouped chapters in `per_part` mode show the plain continuous number, no prefix.
- Caveat: labels are positional, so moving a part relabels its chapters — the same instability reordering already has today, just more visible. Cross-references typed inside chapter content ("see chapter 5") are plain text and are not auto-updated (unchanged from today).

**Rejected — per-part storage numbering** (`chapter_number` restarts at 1 inside each part): would break course-global uniqueness, forcing a new stable identity (`pbId` or a slug), a changed import upsert key, changed export filenames, and a rule for ungrouped chapters. The display flag above gives the same reader-facing "Part 2, chapter 1" without that blast radius.

**Sidebar UI:**
- Nested render: part header (title + collapse chevron + `3/5 done` progress rollup) → chapter rows indented under it.
- Collapse state per part, persisted in localStorage per course.
- Teacher drag-and-drop gains two levels: reorder parts, reorder chapters within a part, and drop a chapter into another part (sets `part_id` + renumbers).
- Ungrouped chapters keep today's flat behaviour.

**Teacher UI:**
- Manage parts in `CourseSettings.jsx` (new "Parts" section): add/rename/delete/reorder parts. Deleting a part does not delete chapters — it sets their `part_id` to null.
- Assign a chapter to a part from the chapter editor (dropdown) or by dragging in the sidebar.

**Authorship (separate, smaller change):**
- Add `authors` (relation, multiple) or `owner` (relation) to `chapters`.
- Show initials/avatar on the chapter row and a "by …" line in the chapter header.
- Teacher toolbar toggle "only my chapters" dims/hides rows — a view filter, no data-model impact.

**Access rules:** `course_parts` follows the same `course_members` membership rules as `chapters` (members write, published/enrolled read).

**Rollout (cheapest useful step first):**
1. Collection + `part_id` field + rules; `part_id` nullable → existing courses unaffected.
2. Sidebar nested render with collapse; parts read-only.
3. Parts CRUD in course settings.
4. Drag-and-drop across parts + renumbering.
5. Authorship metadata + "only my chapters" filter (optional, can slip).

### Step 10 status (done, 2026-09-03) — stages 1-4

- `course_parts` collection (`course_id`, `title`, `part_number`) in `setup-pocketbase.js`, same membership rules as `chapters`; nullable `chapters.part_id` with `cascadeDelete: false` so deleting a part keeps its chapters; `courses.chapter_numbering` select.
- `src/lib/chapterOrder.js`: `groupChapters`, `flattenCourse`, `moveChapter`, `moveParts`, `buildChapterLabels` — all pure. A chapter pointing at a deleted part falls back to ungrouped and its stale `part_id` is cleared on the next write.
- `useChapters` loads parts alongside chapters and owns every structural write (`moveChapterTo`, `movePartTo`, `addPart`, `renamePart`, `removePart`), each ending in one flatten + renumber pass.
- Sidebar renders collapsible groups (collapse state per course in localStorage), per-part `done/total`, drag chapters within and between parts, drag part headers to reorder.
- Course settings gained a Parts section (add / rename / reorder / delete, editors included, not owner-only) and a numbering dropdown in General.
- Chapter editor gained a part dropdown — the non-drag path for assigning a chapter, and the one that works on mobile.
- New chapters land at the end of the part the teacher is currently reading.

**Not built (stage 5):** chapter authorship metadata and the "only my chapters" filter. Nothing in stages 1-4 depends on it.

**Deploy:** run `node --env-file=.env scripts/setup-pocketbase.js` against the target PocketBase before shipping the frontend — the new collection and fields do not exist yet.

**Also unlocks:** per-part progress rollup, shorter sidebar on long courses, and a natural table-of-contents structure for a future course overview page.

**Effort:** ~1-1.5 days. Main cost is the sidebar rewrite (flat map → nested) and cross-part drag logic.

## Known Issues (Blocking)

_None._

### Resolved

| Issue | Component | Status | Notes |
|---|---|---|---|
| Cannot add/delete exercises (Opgaven) | ChapterEditor | 🟢 Resolved | `addExercise` / `deleteExercise` wired into the Opgaven editor UI. |

---

## Design decisions to make before Step 2

| Decision | Options | Recommendation |
|---|---|---|
| Teacher registration | Secret link (Step 3) vs. approval flow (Step 3b) | Start with secret link |
| Student access | Anonymous (no account) vs. invite code | Invite code if progress tracking matters |
| Course visibility | All courses public vs. teacher controls per course | Teacher controls via published flag |
| Subscription model | Recurring (monthly/yearly) vs. one-time per course | Decide before Step 5 |
| Email verification | Required on signup vs. optional | Optional to start; enable when spam becomes a concern |

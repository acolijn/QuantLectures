# Development Roadmap

> **Primary goal:** lecture notes with optional exercises. Exercises are for self-study only — no formal grading or LMS integration intended.

## Implementation Tracker

Use this table as the single source of truth while we build. Update `Status`, `Owner`, `Last update`, `Est. AI time`, and `Notes` as work progresses.

| Item | Scope | Status | Est. AI time | Owner | Last update | Notes |
|---|---|---|---|---|---|---|
| Step 1 | Current MVP (single course, chapter editor, AI import/export, teacher toolbar, chapter reorder) | 🟢 Done | Implemented | - | 2026-05-28 | Baseline already in place |
| Step 2 | Multi-course support + course members + published flag + subject prompt/language | 🟢 Done | 2-3 days | AI + user | 2026-05-29 | Completed: members UI, my-courses filtering by membership, and membership-based PocketBase rules |
| Step 2e | UI localization (menus/buttons/messages) | 🟢 Done | 1-2 days | AI + user | 2026-05-29 | App-wide NL/EN i18n, persisted UI language, and auto-follow course language toggle implemented |
| Step 3 | Teacher registration via secret link | ⚪ Planned | 2-3 hours | - | 2026-05-28 | Fastest safe onboarding path |
| Step 3a | Password management + email verification | ⚪ Planned | 0.5-1 day | - | 2026-05-28 | PocketBase-native APIs |
| Step 3b | Proper teacher approval flow | ⚪ Planned | 1 day | - | 2026-05-28 | Add when teacher volume increases |
| Step 3c | Student invite codes + student signup flow | ⚪ Planned | 1-1.5 days | - | 2026-05-28 | Access to specific courses only |
| Step 3d | Student progress in PocketBase | ⚪ Planned | 1 day | - | 2026-05-28 | No grading; lightweight progress only |
| Step 4 | Subscription tiers + admin manual overrides | ⚪ Planned | 1-2 days | - | 2026-05-28 | Gate content by tier |
| Step 5 | Payment integration (Paddle/Stripe) | ⚪ Planned | 2-3 days | - | 2026-05-28 | Requires webhook service |
| Step 6 | Image support in chapters | ⚪ Planned | 0.5-1 day | - | 2026-05-28 | URL-based references in JSON |
| Step 7 | GDPR compliance | ⚪ Planned | 0.5-1 day (tech) + legal drafting time | - | 2026-05-28 | Account deletion + policy docs |
| Step 8 | Production deployment | ⚪ Planned | 0.5-1 day | - | 2026-05-28 | Domain, SSL, SMTP, backups |

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

## Step 6 — Image support

**What:** teachers can attach images to concepts and exercises.

**Approach:** URL references in JSON (not base64 inline).

**Changes:**
- Add a file-upload field to PocketBase (`chapters` or a separate `images` collection)
- Upload button per concept/exercise in `ChapterEditor`
- `<img>` tag in the content renderer
- JSON export includes image URLs as plain strings; AI round-trips preserve them unchanged
- For AI-generated chapters: AI writes `"image": null`; teacher uploads manually afterwards

**Does not affect:** auth, routing, AI import/export logic.

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

## Design decisions to make before Step 2

| Decision | Options | Recommendation |
|---|---|---|
| Teacher registration | Secret link (Step 3) vs. approval flow (Step 3b) | Start with secret link |
| Student access | Anonymous (no account) vs. invite code | Invite code if progress tracking matters |
| Course visibility | All courses public vs. teacher controls per course | Teacher controls via published flag |
| Subscription model | Recurring (monthly/yearly) vs. one-time per course | Decide before Step 5 |
| Email verification | Required on signup vs. optional | Optional to start; enable when spam becomes a concern |

# Quick start for teachers

From zero to a course your students can open, in about ten minutes. Each step
links to a page with more detail.

## 1. Get a teacher account

1. Go to [minilectures.app](https://minilectures.app) and click **Sign in**.
2. Choose **Create account**, fill in your name, email and a password
   (at least 8 characters), and set **Account type** to **Teacher**.
3. Click **Create account**.

What happens next depends on how you got here:

- **You used a teacher signup link** from the administrator: your account is a
  teacher account straight away. Sign in.
- **You signed up without a link:** your account is *pending*. The administrator
  gets an email and approves you; you get an email when that is done.

You also get an email to confirm your address. Click the link in it.

## 2. Create a course

1. After signing in, click **+ New course** and give it a name. You can change
   it later.
2. Open the course and click **⚙️ Course settings**. Under **General**, set the
   **Language** your course is written in. Under **AI / Subject prompt**, write a
   few lines about the subject and level — for example:

   > First-year physics course on quantum mechanics, following Griffiths.
   > Use SI units and ħ throughout.

   This text is added to every AI prompt for this course, so you only write it
   once.

## 3. Add your first chapter with AI

Chapters are written by an AI assistant from your own notes, then imported.

1. In the course, click **⬆️ Import**.
2. **Step 1:** click **📋 Copy prompt**. Open ChatGPT or Claude, paste the
   prompt, and replace the line
   `[PASTE YOUR NOTES / BOOK EXCERPT / OTHER INFORMATION HERE]`
   with your lecture notes, slides text or a book excerpt. Send it.
3. **Step 2:** the assistant replies with a block of JSON. Copy all of it and
   paste it into the box.
4. **Step 3:** check the chapter number (the next free number is filled in).
5. Click **⬆️ Import chapter**.

The chapter opens with its concepts, formulas, quiz and exercises. Read it
through: AI output is a first draft. Fix anything with **✏️ Edit chapter**.

::: tip
If the import complains about the JSON, ask the assistant to "return only valid
JSON, nothing else" and paste again.
:::

More: [AI import and export](./ai-import.md) · [Writing and editing chapters](./writing.md)

## 4. Publish the course

Students cannot see a course until you publish it.

1. Open **⚙️ Course settings** → **Visibility**.
2. Tick **Published (visible to students)**.
3. Optionally tick **Publicly available (visible without sign-in)** if anyone
   may read it without an account. Leave it off for a course only your own
   students should see.

Unpublished courses show a **Draft** label on the course list — only you and
your co-editors see them.

## 5. Invite your students

1. In **⚙️ Course settings**, under **Student invite codes**, type a code (for
   example `QM2026`), optionally a maximum number of uses, and click
   **Create code**.
2. Give the code to your students. They sign in, click **Add a course** and
   enter it.

You can also share a direct link that fills in the code for them:

```
https://minilectures.app/?invite=QM2026
```

Revoke a code at any time with **Revoke**; students who already joined keep
access.

More: [Sharing and access](./sharing.md)

## Next steps

- Group chapters into parts and set the numbering: [Organising a course](./organising.md)
- Add figures to a chapter: [Writing and editing chapters](./writing.md#figures)
- Let a colleague co-edit: [Sharing and access](./sharing.md#co-editors)
- Hand out a PDF: [Printing and PDF](./printing.md)

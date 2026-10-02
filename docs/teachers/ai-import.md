# AI import and export

You do not write chapters by hand. You give an AI assistant (ChatGPT, Claude or
similar) your own material, and it returns the chapter in a format the app
reads (JSON). The app writes the instructions for the assistant for you.

## Before you start: the subject prompt

In **⚙️ Course settings** → **AI / Subject prompt**, describe the course in a
few lines: subject, level, conventions, notation. For example:

> First-year physics course on quantum mechanics, following Griffiths.
> Use SI units and ħ throughout. Keep derivations short.

This text, and the course **Language**, are added to every prompt
automatically. The technical rules for the JSON are added too — you never need
to write those.

## Import a chapter

1. Open the course and click **⬆️ Import**.
2. **Step 1 — Copy the prompt.** Click **📋 Copy prompt** (or **View prompt**
   to read it first). Paste it into a new chat with the assistant.
3. In the pasted text, replace
   `[PASTE YOUR NOTES / BOOK EXCERPT / OTHER INFORMATION HERE]`
   with your source material: lecture notes, the text of your slides, a book
   section. Send it.
4. **Step 2 — Paste the JSON.** The assistant answers with a block of JSON.
   Copy all of it into the box.
5. **Step 3 — Chapter number.** The next free number is filled in. If you
   enter a number that already exists, the app warns **⚠️ Overwrites existing
   chapter**.
6. Click **⬆️ Import chapter**.

The app checks the JSON first. It may show **Check before importing:** with
warnings, for example exercise steps without an answer. These do not block the
import; click **Import anyway** to continue, or fix the JSON first.

::: tip If the JSON is rejected
- *Invalid JSON*: ask the assistant to "return only the JSON, nothing else" and
  paste again. Make sure you copied the whole block, including the first `{`
  and the last `}`.
- *Required field is missing*: ask the assistant to "follow the format in the
  prompt exactly".
:::

After importing, read the chapter through. AI output is a first draft: check
the physics, the formulas and the quiz answers, and upload the figures it asks
for (see [Figures](./writing.md#figures)).

## Export a chapter

**⬇️ Export** downloads the open chapter as a file (`chapter3.json`). Use it
as a backup, to copy a chapter to another course (import it there), or to
revise it with AI.

## Revise a chapter with AI

1. **⬇️ Export** the chapter.
2. Open a chat with the assistant, paste the contents of the file, and say
   what to change — for example "add two exercises on the infinite well;
   return the complete JSON in the same format".
3. **⬆️ Import** the answer **with the same chapter number**. It replaces the
   chapter.

This is also the way to edit things the editor does not show, such as exercise
hints.

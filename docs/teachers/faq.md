# FAQ

## A student cannot see my course

Check in **⚙️ Course settings**:

1. Is **Published (visible to students)** ticked?
2. Did the student join with an active invite code? Revoked codes and codes
   that reached their **Max uses** no longer work.
3. Is the student signed in with the account they joined with?

## I signed up as a teacher but cannot create a course

Your account is still waiting for approval by the administrator. You get an
email when it is approved. If you had a teacher signup link, make sure you
opened it before creating the account.

## A figure does not show

- No file uploaded yet: you see a red tag in the chapter. Click it and upload.
- The reference does not match: `[fig:bohr]` in the text needs a figure with
  reference `bohr` in the **🖼️ Figures** tab.
- It is a PDF: not supported. Export it as SVG or PNG.

## A formula shows as red text or raw LaTeX

The LaTeX has an error, often an unmatched `{` or `$`, or a command that is
not supported in the browser. Open **✏️ Edit chapter** and check the
**Preview** while you fix it.

## Exercise answers are marked wrong when they are right

- For numbers, widen the **Tolerance** of that step (e.g. `0.05` for 5%).
- For formulas, the comparison is strict about form: `2x+3` and `3+2x` are
  different. Accept several forms through [export and re-import](./ai-import.md#revise-a-chapter-with-ai),
  or remove the **Answer** so students compare with the solution themselves.

## The import says the JSON is invalid

See [If the JSON is rejected](./ai-import.md#import-a-chapter).

## Can I undo a change?

No. Before big changes, **⬇️ Export** the chapter; you can import the file
again to go back.

## Who do I ask for help?

Contact the administrator of your MiniLectures site.

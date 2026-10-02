# Writing and editing chapters

Most chapters start as an [AI import](./ai-import.md) and are then polished
in the editor. You can also write a chapter from scratch.

## Open the editor

- **✏️ Edit chapter** — edit the chapter that is open.
- **➕ New chapter** — add an empty chapter at the end of the course.
- **🗑️ Delete chapter** — removes the open chapter. This cannot be undone, so
  [export](./ai-import.md#export-a-chapter) it first if in doubt.

At the top of the editor you set the **Title**, **Subtitle** and the **Part**
the chapter belongs to. Save with **Save**.

## Formulas in text

Everywhere you can type text, you can use LaTeX:

- inline: `$E = h f$`
- displayed on its own line: `$$i\hbar \frac{\partial \Psi}{\partial t} = \hat H \Psi$$`
- bold text: `**important**`

The editor shows a **Preview** as you type.

## The tabs

### 📖 Concepts

The body of the chapter: a sequence of short sections, each with a **Name**
(the heading) and **Content**. Reorder them with **Move up** / **Move down**;
add one with **+ Add concept**.

### 📐 Formulas

The formula sheet of the chapter: each entry has a **Name** and the **LaTeX**
of the formula, without `$` signs. These are also collected on the printed
formula sheet.

### 🧮 Exercises

Guided exercises that students work through step by step. An exercise has a
**Label**, an **Introduction** and a list of **Steps**. Each step has:

- **Question** — what the student should work out.
- **Answer** — what the app checks against. A number (`9.81`) is compared
  with a relative **Tolerance** (default 1%). A formula (`2x+3`) is compared
  after normalising spaces, `\cdot`, `\left`/`\right` and similar.
- **Solution** — the worked answer, shown on request.

::: warning Steps without an answer
A step with an empty **Answer** is not checked; students get a box for their
own working and compare with the solution. The editor marks such steps with ⚠️.
:::

Hints, and steps with several answer boxes, can only be edited through
[export and re-import](./ai-import.md#revise-a-chapter-with-ai).

### ✏️ Quiz

Multiple-choice questions. Each has a **Question**, the **Answer options**
(select the correct one) and an **Explanation** that students see after
answering.

### 🖼️ Figures {#figures}

Figures are referenced in the text with a placeholder like `[fig:bohr]`,
which is replaced by the image and its caption.

1. In the **🖼️ Figures** tab, click **+ Add figure** and give it a
   **Reference** (e.g. `bohr`) and a **Caption**. An AI import creates these
   entries for you.
2. Click **⬆️ Upload file** and choose the image.
3. Put `[fig:bohr]` in a concept or exercise where the figure should appear.

Use **SVG** where you can (sharp at any size, also in print), otherwise **PNG**
at least 900 px wide. JPEG, GIF and WebP also work. **PDF figures are not
supported** — export them as SVG or PNG first.

::: tip Missing figures
While reading a chapter, teachers see figures that have no file yet as a red
tag. Click it to upload the file right there.
:::

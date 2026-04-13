# QuantLectures

Lecture content for quantitative topics, organized as chapter modules.

## Structure

```text
QuantLectures/
├── src/
│   └── data/
│       ├── chapter1.js
│       ├── chapter2.js
│       ├── chapter3.js
│       ├── chapter4.js
│       ├── chapter5.js
│       ├── chapter6.js
│       ├── chapter7.js
│       ├── chapter8.js
│       ├── chapter9.js
│       ├── chapter10.js
│       └── chapters.js
└── README.md
```

## How It Works

`src/data/chapters.js` imports all individual chapter modules and exports them as a single array for use in the app.

## Adding a Chapter

1. Create a new file in `src/data/`, e.g. `chapter11.js`
2. Export the chapter data from that file
3. Import it in `src/data/chapters.js`
4. Add it to the `chapters` array

## Development

```bash
npm install
npm start
```
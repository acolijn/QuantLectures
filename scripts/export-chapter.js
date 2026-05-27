/**
 * scripts/export-chapter.js
 *
 * Pulls a chapter from PocketBase and overwrites the local seed file.
 * Run this before editing a chapter with Claude, to ensure you have
 * the latest version.
 *
 * Usage:
 *   node --env-file=.env scripts/export-chapter.js <chapter-number>
 *
 * Example:
 *   node --env-file=.env scripts/export-chapter.js 3
 *
 * Required env vars (in .env):
 *   POCKETBASE_URL
 *   PB_ADMIN_EMAIL
 *   PB_ADMIN_PASSWORD
 */

import PocketBase from 'pocketbase';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const chapterNumber = parseInt(process.argv[2]);
if (!chapterNumber || isNaN(chapterNumber)) {
  console.error('Usage: node --env-file=.env scripts/export-chapter.js <chapter-number>');
  process.exit(1);
}

const pb = new PocketBase(process.env.POCKETBASE_URL ?? 'http://localhost:8090');
pb.autoCancellation(false);

async function exportChapter() {
  // Authenticate as admin
  try {
    await pb.admins.authWithPassword(
      process.env.PB_ADMIN_EMAIL,
      process.env.PB_ADMIN_PASSWORD,
    );
  } catch {
    await pb.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_EMAIL,
      process.env.PB_ADMIN_PASSWORD,
    );
  }

  const record = await pb.collection('chapters')
    .getFirstListItem(`chapter_number=${chapterNumber}`);

  const chapter = {
    id:        record.chapter_number,
    title:     record.title,
    subtitle:  record.subtitle,
    formulas:  record.formulas  ?? [],
    concepts:  record.concepts  ?? [],
    exercises: record.exercises ?? [],
    quiz:      record.quiz      ?? [],
  };

  // Serialise as a proper JS module (round-trippable via seed.js)
  const content = `const chapter${chapterNumber} = ${JSON.stringify(chapter, null, 2)};\n\nexport default chapter${chapterNumber};\n`;

  const filePath = join(__dirname, `../src/data/chapter${chapterNumber}.js`);
  writeFileSync(filePath, content, 'utf-8');
  console.log(`Exported chapter ${chapterNumber} → ${filePath}`);
}

exportChapter().catch(err => { console.error(err); process.exit(1); });

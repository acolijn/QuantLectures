/**
 * scripts/seed.js
 *
 * Imports all chapter JS files into PocketBase.
 * Safe to run multiple times — upserts by chapter_number.
 *
 * Usage:
 *   node --env-file=.env scripts/seed.js
 *
 * To seed a single chapter:
 *   node --env-file=.env scripts/seed.js 3
 *
 * Required env vars (in .env):
 *   POCKETBASE_URL        e.g. http://localhost:8090
 *   PB_ADMIN_EMAIL
 *   PB_ADMIN_PASSWORD
 */

import PocketBase from 'pocketbase';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pb = new PocketBase(process.env.POCKETBASE_URL ?? 'http://localhost:8090');
pb.autoCancellation(false);

const CHAPTER_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

async function seedChapter(chapter) {
  const payload = {
    chapter_number: chapter.id,
    title:          chapter.title,
    subtitle:       chapter.subtitle   ?? '',
    formulas:       chapter.formulas   ?? [],
    concepts:       chapter.concepts   ?? [],
    exercises:      chapter.exercises  ?? [],
    quiz:           chapter.quiz       ?? [],
  };

  try {
    const existing = await pb.collection('chapters')
      .getFirstListItem(`chapter_number=${chapter.id}`);
    await pb.collection('chapters').update(existing.id, payload);
    console.log(`  ✓ Updated  chapter ${chapter.id}: ${chapter.title}`);
  } catch {
    await pb.collection('chapters').create(payload);
    console.log(`  ✓ Created  chapter ${chapter.id}: ${chapter.title}`);
  }
}

async function seed() {
  // Authenticate as admin
  console.log('Authenticating…');
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

  // Determine which chapters to seed
  const singleChapter = process.argv[2] ? parseInt(process.argv[2]) : null;
  const toSeed = singleChapter ? [singleChapter] : CHAPTER_NUMBERS;

  console.log(`Seeding ${toSeed.length} chapter(s)…\n`);

  for (const n of toSeed) {
    const filePath = join(__dirname, `../src/data/chapter${n}.js`);
    const { default: chapter } = await import(pathToFileURL(filePath).href);
    await seedChapter(chapter);
  }

  console.log('\nDone!');
}

seed().catch(err => { console.error(err); process.exit(1); });

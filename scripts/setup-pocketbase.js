/**
 * scripts/setup-pocketbase.js
 *
 * Creates the 'chapters' collection in PocketBase and adds a 'role'
 * field to the built-in 'users' collection.
 *
 * Usage:
 *   node --env-file=.env scripts/setup-pocketbase.js
 *
 * Required env vars (in .env):
 *   POCKETBASE_URL        e.g. http://localhost:8090
 *   PB_ADMIN_EMAIL        your PocketBase superuser e-mail
 *   PB_ADMIN_PASSWORD     your PocketBase superuser password
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.POCKETBASE_URL ?? 'http://localhost:8090');

async function setup() {
  // ── 1. Authenticate as admin ────────────────────────────────
  console.log('Authenticating as admin…');
  try {
    await pb.admins.authWithPassword(
      process.env.PB_ADMIN_EMAIL,
      process.env.PB_ADMIN_PASSWORD,
    );
  } catch {
    // PocketBase ≥ 0.23 uses _superusers collection
    await pb.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_EMAIL,
      process.env.PB_ADMIN_PASSWORD,
    );
  }
  console.log('Authenticated.');

  // ── 2. Add 'role' field to users collection ─────────────────
  console.log("Adding 'role' field to users collection…");
  const usersCollection = await pb.collections.getOne('users');

  // System fields that can't be sent back in an update
  const SYSTEM_FIELDS = new Set(['id', 'password', 'tokenKey', 'email', 'emailVisibility', 'verified', 'created', 'updated']);
  const customFields = (usersCollection.fields ?? []).filter(f => !SYSTEM_FIELDS.has(f.name));
  const alreadyHasRole = customFields.some(f => f.name === 'role');

  if (!alreadyHasRole) {
    await pb.collections.update('users', {
      fields: [
        ...customFields,
        {
          name: 'role',
          type: 'select',
          required: false,
          maxSelect: 1,
          values: ['student', 'teacher'],
        },
      ],
    });
    console.log("  → 'role' field added.");
  } else {
    console.log("  → 'role' field already exists, skipping.");
  }

  // ── 3. Create 'chapters' collection ─────────────────────────
  console.log("Creating 'chapters' collection…");
  let chaptersExists = false;
  try {
    await pb.collections.getOne('chapters');
    chaptersExists = true;
  } catch { /* doesn't exist yet */ }

  if (!chaptersExists) {
    await pb.collections.create({
      name: 'chapters',
      type: 'base',
      fields: [
        { name: 'chapter_number', type: 'number',  required: true },
        { name: 'title',          type: 'text',    required: true },
        { name: 'subtitle',       type: 'text',    required: false },
        { name: 'formulas',       type: 'json',    required: false },
        { name: 'concepts',       type: 'json',    required: false },
        { name: 'exercises',      type: 'json',    required: false },
        { name: 'quiz',           type: 'json',    required: false },
      ],
      // Anyone (even unauthenticated) can read chapters
      listRule:   '',
      viewRule:   '',
      // Only teachers can write
      createRule: '@request.auth.role = "teacher"',
      updateRule: '@request.auth.role = "teacher"',
      deleteRule: '@request.auth.role = "teacher"',
    });
    console.log("  → 'chapters' collection created.");
  } else {
    console.log("  → 'chapters' collection already exists, skipping.");
  }

  console.log('\nSetup complete!');
  console.log('\nNext steps:');
  console.log('  1. Run: node --env-file=.env scripts/seed.js');
  console.log('  2. To make a user a teacher, run in the PocketBase Admin UI:');
  console.log('     Edit the user record → set role = teacher');
}

setup().catch(err => { console.error(err); process.exit(1); });

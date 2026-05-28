/**
 * scripts/setup-pocketbase.js
 *
 * Step 2 schema setup:
 * - Adds a 'role' field to users (student/teacher)
 * - Creates/updates 'courses' collection
 * - Creates/updates 'course_members' collection
 * - Creates/updates 'chapters' collection with required 'course_id' relation
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

const SYSTEM_FIELDS = new Set([
  'id',
  'created',
  'updated',
  'password',
  'tokenKey',
  'email',
  'emailVisibility',
  'verified',
]);

function customFields(collection) {
  return (collection.fields ?? []).filter(f => !SYSTEM_FIELDS.has(f.name));
}

async function ensureCollection(name, definition) {
  try {
    const existing = await pb.collections.getOne(name);
    const existingCustom = customFields(existing);
    const incomingNames = new Set((definition.fields ?? []).map(f => f.name));
    const missing = (definition.fields ?? []).filter(f => !existingCustom.some(e => e.name === f.name));

    if (missing.length > 0) {
      await pb.collections.update(name, {
        fields: [...existingCustom, ...missing],
      });
      console.log(`  → '${name}' collection updated (added missing fields: ${[...missing.map(f => f.name)].join(', ')}).`);
    } else {
      console.log(`  → '${name}' collection already exists, skipping.`);
    }

    // Best-effort rules sync if provided.
    if (definition.listRule !== undefined || definition.viewRule !== undefined
      || definition.createRule !== undefined || definition.updateRule !== undefined
      || definition.deleteRule !== undefined) {
      await pb.collections.update(name, {
        fields: customFields(await pb.collections.getOne(name)),
        listRule:   definition.listRule,
        viewRule:   definition.viewRule,
        createRule: definition.createRule,
        updateRule: definition.updateRule,
        deleteRule: definition.deleteRule,
      });
    }

    // Return latest version
    return pb.collections.getOne(name);
  } catch {
    const created = await pb.collections.create({
      name,
      type: 'base',
      ...definition,
    });
    console.log(`  → '${name}' collection created.`);
    return created;
  }
}

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

  const usersCustomFields = customFields(usersCollection);
  const alreadyHasRole = usersCustomFields.some(f => f.name === 'role');

  if (!alreadyHasRole) {
    await pb.collections.update('users', {
      fields: [
        ...usersCustomFields,
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

  // ── 3. Create/update 'courses' collection ───────────────────
  console.log("Creating/updating 'courses' collection…");
  const courses = await ensureCollection('courses', {
    fields: [
      { name: 'name',           type: 'text',   required: true },
      { name: 'subtitle',       type: 'text',   required: false },
      { name: 'published',      type: 'bool',   required: false },
      {
        name: 'language',
        type: 'select',
        required: false,
        maxSelect: 1,
        values: ['nl', 'en', 'de', 'fr', 'es', 'it', 'pt', 'pl'],
      },
      { name: 'subject_prompt', type: 'text',   required: false },
    ],
    listRule:   '',
    viewRule:   '',
    createRule: '@request.auth.role = "teacher"',
    updateRule: '@request.auth.role = "teacher"',
    deleteRule: '@request.auth.role = "teacher"',
  });

  // ── 4. Create/update 'course_members' collection ────────────
  console.log("Creating/updating 'course_members' collection…");
  await ensureCollection('course_members', {
    fields: [
      {
        name: 'course_id',
        type: 'relation',
        required: true,
        maxSelect: 1,
        collectionId: courses.id,
        cascadeDelete: true,
      },
      {
        name: 'user_id',
        type: 'relation',
        required: true,
        maxSelect: 1,
        collectionId: usersCollection.id,
        cascadeDelete: true,
      },
      {
        name: 'role',
        type: 'select',
        required: true,
        maxSelect: 1,
        values: ['owner', 'editor'],
      },
    ],
    listRule:   '@request.auth.role = "teacher"',
    viewRule:   '@request.auth.role = "teacher"',
    createRule: '@request.auth.role = "teacher"',
    updateRule: '@request.auth.role = "teacher"',
    deleteRule: '@request.auth.role = "teacher"',
  });

  // ── 5. Create/update 'chapters' collection ──────────────────
  console.log("Creating/updating 'chapters' collection…");
  await ensureCollection('chapters', {
    fields: [
      {
        name: 'course_id',
        type: 'relation',
        required: true,
        maxSelect: 1,
        collectionId: courses.id,
        cascadeDelete: true,
      },
      { name: 'chapter_number', type: 'number', required: true },
      { name: 'title',          type: 'text',   required: true },
      { name: 'subtitle',       type: 'text',   required: false },
      { name: 'formulas',       type: 'json',   required: false },
      { name: 'concepts',       type: 'json',   required: false },
      { name: 'exercises',      type: 'json',   required: false },
      { name: 'quiz',           type: 'json',   required: false },
    ],
    // Read stays public for now.
    listRule:   '',
    viewRule:   '',
    // Write remains teacher-only at Step 2.
    createRule: '@request.auth.role = "teacher"',
    updateRule: '@request.auth.role = "teacher"',
    deleteRule: '@request.auth.role = "teacher"',
  });

  console.log('\nSetup complete!');
  console.log('\nNext steps:');
  console.log('  1. Start the app: npm run dev');
  console.log('  2. Log in as teacher and create your first course');
  console.log('  3. Import chapter JSON backups into that course');
  console.log('  4. To make a user a teacher, run in the PocketBase Admin UI:');
  console.log('     Edit the user record → set role = teacher');
}

setup().catch(err => { console.error(err); process.exit(1); });

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
  const courseTeacherMemberRule = '@request.auth.role = "teacher" && @collection.course_members.course_id ?= id && @collection.course_members.user_id ?= @request.auth.id';
  const courseTeacherOwnerRule = '@request.auth.role = "teacher" && @collection.course_members.course_id ?= id && @collection.course_members.user_id ?= @request.auth.id && @collection.course_members.role ?= "owner"';
  const courseStudentPublishedRule = '@request.auth.role = "student" && published = true';
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
    listRule:   `(${courseTeacherMemberRule}) || (${courseStudentPublishedRule})`,
    viewRule:   `(${courseTeacherMemberRule}) || (${courseStudentPublishedRule})`,
    createRule: '@request.auth.role = "teacher"',
    updateRule: courseTeacherOwnerRule,
    deleteRule: courseTeacherOwnerRule,
  });

  // ── 4. Create/update 'course_members' collection ────────────
  console.log("Creating/updating 'course_members' collection…");
  const ownerForTargetCourse = '@request.auth.role = "teacher" && @collection.course_members.course_id ?= course_id && @collection.course_members.user_id ?= @request.auth.id && @collection.course_members.role ?= "owner"';
  const selfMembershipRule = '@request.auth.role = "teacher" && user_id = @request.auth.id';
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
    listRule:   `(${selfMembershipRule}) || (${ownerForTargetCourse})`,
    viewRule:   `(${selfMembershipRule}) || (${ownerForTargetCourse})`,
    createRule: '@request.auth.role = "teacher" && ((role = "owner" && user_id = @request.auth.id) || (@collection.course_members.course_id ?= course_id && @collection.course_members.user_id ?= @request.auth.id && @collection.course_members.role ?= "owner"))',
    updateRule: `${ownerForTargetCourse} && role != "owner"`,
    deleteRule: `${ownerForTargetCourse} && role != "owner"`,
  });

  // ── 4b. Backfill legacy memberships for existing courses ───
  console.log("Backfilling legacy course memberships…");
  try {
    const teachers = await pb.collection('users').getFullList({
      filter: 'role = "teacher"',
    });

    if (teachers.length === 0) {
      console.log('  → No teachers found, skipping membership backfill.');
    } else {
      const teacherIds = new Set(teachers.map(t => t.id));
      const allCourses = await pb.collection('courses').getFullList();
      const allMembers = await pb.collection('course_members').getFullList();

      const membersByCourse = new Map();
      for (const member of allMembers) {
        if (!membersByCourse.has(member.course_id)) membersByCourse.set(member.course_id, []);
        membersByCourse.get(member.course_id).push(member);
      }

      let createdOwners = 0;
      let createdEditors = 0;
      let promotedOwners = 0;

      for (const course of allCourses) {
        const members = membersByCourse.get(course.id) ?? [];
        const hasOwner = members.some(m => m.role === 'owner');

        if (members.length === 0) {
          // Legacy course without memberships: attach teachers so it stays accessible.
          const ownerRecord = await pb.collection('course_members').create({
            course_id: course.id,
            user_id: teachers[0].id,
            role: 'owner',
          });
          createdOwners += 1;

          const nextMembers = [ownerRecord];
          for (const teacher of teachers.slice(1)) {
            const editorRecord = await pb.collection('course_members').create({
              course_id: course.id,
              user_id: teacher.id,
              role: 'editor',
            });
            nextMembers.push(editorRecord);
            createdEditors += 1;
          }
          membersByCourse.set(course.id, nextMembers);
          continue;
        }

        if (!hasOwner) {
          // Ensure each course has an owner.
          const preferred = members.find(m => teacherIds.has(m.user_id)) ?? members[0];
          await pb.collection('course_members').update(preferred.id, { role: 'owner' });
          promotedOwners += 1;
        }
      }

      console.log(`  → Backfill complete: ${createdOwners} owner(s), ${createdEditors} editor(s) created, ${promotedOwners} owner(s) promoted.`);
    }
  } catch (err) {
    console.warn(`  → Membership backfill skipped due to error: ${err.message}`);
  }

  // ── 5. Create/update 'chapters' collection ──────────────────
  console.log("Creating/updating 'chapters' collection…");
  const chapterTeacherMemberRule = '@request.auth.role = "teacher" && @collection.course_members.course_id ?= course_id && @collection.course_members.user_id ?= @request.auth.id';
  const chapterStudentPublishedRule = '@request.auth.role = "student" && course_id.published = true';
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
    listRule:   `(${chapterTeacherMemberRule}) || (${chapterStudentPublishedRule})`,
    viewRule:   `(${chapterTeacherMemberRule}) || (${chapterStudentPublishedRule})`,
    createRule: chapterTeacherMemberRule,
    updateRule: chapterTeacherMemberRule,
    deleteRule: chapterTeacherMemberRule,
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

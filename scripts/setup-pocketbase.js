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
 *
 * Optional env vars:
 *   TEACHER_SIGNUP_TOKEN  secret token for teacher self-registration links
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
  let existing = null;
  try {
    existing = await pb.collections.getOne(name);
  } catch {
    // Some PocketBase versions can fail getOne(name) even if the collection exists.
    // Fallback to name lookup from full list before creating.
    try {
      const all = await pb.collections.getFullList();
      const matched = all.find(c => c.name === name);
      if (matched) {
        const existingCustom = customFields(matched);
        const missing = (definition.fields ?? []).filter(f => !existingCustom.some(e => e.name === f.name));

        if (missing.length > 0) {
          await pb.collections.update(matched.id, {
            fields: [...existingCustom, ...missing],
          });
          console.log(`  → '${name}' collection updated (added missing fields: ${[...missing.map(f => f.name)].join(', ')}).`);
        } else {
          console.log(`  → '${name}' collection already exists, skipping.`);
        }

        if (definition.listRule !== undefined || definition.viewRule !== undefined
          || definition.createRule !== undefined || definition.updateRule !== undefined
          || definition.deleteRule !== undefined) {
          await pb.collections.update(matched.id, {
            fields: customFields(await pb.collections.getOne(matched.id)),
            listRule:   definition.listRule,
            viewRule:   definition.viewRule,
            createRule: definition.createRule,
            updateRule: definition.updateRule,
            deleteRule: definition.deleteRule,
          });
        }

        return pb.collections.getOne(matched.id);
      }
    } catch {
      // Ignore and continue with create flow below.
    }
  }

  if (existing) {
    const existingCustom = customFields(existing);
    const missing = (definition.fields ?? []).filter(f => !existingCustom.some(e => e.name === f.name));

    if (missing.length > 0) {
      await pb.collections.update(existing.id, {
        fields: [...existingCustom, ...missing],
      });
      console.log(`  → '${name}' collection updated (added missing fields: ${[...missing.map(f => f.name)].join(', ')}).`);
    } else {
      console.log(`  → '${name}' collection already exists, skipping.`);
    }

    if (definition.listRule !== undefined || definition.viewRule !== undefined
      || definition.createRule !== undefined || definition.updateRule !== undefined
      || definition.deleteRule !== undefined) {
      await pb.collections.update(existing.id, {
        fields: customFields(await pb.collections.getOne(existing.id)),
        listRule: definition.listRule,
        viewRule: definition.viewRule,
        createRule: definition.createRule,
        updateRule: definition.updateRule,
        deleteRule: definition.deleteRule,
      });
    }

    return pb.collections.getOne(existing.id);
  }

  const created = await pb.collections.create({
    name,
    type: 'base',
    ...definition,
  });
  console.log(`  → '${name}' collection created.`);
  return created;
}

async function collectionExists(name) {
  try {
    await pb.collections.getOne(name);
    return true;
  } catch {
    try {
      const all = await pb.collections.getFullList();
      return all.some(c => c.name === name);
    } catch {
      return false;
    }
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
  const alreadyHasSignupToken = usersCustomFields.some(f => f.name === 'signup_token');

  const nextUserFields = usersCustomFields.map(field => {
    if (field.name !== 'role') return field;
    return {
      ...field,
      type: 'select',
      required: false,
      maxSelect: 1,
      values: ['pending', 'student', 'teacher', 'admin'],
    };
  });

  if (!alreadyHasRole) {
    nextUserFields.push({
      name: 'role',
      type: 'select',
      required: false,
      maxSelect: 1,
      values: ['pending', 'student', 'teacher', 'admin'],
    });
    console.log("  → 'role' field added.");
  }

  if (!alreadyHasSignupToken) {
    nextUserFields.push({
      name: 'signup_token',
      type: 'text',
      required: false,
    });
    console.log("  → 'signup_token' field added.");
  }

  await pb.collections.update('users', {
    fields: nextUserFields,
  });
  await pb.collections.update('users', {
    fields: customFields(await pb.collections.getOne('users')),
    listRule: '@request.auth.role = "teacher" || @request.auth.role = "admin"',
    viewRule: '@request.auth.id = id || @request.auth.role = "teacher" || @request.auth.role = "admin"',
    updateRule: '@request.auth.id = id || @request.auth.role = "admin"',
    deleteRule: '@request.auth.role = "admin"',
  });
  if (alreadyHasRole && alreadyHasSignupToken) {
    console.log("  → 'users' fields synced (role options refreshed).");
  }

  const teacherSignupToken = String(process.env.TEACHER_SIGNUP_TOKEN ?? '').trim();
  if (teacherSignupToken) {
    console.log('  → TEACHER_SIGNUP_TOKEN detected (enforced in app signup flow).');
  }

  // ── 3. Create/update 'courses' collection ───────────────────
  console.log("Creating/updating 'courses' collection…");
  const courseTeacherMemberRule = '(@request.auth.role = "teacher" || @request.auth.role = "admin") && @collection.course_members.course_id ?= id && @collection.course_members.user_id ?= @request.auth.id';
  const courseTeacherOwnerRule = '(@request.auth.role = "teacher" || @request.auth.role = "admin") && @collection.course_members.course_id ?= id && @collection.course_members.user_id ?= @request.auth.id && @collection.course_members.role ?= "owner"';
  const courseTeacherBootstrapRule = '@request.auth.role = "teacher" || @request.auth.role = "admin"';
  const courseStudentPublishedRule = '@request.auth.role = "student" && published = true';
  const courseGuestPublicRule = 'published = true && public = true';
  const hasCourseMembersCollection = await collectionExists('course_members');
  const courses = await ensureCollection('courses', {
    fields: [
      { name: 'name',           type: 'text',   required: true },
      { name: 'subtitle',       type: 'text',   required: false },
      { name: 'published',      type: 'bool',   required: false },
      { name: 'public',         type: 'bool',   required: false },
      {
        name: 'language',
        type: 'select',
        required: false,
        maxSelect: 1,
        values: ['nl', 'en', 'de', 'fr', 'es', 'it', 'pt', 'pl'],
      },
      { name: 'subject_prompt', type: 'text',   required: false },
    ],
    listRule:   `(${hasCourseMembersCollection ? courseTeacherMemberRule : courseTeacherBootstrapRule}) || (${courseStudentPublishedRule}) || (${courseGuestPublicRule})`,
    viewRule:   `(${hasCourseMembersCollection ? courseTeacherMemberRule : courseTeacherBootstrapRule}) || (${courseStudentPublishedRule}) || (${courseGuestPublicRule})`,
    createRule: '@request.auth.role = "teacher" || @request.auth.role = "admin"',
    updateRule: hasCourseMembersCollection ? courseTeacherOwnerRule : courseTeacherBootstrapRule,
    deleteRule: hasCourseMembersCollection ? courseTeacherOwnerRule : courseTeacherBootstrapRule,
  });

  // ── 4. Create/update 'course_members' collection ────────────
  console.log("Creating/updating 'course_members' collection…");
  const ownerForTargetCourse = '(@request.auth.role = "teacher" || @request.auth.role = "admin") && @collection.course_members.course_id ?= course_id && @collection.course_members.user_id ?= @request.auth.id && @collection.course_members.role ?= "owner"';
  const selfMembershipRule = '(@request.auth.role = "teacher" || @request.auth.role = "admin") && user_id = @request.auth.id';
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
    createRule: '(@request.auth.role = "teacher" || @request.auth.role = "admin") && ((role = "owner" && user_id = @request.auth.id) || (@collection.course_members.course_id ?= course_id && @collection.course_members.user_id ?= @request.auth.id && @collection.course_members.role ?= "owner"))',
    updateRule: `${ownerForTargetCourse} && role != "owner"`,
    deleteRule: `${ownerForTargetCourse} && role != "owner"`,
  });

  // If we created/updated courses before course_members existed, tighten now.
  if (!hasCourseMembersCollection) {
    await pb.collections.update('courses', {
      fields: customFields(await pb.collections.getOne('courses')),
      listRule: `(${courseTeacherMemberRule}) || (${courseStudentPublishedRule}) || (${courseGuestPublicRule})`,
      viewRule: `(${courseTeacherMemberRule}) || (${courseStudentPublishedRule}) || (${courseGuestPublicRule})`,
      createRule: '@request.auth.role = "teacher" || @request.auth.role = "admin"',
      updateRule: courseTeacherOwnerRule,
      deleteRule: courseTeacherOwnerRule,
    });
  }

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
  const chapterTeacherMemberRule = '(@request.auth.role = "teacher" || @request.auth.role = "admin") && @collection.course_members.course_id ?= course_id && @collection.course_members.user_id ?= @request.auth.id';
  const chapterStudentPublishedRule = '@request.auth.role = "student" && course_id.published = true';
  const chapterGuestPublicRule = 'course_id.published = true && course_id.public = true';
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
    listRule:   `(${chapterTeacherMemberRule}) || (${chapterStudentPublishedRule}) || (${chapterGuestPublicRule})`,
    viewRule:   `(${chapterTeacherMemberRule}) || (${chapterStudentPublishedRule}) || (${chapterGuestPublicRule})`,
    createRule: chapterTeacherMemberRule,
    updateRule: chapterTeacherMemberRule,
    deleteRule: chapterTeacherMemberRule,
  });

  // ── 6. Create/update 'course_invites' collection ────────────
  console.log("Creating/updating 'course_invites' collection…");
  const ownerInviteRule = '(@request.auth.role = "teacher" || @request.auth.role = "admin") && @collection.course_members.course_id ?= course_id && @collection.course_members.user_id ?= @request.auth.id && @collection.course_members.role ?= "owner"';
  await ensureCollection('course_invites', {
    fields: [
      {
        name: 'course_id',
        type: 'relation',
        required: true,
        maxSelect: 1,
        collectionId: courses.id,
        cascadeDelete: true,
      },
      { name: 'code', type: 'text', required: true },
      { name: 'active', type: 'bool', required: false },
      { name: 'max_uses', type: 'number', required: false },
      { name: 'used_count', type: 'number', required: false },
      { name: 'expires_at', type: 'date', required: false },
      {
        name: 'created_by',
        type: 'relation',
        required: false,
        maxSelect: 1,
        collectionId: usersCollection.id,
        cascadeDelete: false,
      },
    ],
    listRule: ownerInviteRule,
    viewRule: ownerInviteRule,
    createRule: ownerInviteRule,
    updateRule: ownerInviteRule,
    deleteRule: ownerInviteRule,
  });

  // ── 7. Create/update 'course_enrollments' collection ────────
  console.log("Creating/updating 'course_enrollments' collection…");
  await ensureCollection('course_enrollments', {
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
        name: 'invite_id',
        type: 'relation',
        required: false,
        maxSelect: 1,
        collectionId: (await pb.collections.getOne('course_invites')).id,
        cascadeDelete: false,
      },
    ],
    listRule: '@request.auth.id = user_id || @request.auth.role = "admin" || ((@request.auth.role = "teacher" || @request.auth.role = "admin") && @collection.course_members.course_id ?= course_id && @collection.course_members.user_id ?= @request.auth.id)',
    viewRule: '@request.auth.id = user_id || @request.auth.role = "admin" || ((@request.auth.role = "teacher" || @request.auth.role = "admin") && @collection.course_members.course_id ?= course_id && @collection.course_members.user_id ?= @request.auth.id)',
    createRule: '(@request.auth.role = "student" && user_id = @request.auth.id) || @request.auth.role = "admin"',
    updateRule: '@request.auth.role = "admin"',
    deleteRule: '@request.auth.role = "admin"',
  });

  // ── 8. Tighten student rules while allowing explicitly public guest courses ──
  console.log('Applying enrollment-based student and public guest access rules…');
  const strictCourseStudentEnrollmentRule = '@request.auth.role = "student" && published = true && @collection.course_enrollments.course_id ?= id && @collection.course_enrollments.user_id ?= @request.auth.id';
  const strictCourseGuestRule = 'published = true && public = true';
  const strictCourseStudentRuleParts = [strictCourseStudentEnrollmentRule, strictCourseGuestRule];
  const strictCourseStudentRule = strictCourseStudentRuleParts.map(p => `(${p})`).join(' || ');

  const strictChapterStudentEnrollmentRule = '@request.auth.role = "student" && course_id.published = true && @collection.course_enrollments.course_id ?= course_id && @collection.course_enrollments.user_id ?= @request.auth.id';
  const strictChapterGuestRule = 'course_id.published = true && course_id.public = true';
  const strictChapterStudentRuleParts = [strictChapterStudentEnrollmentRule, strictChapterGuestRule];
  const strictChapterStudentRule = strictChapterStudentRuleParts.map(p => `(${p})`).join(' || ');

  await pb.collections.update('courses', {
    fields: customFields(await pb.collections.getOne('courses')),
    listRule: `(${courseTeacherMemberRule}) || (${strictCourseStudentRule})`,
    viewRule: `(${courseTeacherMemberRule}) || (${strictCourseStudentRule})`,
    createRule: '@request.auth.role = "teacher"',
    updateRule: courseTeacherOwnerRule,
    deleteRule: courseTeacherOwnerRule,
  });

  await pb.collections.update('chapters', {
    fields: customFields(await pb.collections.getOne('chapters')),
    listRule: `(${chapterTeacherMemberRule}) || (${strictChapterStudentRule})`,
    viewRule: `(${chapterTeacherMemberRule}) || (${strictChapterStudentRule})`,
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

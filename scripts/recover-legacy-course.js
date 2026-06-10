import PocketBase from 'pocketbase';

function parseArgs(argv) {
  const out = {
    course: '',
    email: '',
    role: 'owner',
    language: 'nl',
    publish: false,
    allChapters: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === '--publish') {
      out.publish = true;
      continue;
    }
    if (key === '--all-chapters') {
      out.allChapters = true;
      continue;
    }
    if (!value || value.startsWith('--')) continue;
    if (key === '--course') out.course = value;
    if (key === '--email') out.email = value;
    if (key === '--role') out.role = value;
    if (key === '--language') out.language = value;
  }

  return out;
}

function escapeFilterValue(value) {
  return String(value).replaceAll('"', '\\"');
}

async function authAdmin(pb) {
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
}

async function findOrCreateCourse(pb, { course, language, publish }) {
  const existing = await pb.collection('courses').getFullList({
    filter: `name = "${escapeFilterValue(course)}"`,
  });

  if (existing.length > 0) {
    return { record: existing[0], created: false };
  }

  const created = await pb.collection('courses').create({
    name: course,
    subtitle: '',
    published: !!publish,
    language: language || 'nl',
    subject_prompt: '',
  });
  return { record: created, created: true };
}

async function ensureMembership(pb, { courseId, userId, role }) {
  const memberships = await pb.collection('course_members').getFullList({
    filter: `course_id = "${courseId}" && user_id = "${userId}"`,
  });

  if (memberships.length > 0) {
    const existing = memberships[0];
    if (existing.role !== role) {
      await pb.collection('course_members').update(existing.id, { role });
      return 'updated';
    }
    return 'unchanged';
  }

  await pb.collection('course_members').create({
    course_id: courseId,
    user_id: userId,
    role,
  });
  return 'created';
}

async function reassignChapters(pb, courseId, allChapters) {
  const chapters = await pb.collection('chapters').getFullList();
  const selected = allChapters
    ? chapters.filter(ch => ch.course_id !== courseId)
    : chapters.filter(ch => !ch.course_id);

  let reassigned = 0;
  for (const chapter of selected) {
    await pb.collection('chapters').update(chapter.id, {
      course_id: courseId,
    });
    reassigned += 1;
  }

  return {
    total: chapters.length,
    selected: selected.length,
    reassigned,
    mode: allChapters ? 'all' : 'orphans',
  };
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.course || !args.email) {
    console.error('Usage: node --env-file=.env scripts/recover-legacy-course.js --course "QF1" --email "teacher@example.com" [--role owner|editor] [--language nl] [--publish] [--all-chapters]');
    process.exit(1);
  }
  if (!['owner', 'editor'].includes(args.role)) {
    console.error('Invalid --role. Use owner or editor.');
    process.exit(1);
  }

  const pb = new PocketBase(process.env.POCKETBASE_URL ?? 'http://localhost:8090');
  await authAdmin(pb);

  const users = await pb.collection('users').getFullList({
    filter: `email = "${escapeFilterValue(args.email)}"`,
  });
  if (users.length === 0) {
    console.error(`No user found for email: ${args.email}`);
    process.exit(1);
  }
  const user = users[0];

  const { record: course, created } = await findOrCreateCourse(pb, args);
  const membershipResult = await ensureMembership(pb, {
    courseId: course.id,
    userId: user.id,
    role: args.role,
  });

  const stats = await reassignChapters(pb, course.id, args.allChapters);

  console.log(created
    ? `Created course: ${course.name} (${course.id})`
    : `Using existing course: ${course.name} (${course.id})`);
  console.log(`Membership: ${membershipResult} (${args.email} -> ${args.role})`);
  console.log(`Chapters (${stats.mode} mode): ${stats.total} total, ${stats.selected} selected, ${stats.reassigned} reassigned to ${course.name}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

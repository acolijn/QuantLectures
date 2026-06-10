import PocketBase from 'pocketbase';

function parseArgs(argv) {
  const out = {
    course: '',
    email: '',
    role: 'owner',
  };

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) continue;
    if (key === '--course') out.course = value;
    if (key === '--email') out.email = value;
    if (key === '--role') out.role = value;
  }

  return out;
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

async function main() {
  const { course, email, role } = parseArgs(process.argv);
  if (!course || !email) {
    console.error('Usage: node --env-file=.env scripts/fix-course-membership.js --course "QF1" --email "teacher@example.com" [--role owner|editor]');
    process.exit(1);
  }

  if (!['owner', 'editor'].includes(role)) {
    console.error('Invalid --role. Use owner or editor.');
    process.exit(1);
  }

  const pb = new PocketBase(process.env.POCKETBASE_URL ?? 'http://localhost:8090');
  await authAdmin(pb);

  const users = await pb.collection('users').getFullList({
    filter: `email = "${email.replace(/"/g, '\\"')}"`,
  });
  if (users.length === 0) {
    console.error(`No user found for email: ${email}`);
    process.exit(1);
  }
  const user = users[0];

  const courses = await pb.collection('courses').getFullList({
    filter: `name = "${course.replace(/"/g, '\\"')}"`,
  });
  if (courses.length === 0) {
    console.error(`No course found with name: ${course}`);
    process.exit(1);
  }
  const targetCourse = courses[0];

  const memberships = await pb.collection('course_members').getFullList({
    filter: `course_id = "${targetCourse.id}" && user_id = "${user.id}"`,
  });

  if (memberships.length > 0) {
    const existing = memberships[0];
    if (existing.role !== role) {
      await pb.collection('course_members').update(existing.id, { role });
      console.log(`Updated membership: ${email} is now ${role} for ${course}.`);
    } else {
      console.log(`Membership already exists: ${email} is ${role} for ${course}.`);
    }
  } else {
    await pb.collection('course_members').create({
      course_id: targetCourse.id,
      user_id: user.id,
      role,
    });
    console.log(`Created membership: ${email} is now ${role} for ${course}.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

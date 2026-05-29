import { pb } from './pocketbase';

function escapeFilterValue(value) {
  return String(value).replaceAll('"', '\\"');
}

function isTeacher() {
  return pb.authStore.model?.role === 'teacher';
}

function toCourse(record) {
  return {
    id:            record.id,
    name:          record.name,
    subtitle:      record.subtitle ?? '',
    published:     !!record.published,
    language:      record.language ?? 'nl',
    subjectPrompt: record.subject_prompt ?? '',
    memberRole:    record.memberRole ?? null,
  };
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildOrFilter(field, values) {
  if (!Array.isArray(values) || values.length === 0) return '';
  return values.map(v => `${field}="${escapeFilterValue(v)}"`).join(' || ');
}

async function getMyMemberships() {
  if (!pb.authStore.model?.id) return [];

  try {
    return await pb.collection('course_members').getFullList({
      filter: `user_id="${escapeFilterValue(pb.authStore.model.id)}"`,
    });
  } catch {
    return [];
  }
}

async function getMyMembership(courseId) {
  if (!pb.authStore.model?.id || !courseId) return null;

  try {
    return await pb.collection('course_members').getFirstListItem(
      `course_id="${escapeFilterValue(courseId)}" && user_id="${escapeFilterValue(pb.authStore.model.id)}"`
    );
  } catch {
    return null;
  }
}

// Map a raw PocketBase record to the shape the app expects.
// The app uses chapter.id as the chapter number (1, 2, …).
function toChapter(record) {
  return {
    pbId:      record.id,
    courseId:  record.course_id,
    id:        record.chapter_number,
    title:     record.title,
    subtitle:  record.subtitle,
    formulas:  record.formulas  ?? [],
    concepts:  record.concepts  ?? [],
    exercises: record.exercises ?? [],
    quiz:      record.quiz      ?? [],
  };
}

export async function fetchCourses() {
  if (!isTeacher()) {
    const records = await pb.collection('courses').getFullList({
      sort: 'name',
      filter: 'published=true',
    });
    return records.map(toCourse);
  }

  const memberships = await getMyMemberships();
  if (memberships.length === 0) return [];

  const roleByCourse = new Map(memberships.map(m => [m.course_id, m.role]));
  const filter = buildOrFilter('id', memberships.map(m => m.course_id));
  if (!filter) return [];

  const records = await pb.collection('courses').getFullList({
    sort: 'name',
    filter,
  });

  return records.map(record => toCourse({
    ...record,
    memberRole: roleByCourse.get(record.id) ?? null,
  }));
}

export async function createCourse(payload = {}) {
  const record = await pb.collection('courses').create({
    name:           payload.name ?? 'Nieuwe cursus',
    subtitle:       payload.subtitle ?? '',
    published:      payload.published ?? false,
    language:       payload.language ?? 'nl',
    subject_prompt: payload.subjectPrompt ?? '',
  });

  // Best effort: if the course_members collection exists, register the creator as owner.
  if (pb.authStore.model?.id) {
    try {
      await pb.collection('course_members').create({
        course_id: record.id,
        user_id:   pb.authStore.model.id,
        role:      'owner',
      });
    } catch {
      // Ignore when collection/rules are not yet available.
    }
  }

  return toCourse({
    ...record,
    memberRole: pb.authStore.model?.id ? 'owner' : null,
  });
}

export async function updateCourse(courseId, updates) {
  const record = await pb.collection('courses').update(courseId, {
    name:           updates.name,
    subtitle:       updates.subtitle,
    published:      updates.published,
    language:       updates.language,
    subject_prompt: updates.subjectPrompt,
  });
  const myMembership = await getMyMembership(courseId);
  return toCourse({
    ...record,
    memberRole: myMembership?.role ?? null,
  });
}

function toMember(record) {
  const expandedUser = record.expand?.user_id;
  return {
    id: record.id,
    courseId: record.course_id,
    userId: record.user_id,
    role: record.role,
    email: expandedUser?.email ?? '',
    name: expandedUser?.name ?? expandedUser?.email ?? '',
  };
}

export async function fetchCourseMembers(courseId) {
  const records = await pb.collection('course_members').getFullList({
    filter: `course_id="${escapeFilterValue(courseId)}"`,
    expand: 'user_id',
  });
  return records.map(toMember);
}

export async function addCourseEditorByEmail(courseId, email) {
  const normalizedEmail = String(email).trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Vul een geldig e-mailadres in.');
  }

  const emailFilter = `email ~ "^${escapeRegex(normalizedEmail)}$"`;
  const user = await pb.collection('users').getFirstListItem(emailFilter);
  if (user.role !== 'teacher') {
    throw new Error('Alleen gebruikers met rol teacher kunnen editor worden.');
  }

  const existing = await pb.collection('course_members').getFullList({
    filter: `course_id="${escapeFilterValue(courseId)}" && user_id="${escapeFilterValue(user.id)}"`,
  });
  if (existing.length > 0) {
    throw new Error('Deze gebruiker is al lid van de cursus.');
  }

  const created = await pb.collection('course_members').create({
    course_id: courseId,
    user_id: user.id,
    role: 'editor',
  });

  const withExpand = await pb.collection('course_members').getOne(created.id, {
    expand: 'user_id',
  });
  return toMember(withExpand);
}

export async function removeCourseEditor(memberId) {
  const record = await pb.collection('course_members').getOne(memberId);
  if (record.role === 'owner') {
    throw new Error('Owner kan niet via deze actie verwijderd worden.');
  }
  await pb.collection('course_members').delete(memberId);
}

export async function fetchChapters(courseId) {
  const filter = `course_id="${escapeFilterValue(courseId)}"`;
  const records = await pb.collection('chapters').getFullList({
    sort: 'chapter_number',
    filter,
  });
  return records.map(toChapter);
}

export async function updateChapter(chapterNumber, updates, courseId) {
  const filter = `chapter_number=${chapterNumber} && course_id="${escapeFilterValue(courseId)}"`;
  const existing = await pb.collection('chapters')
    .getFirstListItem(filter);
  const record = await pb.collection('chapters').update(existing.id, {
    course_id:  courseId,
    title:     updates.title,
    subtitle:  updates.subtitle,
    formulas:  updates.formulas,
    concepts:  updates.concepts,
    exercises: updates.exercises,
    quiz:      updates.quiz,
  });
  return toChapter(record);
}

export async function deleteChapter(chapterNumber, courseId) {
  const filter = `chapter_number=${chapterNumber} && course_id="${escapeFilterValue(courseId)}"`;
  const existing = await pb.collection('chapters')
    .getFirstListItem(filter);
  await pb.collection('chapters').delete(existing.id);
}

export async function createChapter(chapterNumber, courseId) {
  const record = await pb.collection('chapters').create({
    course_id:      courseId,
    chapter_number: chapterNumber,
    title:          'Nieuw hoofdstuk',
    subtitle:       '',
    formulas:       [],
    concepts:       [],
    exercises:      [],
    quiz:           [],
  });
  return toChapter(record);
}

// Reassign chapter_number = index+1 for each chapter in the new order.
// No unique constraint exists, so parallel updates are safe.
export async function reorderChapters(chapters, courseId) {
  const records = await Promise.all(
    chapters.map((ch, i) =>
      pb.collection('chapters').update(ch.pbId, {
        course_id:      courseId,
        chapter_number: i + 1,
      })
    )
  );
  return records.map(toChapter);
}

export async function upsertChapter(chapter, courseId) {
  let record;
  const filter = `chapter_number=${chapter.id} && course_id="${escapeFilterValue(courseId)}"`;
  try {
    const existing = await pb.collection('chapters')
      .getFirstListItem(filter);
    record = await pb.collection('chapters').update(existing.id, {
      course_id:      courseId,
      chapter_number: chapter.id,
      title:          chapter.title,
      subtitle:       chapter.subtitle,
      formulas:       chapter.formulas  ?? [],
      concepts:       chapter.concepts  ?? [],
      exercises:      chapter.exercises ?? [],
      quiz:           chapter.quiz      ?? [],
    });
  } catch {
    record = await pb.collection('chapters').create({
      course_id:      courseId,
      chapter_number: chapter.id,
      title:          chapter.title,
      subtitle:       chapter.subtitle,
      formulas:       chapter.formulas  ?? [],
      concepts:       chapter.concepts  ?? [],
      exercises:      chapter.exercises ?? [],
      quiz:           chapter.quiz      ?? [],
    });
  }
  return toChapter(record);
}

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
  };
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
  let records;
  if (isTeacher()) {
    records = await pb.collection('courses').getFullList({ sort: 'name' });
  } else {
    records = await pb.collection('courses').getFullList({
      sort: 'name',
      filter: 'published=true',
    });
  }
  return records.map(toCourse);
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

  return toCourse(record);
}

export async function updateCourse(courseId, updates) {
  const record = await pb.collection('courses').update(courseId, {
    name:           updates.name,
    subtitle:       updates.subtitle,
    published:      updates.published,
    language:       updates.language,
    subject_prompt: updates.subjectPrompt,
  });
  return toCourse(record);
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

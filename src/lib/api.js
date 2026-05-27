import { pb } from './pocketbase';

// Map a raw PocketBase record to the shape the app expects.
// The app uses chapter.id as the chapter number (1, 2, …).
function toChapter(record) {
  return {
    pbId:       record.id,          // PocketBase internal string ID
    id:         record.chapter_number, // chapter number used for navigation
    title:      record.title,
    subtitle:   record.subtitle,
    formulas:   record.formulas   ?? [],
    concepts:   record.concepts   ?? [],
    exercises:  record.exercises  ?? [],
    quiz:       record.quiz       ?? [],
  };
}

export async function fetchChapters() {
  const records = await pb.collection('chapters').getFullList({ sort: 'chapter_number' });
  return records.map(toChapter);
}

export async function updateChapter(chapterNumber, updates) {
  // Find the PocketBase record by chapter number
  const existing = await pb.collection('chapters')
    .getFirstListItem(`chapter_number=${chapterNumber}`);
  const record = await pb.collection('chapters').update(existing.id, {
    title:     updates.title,
    subtitle:  updates.subtitle,
    formulas:  updates.formulas,
    concepts:  updates.concepts,
    exercises: updates.exercises,
    quiz:      updates.quiz,
  });
  return toChapter(record);
}

export async function deleteChapter(chapterNumber) {
  const existing = await pb.collection('chapters')
    .getFirstListItem(`chapter_number=${chapterNumber}`);
  await pb.collection('chapters').delete(existing.id);
}

export async function createChapter(chapterNumber) {  const record = await pb.collection('chapters').create({
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

export async function upsertChapter(chapter) {
  let record;
  try {
    const existing = await pb.collection('chapters')
      .getFirstListItem(`chapter_number=${chapter.id}`);
    record = await pb.collection('chapters').update(existing.id, {
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

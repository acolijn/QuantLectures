import { pb } from './pocketbase';

function escapeFilterValue(value) {
  return String(value).replaceAll('"', '\\"');
}

function isTeacher() {
  return pb.authStore.model?.role === 'teacher' || pb.authStore.model?.role === 'admin';
}

function isAdmin() {
  return pb.authStore.model?.role === 'admin';
}

function toCourse(record) {
  return {
    id:            record.id,
    name:          record.name,
    subtitle:      record.subtitle ?? '',
    published:     !!record.published,
    public:        !!record.public,
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
    pbId:        record.id,
    courseId:    record.course_id,
    id:          record.chapter_number,
    title:       record.title,
    subtitle:    record.subtitle,
    formulas:    record.formulas   ?? [],
    concepts:    record.concepts   ?? [],
    exercises:   record.exercises  ?? [],
    quiz:        record.quiz       ?? [],
  };
}

function toFigure(record) {
  return {
    id:       record.id,
    ref:      record.ref,
    caption:  record.caption ?? '',
    filename: record.file,
  };
}

export async function fetchCourses() {
  if (!isTeacher()) {
    const filter = pb.authStore.model?.id ? 'published=true' : 'published=true && public=true';
    const records = await pb.collection('courses').getFullList({
      sort: 'name',
      filter,
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

function toInvite(record) {
  return {
    id: record.id,
    courseId: record.course_id,
    code: record.code,
    active: !!record.active,
    maxUses: record.max_uses ?? null,
    usedCount: record.used_count ?? 0,
    expiresAt: record.expires_at ?? null,
    createdBy: record.created_by ?? null,
  };
}

function toPendingTeacher(record) {
  return {
    id: record.id,
    email: record.email,
    name: record.name ?? '',
    role: record.role,
    created: record.created,
    verified: !!record.verified,
  };
}

export async function fetchCourseInvites(courseId) {
  if (!courseId) return [];

  const records = await pb.collection('course_invites').getFullList({
    filter: `course_id="${escapeFilterValue(courseId)}"`,
    sort: '-created',
  });

  return records.map(toInvite);
}

export async function createCourseInvite(courseId, payload = {}) {
  if (!courseId) throw new Error('Geen cursus geselecteerd.');

  const rawCode = String(payload.code ?? '').trim().toUpperCase();
  if (!rawCode) {
    throw new Error('Voer een invite code in.');
  }

  const created = await pb.collection('course_invites').create({
    course_id: courseId,
    code: rawCode,
    active: payload.active ?? true,
    max_uses: payload.maxUses ?? null,
    expires_at: payload.expiresAt ?? null,
    used_count: 0,
    created_by: pb.authStore.model?.id,
  });

  return toInvite(created);
}

export async function revokeCourseInvite(inviteId) {
  await pb.collection('course_invites').update(inviteId, { active: false });
}

export async function redeemInviteCode(code) {
  if (!pb.authStore.model?.id) {
    throw new Error('Log eerst in om een invite code te gebruiken.');
  }

  const normalized = String(code).trim().toUpperCase();
  if (!normalized) {
    throw new Error('Voer een invite code in.');
  }

  const invite = await pb.collection('course_invites').getFirstListItem(
    `code="${escapeFilterValue(normalized)}" && active=true`
  );

  if (invite.expires_at) {
    const expiresAt = new Date(invite.expires_at).getTime();
    if (!Number.isNaN(expiresAt) && Date.now() > expiresAt) {
      throw new Error('Deze invite code is verlopen.');
    }
  }

  if (typeof invite.max_uses === 'number' && invite.max_uses > 0 && (invite.used_count ?? 0) >= invite.max_uses) {
    throw new Error('Deze invite code heeft het maximum aantal activaties bereikt.');
  }

  const existingEnrollments = await pb.collection('course_enrollments').getFullList({
    filter: `course_id="${escapeFilterValue(invite.course_id)}" && user_id="${escapeFilterValue(pb.authStore.model.id)}"`,
  });

  if (existingEnrollments.length > 0) {
    throw new Error('Je bent al ingeschreven voor deze cursus.');
  }

  await pb.collection('course_enrollments').create({
    course_id: invite.course_id,
    user_id: pb.authStore.model.id,
    invite_id: invite.id,
  });

  await pb.collection('course_invites').update(invite.id, {
    used_count: (invite.used_count ?? 0) + 1,
  });

  return invite.course_id;
}

export async function fetchPendingTeachers() {
  if (!isAdmin()) return [];

  const records = await pb.collection('users').getFullList({
    filter: 'role="pending"',
  });
  return records.map(toPendingTeacher);
}

export async function approvePendingTeacher(userId) {
  if (!isAdmin()) throw new Error('Alleen admins kunnen docenten goedkeuren.');
  await pb.collection('users').update(userId, { role: 'teacher' });
}

export async function rejectPendingTeacher(userId, mode = 'rejected') {
  if (!isAdmin()) throw new Error('Alleen admins kunnen docentaanvragen afwijzen.');

  if (mode === 'delete') {
    await pb.collection('users').delete(userId);
    return;
  }

  await pb.collection('users').update(userId, { role: 'student' });
}

export async function createCourse(payload = {}) {
  const record = await pb.collection('courses').create({
    name:           payload.name ?? 'Nieuwe cursus',
    subtitle:       payload.subtitle ?? '',
    published:      payload.published ?? false,
    public:         payload.public ?? false,
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
    public:         updates.public,
    language:       updates.language,
    subject_prompt: updates.subjectPrompt,
  });
  const myMembership = await getMyMembership(courseId);
  return toCourse({
    ...record,
    memberRole: myMembership?.role ?? null,
  });
}

export async function deleteCourse(courseId) {
  await pb.collection('courses').delete(courseId);
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
    course_id:   courseId,
    title:       updates.title,
    subtitle:    updates.subtitle,
    formulas:    updates.formulas,
    concepts:    updates.concepts,
    exercises:   updates.exercises,
    quiz:        updates.quiz,
    figure_meta: updates.figureMeta ?? [],
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
    figure_meta:    [],
  });
  return toChapter(record);
}

// Fetch all figures for a chapter
export async function fetchChapterFigures(chapterId) {
  try {
    if (!chapterId) {
      console.warn('fetchChapterFigures: chapterId is empty');
      return [];
    }
    const records = await pb.collection('chapter_figures').getFullList({
      filter: `chapter_id='${chapterId}'`,
      sort: 'created',
    });
    console.log(`fetchChapterFigures(${chapterId}): found ${records.length} figures`);
    return records.map(toFigure);
  } catch (err) {
    console.error(`fetchChapterFigures(${chapterId}) error:`, err);
    return [];
  }
}

// Upload/replace a figure. Creates new if figureId not provided, updates if it does.
export async function uploadChapterFigure(chapterId, ref, caption, file, figureId = null) {
  const formData = new FormData();
  formData.append('chapter_id', chapterId);
  formData.append('ref', ref);
  formData.append('caption', caption);
  formData.append('file', file);

  let record;
  if (figureId) {
    // Update existing
    record = await pb.collection('chapter_figures').update(figureId, formData);
  } else {
    // Create new
    record = await pb.collection('chapter_figures').create(formData);
  }
  return toFigure(record);
}

// Update figure metadata
export async function updateChapterFigure(figureId, ref, caption) {
  const record = await pb.collection('chapter_figures').update(figureId, {
    ref,
    caption,
  });
  return toFigure(record);
}

// Delete a figure
export async function deleteChapterFigure(figureId) {
  await pb.collection('chapter_figures').delete(figureId);
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
      formulas:       chapter.formulas   ?? [],
      concepts:       chapter.concepts   ?? [],
      exercises:      chapter.exercises  ?? [],
      quiz:           chapter.quiz       ?? [],
      figure_meta:    chapter.figures?.map(f => ({ ref: f.ref, caption: f.caption ?? '' })) ?? [],
    });
  } catch {
    record = await pb.collection('chapters').create({
      course_id:      courseId,
      chapter_number: chapter.id,
      title:          chapter.title,
      subtitle:       chapter.subtitle,
      formulas:       chapter.formulas   ?? [],
      concepts:       chapter.concepts   ?? [],
      exercises:      chapter.exercises  ?? [],
      quiz:           chapter.quiz       ?? [],
      figure_meta:    chapter.figures?.map(f => ({ ref: f.ref, caption: f.caption ?? '' })) ?? [],
    });
  }
  return toChapter(record);
}

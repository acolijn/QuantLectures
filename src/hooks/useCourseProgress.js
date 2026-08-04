import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clearMyCourseProgress, fetchMyCourseProgress, saveChapterProgress } from '../lib/api';

const LEGACY_STORAGE_PREFIX = 'qm1-progress';

// Progress used to live in localStorage, first under one key shared by every account
// on the browser and later namespaced per user. Both are obsolete now that rows are
// stored server-side; drop them so they cannot resurface.
function clearLegacyStorage() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key === LEGACY_STORAGE_PREFIX || key.startsWith(`${LEGACY_STORAGE_PREFIX}:`)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore private-mode errors.
  }
}

clearLegacyStorage();

/**
 * Server-backed quiz progress for the signed-in user.
 *
 * Rows are stored against the chapter record id, but callers work in chapter
 * numbers, so `chapters` is needed to translate between the two.
 */
export function useCourseProgress(activeCourseId, userId, chapters) {
  const [rows, setRows] = useState([]);
  // Identifies which (course, user) the rows belong to, so a response that arrives
  // after the user switched course or signed out is discarded rather than displayed.
  const loadedFor = useRef(null);

  useEffect(() => {
    const key = `${activeCourseId ?? ''}:${userId ?? ''}`;

    if (!activeCourseId || !userId) {
      loadedFor.current = key;
      setRows([]);
      return;
    }

    let cancelled = false;
    fetchMyCourseProgress(activeCourseId)
      .then(records => {
        if (cancelled) return;
        loadedFor.current = key;
        setRows(records);
      })
      .catch(err => {
        if (cancelled) return;
        console.error('Failed to load course progress:', err);
        loadedFor.current = key;
        setRows([]);
      });

    return () => { cancelled = true; };
  }, [activeCourseId, userId]);

  const chapterIdByNumber = useMemo(() => {
    const map = new Map();
    for (const chapter of chapters ?? []) map.set(chapter.id, chapter.pbId);
    return map;
  }, [chapters]);

  // Consumers index by chapter number.
  const courseProgress = useMemo(() => {
    const numberByChapterId = new Map();
    for (const chapter of chapters ?? []) numberByChapterId.set(chapter.pbId, chapter.id);

    const byNumber = {};
    for (const row of rows) {
      const number = numberByChapterId.get(row.chapterId);
      if (number === undefined) continue; // chapter deleted, or chapters not loaded yet
      byNumber[number] = {
        quizCompleted: row.quizCompleted,
        bestScore: row.bestScore,
        lastAttempt: row.lastAttempt,
        attempts: row.attempts,
      };
    }
    return byNumber;
  }, [rows, chapters]);

  const updateProgress = useCallback(async (chapterNumber, score) => {
    if (!userId || !activeCourseId) return;

    const chapterId = chapterIdByNumber.get(chapterNumber);
    if (!chapterId) return;

    // Show the new score straight away; the server is the source of truth once it replies.
    setRows(prev => {
      const existing = prev.find(r => r.chapterId === chapterId);
      const merged = {
        ...(existing ?? { id: null, courseId: activeCourseId, chapterId, attempts: 0 }),
        quizCompleted: true,
        bestScore: Math.max(score, existing?.bestScore ?? 0),
        attempts: (existing?.attempts ?? 0) + 1,
        lastAttempt: new Date().toISOString(),
      };
      return existing
        ? prev.map(r => (r.chapterId === chapterId ? merged : r))
        : [...prev, merged];
    });

    try {
      const saved = await saveChapterProgress({ courseId: activeCourseId, chapterId, score });
      if (!saved) return;
      setRows(prev => prev.map(r => (r.chapterId === chapterId ? saved : r)));
    } catch (err) {
      console.error('Failed to save quiz progress:', err);
    }
  }, [activeCourseId, userId, chapterIdByNumber]);

  const resetCourseProgress = useCallback(async () => {
    if (!userId || !activeCourseId) return;

    const previous = rows;
    setRows([]);
    try {
      await clearMyCourseProgress(activeCourseId);
    } catch (err) {
      console.error('Failed to reset course progress:', err);
      setRows(previous);
    }
  }, [activeCourseId, userId, rows]);

  return {
    courseProgress,
    updateProgress,
    resetCourseProgress,
  };
}

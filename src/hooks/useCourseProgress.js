import { useEffect, useMemo, useState } from 'react';

// Progress lives per user. A single shared key would let whoever signs in next
// inherit the previous account's completed quizzes on the same browser.
const STORAGE_PREFIX = 'qm1-progress';

function storageKey(userId) {
  return `${STORAGE_PREFIX}:${userId}`;
}

// Drop the pre-namespacing blob. It is shared between every account that used this
// browser, so it cannot be attributed to one of them and is what caused a student to
// inherit a teacher's completed quizzes.
try {
  localStorage.removeItem(STORAGE_PREFIX);
} catch {
  // Ignore private-mode errors.
}

function loadProgress(userId) {
  if (!userId) return {};
  try {
    const saved = localStorage.getItem(storageKey(userId));
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgress(userId, progress) {
  if (!userId) return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(progress));
  } catch {
    // Ignore quota / private-mode errors; progress is best effort.
  }
}

export function useCourseProgress(activeCourseId, userId) {
  // The owner is carried alongside the data so a render that happens between a
  // sign-in and the reload effect cannot write one user's progress under another's key.
  const [state, setState] = useState(() => ({ userId, data: loadProgress(userId) }));

  useEffect(() => {
    setState({ userId, data: loadProgress(userId) });
  }, [userId]);

  useEffect(() => {
    if (!state.userId || state.userId !== userId) return;
    saveProgress(state.userId, state.data);
  }, [state, userId]);

  const progress = state.userId === userId ? state.data : {};

  const courseProgress = useMemo(() => {
    if (!activeCourseId) return {};
    return progress[activeCourseId] ?? {};
  }, [activeCourseId, progress]);

  function updateProgress(chapterId, score) {
    if (!userId || !activeCourseId) return;

    setState(prev => {
      if (prev.userId !== userId) return prev;
      const existing = prev.data[activeCourseId]?.[chapterId] || {};
      return {
        userId,
        data: {
          ...prev.data,
          [activeCourseId]: {
            ...(prev.data[activeCourseId] ?? {}),
            [chapterId]: {
              quizCompleted: true,
              bestScore: Math.max(score, existing.bestScore || 0),
              lastAttempt: new Date().toISOString(),
            },
          },
        },
      };
    });
  }

  function resetCourseProgress() {
    if (!userId || !activeCourseId) return;

    setState(prev => {
      if (prev.userId !== userId) return prev;
      const data = { ...prev.data };
      delete data[activeCourseId];
      return { userId, data };
    });
  }

  return {
    courseProgress,
    updateProgress,
    resetCourseProgress,
  };
}

import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'qm1-progress';

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useCourseProgress(activeCourseId) {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const courseProgress = useMemo(() => {
    if (!activeCourseId) return {};
    return progress[activeCourseId] ?? {};
  }, [activeCourseId, progress]);

  function updateProgress(chapterId, score) {
    if (!activeCourseId) return;

    setProgress(prev => {
      const existing = prev[activeCourseId]?.[chapterId] || {};
      return {
        ...prev,
        [activeCourseId]: {
          ...(prev[activeCourseId] ?? {}),
          [chapterId]: {
            quizCompleted: true,
            bestScore: Math.max(score, existing.bestScore || 0),
            lastAttempt: new Date().toISOString(),
          },
        },
      };
    });
  }

  function resetCourseProgress() {
    if (!activeCourseId) return;

    setProgress(prev => {
      const next = { ...prev };
      delete next[activeCourseId];
      return next;
    });
  }

  return {
    courseProgress,
    updateProgress,
    resetCourseProgress,
  };
}

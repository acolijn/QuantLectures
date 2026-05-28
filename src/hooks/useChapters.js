import { useEffect, useState } from 'react';
import { createChapter, deleteChapter, fetchChapters, reorderChapters } from '../lib/api';

function sortByChapterNumber(items) {
  return [...items].sort((a, b) => a.id - b.id);
}

export function useChapters(activeCourseId) {
  const [chapters, setChapters] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);
  const [loadingChapters, setLoadingChapters] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!activeCourseId) {
      setChapters([]);
      setActiveChapter(null);
      setLoadingChapters(false);
      return () => {
        cancelled = true;
      };
    }

    setLoadingChapters(true);
    fetchChapters(activeCourseId)
      .then(records => {
        if (cancelled) return;
        setChapters(records);
        setActiveChapter(prev => {
          if (records.length === 0) return null;
          if (prev && records.some(c => c.id === prev)) return prev;
          return records[0].id;
        });
      })
      .catch(err => console.error('Failed to load chapters:', err))
      .finally(() => {
        if (!cancelled) setLoadingChapters(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCourseId]);

  async function reorderAll(newOrder, activeChapterPbId) {
    if (!activeCourseId) return;

    try {
      const updated = await reorderChapters(newOrder, activeCourseId);
      const sorted = sortByChapterNumber(updated);
      setChapters(sorted);

      if (activeChapterPbId) {
        const stillActive = sorted.find(c => c.pbId === activeChapterPbId);
        if (stillActive) setActiveChapter(stillActive.id);
      }
    } catch (err) {
      console.error('Reorder failed:', err);
      const latest = await fetchChapters(activeCourseId);
      setChapters(sortByChapterNumber(latest));
    }
  }

  async function createNextChapter() {
    if (!activeCourseId) return null;

    const used = new Set(chapters.map(c => c.id));
    let nextId = 1;
    while (used.has(nextId)) nextId += 1;

    const newChapter = await createChapter(nextId, activeCourseId);
    setChapters(prev => sortByChapterNumber([...prev, newChapter]));
    setActiveChapter(newChapter.id);
    return newChapter;
  }

  async function deleteExistingChapter(chapter) {
    if (!activeCourseId || !chapter) return;

    await deleteChapter(chapter.id, activeCourseId);
    const remaining = sortByChapterNumber(chapters.filter(c => c.id !== chapter.id));

    if (remaining.length > 0) {
      const renumbered = await reorderChapters(remaining, activeCourseId);
      const sorted = sortByChapterNumber(renumbered);
      setChapters(sorted);
      setActiveChapter(sorted[0].id);
    } else {
      setChapters([]);
      setActiveChapter(null);
    }
  }

  function applySavedChapter(updatedChapter) {
    setChapters(prev => prev.map(c => c.id === updatedChapter.id ? updatedChapter : c));
  }

  function applyImportedChapter(savedChapter) {
    setChapters(prev => {
      const exists = prev.some(c => c.id === savedChapter.id);
      return exists
        ? sortByChapterNumber(prev.map(c => c.id === savedChapter.id ? savedChapter : c))
        : sortByChapterNumber([...prev, savedChapter]);
    });
    setActiveChapter(savedChapter.id);
  }

  return {
    chapters,
    activeChapter,
    loadingChapters,
    setActiveChapter,
    reorderAll,
    createNextChapter,
    deleteExistingChapter,
    applySavedChapter,
    applyImportedChapter,
  };
}

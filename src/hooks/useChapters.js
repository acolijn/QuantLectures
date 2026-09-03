import { useEffect, useState } from 'react';
import {
  createChapter,
  createCoursePart,
  deleteChapter,
  deleteCoursePart,
  fetchChapters,
  fetchCourseParts,
  renameCoursePart,
  reorderChapters,
  reorderCourseParts,
} from '../lib/api';
import { flattenCourse, groupChapters, moveChapter, moveParts } from '../lib/chapterOrder';

function sortByChapterNumber(items) {
  return [...items].sort((a, b) => a.id - b.id);
}

export function useChapters(activeCourseId) {
  const [chapters, setChapters] = useState([]);
  const [parts, setParts] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);
  const [loadingChapters, setLoadingChapters] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!activeCourseId) {
      setChapters([]);
      setParts([]);
      setActiveChapter(null);
      setLoadingChapters(false);
      return () => {
        cancelled = true;
      };
    }

    setLoadingChapters(true);
    Promise.all([fetchChapters(activeCourseId), fetchCourseParts(activeCourseId)])
      .then(([records, partRecords]) => {
        if (cancelled) return;
        setChapters(records);
        setParts(partRecords);
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

  // Persist one flattened course order (already in part order) and keep the
  // selected chapter selected, even though its number may have changed.
  async function persistOrder(flatOrder, keepPbId) {
    const updated = await reorderChapters(flatOrder, activeCourseId);
    const sorted = sortByChapterNumber(updated);
    setChapters(sorted);

    if (keepPbId) {
      const stillActive = sorted.find(c => c.pbId === keepPbId);
      if (stillActive) setActiveChapter(stillActive.id);
    }
    return sorted;
  }

  async function reloadAfterFailure() {
    const [latest, latestParts] = await Promise.all([
      fetchChapters(activeCourseId),
      fetchCourseParts(activeCourseId),
    ]);
    setChapters(sortByChapterNumber(latest));
    setParts(latestParts);
  }

  // Drag-and-drop: move one chapter to a position inside a (possibly different)
  // part, then renumber the whole course so parts stay contiguous.
  async function moveChapterTo(pbId, targetPartId, targetIndex) {
    if (!activeCourseId) return;
    try {
      const flat = moveChapter(parts, chapters, pbId, targetPartId, targetIndex);
      await persistOrder(flat, pbId);
    } catch (err) {
      console.error('Move failed:', err);
      await reloadAfterFailure();
    }
  }

  async function movePartTo(fromIndex, toIndex) {
    if (!activeCourseId || fromIndex === toIndex) return;
    const activePbId = chapters.find(c => c.id === activeChapter)?.pbId;
    try {
      const next = moveParts(parts, chapters, fromIndex, toIndex);
      await reorderCourseParts(next.parts);
      setParts(next.parts);
      await persistOrder(next.chapters, activePbId);
    } catch (err) {
      console.error('Part reorder failed:', err);
      await reloadAfterFailure();
    }
  }

  async function addPart(title) {
    if (!activeCourseId) return null;
    const part = await createCoursePart(activeCourseId, title, parts.length + 1);
    setParts(prev => [...prev, part]);
    return part;
  }

  async function renamePart(partId, title) {
    const updated = await renameCoursePart(partId, title);
    setParts(prev => prev.map(p => (p.id === partId ? updated : p)));
    return updated;
  }

  // Chapters survive: they fall back to ungrouped and the course is renumbered.
  async function removePart(partId) {
    if (!activeCourseId) return;
    const activePbId = chapters.find(c => c.id === activeChapter)?.pbId;
    const remainingParts = parts
      .filter(p => p.id !== partId)
      .map((p, i) => ({ ...p, number: i + 1 }));
    const orphaned = new Set(chapters.filter(c => c.partId === partId).map(c => c.pbId));
    const detached = chapters.map(c => (orphaned.has(c.pbId) ? { ...c, partId: null } : c));

    try {
      await deleteCoursePart(partId);
      await reorderCourseParts(remainingParts);
      setParts(remainingParts);
      await persistOrder(flattenCourse(remainingParts, detached), activePbId);
    } catch (err) {
      console.error('Part delete failed:', err);
      await reloadAfterFailure();
    }
  }

  // New chapters land at the end of the part the reader is currently in, so
  // they appear next to what the teacher was looking at.
  async function createNextChapter(partId = null) {
    if (!activeCourseId) return null;

    const used = new Set(chapters.map(c => c.id));
    let nextId = 1;
    while (used.has(nextId)) nextId += 1;

    const newChapter = await createChapter(nextId, activeCourseId, partId);
    const withNew = [...chapters, newChapter];
    const flat = flattenCourse(parts, withNew);
    const sorted = await persistOrder(flat, newChapter.pbId);
    return sorted.find(c => c.pbId === newChapter.pbId) ?? newChapter;
  }

  async function deleteExistingChapter(chapter) {
    if (!activeCourseId || !chapter) return;

    await deleteChapter(chapter.id, activeCourseId);
    const remaining = chapters.filter(c => c.id !== chapter.id);

    if (remaining.length > 0) {
      const sorted = await persistOrder(flattenCourse(parts, remaining), null);
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
    parts,
    chapterGroups: groupChapters(parts, chapters),
    activeChapter,
    loadingChapters,
    setActiveChapter,
    moveChapterTo,
    movePartTo,
    addPart,
    renamePart,
    removePart,
    createNextChapter,
    deleteExistingChapter,
    applySavedChapter,
    applyImportedChapter,
  };
}

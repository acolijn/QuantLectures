// Chapter ordering across parts.
//
// `chapter_number` is course-global and continuous (1..N) — it doubles as the
// app-level chapter id and as the upsert key for AI import, so it must never be
// scoped per part. Parts only decide the *sort position*: after any structural
// change the course is flattened in part order and renumbered, which keeps
// every part's chapters contiguous.
//
// The label a reader sees ("3" or "2.1") is derived from position at render
// time and is never stored.

// Ungrouped chapters (partId === null) come first, then each part in
// part_number order. Chapters inside a group keep their chapter_number order.
export function groupChapters(parts, chapters) {
  const sortedParts = [...(parts ?? [])].sort((a, b) => a.number - b.number);
  const byNumber = [...(chapters ?? [])].sort((a, b) => a.id - b.id);
  const knownPartIds = new Set(sortedParts.map(p => p.id));

  // The ungrouped group is always present, even when empty: it is a valid drop
  // target. Renderers skip empty groups.
  // A chapter pointing at a deleted part falls back to ungrouped.
  const groups = [{
    part: null,
    chapters: byNumber
      .filter(ch => !ch.partId || !knownPartIds.has(ch.partId))
      // Normalise a dangling pointer so persisting this order clears it.
      .map(ch => (ch.partId ? { ...ch, partId: null } : ch)),
  }];
  for (const part of sortedParts) {
    groups.push({ part, chapters: byNumber.filter(ch => ch.partId === part.id) });
  }
  return groups;
}

// The course as one ordered list — the exact order reorderChapters renumbers.
export function flattenCourse(parts, chapters) {
  return groupChapters(parts, chapters).flatMap(group => group.chapters);
}

// Move one chapter to a new part and position, returning the flattened course.
// `targetIndex` is the index within the target part; null appends.
export function moveChapter(parts, chapters, pbId, targetPartId, targetIndex = null) {
  const groups = groupChapters(parts, chapters);
  const moved = chapters.find(ch => ch.pbId === pbId);
  if (!moved) return flattenCourse(parts, chapters);

  return groups.flatMap(group => {
    const groupPartId = group.part?.id ?? null;
    const rest = group.chapters.filter(ch => ch.pbId !== pbId);
    if (groupPartId !== (targetPartId ?? null)) return rest;

    const at = targetIndex === null ? rest.length : Math.max(0, Math.min(targetIndex, rest.length));
    const next = [...rest];
    next.splice(at, 0, { ...moved, partId: targetPartId ?? null });
    return next;
  });
}

// Reorder the parts themselves; returns the flattened course for renumbering.
export function moveParts(parts, chapters, fromIndex, toIndex) {
  const sorted = [...(parts ?? [])].sort((a, b) => a.number - b.number);
  if (fromIndex === toIndex) return { parts: sorted, chapters: flattenCourse(sorted, chapters) };

  const next = [...sorted];
  const [movedPart] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, movedPart);
  const renumberedParts = next.map((part, i) => ({ ...part, number: i + 1 }));
  return { parts: renumberedParts, chapters: flattenCourse(renumberedParts, chapters) };
}

// Labels for display only. 'per_part' shows "2.1" for grouped chapters and the
// plain continuous number for ungrouped ones.
export function buildChapterLabels(parts, chapters, mode = 'continuous') {
  const labels = new Map();
  const groups = groupChapters(parts, chapters);
  let partIndex = 0;

  for (const group of groups) {
    if (group.part) partIndex += 1;
    group.chapters.forEach((ch, i) => {
      const label = mode === 'per_part' && group.part
        ? `${partIndex}.${i + 1}`
        : String(ch.id);
      labels.set(ch.pbId, label);
    });
  }
  return labels;
}

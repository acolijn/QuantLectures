// The document model behind the print view.
//
// Pure: given the course, its parts and chapters plus a scope selection, it
// returns the ordered sections to render. Keeping the selection logic here
// means the print route never re-derives ordering — it reuses the same part
// ordering and label rules the sidebar and reading pane already agree on.
import { buildChapterLabels, groupChapters } from './chapterOrder';

// scope: { kind: 'course' } | { kind: 'part', partId } | { kind: 'chapter', pbId }
export function selectChapters(parts, chapters, scope) {
  const groups = groupChapters(parts, chapters);

  if (scope?.kind === 'chapter') {
    const one = chapters.find(ch => ch.pbId === scope.pbId);
    return one ? [{ part: partOf(groups, one), chapters: [one] }] : [];
  }
  if (scope?.kind === 'part') {
    // A part id of null is the ungrouped bucket, which is a real selection.
    const group = groups.find(g => (g.part?.id ?? null) === (scope.partId ?? null));
    return group && group.chapters.length ? [group] : [];
  }
  return groups.filter(g => g.chapters.length > 0);
}

function partOf(groups, chapter) {
  return groups.find(g => g.chapters.some(ch => ch.pbId === chapter.pbId))?.part ?? null;
}

// The printable document: the selected groups, the label each chapter carries
// in the *whole* course (so a single-chapter print still reads "2.3"), and the
// flat chapter list the figure loader needs.
export function buildPrintDoc(course, parts, chapters, scope, options = {}) {
  const groups = selectChapters(parts, chapters, scope);
  const labels = buildChapterLabels(parts, chapters, course?.numbering);
  const flat = groups.flatMap(g => g.chapters);

  // 'per_chapter' | 'end' | 'none'. Printing both places the same formulas
  // twice in one document, which is what the first version did.
  const formulas = options.formulas ?? 'per_chapter';
  const includeExercises = options.includeExercises ?? false;

  return {
    course,
    groups,
    labels,
    chapters: flat,
    formulas,
    includeExercises,
    // A table of contents only earns its page once there is more than one chapter.
    showToc: flat.length > 1,
    showChapterFormulas: formulas === 'per_chapter',
    showCombinedFormulaSheet:
      formulas === 'end' && flat.some(ch => ch.formulas?.length > 0),
    title: printTitle(course, groups, scope, labels),
  };
}

function printTitle(course, groups, scope, labels) {
  if (scope?.kind === 'chapter') {
    const ch = groups[0]?.chapters[0];
    return ch ? `${labels.get(ch.pbId) ?? ch.id}. ${ch.title}` : (course?.name ?? '');
  }
  if (scope?.kind === 'part') {
    return groups[0]?.part?.title ?? course?.name ?? '';
  }
  return course?.name ?? '';
}

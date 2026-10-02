// The user documentation is a separate static site (VitePress, docs/) served
// by the same nginx at /docs. Everyone may read all of it; the role only
// decides which page the Help link opens.
const DOCS_BASE = '/docs/';

export function helpUrl({ user, isTeacher } = {}) {
  if (!user) return DOCS_BASE;
  return isTeacher ? `${DOCS_BASE}teachers/quick-start` : `${DOCS_BASE}students/`;
}

export const gettingStartedUrl = `${DOCS_BASE}getting-started`;

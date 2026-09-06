// Figure files: what the uploader accepts, and how a chapter's figure records
// become the map the renderer resolves [fig:ref] against.
import { pb } from './pocketbase';

// PDF is deliberately absent: the renderer puts every figure into a plain
// <img>, and PocketBase only thumbnails raster images, so a PDF upload
// succeeds and then renders as a broken image. Restored once uploads are
// converted to PNG (Step 6a in DEVELOPMENTS.md).
export const FIGURE_ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml';

// `accept` is a filter, not a guarantee — drag-and-drop and "All files" walk
// straight past it, so re-check whatever actually arrived.
export function unsupportedFigureFile(file) {
  if (!file) return null;
  const name = file.name?.toLowerCase() ?? '';
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (file.type && !FIGURE_ACCEPT.split(',').includes(file.type)) return 'type';
  return null;
}

// `full: true` skips the 400px thumbnail. Print needs it: at a ~150mm column
// the thumbnail lands near 68 DPI and plot labels stop being readable.
export function buildFiguresMap(figures, { full = false } = {}) {
  if (!figures?.length) return {};
  const map = {};
  figures.forEach(fig => {
    if (!fig.filename) return;
    const record = { collectionName: 'chapter_figures', id: fig.id };
    map[fig.ref] = {
      caption: fig.caption,
      url: full
        ? pb.files.getURL(record, fig.filename)
        : pb.files.getURL(record, fig.filename, { thumb: '400x0' }),
      fullUrl: pb.files.getURL(record, fig.filename),
      filename: fig.filename,
    };
  });
  return map;
}

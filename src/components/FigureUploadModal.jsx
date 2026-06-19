import { useState, useRef } from 'react';
import { uploadChapterFigure } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import { pb } from '../lib/pocketbase';

// Inline upload/edit for a single [fig:ref] placeholder clicked in the reading view.
// existingFig: figure record matching the ref (may have no file), or null (auto-create).
export default function FigureUploadModal({ chapterPbId, figRef, existingFig, onClose, onUploaded }) {
  const { t } = useLanguage();
  const [caption, setCaption] = useState(existingFig?.caption ?? '');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const figureId = existingFig?.id && !existingFig.id.startsWith('temp-') ? existingFig.id : null;
  const hasFile = !!existingFig?.filename;
  const isPdf = existingFig?.filename?.toLowerCase().endsWith('.pdf');
  const currentThumb = hasFile && !isPdf
    ? pb.files.getURL({ collectionName: 'chapter_figures', id: existingFig.id }, existingFig.filename, { thumb: '400x0' })
    : null;

  async function handleSubmit() {
    if (!file) { setError(t('figmodal_no_file')); return; }
    setUploading(true);
    setError(null);
    try {
      await uploadChapterFigure(chapterPbId, figRef, caption, file, figureId);
      await onUploaded();
      onClose();
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal figmodal" onClick={e => e.stopPropagation()}>
        <h2>{t('figmodal_title', { ref: figRef })}</h2>

        {currentThumb && (
          <img src={currentThumb} alt={figRef} className="figmodal-current" />
        )}
        {hasFile && isPdf && <span className="figure-pdf-badge">📄 PDF</span>}

        <label className="figmodal-field">
          {t('editor_figure_caption')}
          <input value={caption} onChange={e => setCaption(e.target.value)} />
        </label>

        <input
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,application/pdf"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={e => { setFile(e.target.files[0] || null); setError(null); }}
        />
        <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
          {file ? file.name : (hasFile ? t('editor_figure_replace') : t('editor_figure_upload'))}
        </button>

        {error && <p className="figmodal-error">{error}</p>}

        <div className="figmodal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={uploading}>
            {t('common_cancel')}
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={uploading || !file}>
            {uploading ? t('editor_figure_uploading') : t('common_save')}
          </button>
        </div>
      </div>
    </div>
  );
}

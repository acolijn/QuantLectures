import { useLanguage } from '../../contexts/LanguageContext';

export default function TeacherToolbar({
  showEditButton = false,
  onEdit,
  onNewChapter,
  onImport,
  onExport,
  onDelete,
  onOpenCourseSettings,
}) {
  const { t } = useLanguage();

  return (
    <div className="teacher-toolbar">
      {showEditButton && (
        <button className="btn-edit-chapter" onClick={onEdit}>
          {t('toolbar_edit_chapter')}
        </button>
      )}
      <button className="btn-new-chapter" onClick={onNewChapter}>
        {t('toolbar_new_chapter')}
      </button>
      <button className="btn-import-chapter" onClick={onImport}>
        {t('toolbar_import')}
      </button>
      {onExport && (
        <button className="btn-export-chapter" onClick={onExport}>
          {t('toolbar_export')}
        </button>
      )}
      {onDelete && (
        <button className="btn-delete-chapter" onClick={onDelete}>
          {t('toolbar_delete_chapter')}
        </button>
      )}
      {onOpenCourseSettings && (
        <button className="btn-course-settings" onClick={onOpenCourseSettings}>
          {t('toolbar_course_settings')}
        </button>
      )}
    </div>
  );
}

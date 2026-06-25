import ChapterView from '../ChapterView';
import ChapterEditor from '../admin/ChapterEditor';
import TeacherToolbar from './TeacherToolbar';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AppMainContent({
  loadingCourses,
  loadingChapters,
  activeCourseId,
  isTeacher,
  chapter,
  editMode,
  onStartEdit,
  onStopEdit,
  onChapterSaved,
  onCreateCourse,
  onNewChapter,
  onShowImport,
  onExportChapter,
  onDeleteChapter,
  onOpenCourseSettings,
  courseProgress,
  onProgressUpdate,
}) {
  const { t } = useLanguage();

  if (loadingCourses || loadingChapters) {
    return <div className="chapter-loading">{t('common_loading')}</div>;
  }

  if (!activeCourseId) {
    return (
      <div className="chapter-loading">
        {isTeacher ? (
          <div className="empty-course-state">
            <p>{t('main_no_course_teacher')}</p>
            <button className="btn-new-chapter" onClick={onCreateCourse}>{t('main_create_first_course')}</button>
          </div>
        ) : t('main_no_course_student')}
      </div>
    );
  }

  if (chapter) {
    if (editMode && isTeacher) {
      return (
        <ChapterEditor
          chapter={chapter}
          courseId={activeCourseId}
          onClose={onStopEdit}
          onSaved={onChapterSaved}
        />
      );
    }

    return (
      <div className="chapter-view-wrapper">
        {isTeacher && (
          <TeacherToolbar
            showEditButton
            onEdit={onStartEdit}
            onNewChapter={onNewChapter}
            onImport={onShowImport}
            onExport={onExportChapter}
            onDelete={onDeleteChapter}
            onOpenCourseSettings={onOpenCourseSettings}
          />
        )}
        <ChapterView
          key={chapter.id}
          chapter={chapter}
          progress={courseProgress[chapter.id]}
          onProgressUpdate={onProgressUpdate}
          isTeacher={isTeacher}
        />
      </div>
    );
  }

  return (
    <div className="chapter-view-wrapper">
      {isTeacher && (
        <TeacherToolbar
          onNewChapter={onNewChapter}
          onImport={onShowImport}
          onOpenCourseSettings={onOpenCourseSettings}
        />
      )}
      <div className="chapter-loading">
        {isTeacher ? (
          <div className="empty-course-state">
            <p>{t('main_no_chapters_teacher')}</p>
            <button className="btn-new-chapter" onClick={onNewChapter}>{t('main_create_first_chapter')}</button>
          </div>
        ) : t('main_no_chapters_student')}
      </div>
    </div>
  );
}

import ChapterView from '../ChapterView';
import ChapterEditor from '../admin/ChapterEditor';
import TeacherToolbar from './TeacherToolbar';

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
  courseProgress,
  onProgressUpdate,
}) {
  if (loadingCourses || loadingChapters) {
    return <div className="chapter-loading">Laden…</div>;
  }

  if (!activeCourseId) {
    return (
      <div className="chapter-loading">
        {isTeacher ? (
          <div className="empty-course-state">
            <p>Nog geen cursus gevonden.</p>
            <button className="btn-new-chapter" onClick={onCreateCourse}>➕ Eerste cursus maken</button>
          </div>
        ) : 'Geen gepubliceerde cursussen beschikbaar.'}
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
          />
        )}
        <ChapterView
          key={chapter.id}
          chapter={chapter}
          progress={courseProgress[chapter.id]}
          onProgressUpdate={onProgressUpdate}
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
        />
      )}
      <div className="chapter-loading">
        {isTeacher ? (
          <div className="empty-course-state">
            <p>Deze cursus heeft nog geen hoofdstukken.</p>
            <button className="btn-new-chapter" onClick={onNewChapter}>➕ Eerste hoofdstuk maken</button>
          </div>
        ) : 'Deze cursus heeft nog geen hoofdstukken.'}
      </div>
    </div>
  );
}

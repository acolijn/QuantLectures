import ImportChapter from '../admin/ImportChapter';
import Login from '../Login';

export default function AppOverlays({
  showLogin,
  onCloseLogin,
  showImport,
  courseId,
  existingChapters,
  onCloseImport,
  onImported,
}) {
  return (
    <>
      {showLogin && <Login onClose={onCloseLogin} />}
      {showImport && (
        <ImportChapter
          courseId={courseId}
          existingChapters={existingChapters}
          onClose={onCloseImport}
          onImported={onImported}
        />
      )}
    </>
  );
}

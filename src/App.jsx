import { useState } from 'react';
import Sidebar from './components/Sidebar';
import AppMainContent from './components/app/AppMainContent';
import AppOverlays from './components/app/AppOverlays';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useCourses } from './hooks/useCourses';
import { useChapters } from './hooks/useChapters';
import { useCourseProgress } from './hooks/useCourseProgress';

function AppContent() {
  const { isTeacher } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const {
    courses,
    activeCourseId,
    loadingCourses,
    courseMembersByCourse,
    setActiveCourseId,
    createNewCourse,
    updateExistingCourse,
    refreshCourseMembers,
    addEditorToCourse,
    removeEditorFromCourse,
  } = useCourses(isTeacher);
  const {
    chapters,
    activeChapter,
    loadingChapters,
    setActiveChapter,
    reorderAll,
    createNextChapter,
    deleteExistingChapter,
    applySavedChapter,
    applyImportedChapter,
  } = useChapters(activeCourseId);
  const {
    courseProgress,
    updateProgress,
    resetCourseProgress,
  } = useCourseProgress(activeCourseId);

  const course = courses.find(c => c.id === activeCourseId) ?? null;
  const chapter = chapters.find(c => c.id === activeChapter);

  function handleProgressUpdate(chapterId, score) {
    updateProgress(chapterId, score);
  }

  function handleChapterSaved(updatedChapter) {
    applySavedChapter(updatedChapter);
    setEditMode(false);
  }

  async function handleReorderChapters(newOrder) {
    await reorderAll(newOrder, chapter?.pbId);
  }

  async function handleCreateCourse() {
    if (!isTeacher) return;
    const defaultName = `Nieuwe cursus ${courses.length + 1}`;
    const name = window.prompt('Naam van de cursus?', defaultName);
    if (name === null) return;
    await createNewCourse(name.trim() || defaultName);
  }

  async function handleNewChapter() {
    const newChapter = await createNextChapter();
    if (!newChapter) return;
    setEditMode(true);
  }

  function handleExportChapter() {
    if (!chapter) return;
    const exportData = {
      title: chapter.title,
      subtitle: chapter.subtitle,
      formulas: chapter.formulas,
      concepts: chapter.concepts,
      exercises: chapter.exercises,
      quiz: chapter.quiz,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chapter${chapter.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteChapter() {
    if (!activeCourseId || !chapter) return;
    if (!window.confirm(`Hoofdstuk ${chapter.id} "${chapter.title}" verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;

    await deleteExistingChapter(chapter);
  }

  function handleImported(savedChapter) {
    applyImportedChapter(savedChapter);
    setShowImport(false);
  }

  function handleSelectChapter(id) {
    setActiveChapter(id);
    setEditMode(false);
    setSidebarOpen(false);
  }

  function handleSelectCourse(courseId) {
    setActiveCourseId(courseId);
    setEditMode(false);
    setSidebarOpen(false);
  }

  async function handleUpdateCourse(updates) {
    if (!activeCourseId) return;
    await updateExistingCourse(activeCourseId, updates);
  }

  return (
    <div className="app">
      <AppOverlays
        showLogin={showLogin}
        onCloseLogin={() => setShowLogin(false)}
        showImport={showImport}
        courseId={activeCourseId}
        course={course}
        existingChapters={chapters}
        onCloseImport={() => setShowImport(false)}
        onImported={handleImported}
      />

      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menu"
      >
        ☰
      </button>
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar
          course={course}
          courses={courses}
          activeCourseId={activeCourseId}
          onSelectCourse={handleSelectCourse}
          onCreateCourse={handleCreateCourse}
          onUpdateCourse={handleUpdateCourse}
          courseMembers={courseMembersByCourse[activeCourseId] ?? []}
          onLoadCourseMembers={() => refreshCourseMembers(activeCourseId)}
          onAddEditor={email => addEditorToCourse(activeCourseId, email)}
          onRemoveEditor={memberId => removeEditorFromCourse(activeCourseId, memberId)}
          chapters={chapters}
          activeChapter={activeChapter}
          onSelectChapter={handleSelectChapter}
          progress={courseProgress}
          onResetProgress={resetCourseProgress}
          onLoginClick={() => setShowLogin(true)}
          onReorderChapters={handleReorderChapters}
        />
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <AppMainContent
        loadingCourses={loadingCourses}
        loadingChapters={loadingChapters}
        activeCourseId={activeCourseId}
        isTeacher={isTeacher}
        chapter={chapter}
        editMode={editMode}
        onStartEdit={() => setEditMode(true)}
        onStopEdit={() => setEditMode(false)}
        onChapterSaved={handleChapterSaved}
        onCreateCourse={handleCreateCourse}
        onNewChapter={handleNewChapter}
        onShowImport={() => setShowImport(true)}
        onExportChapter={handleExportChapter}
        onDeleteChapter={handleDeleteChapter}
        courseProgress={courseProgress}
        onProgressUpdate={handleProgressUpdate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Landing from './components/Landing';
import AppMainContent from './components/app/AppMainContent';
import AppOverlays from './components/app/AppOverlays';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useCourses } from './hooks/useCourses';
import { useChapters } from './hooks/useChapters';
import { useCourseProgress } from './hooks/useCourseProgress';

function AppContent() {
  const { user, isTeacher, isAdmin } = useAuth();
  const { t, syncWithCourseLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const {
    courses,
    activeCourseId,
    loadingCourses,
    courseMembersByCourse,
    courseInvitesByCourse,
    pendingTeachers,
    teachers,
    refreshTeachers,
    setActiveCourseId,
    createNewCourse,
    deleteExistingCourse,
    updateExistingCourse,
    refreshCourseMembers,
    addEditorToCourse,
    removeEditorFromCourse,
    refreshCourseInvites,
    createInviteForCourse,
    revokeInviteForCourse,
    redeemStudentInvite,
    refreshPendingTeachers,
    approveTeacher,
    rejectTeacher,
  } = useCourses(user);
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
  } = useCourseProgress(activeCourseId, user?.id);

  const course = courses.find(c => c.id === activeCourseId) ?? null;
  const chapter = chapters.find(c => c.id === activeChapter);

  useEffect(() => {
    syncWithCourseLanguage(course?.language);
  }, [course?.language, syncWithCourseLanguage]);

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
    const defaultName = `Course ${courses.length + 1}`;
    const name = window.prompt(t('sidebar_name'), defaultName);
    if (name === null) return;
    await createNewCourse(name.trim() || defaultName);
  }

  async function handleDeleteCourse() {
    if (!activeCourseId) return;
    if (!window.confirm(t('sidebar_confirm_delete_course'))) return;
    await deleteExistingCourse(activeCourseId);
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
    if (!window.confirm(t('app_confirm_delete_chapter', { id: chapter.id, title: chapter.title }))) return;

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

  function handleGoHome() {
    setActiveCourseId(null);
    setEditMode(false);
    setSidebarOpen(false);
  }

  async function handleUpdateCourse(updates) {
    if (!activeCourseId) return;
    await updateExistingCourse(activeCourseId, updates);
  }

  const showLanding = !loadingCourses && !activeCourseId;

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

      {showLanding ? (
        <Landing
          courses={courses}
          onSelectCourse={handleSelectCourse}
          onCreateCourse={handleCreateCourse}
          onLoginClick={() => setShowLogin(true)}
        />
      ) : (
      <>
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={t('app_menu')}
      >
        ☰
      </button>
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar
          course={course}
          courses={courses}
          activeCourseId={activeCourseId}
          isAdmin={isAdmin}
          onGoHome={handleGoHome}
          onSelectCourse={handleSelectCourse}
          onCreateCourse={handleCreateCourse}
          onDeleteCourse={handleDeleteCourse}
          onUpdateCourse={handleUpdateCourse}
          courseMembers={courseMembersByCourse[activeCourseId] ?? []}
          onLoadCourseMembers={() => refreshCourseMembers(activeCourseId)}
          teachers={teachers}
          onLoadTeachers={refreshTeachers}
          onAddEditor={userId => addEditorToCourse(activeCourseId, userId)}
          onRemoveEditor={memberId => removeEditorFromCourse(activeCourseId, memberId)}
          courseInvites={courseInvitesByCourse[activeCourseId] ?? []}
          onLoadCourseInvites={() => refreshCourseInvites(activeCourseId)}
          onCreateInvite={payload => createInviteForCourse(activeCourseId, payload)}
          onRevokeInvite={inviteId => revokeInviteForCourse(activeCourseId, inviteId)}
          onRedeemInvite={redeemStudentInvite}
          pendingTeachers={pendingTeachers}
          onLoadPendingTeachers={refreshPendingTeachers}
          onApproveTeacher={approveTeacher}
          onRejectTeacher={rejectTeacher}
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
      </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

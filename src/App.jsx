import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Landing from './components/Landing';
import CourseSettings from './components/CourseSettings';
import AdminPanel from './components/AdminPanel';
import JoinCourseModal from './components/JoinCourseModal';
import PrintDialog from './components/PrintDialog';
import PrintView from './components/PrintView';
import AppMainContent from './components/app/AppMainContent';
import AppOverlays from './components/app/AppOverlays';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { buildChapterLabels } from './lib/chapterOrder';
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
  const [showCourseSettings, setShowCourseSettings] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [joinCode, setJoinCode] = useState(null); // null = modal closed
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  // null = not printing; otherwise { scope, options } chosen in the dialog.
  const [printJob, setPrintJob] = useState(null);
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
    parts,
    chapterGroups,
    activeChapter,
    loadingChapters,
    setActiveChapter,
    moveChapterTo,
    movePartTo,
    addPart,
    renamePart,
    removePart,
    createNextChapter,
    deleteExistingChapter,
    applySavedChapter,
    applyImportedChapter,
  } = useChapters(activeCourseId);
  const {
    courseProgress,
    updateProgress,
    resetCourseProgress,
  } = useCourseProgress(activeCourseId, user?.id, chapters);

  const course = courses.find(c => c.id === activeCourseId) ?? null;
  const chapter = chapters.find(c => c.id === activeChapter);
  // One label map for the whole app so the sidebar, the reading pane and the
  // editor never disagree about how a chapter is numbered.
  const chapterLabels = buildChapterLabels(parts, chapters, course?.numbering);

  useEffect(() => {
    syncWithCourseLanguage(course?.language);
  }, [course?.language, syncWithCourseLanguage]);

  // Teachers can share a join link (…/?invite=CODE); open the modal prefilled.
  // Signing in is a prerequisite, so hold the code until there is a user.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite');
    if (!code) return;

    if (!user) {
      setShowLogin(true);
      return;
    }

    setJoinCode(code.toUpperCase());
    params.delete('invite');
    const query = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (query ? `?${query}` : ''));
  }, [user]);

  function handleProgressUpdate(chapterId, score) {
    updateProgress(chapterId, score);
  }

  function handleChapterSaved(updatedChapter) {
    applySavedChapter(updatedChapter);
    setEditMode(false);
  }

  async function handleMoveChapter(pbId, targetPartId, targetIndex) {
    await moveChapterTo(pbId, targetPartId, targetIndex);
  }

  // The editor's part dropdown appends the chapter to the chosen part.
  async function handleAssignChapterPart(targetPartId) {
    if (!chapter) return;
    await moveChapterTo(chapter.pbId, targetPartId, null);
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
    const newChapter = await createNextChapter(chapter?.partId ?? null);
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
    setShowCourseSettings(false);
  }

  async function handleUpdateCourse(updates) {
    if (!activeCourseId) return;
    await updateExistingCourse(activeCourseId, updates);
  }

  function handleJoined(courseId) {
    setJoinCode(null);
    if (courseId) handleSelectCourse(courseId);
  }

  function handleStartPrint(scope, options) {
    setShowPrintDialog(false);
    setPrintJob({ scope, options });
  }

  async function handleDeleteCourseFromSettings() {
    await handleDeleteCourse();
    setShowCourseSettings(false);
  }

  const showLanding = !loadingCourses && !activeCourseId;

  return (
    <div className="app">
      {printJob && (
        <PrintView
          course={course}
          parts={parts}
          chapters={chapters}
          scope={printJob.scope}
          options={printJob.options}
          onClose={() => setPrintJob(null)}
        />
      )}

      {showPrintDialog && course && (
        <PrintDialog
          course={course}
          parts={parts}
          chapters={chapters}
          currentChapter={chapter ?? null}
          onClose={() => setShowPrintDialog(false)}
          onPrint={handleStartPrint}
        />
      )}

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

      {showAdminPanel && isAdmin && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          pendingTeachers={pendingTeachers}
          onLoadPendingTeachers={refreshPendingTeachers}
          onApproveTeacher={approveTeacher}
          onRejectTeacher={rejectTeacher}
        />
      )}

      {joinCode !== null && (
        <JoinCourseModal
          initialCode={joinCode}
          onRedeem={redeemStudentInvite}
          onClose={() => setJoinCode(null)}
          onJoined={handleJoined}
        />
      )}

      {showLanding ? (
        <Landing
          courses={courses}
          onSelectCourse={handleSelectCourse}
          onCreateCourse={handleCreateCourse}
          onLoginClick={() => setShowLogin(true)}
          onOpenAdmin={() => setShowAdminPanel(true)}
          onJoinCourse={() => setJoinCode('')}
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
          isAdmin={isAdmin}
          onGoHome={handleGoHome}
          chapters={chapters}
          chapterGroups={chapterGroups}
          parts={parts}
          chapterLabels={chapterLabels}
          activeChapter={activeChapter}
          onSelectChapter={handleSelectChapter}
          progress={courseProgress}
          onResetProgress={resetCourseProgress}
          onLoginClick={() => setShowLogin(true)}
          onMoveChapter={handleMoveChapter}
          onMovePart={movePartTo}
          onPrint={chapters.length > 0 ? () => setShowPrintDialog(true) : null}
        />
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <AppMainContent
        loadingCourses={loadingCourses}
        loadingChapters={loadingChapters}
        activeCourseId={activeCourseId}
        isTeacher={isTeacher}
        chapter={chapter}
        chapterLabel={chapterLabels.get(chapter?.pbId) ?? chapter?.id}
        parts={parts}
        onAssignChapterPart={handleAssignChapterPart}
        editMode={editMode}
        onStartEdit={() => setEditMode(true)}
        onStopEdit={() => setEditMode(false)}
        onChapterSaved={handleChapterSaved}
        onCreateCourse={handleCreateCourse}
        onNewChapter={handleNewChapter}
        onShowImport={() => setShowImport(true)}
        onExportChapter={handleExportChapter}
        onDeleteChapter={handleDeleteChapter}
        onOpenCourseSettings={() => setShowCourseSettings(true)}
        courseProgress={courseProgress}
        onProgressUpdate={handleProgressUpdate}
      />

      {showCourseSettings && course && isTeacher && (
        <CourseSettings
          course={course}
          onClose={() => setShowCourseSettings(false)}
          onUpdateCourse={handleUpdateCourse}
          onDeleteCourse={handleDeleteCourseFromSettings}
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
          parts={parts}
          onAddPart={addPart}
          onRenamePart={renamePart}
          onDeletePart={removePart}
          onMovePart={movePartTo}
        />
      )}
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

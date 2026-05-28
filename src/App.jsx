import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChapterView from './components/ChapterView';
import ChapterEditor from './components/admin/ChapterEditor';
import ImportChapter from './components/admin/ImportChapter';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { fetchChapters, createChapter, deleteChapter, reorderChapters } from './lib/api';

const STORAGE_KEY = 'qm1-progress';

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function AppContent() {
  const { isTeacher } = useAuth();
  const [activeChapter, setActiveChapter] = useState(1);
  const [progress, setProgress] = useState(loadProgress);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    fetchChapters()
      .then(setChapters)
      .catch(err => console.error('Failed to load chapters:', err))
      .finally(() => setLoadingChapters(false));
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function handleProgressUpdate(chapterId, score) {
    setProgress(prev => {
      const existing = prev[chapterId] || {};
      return {
        ...prev,
        [chapterId]: {
          quizCompleted: true,
          bestScore: Math.max(score, existing.bestScore || 0),
          lastAttempt: new Date().toISOString(),
        }
      };
    });
  }

  function handleChapterSaved(updatedChapter) {
    setChapters(prev => prev.map(c => c.id === updatedChapter.id ? updatedChapter : c));
    setEditMode(false);
  }

  async function handleReorderChapters(newOrder) {
    try {
      const updated = await reorderChapters(newOrder);
      const sorted = updated.sort((a, b) => a.id - b.id);
      setChapters(sorted);
      // Keep the active chapter tracking the same chapter by pbId
      const activePbId = chapter?.pbId;
      if (activePbId) {
        const stillActive = sorted.find(c => c.pbId === activePbId);
        if (stillActive) setActiveChapter(stillActive.id);
      }
    } catch (err) {
      console.error('Reorder failed:', err);
      fetchChapters().then(setChapters);
    }
  }

  async function handleNewChapter() {
    const nextId = chapters.length > 0 ? Math.max(...chapters.map(c => c.id)) + 1 : 1;
    const newChapter = await createChapter(nextId);
    setChapters(prev => [...prev, newChapter]);
    setActiveChapter(newChapter.id);
    setEditMode(true);
  }

  function handleExportChapter() {
    if (!chapter) return;
    const exportData = {
      title:     chapter.title,
      subtitle:  chapter.subtitle,
      formulas:  chapter.formulas,
      concepts:  chapter.concepts,
      exercises: chapter.exercises,
      quiz:      chapter.quiz,
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
    if (!chapter) return;
    if (!window.confirm(`Hoofdstuk ${chapter.id} "${chapter.title}" verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;
    await deleteChapter(chapter.id);
    const remaining = chapters.filter(c => c.id !== chapter.id);
    setChapters(remaining);
    setActiveChapter(remaining.length > 0 ? remaining[0].id : null);
  }

  function handleImported(savedChapter) {
    setChapters(prev => {
      const exists = prev.some(c => c.id === savedChapter.id);
      return exists
        ? prev.map(c => c.id === savedChapter.id ? savedChapter : c)
        : [...prev, savedChapter].sort((a, b) => a.id - b.id);
    });
    setActiveChapter(savedChapter.id);
    setShowImport(false);
  }

  function handleSelectChapter(id) {
    setActiveChapter(id);
    setEditMode(false);
    setSidebarOpen(false);
  }

  const chapter = chapters.find(c => c.id === activeChapter);

  return (
    <div className="app">
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showImport && (
        <ImportChapter
          existingChapters={chapters}
          onClose={() => setShowImport(false)}
          onImported={handleImported}
        />
      )}

      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menu"
      >
        ☰
      </button>
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar
          chapters={chapters}
          activeChapter={activeChapter}
          onSelectChapter={handleSelectChapter}
          progress={progress}
          onResetProgress={() => setProgress({})}
          onLoginClick={() => setShowLogin(true)}
          onReorderChapters={handleReorderChapters}
        />
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {loadingChapters ? (
        <div className="chapter-loading">Laden…</div>
      ) : chapter ? (
        editMode && isTeacher ? (
          <ChapterEditor
            chapter={chapter}
            onClose={() => setEditMode(false)}
            onSaved={handleChapterSaved}
          />
        ) : (
          <div className="chapter-view-wrapper">
            {isTeacher && (
              <div className="teacher-toolbar">
                <button className="btn-edit-chapter" onClick={() => setEditMode(true)}>
                  ✏️ Hoofdstuk bewerken
                </button>
                <button className="btn-new-chapter" onClick={handleNewChapter}>
                  ➕ Nieuw hoofdstuk
                </button>
                <button className="btn-import-chapter" onClick={() => setShowImport(true)}>
                  ⬆️ Importeer
                </button>
                <button className="btn-export-chapter" onClick={handleExportChapter}>
                  ⬇️ Exporteer
                </button>
                <button className="btn-delete-chapter" onClick={handleDeleteChapter}>
                  🗑️ Verwijder hoofdstuk
                </button>
              </div>
            )}
            <ChapterView
              key={chapter.id}
              chapter={chapter}
              progress={progress[chapter.id]}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>
        )
      ) : null}
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

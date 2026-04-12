import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChapterView from './components/ChapterView';
import chapters from './data/chapters';

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

export default function App() {
  const [activeChapter, setActiveChapter] = useState(1);
  const [progress, setProgress] = useState(loadProgress);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const chapter = chapters.find(c => c.id === activeChapter);

  return (
    <div className="app">
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
          onSelectChapter={(id) => {
            setActiveChapter(id);
            setSidebarOpen(false);
          }}
          progress={progress}
          onResetProgress={() => setProgress({})}
        />
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      {chapter && (
        <ChapterView
          key={chapter.id}
          chapter={chapter}
          progress={progress[chapter.id]}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </div>
  );
}

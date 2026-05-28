import { useState } from 'react';
import MathText from './MathText';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ chapters, activeChapter, onSelectChapter, progress, onResetProgress, onLoginClick, onReorderChapters }) {
  const { user, isTeacher, signOut } = useAuth();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [overIndex, setOverIndex]       = useState(null);

  function handleDragStart(e, index) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (index !== overIndex) setOverIndex(index);
  }

  function handleDrop(e, index) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setOverIndex(null);
      return;
    }
    const newOrder = [...chapters];
    const [moved] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, moved);
    onReorderChapters(newOrder);
    setDraggedIndex(null);
    setOverIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setOverIndex(null);
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>QM I</h1>
        <p className="sidebar-subtitle">Quantumfysica I</p>
      </div>
      <nav className="chapter-list">
        {chapters.map((ch, i) => {
          const chProgress = progress[ch.id] || {};
          const quizDone = chProgress.quizCompleted;
          const bestScore = chProgress.bestScore;
          return (
            <button
              key={ch.pbId ?? ch.id}
              className={[
                'chapter-item',
                activeChapter === ch.id ? 'active' : '',
                draggedIndex === i      ? 'dragging' : '',
                overIndex === i         ? 'drag-over' : '',
              ].join(' ')}
              onClick={() => onSelectChapter(ch.id)}
              draggable={!!isTeacher}
              onDragStart={isTeacher ? e => handleDragStart(e, i) : undefined}
              onDragOver={isTeacher  ? e => handleDragOver(e, i)  : undefined}
              onDrop={isTeacher      ? e => handleDrop(e, i)      : undefined}
              onDragEnd={isTeacher   ? handleDragEnd               : undefined}
            >
              {isTeacher && <span className="drag-handle">⠿</span>}
              <span className="chapter-number">{i + 1}</span>
              <span className="chapter-info">
                <span className="chapter-title">
                  <MathText text={ch.title} />
                </span>
                {quizDone && (
                  <span className="chapter-score">
                    {bestScore !== undefined ? `${Math.round(bestScore)}%` : '✓'}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        {/* Auth section */}
        <div className="sidebar-auth">
          {user ? (
            <div className="sidebar-auth-user">
              <span className="sidebar-auth-role">{isTeacher ? '🎓 Docent' : '📚 Student'}</span>
              <span className="sidebar-auth-email">{user.email}</span>
              <button className="sidebar-auth-btn" onClick={signOut}>Uitloggen</button>
            </div>
          ) : (
            <button className="sidebar-auth-btn sidebar-auth-btn--login" onClick={onLoginClick}>
              Inloggen
            </button>
          )}
        </div>

        <div className="overall-progress">
          <div className="progress-header">
            <span className="progress-label">
              Voortgang: {Object.values(progress).filter(p => p.quizCompleted).length}/{chapters.length}
            </span>
            {Object.keys(progress).length > 0 && (
              <button
                className="reset-progress-btn"
                onClick={() => {
                  if (window.confirm('Weet je zeker dat je alle voortgang wilt resetten?')) {
                    onResetProgress();
                  }
                }}
                title="Reset voortgang"
              >
                ↺
              </button>
            )}
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(Object.values(progress).filter(p => p.quizCompleted).length / chapters.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
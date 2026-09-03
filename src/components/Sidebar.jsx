import { useEffect, useState } from 'react';
import MathText from './MathText';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { buildChapterLabels } from '../lib/chapterOrder';

const COLLAPSE_KEY_PREFIX = 'minilectures:parts-collapsed:';

function loadCollapsed(courseId) {
  if (!courseId) return {};
  try {
    return JSON.parse(window.localStorage.getItem(COLLAPSE_KEY_PREFIX + courseId) ?? '{}');
  } catch {
    return {};
  }
}

export default function Sidebar({
  course,
  isAdmin,
  onGoHome,
  chapters,
  chapterGroups,
  parts,
  activeChapter,
  onSelectChapter,
  progress,
  onResetProgress,
  onLoginClick,
  onMoveChapter,
  onMovePart,
}) {
  const { user, isTeacher, signOut } = useAuth();
  const { t } = useLanguage();
  // { kind: 'chapter', pbId } | { kind: 'part', index }
  const [drag, setDrag] = useState(null);
  const [overChapter, setOverChapter] = useState(null);
  const [overPart, setOverPart] = useState(null);
  const [collapsed, setCollapsed] = useState(() => loadCollapsed(course?.id));

  useEffect(() => {
    setCollapsed(loadCollapsed(course?.id));
  }, [course?.id]);

  function toggleCollapsed(partId) {
    setCollapsed(prev => {
      const next = { ...prev, [partId]: !prev[partId] };
      try {
        window.localStorage.setItem(COLLAPSE_KEY_PREFIX + course?.id, JSON.stringify(next));
      } catch {
        // Storage unavailable (private mode); collapsing still works for this session.
      }
      return next;
    });
  }

  const labels = buildChapterLabels(parts ?? [], chapters ?? [], course?.numbering);
  const visibleGroups = (chapterGroups ?? []).filter(g => g.part || g.chapters.length > 0);

  function clearDrag() {
    setDrag(null);
    setOverChapter(null);
    setOverPart(null);
  }

  function handleChapterDragStart(e, chapter) {
    setDrag({ kind: 'chapter', pbId: chapter.pbId });
    e.dataTransfer.effectAllowed = 'move';
  }

  function handlePartDragStart(e, index) {
    setDrag({ kind: 'part', index });
    e.dataTransfer.effectAllowed = 'move';
  }

  // Dropping on a chapter inserts the dragged chapter in that slot; dropping on
  // a part header appends it to the end of that part.
  function handleChapterDrop(e, group, chapter) {
    e.preventDefault();
    e.stopPropagation();
    if (drag?.kind !== 'chapter' || drag.pbId === chapter.pbId) return clearDrag();

    const rest = group.chapters.filter(c => c.pbId !== drag.pbId);
    const index = rest.findIndex(c => c.pbId === chapter.pbId);
    onMoveChapter?.(drag.pbId, group.part?.id ?? null, index === -1 ? rest.length : index);
    clearDrag();
  }

  function handlePartDrop(e, group, groupIndex) {
    e.preventDefault();
    if (!drag) return;

    if (drag.kind === 'chapter') {
      onMoveChapter?.(drag.pbId, group.part?.id ?? null, null);
    } else if (group.part) {
      // Part indices skip the ungrouped group, which is never a part itself.
      const partIndex = visibleGroups.slice(0, groupIndex).filter(g => g.part).length;
      onMovePart?.(drag.index, partIndex);
    }
    clearDrag();
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {onGoHome && (
          <button className="sidebar-home-btn" onClick={onGoHome}>
            {t('sidebar_all_courses')}
          </button>
        )}
        <h1>{course?.name ?? 'MiniLectures'}</h1>
        <p className="sidebar-subtitle">{course?.subtitle ?? t('sidebar_default_subtitle')}</p>
      </div>
      <nav className="chapter-list">
        {visibleGroups.map((group, groupIndex) => {
          const partId = group.part?.id ?? null;
          const isCollapsed = partId ? !!collapsed[partId] : false;
          const doneInPart = group.chapters.filter(ch => progress[ch.id]?.quizCompleted).length;
          const partIndex = visibleGroups.slice(0, groupIndex).filter(g => g.part).length;

          return (
            <div
              className="chapter-group"
              key={partId ?? 'ungrouped'}
              onDragOver={drag ? e => { e.preventDefault(); } : undefined}
              onDrop={drag ? e => handlePartDrop(e, group, groupIndex) : undefined}
            >
              {group.part && (
                <div
                  className={[
                    'part-header',
                    overPart === partId ? 'drag-over' : '',
                    drag?.kind === 'part' && drag.index === partIndex ? 'dragging' : '',
                  ].join(' ')}
                  draggable={!!isTeacher}
                  onDragStart={isTeacher ? e => handlePartDragStart(e, partIndex) : undefined}
                  onDragOver={drag ? e => { e.preventDefault(); setOverPart(partId); } : undefined}
                  onDragLeave={drag ? () => setOverPart(null) : undefined}
                  onDragEnd={isTeacher ? clearDrag : undefined}
                >
                  {isTeacher && <span className="drag-handle">⠿</span>}
                  <button
                    className="part-toggle"
                    onClick={() => toggleCollapsed(partId)}
                    aria-expanded={!isCollapsed}
                  >
                    <span className="part-chevron">{isCollapsed ? '▸' : '▾'}</span>
                    <span className="part-title">
                      <MathText text={group.part.title} />
                    </span>
                    {user && group.chapters.length > 0 && (
                      <span className="part-progress">{doneInPart}/{group.chapters.length}</span>
                    )}
                  </button>
                </div>
              )}

              {group.part && group.chapters.length === 0 && !isCollapsed && (
                <p className="part-empty">{t('sidebar_part_empty')}</p>
              )}

              {!isCollapsed && group.chapters.map(ch => {
                const chProgress = progress[ch.id] || {};
                const quizDone = chProgress.quizCompleted;
                const bestScore = chProgress.bestScore;
                return (
                  <button
                    key={ch.pbId ?? ch.id}
                    className={[
                      'chapter-item',
                      group.part ? 'chapter-item--in-part' : '',
                      activeChapter === ch.id ? 'active' : '',
                      drag?.kind === 'chapter' && drag.pbId === ch.pbId ? 'dragging' : '',
                      overChapter === ch.pbId ? 'drag-over' : '',
                    ].join(' ')}
                    onClick={() => onSelectChapter(ch.id)}
                    draggable={!!isTeacher}
                    onDragStart={isTeacher ? e => handleChapterDragStart(e, ch) : undefined}
                    onDragOver={drag?.kind === 'chapter' ? e => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      setOverChapter(ch.pbId);
                    } : undefined}
                    onDragLeave={drag?.kind === 'chapter' ? () => setOverChapter(null) : undefined}
                    onDrop={drag?.kind === 'chapter' ? e => handleChapterDrop(e, group, ch) : undefined}
                    onDragEnd={isTeacher ? clearDrag : undefined}
                  >
                    {isTeacher && <span className="drag-handle">⠿</span>}
                    <span className="chapter-number">{labels.get(ch.pbId) ?? ch.id}</span>
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
            </div>
          );
        })}
      </nav>

      {user && chapters.length > 0 && (
        <div className="overall-progress">
          <div className="progress-header">
            <span className="progress-label">
              {t('sidebar_progress', {
                done: Object.values(progress).filter(p => p.quizCompleted).length,
                total: chapters.length,
              })}
            </span>
            {Object.keys(progress).length > 0 && (
              <button
                className="reset-progress-btn"
                onClick={() => {
                  if (window.confirm(t('sidebar_reset_confirm'))) {
                    onResetProgress();
                  }
                }}
                title={t('sidebar_reset_title')}
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
      )}

      <div className="sidebar-footer">
        {/* Auth section */}
        <div className="sidebar-auth">
          {user ? (
            <div className="sidebar-auth-user">
              <span className="sidebar-auth-role">
                {isAdmin ? t('sidebar_admin_role') : (isTeacher ? t('sidebar_teacher_role') : t('sidebar_student_role'))}
              </span>
              <span className="sidebar-auth-email">{user.email}</span>
              <button className="sidebar-auth-btn" onClick={signOut}>{t('sidebar_sign_out')}</button>
            </div>
          ) : (
            <button className="sidebar-auth-btn sidebar-auth-btn--login" onClick={onLoginClick}>
              {t('sidebar_sign_in')}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

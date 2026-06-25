import { useEffect } from 'react';
import MathText from './MathText';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LANGUAGE_FLAGS = {
  nl: '🇳🇱',
  en: '🇬🇧',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
  it: '🇮🇹',
  pt: '🇵🇹',
  pl: '🇵🇱',
};

export default function Landing({
  courses,
  onSelectCourse,
  onCreateCourse,
  onLoginClick,
  onOpenAdmin,
}) {
  const { user, isTeacher, isAdmin, signOut } = useAuth();
  const { t, setUiLanguage } = useLanguage();

  // Landing page is always English; course language takes over once a course opens.
  useEffect(() => {
    setUiLanguage('en');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="landing">
      <header className="landing-topbar">
        <div className="landing-brand">📐 MiniLectures.app</div>
        <div className="landing-topbar-actions">
          {isAdmin && (
            <button className="landing-btn landing-btn--ghost" onClick={onOpenAdmin}>
              {t('admin_button')}
            </button>
          )}
          {isTeacher && (
            <button className="landing-btn landing-btn--ghost" onClick={onCreateCourse}>
              {t('sidebar_new_course')}
            </button>
          )}
          {user ? (
            <div className="landing-user">
              <span className="landing-user-email">{user.email}</span>
              <button className="landing-btn landing-btn--ghost" onClick={signOut}>
                {t('sidebar_sign_out')}
              </button>
            </div>
          ) : (
            <button className="landing-btn" onClick={onLoginClick}>
              {t('sidebar_sign_in')}
            </button>
          )}
        </div>
      </header>

      <section className="landing-hero">
        <h1 className="landing-title">{t('landing_title')}</h1>
        <p className="landing-tagline">{t('landing_tagline')}</p>
      </section>

      <section className="landing-courses">
        <h2 className="landing-section-title">{t('landing_courses_title')}</h2>

        {courses.length === 0 ? (
          <div className="landing-empty">
            <p>{isTeacher ? t('main_no_course_teacher') : t('landing_empty_student')}</p>
            {isTeacher ? (
              <button className="landing-btn" onClick={onCreateCourse}>
                {t('main_create_first_course')}
              </button>
            ) : !user ? (
              <button className="landing-btn" onClick={onLoginClick}>
                {t('sidebar_sign_in')}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="landing-grid">
            {courses.map(course => (
              <button
                key={course.id}
                className="landing-card"
                onClick={() => onSelectCourse(course.id)}
              >
                <h3 className="landing-card-title">
                  <MathText text={course.name} />
                  <span className="landing-card-flag">{LANGUAGE_FLAGS[course.language] ?? '🌐'}</span>
                </h3>
                {course.subtitle && (
                  <p className="landing-card-subtitle">
                    <MathText text={course.subtitle} />
                  </p>
                )}
                {(isTeacher || isAdmin) && !course.published && (
                  <span className="landing-card-badge">{t('landing_draft')}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="landing-features">
        <div className="landing-feature">
          <div className="landing-feature-icon">∑</div>
          <h4>{t('landing_feature_latex_title')}</h4>
          <p>{t('landing_feature_latex_body')}</p>
        </div>
        <div className="landing-feature">
          <div className="landing-feature-icon">✓</div>
          <h4>{t('landing_feature_quiz_title')}</h4>
          <p>{t('landing_feature_quiz_body')}</p>
        </div>
        <div className="landing-feature">
          <div className="landing-feature-icon">✎</div>
          <h4>{t('landing_feature_exercise_title')}</h4>
          <p>{t('landing_feature_exercise_body')}</p>
        </div>
      </section>
    </div>
  );
}

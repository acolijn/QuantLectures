import { createContext, useContext, useMemo, useState } from 'react';
import { SUPPORTED_UI_LANGUAGES, translations } from '../i18n/translations';

const STORAGE_UI_LANGUAGE = 'qm1-ui-language';

const LanguageContext = createContext(null);

function normalizeUiLanguage(language) {
  if (SUPPORTED_UI_LANGUAGES.includes(language)) return language;
  return 'nl';
}

function mapCourseLanguageToUiLanguage(courseLanguage) {
  if (courseLanguage === 'nl') return 'nl';
  return 'en';
}

function loadUiLanguage() {
  try {
    return normalizeUiLanguage(localStorage.getItem(STORAGE_UI_LANGUAGE) ?? 'nl');
  } catch {
    return 'nl';
  }
}

function setLocalStorageValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors in private mode
  }
}

function interpolate(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

export function LanguageProvider({ children }) {
  const [uiLanguage, setUiLanguageState] = useState(loadUiLanguage);

  function setUiLanguage(language) {
    const next = normalizeUiLanguage(language);
    setUiLanguageState(next);
    setLocalStorageValue(STORAGE_UI_LANGUAGE, next);
  }

  function syncWithCourseLanguage(courseLanguage) {
    if (!courseLanguage) return;
    setUiLanguage(mapCourseLanguageToUiLanguage(courseLanguage));
  }

  const t = useMemo(() => {
    return (key, vars) => {
      const bundle = translations[uiLanguage] ?? translations.nl;
      const fallback = translations.nl[key] ?? key;
      const raw = bundle[key] ?? fallback;
      if (typeof raw !== 'string') return String(raw ?? key);
      return vars ? interpolate(raw, vars) : raw;
    };
  }, [uiLanguage]);

  const value = useMemo(() => ({
    uiLanguage,
    setUiLanguage,
    syncWithCourseLanguage,
    t,
  }), [uiLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}

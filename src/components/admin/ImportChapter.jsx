import { useState } from 'react';
import { upsertChapter } from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';

const BASE_PROMPT = `Je bent een assistent die college-aantekeningen omzet naar een gestructureerd JSON-hoofdstuk voor een leer-app.

Genereer ALLEEN geldige JSON (geen markdown, geen uitleg erbuiten), in dit exacte formaat:

{
  "title": "Hoofdstuktitel",
  "subtitle": "Korte beschrijving van de onderwerpen",
  "formulas": [
    { "name": "Naam van de formule", "latex": "E = mc^2" }
  ],
  "concepts": [
    {
      "title": "Naam van het concept",
      "content": "Uitgebreide uitleg in het Nederlands. Gebruik $...$ voor inline LaTeX en $$...$$ voor display LaTeX."
    }
  ],
  "exercises": [
    {
      "label": "Opgave 1",
      "title": "Titel van de opgave",
      "intro": "Inleiding tot de opgave met context. Gebruik $...$ voor inline LaTeX.",
      "steps": [
        {
          "question": "Eerste deelvraag met eventueel $LaTeX$.",
          "hints": [
            "Eerste hint.",
            "Tweede hint met meer detail."
          ],
          "solution": [
            "Eerste stap van de oplossing.",
            "$LaTeX-uitdrukking$",
            "Conclusie."
          ]
        },
        {
          "question": "Tweede deelvraag. Bereken een numerieke waarde.",
          "hints": ["Hint voor berekening."],
          "answer": ["numeriek antwoord"],
          "solution": [
            "Oplossing stap 1.",
            "Uitkomst: $x = 42$"
          ]
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "Meerkeuzevraag met LaTeX: $\\hat{H}|\\psi\\rangle = E|\\psi\\rangle$?",
      "options": ["$\\alpha$", "$\\beta$", "Optie C", "Optie D"],
      "correct": 0
    }
  ]
}

LaTeX-regels (VERPLICHT — gebruik altijd echte LaTeX-commando's):
- Griekse letters: \\alpha \\beta \\gamma \\psi \\Psi \\phi \\Phi \\omega \\Omega \\lambda \\Lambda \\hbar
- Breuken: \\frac{teller}{noemer}
- Wortels: \\sqrt{x}
- Machten/indices: x^{2} x_{n}
- Dirac-notatie: |\\psi\\rangle \\langle\\psi| \\langle\\psi|\\hat{A}|\\psi\\rangle
- Operatoren: \\hat{H} \\hat{p} \\hat{x}
- Integralen: \\int_{-\\infty}^{\\infty}
- Vectoren: \\vec{p} \\nabla
- Speciale symbolen: \\infty \\partial \\otimes \\dagger
- FOUT: |psi>, alpha, sqrt(x) — dit zijn GEEN geldige LaTeX-commando's
- GOED: |\\psi\\rangle, \\alpha, \\sqrt{x}

Overige regels:
- Geef 4-10 formules, 4-8 concepten, 2-4 opgaven met elk 3-6 stappen, 3-6 quizvragen
- Elke quizvraag heeft precies 4 opties; "correct" is de index (0-3) van het juiste antwoord
- VERPLICHT: omsluit ALLE LaTeX in quizvragen én opties met $...$ (inline), ook korte uitdrukkingen zoals $|0\\rangle$ of $\\alpha$
- FOUT: "options": ["|0\\rangle", "|1\\rangle"] — GOED: "options": ["$|0\\rangle$", "$|1\\rangle$"]
- Geef ALLEEN de JSON terug, niets anders
`;

const LANGUAGE_LABELS = {
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  pl: 'Polski',
};

function buildClaudePrompt(course) {
  const languageCode = course?.language ?? 'nl';
  const languageLabel = LANGUAGE_LABELS[languageCode] ?? 'Nederlands';
  const subjectPrompt = (course?.subjectPrompt ?? '').trim();

  const dynamicContext = [
    'Cursusinstellingen voor deze import (automatisch toegevoegd):',
    `- Schrijf alle inhoud in: ${languageLabel}`,
    subjectPrompt
      ? `- Vakinhoudelijke instructies van docent: ${subjectPrompt}`
      : '- Vakinhoudelijke instructies van docent: (nog niet ingesteld)',
    '',
    'Hier zijn de college-aantekeningen / het bronmateriaal:',
    '',
    '[PLAK HIER JE AANTEKENINGEN / BOEKFRAGMENT / ANDERE INFORMATIE]',
  ].join('\n');

  return `${BASE_PROMPT}\n\n${dynamicContext}`;
}

const REQUIRED_KEYS = ['title', 'subtitle', 'formulas', 'concepts', 'exercises', 'quiz'];

function validateChapter(obj, t) {
  for (const key of REQUIRED_KEYS) {
    if (!(key in obj)) return t('import_required_field_missing', { field: key });
  }
  if (!Array.isArray(obj.formulas))  return t('import_array_expected', { field: 'formulas' });
  if (!Array.isArray(obj.concepts))  return t('import_array_expected', { field: 'concepts' });
  if (!Array.isArray(obj.exercises)) return t('import_array_expected', { field: 'exercises' });
  if (!Array.isArray(obj.quiz))      return t('import_array_expected', { field: 'quiz' });
  return null;
}

export default function ImportChapter({ courseId, course, existingChapters, onClose, onImported }) {
  const { t } = useLanguage();
  const [json, setJson]           = useState('');
  const [chapterNum, setChapterNum] = useState(
    existingChapters.length > 0 ? Math.max(...existingChapters.map(c => c.id)) + 1 : 1
  );
  const [error, setError]         = useState(null);
  const [saving, setSaving]       = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const claudePrompt = buildClaudePrompt(course);

  const localizedPrompt = claudePrompt
    .replace(
      'Cursusinstellingen voor deze import (automatisch toegevoegd):',
      t('import_prompt_context_title')
    )
    .replace(
      /- Schrijf alle inhoud in: (.*)/,
      (_, language) => t('import_prompt_language', { language })
    )
    .replace(
      /- Vakinhoudelijke instructies van docent: \(nog niet ingesteld\)/,
      t('import_prompt_subject_missing')
    )
    .replace(
      /- Vakinhoudelijke instructies van docent: (.*)/,
      (_, text) => t('import_prompt_subject', { text })
    )
    .replace(
      'Hier zijn de college-aantekeningen / het bronmateriaal:',
      t('import_prompt_source_title')
    )
    .replace(
      '[PLAK HIER JE AANTEKENINGEN / BOEKFRAGMENT / ANDERE INFORMATIE]',
      t('import_prompt_source_placeholder')
    );

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(localizedPrompt);
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement('textarea');
      el.value = localizedPrompt;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  }

  async function handleImport() {
    setError(null);
    let parsed;
    try {
      // Strip markdown code fences and extract the JSON object,
      // ignoring any surrounding text Claude may have added
      let cleaned = json.trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      const start = cleaned.indexOf('{');
      const end   = cleaned.lastIndexOf('}');
      if (start !== -1 && end > start) {
        cleaned = cleaned.slice(start, end + 1);
      }
      // Normalize typographic/curly quotes that Claude's UI inserts
      // (do this first so string boundaries are reliably straight-quote delimited)
      cleaned = cleaned
        .replace(/[\u201C\u201D]/g, '"')  // " "  → "
        .replace(/[\u2018\u2019]/g, "'"); // ' '  → '

      // Fix LaTeX backslashes: walk through the JSON character by character and,
      // inside string values, double every backslash except \" (escaped quote).
      // This correctly handles \frac, \begin, and tricky sequences like \\\infty
      // (LaTeX line-break + \infty) where the lookbehind regex approach fails.
      {
        let out = '';
        let inStr = false;
        for (let i = 0; i < cleaned.length; i++) {
          const c = cleaned[i];
          if (!inStr) {
            out += c;
            if (c === '"') inStr = true;
          } else if (c === '\\') {
            if (cleaned[i + 1] === '"') {
              // \" — valid JSON escape for a literal quote, keep as-is
              out += '\\"';
              i++;
            } else {
              // Any other backslash (LaTeX command, \\, etc.) — double it
              out += '\\\\';
            }
          } else {
            out += c;
            if (c === '"') inStr = false;
          }
        }
        cleaned = out;
      }
      parsed = JSON.parse(cleaned);
    } catch(e) {
      setError(t('import_invalid_json', { message: e.message }));
      return;
    }
    const validationError = validateChapter(parsed, t);
    if (validationError) { setError(validationError); return; }
    if (!chapterNum || chapterNum < 1) { setError(t('import_invalid_chapter_num')); return; }

    setSaving(true);
    try {
      const saved = await upsertChapter({ ...parsed, id: chapterNum }, courseId);
      onImported(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal import-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('import_title')}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Step 1 */}
        <div className="import-step">
          <div className="import-step-label">{t('import_step1')}</div>
          <p className="import-step-desc">
            {t('import_step1_desc_a')}{' '}
            <a href="https://claude.ai" target="_blank" rel="noreferrer">claude.ai</a>,
            {' '}{t('import_step1_desc_b')}
          </p>
          <div className="import-prompt-actions">
            <button className="btn-copy-prompt" onClick={handleCopyPrompt}>
              {promptCopied ? t('import_copied') : t('import_copy_prompt')}
            </button>
            <button
              className="btn-toggle-prompt"
              onClick={() => setShowPrompt(p => !p)}
            >
              {showPrompt ? t('import_hide_prompt') : t('import_show_prompt')}
            </button>
          </div>
          {showPrompt && (
            <pre className="import-prompt-preview">{localizedPrompt}</pre>
          )}
        </div>

        {/* Step 2 */}
        <div className="import-step">
          <div className="import-step-label">{t('import_step2')}</div>
          <textarea
            className="import-json-input"
            placeholder={'{\n  "title": "...",\n  "formulas": [...],\n  ...\n}'}
            value={json}
            onChange={e => { setJson(e.target.value); setError(null); }}
            rows={10}
            spellCheck={false}
          />
        </div>

        {/* Step 3 */}
        <div className="import-step import-step--inline">
          <div className="import-step-label">{t('import_step3')}</div>
          <input
            type="number"
            min="1"
            className="import-chapter-num"
            value={chapterNum}
            onChange={e => setChapterNum(parseInt(e.target.value))}
          />
          <span className="import-chapter-num-hint">
            {existingChapters.find(c => c.id === chapterNum)
              ? t('import_overwrite_warning')
              : t('import_new_chapter')}
          </span>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button className="btn-secondary" onClick={onClose}>{t('common_cancel')}</button>
          <button className="btn-primary" onClick={handleImport} disabled={saving || !json.trim()}>
            {saving ? t('import_importing') : t('import_import_button')}
          </button>
        </div>
      </div>
    </div>
  );
}

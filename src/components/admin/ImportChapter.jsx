import { useState } from 'react';
import { upsertChapter } from '../../lib/api';

const CLAUDE_PROMPT = `Je bent een assistent die college-aantekeningen omzet naar een gestructureerd JSON-hoofdstuk voor een quantumfysica leer-app.

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
- Schrijf in het Nederlands
- Geef 4-10 formules, 4-8 concepten, 2-4 opgaven met elk 3-6 stappen, 3-6 quizvragen
- Elke quizvraag heeft precies 4 opties; "correct" is de index (0-3) van het juiste antwoord
- VERPLICHT: omsluit ALLE LaTeX in quizvragen én opties met $...$ (inline), ook korte uitdrukkingen zoals $|0\\rangle$ of $\\alpha$
- FOUT: "options": ["|0\\rangle", "|1\\rangle"] — GOED: "options": ["$|0\\rangle$", "$|1\\rangle$"]
- Geef ALLEEN de JSON terug, niets anders

Hier zijn de college-aantekeningen / het bronmateriaal:

[PLAK HIER JE AANTEKENINGEN / BOEKFRAGMENT / ANDERE INFORMATIE]`;

const REQUIRED_KEYS = ['title', 'subtitle', 'formulas', 'concepts', 'exercises', 'quiz'];

function validateChapter(obj) {
  for (const key of REQUIRED_KEYS) {
    if (!(key in obj)) return `Verplicht veld ontbreekt: "${key}"`;
  }
  if (!Array.isArray(obj.formulas))  return '"formulas" moet een array zijn';
  if (!Array.isArray(obj.concepts))  return '"concepts" moet een array zijn';
  if (!Array.isArray(obj.exercises)) return '"exercises" moet een array zijn';
  if (!Array.isArray(obj.quiz))      return '"quiz" moet een array zijn';
  return null;
}

export default function ImportChapter({ courseId, existingChapters, onClose, onImported }) {
  const [json, setJson]           = useState('');
  const [chapterNum, setChapterNum] = useState(
    existingChapters.length > 0 ? Math.max(...existingChapters.map(c => c.id)) + 1 : 1
  );
  const [error, setError]         = useState(null);
  const [saving, setSaving]       = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(CLAUDE_PROMPT);
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement('textarea');
      el.value = CLAUDE_PROMPT;
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
      // Double backslashes for LaTeX commands (\alpha → \\alpha etc.)
      // Only touch single backslashes — skip already-doubled ones (negative lookbehind)
      cleaned = cleaned.replace(/(?<!\\)\\([a-zA-Z{}[\]|,;! ^_])/g, '\\\\$1');

      // Normalize typographic/curly quotes that Claude's UI inserts
      cleaned = cleaned
        .replace(/[\u201C\u201D]/g, '"')  // " "  → "
        .replace(/[\u2018\u2019]/g, "'"); // ' '  → '
      parsed = JSON.parse(cleaned);
    } catch(e) {
      setError(`Ongeldige JSON: ${e.message}`);
      return;
    }
    const validationError = validateChapter(parsed);
    if (validationError) { setError(validationError); return; }
    if (!chapterNum || chapterNum < 1) { setError('Voer een geldig hoofdstuknummer in.'); return; }

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
          <h2>Hoofdstuk importeren</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Step 1 */}
        <div className="import-step">
          <div className="import-step-label">Stap 1 — Kopieer de Claude-prompt</div>
          <p className="import-step-desc">
            Kopieer de prompt hieronder, open{' '}
            <a href="https://claude.ai" target="_blank" rel="noreferrer">claude.ai</a>,
            plak de prompt en voeg je eigen aantekeningen toe op de aangegeven plek.
          </p>
          <div className="import-prompt-actions">
            <button className="btn-copy-prompt" onClick={handleCopyPrompt}>
              {promptCopied ? '✓ Gekopieerd!' : '📋 Kopieer prompt'}
            </button>
            <button
              className="btn-toggle-prompt"
              onClick={() => setShowPrompt(p => !p)}
            >
              {showPrompt ? 'Verberg prompt' : 'Bekijk prompt'}
            </button>
          </div>
          {showPrompt && (
            <pre className="import-prompt-preview">{CLAUDE_PROMPT}</pre>
          )}
        </div>

        {/* Step 2 */}
        <div className="import-step">
          <div className="import-step-label">Stap 2 — Plak de JSON-output van Claude</div>
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
          <div className="import-step-label">Stap 3 — Hoofdstuknummer</div>
          <input
            type="number"
            min="1"
            className="import-chapter-num"
            value={chapterNum}
            onChange={e => setChapterNum(parseInt(e.target.value))}
          />
          <span className="import-chapter-num-hint">
            {existingChapters.find(c => c.id === chapterNum)
              ? '⚠️ Overschrijft bestaand hoofdstuk'
              : '(nieuw hoofdstuk)'}
          </span>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button className="btn-secondary" onClick={onClose}>Annuleren</button>
          <button className="btn-primary" onClick={handleImport} disabled={saving || !json.trim()}>
            {saving ? 'Importeren…' : '⬆️ Importeer hoofdstuk'}
          </button>
        </div>
      </div>
    </div>
  );
}

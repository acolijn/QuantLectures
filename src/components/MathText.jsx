import { useEffect, useRef } from 'react';
import katex from 'katex';

function decodeEscapedUnicode(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return `\\u${hex}`;
    }
  });
}

export default function MathText({ text, figures }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !text) return;
    const normalizedText = decodeEscapedUnicode(text);

    // Split on display math ($$...$$) first, then inline math ($...$)
    const tokens = [];
    const displayRegex = /\$\$([^$]+?)\$\$/g;
    let lastIndex = 0;
    let match;

    while ((match = displayRegex.exec(normalizedText)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'text', value: normalizedText.slice(lastIndex, match.index) });
      }
      tokens.push({ type: 'displaymath', value: match[1] });
      lastIndex = displayRegex.lastIndex;
    }
    if (lastIndex < normalizedText.length) {
      tokens.push({ type: 'text', value: normalizedText.slice(lastIndex) });
    }

    // Further split text tokens: first extract tables, then inline math
    const allTokens = [];
    tokens.forEach(token => {
      if (token.type !== 'text') {
        allTokens.push(token);
        return;
      }
      // Extract markdown tables before inline math splitting
      const tableRegex = /((?:^|\n)\|.+\|(?:\n\|.+\|)+)/g;
      const tableParts = token.value.split(tableRegex);
      tableParts.forEach(part => {
        const tableLines = part.trim().split('\n').filter(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
        if (tableLines.length >= 2) {
          allTokens.push({ type: 'table', value: tableLines });
          return;
        }
        // Split non-table text on inline math ($...$)
        const inlineRegex = /\$([^$]+?)\$/g;
        let last = 0;
        let m;
        while ((m = inlineRegex.exec(part)) !== null) {
          if (m.index > last) {
            allTokens.push({ type: 'text', value: part.slice(last, m.index) });
          }
          allTokens.push({ type: 'inlinemath', value: m[1] });
          last = inlineRegex.lastIndex;
        }
        if (last < part.length) {
          allTokens.push({ type: 'text', value: part.slice(last) });
        }
      });
    });

    // Further split text tokens on [fig:ref] figure placeholders
    const withFigs = [];
    allTokens.forEach(token => {
      if (token.type !== 'text') { withFigs.push(token); return; }
      const figRegex = /\[fig:([\w-]+)\]/g;
      let last = 0;
      let fm;
      while ((fm = figRegex.exec(token.value)) !== null) {
        if (fm.index > last) withFigs.push({ type: 'text', value: token.value.slice(last, fm.index) });
        withFigs.push({ type: 'figref', ref: fm[1] });
        last = figRegex.lastIndex;
      }
      if (last < token.value.length) withFigs.push({ type: 'text', value: token.value.slice(last) });
    });
    const allTokensFinal = withFigs;

    // Render tokens
    containerRef.current.innerHTML = '';
    allTokensFinal.forEach(token => {
      if (token.type === 'figref') {
        const figMap = figures || {};
        const fig = figMap[token.ref];
        const wrapper = document.createElement('span');
        wrapper.className = 'fig-inline';
        if (fig?.url) {
          const img = document.createElement('img');
          img.src = fig.url;
          img.alt = fig.caption || token.ref;
          img.className = 'fig-inline-img';
          wrapper.appendChild(img);
          if (fig.caption) {
            const cap = document.createElement('span');
            cap.className = 'fig-inline-caption';
            cap.textContent = fig.caption;
            wrapper.appendChild(cap);
          }
        } else {
          wrapper.className += ' fig-placeholder';
          wrapper.textContent = `[fig:${token.ref}]`;
        }
        containerRef.current.appendChild(wrapper);
        return;
      }
      if (token.type === 'displaymath') {
        const div = document.createElement('div');
        div.className = 'math-block';
        try {
          katex.render(token.value, div, { throwOnError: false, displayMode: true });
        } catch (e) {
          div.textContent = token.value;
        }
        containerRef.current.appendChild(div);
      } else if (token.type === 'inlinemath') {
        const span = document.createElement('span');
        try {
          katex.render(token.value, span, { throwOnError: false, displayMode: false });
        } catch (e) {
          span.textContent = token.value;
        }
        containerRef.current.appendChild(span);
      } else if (token.type === 'table') {
        const tableLines = token.value;
        const table = document.createElement('table');
        table.className = 'math-table';
        const hasSeparator = /^\|[\s\-:]+(\|[\s\-:]+)+\|$/.test(tableLines[1]);
        const dataRows = hasSeparator ? [tableLines[0], ...tableLines.slice(2)] : tableLines;
        dataRows.forEach((row, ri) => {
          const tr = document.createElement('tr');
          const cells = row.split('|').filter((_, ci, arr) => ci > 0 && ci < arr.length - 1);
          cells.forEach(cell => {
            const td = document.createElement(ri === 0 && hasSeparator ? 'th' : 'td');
            const cellText = cell.trim()
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
            const mathParts = cellText.split(/(\$[^$]+?\$)/);
            if (mathParts.some(p => /^\$[^$]+\$$/.test(p))) {
              mathParts.forEach(mp => {
                const mm = mp.match(/^\$([^$]+)\$$/);
                if (mm) {
                  const mathSpan = document.createElement('span');
                  try { katex.render(mm[1], mathSpan, { throwOnError: false, displayMode: false }); }
                  catch(e) { mathSpan.textContent = mm[1]; }
                  td.appendChild(mathSpan);
                } else if (mp) {
                  const textNode = document.createElement('span');
                  textNode.innerHTML = mp;
                  td.appendChild(textNode);
                }
              });
            } else {
              td.innerHTML = cellText;
            }
            tr.appendChild(td);
          });
          table.appendChild(tr);
        });
        containerRef.current.appendChild(table);
      } else {
        // Process regular text: normalize escaped newlines and handle formatting
        const span = document.createElement('span');
        const normalizedPlainText = token.value
          .replace(/\\r\\n/g, '\n')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\n');

        let html = normalizedPlainText
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n\n/g, '<br/><br/>')
          .replace(/\n/g, '<br/>')
          .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
        span.innerHTML = html;
        containerRef.current.appendChild(span);
      }
    });
  }, [text, figures]);

  return <span ref={containerRef} />;
}

export function MathBlock({ latex }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !latex) return;
    try {
      katex.render(latex, containerRef.current, { throwOnError: false, displayMode: true });
    } catch (e) {
      containerRef.current.textContent = latex;
    }
  }, [latex]);

  return <div ref={containerRef} className="math-block" />;
}

import { useEffect, useRef } from 'react';
import katex from 'katex';

export default function MathText({ text }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !text) return;

    // Split on display math ($$...$$) first, then inline math ($...$)
    const tokens = [];
    const displayRegex = /\$\$([^$]+?)\$\$/g;
    let lastIndex = 0;
    let match;

    while ((match = displayRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
      }
      tokens.push({ type: 'displaymath', value: match[1] });
      lastIndex = displayRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      tokens.push({ type: 'text', value: text.slice(lastIndex) });
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

    // Render tokens
    containerRef.current.innerHTML = '';
    allTokens.forEach(token => {
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
      } else {
        // Process text: handle tables, \n, **bold**
        // First check if text contains a markdown table
        const tableRegex = /((?:^|\n)\|.+\|(?:\n\|.+\|)+)/g;
        const textVal = token.value;
        const parts = textVal.split(tableRegex);

        parts.forEach(part => {
          // Check if this part is a table block
          const tableLines = part.trim().split('\n').filter(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
          if (tableLines.length >= 2) {
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
                // Render inline math in table cells
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
          } else if (part) {
            // Regular text (non-table)
            const span = document.createElement('span');
            let html = part
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
      }
    });
  }, [text]);

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

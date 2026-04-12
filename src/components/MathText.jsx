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

    // Further split text tokens on inline math ($...$)
    const allTokens = [];
    tokens.forEach(token => {
      if (token.type !== 'text') {
        allTokens.push(token);
        return;
      }
      const inlineRegex = /\$([^$]+?)\$/g;
      let last = 0;
      let m;
      while ((m = inlineRegex.exec(token.value)) !== null) {
        if (m.index > last) {
          allTokens.push({ type: 'text', value: token.value.slice(last, m.index) });
        }
        allTokens.push({ type: 'inlinemath', value: m[1] });
        last = inlineRegex.lastIndex;
      }
      if (last < token.value.length) {
        allTokens.push({ type: 'text', value: token.value.slice(last) });
      }
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
        // Process text: handle tables, \n, **bold**, - lists
        const lines = token.value.split('\n');
        // Detect markdown tables (consecutive lines starting with |)
        let i = 0;
        while (i < lines.length) {
          // Check if this starts a table block
          if (lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
            const tableLines = [];
            while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
              tableLines.push(lines[i].trim());
              i++;
            }
            if (tableLines.length >= 2) {
              const table = document.createElement('table');
              table.className = 'math-table';
              // Check if second line is separator (|---|---|)
              const hasSeparator = /^\|[\s\-:]+(\|[\s\-:]+)+\|$/.test(tableLines[1]);
              const dataRows = hasSeparator ? [tableLines[0], ...tableLines.slice(2)] : tableLines;
              dataRows.forEach((row, ri) => {
                const tr = document.createElement('tr');
                const cells = row.split('|').filter((_, ci, arr) => ci > 0 && ci < arr.length - 1);
                cells.forEach(cell => {
                  const td = document.createElement(ri === 0 && hasSeparator ? 'th' : 'td');
                  td.innerHTML = cell.trim()
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
                  // Render inline math in table cells
                  const mathParts = td.innerHTML.split(/(\$[^$]+?\$)/);
                  if (mathParts.length > 1) {
                    td.innerHTML = '';
                    mathParts.forEach(part => {
                      const m = part.match(/^\$([^$]+)\$$/);
                      if (m) {
                        const mathSpan = document.createElement('span');
                        try { katex.render(m[1], mathSpan, { throwOnError: false, displayMode: false }); }
                        catch(e) { mathSpan.textContent = m[1]; }
                        td.appendChild(mathSpan);
                      } else {
                        const textNode = document.createElement('span');
                        textNode.innerHTML = part;
                        td.appendChild(textNode);
                      }
                    });
                  }
                  tr.appendChild(td);
                });
                (ri === 0 && hasSeparator ? (table.createTHead ? table.createTHead() : table) : table).appendChild(tr);
              });
              containerRef.current.appendChild(table);
            }
            continue;
          }
          // Non-table line
          const span = document.createElement('span');
          let html = lines[i]
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
          if (i < lines.length - 1 || lines[i] !== '') {
            html += '<br/>';
          }
          // Collapse double <br/>
          span.innerHTML = html;
          containerRef.current.appendChild(span);
          i++;
        }
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

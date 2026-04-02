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
        // Process text: handle \n, **bold**
        const span = document.createElement('span');
        let html = token.value
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

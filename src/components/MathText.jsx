import { useEffect, useRef } from 'react';
import katex from 'katex';

export default function MathText({ text }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !text) return;

    // Split text into math ($...$) and non-math parts
    const parts = text.split(/(\$[^$]+\$)/g);
    containerRef.current.innerHTML = '';

    parts.forEach(part => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        const span = document.createElement('span');
        try {
          katex.render(math, span, { throwOnError: false, displayMode: false });
        } catch (e) {
          span.textContent = math;
        }
        containerRef.current.appendChild(span);
      } else {
        const span = document.createElement('span');
        span.textContent = part;
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

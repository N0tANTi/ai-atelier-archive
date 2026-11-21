import { useState, useCallback } from 'react';

export function useCopy(resetMs = 1800) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, id = 'default') => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        window.setTimeout(() => {
          setCopiedId((curr) => (curr === id ? null : curr));
        }, resetMs);
        return true;
      } catch {
        // Fallback for non-HTTPS contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedId(id);
        window.setTimeout(() => {
          setCopiedId((curr) => (curr === id ? null : curr));
        }, resetMs);
        return true;
      }
    },
    [resetMs]
  );

  return { copiedId, copy };
}

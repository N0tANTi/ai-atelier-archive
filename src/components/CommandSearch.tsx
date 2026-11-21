import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  X,
  FileText,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { archiveDocs, allPromptCards, type PromptCard } from '../lib/content';
import { useCopy } from '../lib/useCopy';

interface CommandSearchProps {
  open: boolean;
  onClose: () => void;
  onSelectDoc: (slug: string) => void;
  onFocusCard: (card: PromptCard) => void;
}

export function CommandSearch({
  open,
  onClose,
  onSelectDoc,
  onFocusCard,
}: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { copiedId, copy } = useCopy();

  useEffect(() => {
    if (open) {
      setQuery('');
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const { matchedDocs, matchedCards } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { matchedDocs: archiveDocs, matchedCards: allPromptCards };
    }
    const docs = archiveDocs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.bodyMarkdown.toLowerCase().includes(q)
    );
    const cards = allPromptCards.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.promptSubtitle ?? '').toLowerCase().includes(q) ||
        (c.stage ?? '').toLowerCase().includes(q) ||
        c.rawPrompt.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
    return { matchedDocs: docs, matchedCards: cards };
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-[10vh] backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="animate-dropbox-in w-full max-w-2xl overflow-hidden border-2 border-[var(--ink-base)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--blueprint-line)] px-5 py-4">
          <Search className="h-4 w-4 shrink-0 text-[var(--brand-blue)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="检索档案标题、正文关键词、标签或 Prompt 卡片（如 Kuwahara、草海、Alpha）..."
            className="w-full bg-transparent text-sm text-[var(--ink-base)] placeholder:text-[var(--ink-muted)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink-base)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="border border-[var(--hairline-strong)] px-1.5 py-0.5 font-mono-tech text-[10px] text-[var(--ink-muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {matchedDocs.length === 0 && matchedCards.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-display text-lg font-bold text-[var(--ink-base)]">
                未找到包含「{query}」的档案或卡片
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                请换一个关键词试试
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedDocs.length > 0 && (
                <div>
                  <div className="mb-1.5 px-2.5 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                    DOCUMENTS · 档案文档 ({matchedDocs.length})
                  </div>
                  <div className="space-y-1">
                    {matchedDocs.map((doc) => (
                      <button
                        key={doc.slug}
                        onClick={() => {
                          onSelectDoc(doc.slug);
                          onClose();
                        }}
                        className="group flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-subtle)]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--brand-blue)] text-white">
                            <FileText className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono-tech text-[10px] font-bold text-[var(--brand-blue)]">
                                NO.{doc.number}
                              </span>
                              <span className="truncate font-display text-sm font-bold text-[var(--ink-base)]">
                                {doc.title}
                              </span>
                            </div>
                            <p className="truncate text-xs text-[var(--ink-secondary)]">
                              {doc.subtitle}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--ink-muted)] group-hover:text-[var(--brand-blue)]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedCards.length > 0 && (
                <div>
                  <div className="mb-1.5 px-2.5 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                    PROMPT CARDS · 精炼卡片 ({matchedCards.length})
                  </div>
                  <div className="space-y-1">
                    {matchedCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between gap-2 px-3 py-2.5 transition-colors hover:bg-[var(--bg-subtle)]"
                      >
                        <button
                          onClick={() => {
                            onFocusCard(card);
                            onClose();
                          }}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center font-mono-tech text-[11px] font-bold text-white"
                            style={{ backgroundColor: card.accentHex }}
                          >
                            #{card.number}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-display text-sm font-bold text-[var(--ink-base)]">
                                {card.title}
                              </span>
                              <span className="bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono-tech text-[10px] text-[var(--ink-secondary)]">
                                {card.stage}
                              </span>
                            </div>
                            <p className="truncate text-xs text-[var(--ink-secondary)]">
                              {card.promptSubtitle} · {card.docTitle}
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() => copy(card.rawPrompt, card.id)}
                          className="flex shrink-0 items-center gap-1 bg-[var(--ink-base)] px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
                        >
                          {copiedId === card.id ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>复制</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--hairline)] bg-[var(--bg-subtle)] px-5 py-2.5 font-mono-tech text-[10px] text-[var(--ink-muted)]">
          <span>AUTO-INDEXED FROM CONTENT/**/*.MD</span>
          <span>⌘K / CTRL+K</span>
        </div>
      </div>
    </div>
  );
}

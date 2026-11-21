import { useEffect } from 'react';
import { X, Copy, Check, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import type { PromptCard } from '../lib/content';
import { useCopy } from '../lib/useCopy';

interface CardFocusModalProps {
  cards: PromptCard[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
  onGoToDoc?: (slug: string) => void;
}

export function CardFocusModal({
  cards,
  activeIndex,
  onClose,
  onChangeIndex,
  onGoToDoc,
}: CardFocusModalProps) {
  const { copiedId, copy } = useCopy();

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + cards.length) % cards.length);
      }
      if (e.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % cards.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, cards.length, onClose, onChangeIndex]);

  if (activeIndex === null || !cards[activeIndex]) return null;
  const card = cards[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="animate-atelier-in relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Stage Color Accent Bar */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: card.accentHex }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line-subtle)] px-6 py-5 sm:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: card.accentHex }}
              />
              <span>{card.promptCode}</span>
              <span>·</span>
              <span>{card.stage}</span>
              <span>·</span>
              <span>
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(cards.length).padStart(2, '0')}
              </span>
            </div>
            <h3 className="mt-2 font-serif-cn text-2xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-3xl">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--ink-secondary)]">
              {card.promptSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭专注视图"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line-subtle)] text-[var(--ink-secondary)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Structured Points */}
        <div className="px-6 py-6 sm:px-8">
          <div className="space-y-4">
            {card.points.map((point, idx) => (
              <div
                key={idx}
                className="flex gap-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-canvas)]/75 p-4"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono-tech text-[11px] font-semibold text-white"
                  style={{ backgroundColor: card.accentHex }}
                >
                  0{idx + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-[var(--ink-primary)]">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Exact Prompt Snippet */}
          <div className="mt-5 rounded-xl bg-[var(--bg-specimen)] p-4 text-[var(--ink-on-specimen)]">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono-tech text-[10px] uppercase tracking-[0.14em] text-[var(--ink-on-specimen-muted)]">
                RAW PROMPT SNIPPET
              </span>
              <button
                onClick={() => copy(card.rawPrompt, card.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--ink-on-specimen)] transition-colors hover:bg-white/20"
              >
                {copiedId === card.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>已复制到剪贴板</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>复制此卡片 Prompt</span>
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono-tech text-xs leading-6 text-[var(--ink-on-specimen)]/90">
              {card.rawPrompt}
            </pre>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-[var(--line-subtle)] bg-[var(--bg-canvas)]/60 px-6 py-3.5 sm:px-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onChangeIndex((activeIndex - 1 + cards.length) % cards.length)
              }
              className="inline-flex items-center gap-1 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--ink-secondary)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>上一张</span>
            </button>
            <button
              onClick={() => onChangeIndex((activeIndex + 1) % cards.length)}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--ink-secondary)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]"
            >
              <span>下一张</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <span className="ml-2 hidden font-mono-tech text-[10px] text-[var(--ink-muted)] sm:inline">
              ← / → 切换卡片
            </span>
          </div>

          {onGoToDoc && (
            <button
              onClick={() => {
                onClose();
                onGoToDoc(card.docSlug);
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--accent)]"
            >
              <span>打开所属档案</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

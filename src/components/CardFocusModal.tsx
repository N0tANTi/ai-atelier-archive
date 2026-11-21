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

const DUOTONE_THEMES = [
  { bg: '#2B4464', fg: '#FFFFFF', badgeBg: '#82B8FF', badgeFg: '#1E1919' },
  { bg: '#3DD6F5', fg: '#1E1919', badgeBg: '#0B4C5F', badgeFg: '#FFFFFF' },
  { bg: '#FAD24B', fg: '#1E1919', badgeBg: '#594404', badgeFg: '#FFFFFF' },
  { bg: '#B4DC19', fg: '#1E1919', badgeBg: '#24450A', badgeFg: '#FFFFFF' },
  { bg: '#C8AFF0', fg: '#1E1919', badgeBg: '#441C78', badgeFg: '#FFFFFF' },
  { bg: '#FA551E', fg: '#1E1919', badgeBg: '#1E1919', badgeFg: '#FFFFFF' },
];

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
  const theme = DUOTONE_THEMES[(card.number - 1) % DUOTONE_THEMES.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-8 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="animate-dropbox-in relative w-full max-w-2xl overflow-hidden border-2 border-[var(--ink-base)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bold Duotone Color-Block Header */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-6 sm:px-8"
          style={{ backgroundColor: theme.bg, color: theme.fg }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono-tech text-[11px] font-semibold uppercase tracking-[0.12em]">
              <span
                className="px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: theme.badgeBg, color: theme.badgeFg }}
              >
                {card.stage}
              </span>
              <span className="opacity-80">{card.promptCode}</span>
              <span className="opacity-60">·</span>
              <span className="opacity-80">
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(cards.length).padStart(2, '0')}
              </span>
            </div>
            <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {card.title}
            </h3>
            <p className="mt-1 text-sm font-medium opacity-85">
              {card.promptSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭专注视图"
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-black/15 text-current transition-colors hover:bg-[#1E1919] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Structured Points */}
        <div className="px-6 py-6 sm:px-8">
          <div className="space-y-3">
            {card.points.map((point, idx) => (
              <div
                key={idx}
                className="flex gap-3.5 border border-[var(--hairline)] bg-[var(--bg-subtle)] p-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[var(--brand-blue)] font-mono-tech text-[11px] font-bold text-white">
                  0{idx + 1}
                </span>
                <p className="text-[14.5px] leading-relaxed text-[var(--ink-base)]">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Exact Prompt Snippet */}
          <div className="mt-5 bg-[var(--bg-dark-band)] p-4 text-white">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.14em] text-[#3DD6F5]">
                RAW PROMPT SNIPPET
              </span>
              <button
                onClick={() => copy(card.rawPrompt, card.id)}
                className="inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#1E1919]"
              >
                {copiedId === card.id ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
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
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono-tech text-xs leading-6 text-white/90">
              {card.rawPrompt}
            </pre>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-[var(--hairline)] bg-[var(--bg-subtle)] px-6 py-3.5 sm:px-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onChangeIndex((activeIndex - 1 + cards.length) % cards.length)
              }
              className="inline-flex items-center gap-1 border border-[var(--hairline-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:bg-[var(--ink-base)] hover:text-white"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>上一张</span>
            </button>
            <button
              onClick={() => onChangeIndex((activeIndex + 1) % cards.length)}
              className="inline-flex items-center gap-1 border border-[var(--hairline-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:bg-[var(--ink-base)] hover:text-white"
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
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:text-[var(--brand-blue)]"
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

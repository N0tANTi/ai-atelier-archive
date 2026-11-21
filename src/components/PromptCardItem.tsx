import { Copy, Check, Maximize2 } from 'lucide-react';
import type { PromptCard } from '../lib/content';

interface PromptCardItemProps {
  card: PromptCard;
  copied: boolean;
  onCopy: () => void;
  onFocus: () => void;
  compact?: boolean;
}

export function PromptCardItem({
  card,
  copied,
  onCopy,
  onFocus,
  compact = false,
}: PromptCardItemProps) {
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface)] transition-all duration-300 ease-atelier hover:-translate-y-1 hover:border-[var(--line-strong)]"
      style={{
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Top fine color-coded studio accent strip */}
      <div
        className="h-[3px] w-full shrink-0 opacity-90 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: card.accentHex }}
      />

      <div className={`flex-1 ${compact ? 'p-5' : 'p-6'}`}>
        {/* Top Metadata Rail */}
        <div className="flex items-center justify-between gap-2 border-b border-[var(--line-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-5 items-center rounded px-1.5 font-mono-tech text-[10px] font-semibold tracking-wider text-white"
              style={{ backgroundColor: card.accentHex }}
            >
              {card.stage || `STAGE ${card.number}`}
            </span>
            <span className="font-mono-tech text-[10px] tracking-[0.12em] text-[var(--ink-muted)]">
              CARD #{String(card.number).padStart(2, '0')}
            </span>
          </div>
          <button
            onClick={onFocus}
            title="专注模式查看"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--ink-muted)] opacity-70 transition-all hover:bg-[var(--bg-surface-alt)] hover:text-[var(--ink-primary)] group-hover:opacity-100"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Title & Prompt Code */}
        <div className="mt-4">
          <p className="font-mono-tech text-[10px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">
            {card.promptCode}
          </p>
          <h3 className="mt-1 font-serif-cn text-[19px] font-semibold leading-snug tracking-tight text-[var(--ink-primary)]">
            {card.title}
          </h3>
          {card.promptSubtitle && card.promptSubtitle !== card.title && (
            <p className="mt-1 text-xs font-medium text-[var(--ink-secondary)]">
              {card.promptSubtitle}
            </p>
          )}
        </div>

        {/* Structured Numbered Points */}
        <ol className="mt-4 space-y-2.5">
          {card.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[13px] leading-relaxed">
              <span className="mt-0.5 shrink-0 font-mono-tech text-[10px] font-semibold text-[var(--ink-muted)]">
                0{idx + 1}
              </span>
              <span className="text-[var(--ink-secondary)]">{point}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Bottom Action Hairline Bar */}
      <div className="flex items-center justify-between border-t border-[var(--line-subtle)] bg-[var(--bg-canvas)]/45 px-5 py-3">
        <button
          onClick={onFocus}
          className="font-mono-tech text-[11px] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink-primary)]"
        >
          查看详情 →
        </button>

        <button
          onClick={onCopy}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
            copied
              ? 'border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400'
              : 'border-[var(--line-subtle)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--line-solid)] hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)]'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>复制 Prompt</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

import { Copy, Check, Maximize2, FileCode2, ArrowUpRight } from 'lucide-react';
import type { PromptCard } from '../lib/content';

interface PromptCardItemProps {
  card: PromptCard;
  copied: boolean;
  onCopy: () => void;
  onFocus: () => void;
  compact?: boolean;
}

const DUOTONE_THEMES = [
  { bg: '#2B4464', fg: '#FFFFFF', sub: '#82B8FF', badgeBg: '#82B8FF', badgeFg: '#1E1919' },
  { bg: '#3DD6F5', fg: '#1E1919', sub: '#0B4C5F', badgeBg: '#0B4C5F', badgeFg: '#FFFFFF' },
  { bg: '#FAD24B', fg: '#1E1919', sub: '#594404', badgeBg: '#594404', badgeFg: '#FFFFFF' },
  { bg: '#B4DC19', fg: '#1E1919', sub: '#24450A', badgeBg: '#24450A', badgeFg: '#FFFFFF' },
  { bg: '#C8AFF0', fg: '#1E1919', sub: '#441C78', badgeBg: '#441C78', badgeFg: '#FFFFFF' },
  { bg: '#FA551E', fg: '#1E1919', sub: '#6B1506', badgeBg: '#1E1919', badgeFg: '#FFFFFF' },
];

export function PromptCardItem({
  card,
  copied,
  onCopy,
  onFocus,
  compact = false,
}: PromptCardItemProps) {
  const theme = DUOTONE_THEMES[(card.number - 1) % DUOTONE_THEMES.length];

  return (
    <article className="group flex h-full flex-col border border-[var(--hairline-strong)] bg-white transition-all duration-300 ease-dropbox hover:border-[var(--ink-base)]">
      {/* Authentic Dropbox Saturated Duotone Header Block (flips to #1E1919 on card hover!) */}
      <div
        className="transition-colors duration-300 ease-dropbox group-hover:!bg-[#1E1919] group-hover:!text-white"
        style={{ backgroundColor: theme.bg, color: theme.fg }}
      >
        <div className={compact ? 'p-5' : 'p-6'}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 group-hover:!bg-[#0061FF] group-hover:!text-white"
                style={{
                  backgroundColor: theme.badgeBg,
                  color: theme.badgeFg,
                }}
              >
                {card.stage || `STAGE ${card.number}`}
              </span>
              <span
                className="font-mono-tech text-[10px] font-semibold tracking-[0.12em] opacity-80 group-hover:text-white/70"
              >
                CARD #{String(card.number).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={onFocus}
              title="专注模式查看"
              className="flex h-7 w-7 items-center justify-center bg-black/10 text-current transition-colors hover:bg-black/25 group-hover:bg-white/15 group-hover:text-white"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-4 font-mono-tech text-[10px] uppercase tracking-[0.12em] opacity-75">
            {card.promptCode}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold leading-snug tracking-tight">
            {card.title}
          </h3>
          {card.promptSubtitle && card.promptSubtitle !== card.title && (
            <p className="mt-1 text-xs font-medium opacity-85">
              {card.promptSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Crisp White Blueprint Body with Numbered Points */}
      <div className={`flex-1 bg-white ${compact ? 'p-5' : 'p-6'}`}>
        <ol className="space-y-3">
          {card.points.map((point, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-[13px] leading-relaxed"
            >
              <span className="mt-0.5 shrink-0 font-mono-tech text-[10px] font-bold text-[var(--brand-blue)]">
                0{idx + 1}
              </span>
              <span className="text-[var(--ink-secondary)]">{point}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Bottom Action Hairline Rail */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[var(--hairline)] bg-[var(--bg-subtle)] px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onFocus}
            className="font-mono-tech text-[11px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--brand-blue)]"
          >
            INSPECT →
          </button>

          {card.repoUrl && card.sourceFiles && card.sourceFiles.length > 0 && (
            <a
              href={`${card.repoUrl}/blob/main/${card.sourceFiles[0]}`}
              target="_blank"
              rel="noreferrer"
              title={`在 GitHub 查看对应源码：${card.sourceFiles.join(', ')}`}
              className="inline-flex items-center gap-1 font-mono-tech text-[10px] font-semibold text-[var(--brand-blue)] transition-colors hover:text-[var(--ink-base)]"
            >
              <FileCode2 className="h-3 w-3" />
              <span>{card.sourceFiles[0].split('/').pop()}</span>
              <ArrowUpRight className="h-2.5 w-2.5" />
            </a>
          )}
        </div>

        <button
          onClick={onCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-[var(--ink-base)] text-white hover:bg-[var(--brand-blue)]'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>复制 Prompt</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

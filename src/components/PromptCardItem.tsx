import { Copy, Check, Maximize2, FileCode2, ArrowUpRight, Download } from 'lucide-react';
import type { PromptCard } from '../lib/content';

interface PromptCardItemProps {
  card: PromptCard;
  copied: boolean;
  onCopy: () => void;
  onFocus: () => void;
  compact?: boolean;
  showOwnerBadge?: boolean;
  onOpenOwner?: () => void;
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
  showOwnerBadge = false,
  onOpenOwner,
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
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 group-hover:!bg-[#0061FF] group-hover:!text-white"
                style={{
                  backgroundColor: theme.badgeBg,
                  color: theme.badgeFg,
                }}
              >
                {card.stage || `STAGE ${card.number}`}
              </span>
              <span className="font-mono-tech text-[10px] font-semibold tracking-[0.12em] opacity-80 group-hover:text-white/70">
                CARD #{String(card.number).padStart(2, '0')}
              </span>
              {showOwnerBadge && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenOwner?.();
                  }}
                  className="bg-black/15 px-1.5 py-0.5 font-mono-tech text-[10px] font-semibold text-current transition-colors hover:bg-black/30 group-hover:bg-white/15"
                >
                  {card.ownerTitle}
                </button>
              )}
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

      {/* Optional Reference Image(s) Preview + 1-Click Direct Download */}
      {card.references && card.references.length > 0 && (
        <div className="border-b border-[var(--hairline)] bg-[var(--bg-subtle)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
              REFERENCE IMAGE{card.references.length > 1 ? `S (${card.references.length})` : ''} · 本轮参考图
            </span>
            <span className="font-mono-tech text-[10px] text-[var(--ink-muted)]">
              点击大图 / 直接下载
            </span>
          </div>
          <div
            className={`grid gap-2.5 ${
              card.references.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {card.references.map((ref) => (
              <div
                key={`${card.id}-${ref.url}`}
                className="overflow-hidden border border-[var(--hairline-strong)] bg-white"
              >
                <button
                  type="button"
                  onClick={onFocus}
                  className="group/img relative block aspect-[16/9] w-full overflow-hidden bg-[#f2efe9]"
                  title="点击放大查看参考图"
                >
                  <img
                    src={ref.url}
                    alt={ref.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-[1.04]"
                  />
                </button>
                <div className="flex items-center justify-between gap-2 border-t border-[var(--hairline)] px-2.5 py-1.5">
                  <span className="truncate font-mono-tech text-[10px] font-medium text-[var(--ink-secondary)]">
                    {ref.label}
                  </span>
                  <a
                    href={ref.url}
                    download={ref.label}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex shrink-0 items-center gap-1 bg-[var(--brand-blue)] px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-white transition-colors hover:bg-[var(--ink-base)]"
                    title={`下载 ${ref.label}`}
                  >
                    <Download className="h-2.5 w-2.5" />
                    <span>下载</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

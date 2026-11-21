import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../site.config';

export function Footer() {
  return (
    <footer className="border-t border-[var(--line-subtle)] bg-[var(--bg-surface)]/55">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-4 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono-tech text-xs font-semibold tracking-[0.14em] text-[var(--ink-primary)]">
              {siteConfig.brandEn}
            </span>
            <span className="text-xs text-[var(--ink-muted)]">·</span>
            <span className="text-xs text-[var(--ink-secondary)]">
              {siteConfig.brandZh}
            </span>
          </div>
          <p className="mt-1 font-mono-tech text-[10px] tracking-[0.08em] text-[var(--ink-muted)]">
            EDITORIAL ARCHIVE INSPIRED BY SIENA FILM FOUNDATION, FLOEMA &amp; DROPBOX BRAND
          </p>
        </div>

        <div className="flex items-center gap-5 font-mono-tech text-[11px] text-[var(--ink-muted)]">
          <span>MARKDOWN DRIVEN · STATIC ARCHIVE</span>
          <a
            href={siteConfig.githubRepo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[var(--ink-primary)] transition-colors hover:text-[var(--accent)]"
          >
            <span>GITHUB</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

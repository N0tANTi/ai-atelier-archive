import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../site.config';

export function Footer() {
  return (
    <footer className="bg-[var(--bg-dark-band)] text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 border-x border-white/10 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center bg-[var(--brand-blue)] font-display text-xs font-bold text-white">
              Ai
            </span>
            <span className="font-display text-sm font-bold tracking-tight text-white">
              {siteConfig.brandEn}
            </span>
            <span className="text-xs text-white/35">·</span>
            <span className="text-xs text-white/75">{siteConfig.brandZh}</span>
          </div>
          <p className="mt-2 font-mono-tech text-[10px] tracking-[0.1em] text-white/45">
            VISUAL SYSTEM INSPIRED BY DROPBOX BRAND GUIDELINES · MARKDOWN-DRIVEN KNOWLEDGE BASE
          </p>
        </div>

        <div className="flex items-center gap-5 font-mono-tech text-[11px] text-white/60">
          <span>STATIC ARCHIVE</span>
          <a
            href={siteConfig.githubRepo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-white transition-colors hover:text-[#3DD6F5]"
          >
            <span>GITHUB</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

import { ArrowLeft, Copy, Check } from 'lucide-react';
import type { StandaloneDoc } from '../lib/content';
import { useCopy } from '../lib/useCopy';

interface StandaloneDocViewProps {
  doc: StandaloneDoc;
  onBack: () => void;
}

export function StandaloneDocView({ doc, onBack }: StandaloneDocViewProps) {
  const { copiedId, copy } = useCopy();

  return (
    <div className="animate-dropbox-in">
      <section className="blueprint-grid-bg border-b border-[var(--blueprint-line)] bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--brand-blue)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>返回栏目列表</span>
            </button>

            <div className="flex items-center gap-3 font-mono-tech text-[11px] text-[var(--ink-muted)]">
              <span className="bg-[#FAD24B] px-2 py-0.5 font-bold text-[#1E1919]">
                {doc.category}
              </span>
              <span>{doc.date}</span>
              <span>·</span>
              <span>{doc.readingMinutes} min read</span>
            </div>
          </div>

          <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-[var(--ink-base)] sm:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-2.5 text-base text-[var(--ink-secondary)]">
            {doc.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-[var(--hairline-strong)] bg-white px-2.5 py-0.5 font-mono-tech text-[11px] text-[var(--ink-secondary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => copy(doc.bodyMarkdown, 'standalone-raw')}
              className="inline-flex items-center gap-1.5 border border-[var(--hairline-strong)] bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-base)] hover:bg-[var(--ink-base)] hover:text-white"
            >
              {copiedId === 'standalone-raw' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>已复制 Markdown</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>复制原文</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <article
              className="swiss-prose lg:col-span-8"
              dangerouslySetInnerHTML={{ __html: doc.htmlContent }}
            />
            {doc.toc.length > 0 && (
              <aside className="hidden lg:col-span-4 lg:block">
                <div className="sticky top-20 border border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-6">
                  <div className="border-b border-[var(--blueprint-line)] pb-3 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                    TABLE OF CONTENTS · 目录大纲
                  </div>
                  <nav className="mt-4 space-y-2">
                    {doc.toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-xs leading-relaxed text-[var(--ink-secondary)] hover:text-[var(--brand-blue)] ${
                          item.level === 3 ? 'pl-4' : 'font-semibold'
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

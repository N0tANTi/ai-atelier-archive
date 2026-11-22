import { ArrowRight, Sparkles } from 'lucide-react';
import { allDemos } from '../lib/content';
import { SourceCodePanel } from './SourceCodePanel';
import type { ProjectTab } from './ProjectView';

interface DemosHubViewProps {
  onOpenProject: (slug: string, tab?: ProjectTab) => void;
}

export function DemosHubView({ onOpenProject }: DemosHubViewProps) {
  return (
    <div className="animate-dropbox-in">
      <section className="bg-[#3DD6F5] text-[#1E1919]">
        <div className="mx-auto max-w-[1400px] border-x border-black/10 px-5 pb-12 pt-10 sm:px-8 sm:pb-14">
          <div className="flex items-center gap-2 font-mono-tech text-[11px] font-bold uppercase tracking-[0.16em] text-[#0B4C5F]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>LIVE INTERACTIVE GALLERY · 在线 3D 展厅</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-[#1E1919] sm:text-5xl">
            在线 3D 交互展厅
            <span className="ml-3 font-mono-tech text-2xl font-normal text-[#0B4C5F] sm:text-3xl">
              ({String(allDemos.length).padStart(2, '0')})
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#1E1919]/80">
            所有可交互 Three.js / WebGL2 作品均汇集于此，点击「站内直接运行 3D」即可按需加载体验，不点击不消耗带宽；亦可一键进入对应项目的完整档案页。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] space-y-12 border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          {allDemos.map((project) => (
            <div
              key={project.slug}
              className="border border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-5 sm:p-7"
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--blueprint-line)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[var(--brand-blue)] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-white">
                      PROJECT P{project.number}
                    </span>
                    <span className="font-mono-tech text-[11px] text-[var(--ink-muted)]">
                      {project.date}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-bold text-[var(--ink-base)] sm:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--ink-secondary)]">
                    {project.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => onOpenProject(project.slug, 'overview')}
                  className="inline-flex items-center gap-1.5 bg-[var(--ink-base)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
                >
                  <span>打开完整项目档案</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <SourceCodePanel project={project} mode="demo-only" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

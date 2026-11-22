import {
  ArrowRight,
  ArrowUpRight,
  FolderGit2,
  FolderKanban,
  Plus,
} from 'lucide-react';
import {
  projects,
  allPromptCards,
  allRepos,
  allNotes,
  type PromptCard,
} from '../lib/content';
import { useCopy } from '../lib/useCopy';
import { type GlobalHubRoute, type MosaicAction } from './PinwheelMosaic';
import { BlueprintIntroStage } from './BlueprintIntroStage';
import { ProjectCard } from './ProjectCard';
import { PromptCardItem } from './PromptCardItem';
import type { ProjectTab } from './ProjectView';

interface HomeViewProps {
  onNavigateHub: (route: GlobalHubRoute) => void;
  onOpenProject: (slug: string, tab?: ProjectTab) => void;
  onOpenDoc: (slug: string) => void;
  onOpenSearch: () => void;
  onFocusCard: (card: PromptCard, pool: PromptCard[]) => void;
  onIntroProgress?: (progress: number) => void;
}

export function HomeView({
  onNavigateHub,
  onOpenProject,
  onOpenDoc,
  onOpenSearch,
  onFocusCard,
  onIntroProgress,
}: HomeViewProps) {
  const { copiedId, copy } = useCopy();

  const handleMosaicAction = (action: MosaicAction) => {
    if (action.type === 'route') onNavigateHub(action.route);
    else if (action.type === 'search') onOpenSearch();
  };

  return (
    <div className="animate-dropbox-in">
      {/* 1. AUTHENTIC DROPBOX 3-ACT SCROLL-DRIVEN OPENING HERO -> 8-TILE GLOBAL PINWHEEL MOSAIC */}
      <BlueprintIntroStage
        onAction={handleMosaicAction}
        onProgressChange={onIntroProgress}
      />

      {/* 2. HIGH-CONTRAST DARK #1E1919 BAND — PRIMARY PROJECTS INDEX (Project-First Axis!) */}
      <section className="bg-[var(--bg-dark-band)] text-white">
        <div className="mx-auto max-w-[1400px] border-x border-white/10 px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/12 pb-6">
            <div>
              <div className="flex items-center gap-2 font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3DD6F5]">
                <FolderKanban className="h-3.5 w-3.5" />
                <span>PRIMARY INDEX · 核心项目作品集</span>
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                以项目为主轴的知识档案
              </h2>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/65 sm:text-sm">
                每个项目均采用统一入口：先看概览与实时 3D 体验，再按需深入该项目的 Prompt 卡片、技术拆解与源码文件索引。
              </p>
            </div>

            <button
              onClick={() => onNavigateHub('projects')}
              className="group inline-flex items-center gap-2 border-b-2 border-white pb-1 font-display text-sm font-semibold text-white transition-colors hover:border-[#3DD6F5] hover:text-[#3DD6F5]"
            >
              <span>查看全部项目 ({projects.length})</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                variant="dark"
                onOpenProject={onOpenProject}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. CROSS-PROJECT DUOTONE PROMPT CARDS GALLERY BAND */}
      {allPromptCards.length > 0 && (
        <section className="border-b border-[var(--blueprint-line)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-16 sm:px-8 sm:py-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  HORIZONTAL POOL · 跨项目精炼 Prompt 卡片
                </span>
                <h2 className="mt-2 font-display text-3xl font-bold text-[var(--ink-base)] sm:text-4xl">
                  Prompt 卡片库精选
                </h2>
              </div>

              <button
                onClick={() => onNavigateHub('prompts')}
                className="group inline-flex items-center gap-2 border-b-2 border-[var(--ink-base)] pb-1 font-display text-sm font-semibold text-[var(--ink-base)] transition-colors hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                <span>进入完整 Prompt 卡片库 ({allPromptCards.length})</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {allPromptCards.slice(0, 6).map((card) => (
                <PromptCardItem
                  key={card.id}
                  card={card}
                  copied={copiedId === card.id}
                  onCopy={() => copy(card.rawPrompt, card.id)}
                  onFocus={() => onFocusCard(card, allPromptCards)}
                  compact
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. GLOBAL RESOURCES QUICK INDEX (Tech Notes + Open-Source Repos) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left 6 cols: Latest Tech Notes & Breakdowns */}
            <div className="lg:col-span-6">
              <div className="flex items-end justify-between border-b-2 border-[var(--ink-base)] pb-4">
                <div>
                  <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[#FA551E]">
                    TECH NOTES · 技术拆解与笔记
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold text-[var(--ink-base)]">
                    最新技术笔记
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateHub('notes')}
                  className="font-mono-tech text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--brand-blue)]"
                >
                  全部 ({allNotes.length}) →
                </button>
              </div>

              <div className="divide-y divide-[var(--hairline)]">
                {allNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      if (note.source === 'project' && note.projectSlug) {
                        onOpenProject(note.projectSlug, 'tech');
                      } else if (note.docSlug) {
                        onOpenDoc(note.docSlug);
                      }
                    }}
                    className="group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-[var(--bg-subtle)] hover:px-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {note.projectTitle && (
                          <span className="bg-[#2B4464] px-2 py-0.5 font-mono-tech text-[9px] font-bold text-white">
                            P{note.projectNumber} · {note.projectTitle}
                          </span>
                        )}
                        <span className="font-mono-tech text-[10px] text-[var(--ink-muted)]">
                          {note.readingMinutes} min
                        </span>
                      </div>
                      <p className="mt-1.5 truncate font-display text-base font-bold text-[var(--ink-base)] group-hover:text-[var(--brand-blue)]">
                        {note.title}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--ink-muted)] group-hover:text-[var(--brand-blue)]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right 6 cols: Open-Source Repositories */}
            <div className="lg:col-span-6">
              <div className="flex items-end justify-between border-b-2 border-[var(--ink-base)] pb-4">
                <div>
                  <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[#61082B]">
                    GITHUB REPOS · 开源仓库合集
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold text-[var(--ink-base)]">
                    关联开源仓库
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateHub('repos')}
                  className="font-mono-tech text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--brand-blue)]"
                >
                  全部 ({allRepos.length}) →
                </button>
              </div>

              <div className="divide-y divide-[var(--hairline)]">
                {allRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-[var(--bg-subtle)] hover:px-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-[var(--brand-blue)]" />
                        <span className="truncate font-mono-tech text-xs font-bold text-[var(--ink-base)]">
                          {repo.repoSlug}
                        </span>
                        <span className="bg-[#FAD24B] px-1.5 py-0.5 font-mono-tech text-[9px] font-bold text-[#1E1919]">
                          {repo.license}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-[var(--ink-secondary)]">
                        {repo.title}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {repo.projectSlug && (
                        <button
                          onClick={() =>
                            onOpenProject(repo.projectSlug!, 'source')
                          }
                          className="border border-[var(--hairline-strong)] bg-white px-2.5 py-1 font-mono-tech text-[10px] font-semibold text-[var(--ink-base)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                        >
                          源码索引
                        </button>
                      )}
                      <a
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 bg-[var(--ink-base)] px-2.5 py-1 font-mono-tech text-[10px] font-semibold text-white hover:bg-[var(--brand-blue)]"
                      >
                        <span>GitHub</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Blueprint Quick-Add Slot */}
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border border-dashed border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--brand-blue)] font-mono-tech text-xs font-bold text-white">
                <Plus className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-[var(--ink-base)]">
                  以项目文件夹或独立 Markdown 持续扩展知识库
                </p>
                <p className="mt-0.5 text-xs text-[var(--ink-secondary)]">
                  新项目放入{' '}
                  <code className="font-mono-tech text-[var(--brand-blue)]">
                    content/projects/&lt;slug&gt;/
                  </code>
                  ，独立笔记/论文/工作流放入{' '}
                  <code className="font-mono-tech text-[var(--brand-blue)]">
                    content/notes|papers|workflows/
                  </code>
                  ，推送构建即自动收录到对应全局展厅。
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateHub('guide')}
              className="shrink-0 bg-[var(--ink-base)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
            >
              查看归档规范 →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  Check,
  LayoutGrid,
  GalleryHorizontalEnd,
  Layers,
  BookOpen,
  FolderGit2,
  Compass,
  CheckCircle2,
  Circle,
  Play,
  Sliders,
} from 'lucide-react';
import type { ProjectRecord, PromptCard } from '../lib/content';
import { useCopy } from '../lib/useCopy';
import { PromptCardItem } from './PromptCardItem';
import { InteractiveSpecimenWidgets } from './InteractiveSpecimenWidgets';
import { SourceCodePanel } from './SourceCodePanel';

export type ProjectTab = 'overview' | 'prompts' | 'tech' | 'source';

interface ProjectViewProps {
  project: ProjectRecord;
  initialTab?: ProjectTab;
  onBack: () => void;
  onFocusCard: (card: PromptCard, pool: PromptCard[]) => void;
}

function renderInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={i}
          className="mx-0.5 bg-white/12 px-1.5 py-0.5 font-mono-tech text-[12px] text-[#3DD6F5]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ProjectView({
  project,
  initialTab = 'overview',
  onBack,
  onFocusCard,
}: ProjectViewProps) {
  const hasPrompts =
    project.promptCards.length > 0 || Boolean(project.masterPrompt);
  const hasTech = Boolean(project.analysisHtml) || Boolean(project.specimens);
  const hasSource = Boolean(project.repo) || project.sourceMap.length > 0;

  const [activeTab, setActiveTab] = useState<ProjectTab>(initialTab);
  const [deckLayout, setDeckLayout] = useState<'grid' | 'filmstrip'>('grid');
  const { copiedId, copy } = useCopy();

  const storageKey = `atelier-stage-progress:${project.slug}`;
  const [completedStages, setCompletedStages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.slug, initialTab]);

  const toggleStage = (stageIndex: number) => {
    setCompletedStages((prev) => {
      const next = prev.includes(stageIndex)
        ? prev.filter((i) => i !== stageIndex)
        : [...prev, stageIndex].sort((a, b) => a - b);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const allCardsCombined = project.promptCards
    .map((c) => `### 卡片 #${c.number}｜${c.title}（${c.stage}）\n${c.rawPrompt}`)
    .join('\n\n');

  const totalSourceFiles = project.sourceMap.reduce(
    (sum, s) => sum + s.files.length,
    0
  );

  return (
    <div className="animate-dropbox-in">
      {/* 1. UNIFIED PROJECT HEADER (100% Consistent Across Every Project!) */}
      <section className="blueprint-grid-bg border-b border-[var(--blueprint-line)] bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[var(--ink-secondary)] transition-colors hover:text-[var(--brand-blue)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>返回全部项目 / PROJECTS</span>
            </button>

            <div className="flex items-center gap-3 font-mono-tech text-[11px] text-[var(--ink-muted)]">
              <span className="bg-[var(--brand-blue)] px-2 py-0.5 font-bold text-white">
                PROJECT P{project.number}
              </span>
              <span>{project.date}</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">{project.folderPath}</span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[var(--hairline-strong)] bg-white px-2.5 py-0.5 font-mono-tech text-[11px] text-[var(--ink-secondary)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-[-0.03em] text-[var(--ink-base)] sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-2.5 text-base text-[var(--ink-secondary)]">
                {project.subtitle}
              </p>
            </div>

            {/* Unified Primary Actions: Live 3D / Film / Desktop Release + GitHub Repo */}
            <div className="flex flex-wrap gap-2.5 lg:col-span-4 lg:justify-end">
              {(project.demo || project.video || project.downloads[0]) && (
                <a
                  href={project.demo || project.video || project.downloads[0]?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--ink-base)]"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>
                    {project.demo
                      ? '全屏体验 3D'
                      : project.video
                        ? '观看 1080p 成片'
                        : '下载 Windows 试玩版'}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}

              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[var(--ink-base)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:bg-[var(--ink-base)] hover:text-white"
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  <span>GitHub 源码</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* 2. UNIFIED 4-TAB ARCHITECTURE (Same Structure & Order for Every Project!) */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--blueprint-line)] pt-5">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[var(--ink-base)] text-white'
                    : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-secondary)] hover:border-[var(--ink-base)] hover:text-[var(--ink-base)]'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>
                  {project.demo
                    ? '01 / 项目概览与 3D 体验'
                    : project.video
                      ? '01 / 项目概览与成片预览'
                      : '01 / 项目概览与试玩下载'}
                </span>
              </button>

              {hasPrompts && (
                <button
                  onClick={() => setActiveTab('prompts')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'prompts'
                      ? 'bg-[#FAD24B] text-[#1E1919]'
                      : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-secondary)] hover:border-[var(--ink-base)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>02 / Prompt 卡片与模板 ({project.promptCards.length})</span>
                </button>
              )}

              {hasTech && (
                <button
                  onClick={() => setActiveTab('tech')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'tech'
                      ? 'bg-[#FA551E] text-white'
                      : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-secondary)] hover:border-[var(--ink-base)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  {project.analysisHtml ? (
                    <BookOpen className="h-3.5 w-3.5" />
                  ) : (
                    <Sliders className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {hasPrompts ? '03' : '02'} / 技术拆解与实验
                  </span>
                </button>
              )}

              {hasSource && (
                <button
                  onClick={() => setActiveTab('source')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'source'
                      ? 'bg-[#2B4464] text-white'
                      : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-secondary)] hover:border-[var(--ink-base)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  <span>
                    0{1 + (hasPrompts ? 1 : 0) + (hasTech ? 1 : 0) + 1} / 源码文件索引 ({totalSourceFiles})
                  </span>
                </button>
              )}
            </div>

            {activeTab === 'prompts' && project.promptCards.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copy(allCardsCombined, 'copy-all-cards')}
                  className="inline-flex items-center gap-1.5 border border-[var(--hairline-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink-base)] hover:bg-[var(--ink-base)] hover:text-white"
                >
                  {copiedId === 'copy-all-cards' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>已复制全部卡片</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>复制全部</span>
                    </>
                  )}
                </button>

                <div className="flex border border-[var(--hairline-strong)] bg-white">
                  <button
                    onClick={() => setDeckLayout('grid')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold ${
                      deckLayout === 'grid'
                        ? 'bg-[var(--ink-base)] text-white'
                        : 'text-[var(--ink-secondary)]'
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeckLayout('filmstrip')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold ${
                      deckLayout === 'filmstrip'
                        ? 'bg-[var(--ink-base)] text-white'
                        : 'text-[var(--ink-secondary)]'
                    }`}
                  >
                    <GalleryHorizontalEnd className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. TAB CONTENT BODY */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          {/* TAB 1: UNIFIED PROJECT OVERVIEW + LIVE 3D + INCLUDED MODULES MATRIX */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left 7 cols: Live 3D Interactive Launcher */}
                <div className="lg:col-span-7">
                  <SourceCodePanel project={project} mode="demo-only" />
                </div>

                {/* Right 5 cols: Overview Prose + Color Palette */}
                <div className="flex flex-col justify-between border border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-6 sm:p-7 lg:col-span-5">
                  <div>
                    <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                      PROJECT BRIEF · 项目定位
                    </span>
                    <div
                      className="swiss-prose mt-4 text-sm"
                      dangerouslySetInnerHTML={{ __html: project.overviewHtml }}
                    />
                  </div>

                  <div className="mt-6 border-t border-[var(--blueprint-line)] pt-5">
                    {project.downloads.length > 0 && (
                      <div className="mb-5 border-b border-[var(--blueprint-line)] pb-5">
                        <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-blue)]">
                          RELEASE ASSETS · 工程与素材包下载
                        </span>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {project.downloads.map((dl) => (
                            <a
                              key={dl.label}
                              href={dl.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 border border-[var(--hairline-strong)] bg-white px-2.5 py-1.5 font-mono-tech text-[11px] font-semibold text-[var(--ink-base)] transition-colors hover:border-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white"
                            >
                              <span>{dl.label}</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                        COLOR PALETTE · 项目色板
                      </span>
                      <span className="font-mono-tech text-[10px] text-[var(--ink-muted)]">
                        {project.license || 'MIT'}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {project.palette.map((hex) => (
                        <button
                          key={hex}
                          onClick={() => copy(hex, `pal-${hex}`)}
                          title={`点击复制 ${hex}`}
                          className="group flex-1 text-left"
                        >
                          <div
                            className="h-10 w-full border border-black/10 transition-transform group-hover:scale-[1.03]"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="mt-1 block font-mono-tech text-[10px] text-[var(--ink-secondary)]">
                            {copiedId === `pal-${hex}` ? '已复制' : hex}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* UNIFIED "PROJECT ASSETS" NAVIGATION CARDS (Same 3 Slots for Every Project!) */}
              <div>
                <div className="mb-5 flex items-baseline justify-between border-b border-[var(--blueprint-line)] pb-3">
                  <div>
                    <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                      PROJECT MODULES · 本项目收录内容
                    </span>
                    <h2 className="mt-1 font-display text-2xl font-bold text-[var(--ink-base)]">
                      深入本项目档案
                    </h2>
                  </div>
                  <span className="font-mono-tech text-[11px] text-[var(--ink-muted)]">
                    {project.folderPath}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Slot 1: Prompt Cards */}
                  <button
                    disabled={!hasPrompts}
                    onClick={() => hasPrompts && setActiveTab('prompts')}
                    className={`flex flex-col justify-between border p-6 text-left transition-all ${
                      hasPrompts
                        ? 'border-[var(--ink-base)] bg-[#FAD24B] text-[#1E1919] hover:bg-[#1E1919] hover:text-white'
                        : 'cursor-default border-dashed border-[var(--hairline-strong)] bg-[var(--bg-subtle)] text-[var(--ink-muted)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono-tech text-[10px] font-bold uppercase tracking-wider">
                        <span>PROMPT DECK</span>
                        <span>{hasPrompts ? `${project.promptCards.length} CARDS →` : '待补充'}</span>
                      </div>
                      <h3 className="mt-3 font-display text-xl font-bold">
                        Prompt 卡片与工程模板
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed opacity-80">
                        {hasPrompts
                          ? `包含 ${project.promptCards.length} 张可一键复制的分阶段 Prompt 卡片与完整工程级模板。`
                          : `在 ${project.folderPath} 中新增 prompts.md 即可自动点亮此模块。`}
                      </p>
                    </div>
                  </button>

                  {/* Slot 2: Tech Breakdown & Lab */}
                  <button
                    disabled={!hasTech}
                    onClick={() => hasTech && setActiveTab('tech')}
                    className={`flex flex-col justify-between border p-6 text-left transition-all ${
                      hasTech
                        ? 'border-[var(--ink-base)] bg-[#FA551E] text-white hover:bg-[#1E1919]'
                        : 'cursor-default border-dashed border-[var(--hairline-strong)] bg-[var(--bg-subtle)] text-[var(--ink-muted)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono-tech text-[10px] font-bold uppercase tracking-wider">
                        <span>TECH &amp; LAB</span>
                        <span>
                          {hasTech
                            ? project.analysisHtml
                              ? `${project.analysisReadingMinutes} MIN READ →`
                              : 'INTERACTIVE →'
                            : '待补充'}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-xl font-bold">
                        技术拆解与交互实验
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed opacity-85">
                        {project.analysisHtml
                          ? `深度拆解本项目着色器与核心架构（${project.analysisTitle}）。`
                          : project.specimens
                            ? '内置可交互 4 时段线性光色板切换器与 Alpha 通道分层图谱。'
                            : `在 ${project.folderPath} 中新增 analysis.md 即可自动点亮此模块。`}
                      </p>
                    </div>
                  </button>

                  {/* Slot 3: Source Code Index */}
                  <button
                    disabled={!hasSource}
                    onClick={() => hasSource && setActiveTab('source')}
                    className={`flex flex-col justify-between border p-6 text-left transition-all ${
                      hasSource
                        ? 'border-[var(--ink-base)] bg-[#2B4464] text-white hover:bg-[#1E1919]'
                        : 'cursor-default border-dashed border-[var(--hairline-strong)] bg-[var(--bg-subtle)] text-[var(--ink-muted)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono-tech text-[10px] font-bold uppercase tracking-wider">
                        <span>SOURCE CODE</span>
                        <span>{hasSource ? `${totalSourceFiles} FILES →` : '待补充'}</span>
                      </div>
                      <h3 className="mt-3 font-display text-xl font-bold">
                        源码仓库与模块文件索引
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed opacity-85">
                        {hasSource
                          ? `关联 GitHub 开源仓库，按 ${project.sourceMap.length} 大模块精准映射 ${totalSourceFiles} 个核心源码文件。`
                          : '配置 repo 与 sourceMap 字段即可关联 GitHub 源码。'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROMPT CARDS & MASTER ENGINEERING TEMPLATE */}
          {activeTab === 'prompts' && hasPrompts && (
            <div className="space-y-14">
              {/* Optional Prompt Kit / Reference Pack Download Banner */}
              {project.downloads.length > 0 && (
                <div className="flex flex-col items-start justify-between gap-4 border border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-5 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                      REFERENCE KIT · 配套参考图与离线素材包
                    </span>
                    <p className="mt-1 text-xs text-[var(--ink-secondary)]">
                      每张卡片内均可直接预览并单张下载对应参考图；也可一键打包下载全套素材包与离线图文版。
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.downloads.map((dl) => (
                      <a
                        key={dl.label}
                        href={dl.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 bg-[var(--ink-base)] px-3 py-1.5 font-mono-tech text-[11px] font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
                      >
                        <span>{dl.label}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {project.promptCards.length > 0 &&
                (deckLayout === 'grid' ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {project.promptCards.map((card) => (
                      <PromptCardItem
                        key={card.id}
                        card={card}
                        copied={copiedId === card.id}
                        onCopy={() => copy(card.rawPrompt, card.id)}
                        onFocus={() => onFocusCard(card, project.promptCards)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-6 pt-1">
                    {project.promptCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex w-[88vw] shrink-0 snap-start sm:w-[420px]"
                      >
                        <div className="w-full">
                          <PromptCardItem
                            card={card}
                            copied={copiedId === card.id}
                            onCopy={() => copy(card.rawPrompt, card.id)}
                            onFocus={() => onFocusCard(card, project.promptCards)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

              {/* Master Engineering Prompt Blueprint */}
              {project.masterPrompt && (
                <div className="grid grid-cols-1 gap-8 border-t border-[var(--blueprint-line)] pt-12 lg:grid-cols-12">
                  <div className="lg:col-span-8">
                    <div className="bg-[var(--bg-dark-band)] text-white">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 px-6 py-4 sm:px-8">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2.5 w-2.5 bg-[var(--brand-blue)]" />
                          <span className="font-mono-tech text-xs font-semibold uppercase tracking-[0.14em] text-[#3DD6F5]">
                            MASTER ENGINEERING PROMPT · 完整工程级模板
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            copy(project.masterPrompt!.content, 'master-copy')
                          }
                          className="inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#1E1919]"
                        >
                          {copiedId === 'master-copy' ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>完整模板已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>一键复制完整模板</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-8 p-6 sm:p-8">
                        {project.masterPrompt.intro && (
                          <p className="border-l-4 border-[#FAD24B] pl-4 font-display text-lg font-medium leading-relaxed text-white">
                            {project.masterPrompt.intro}
                          </p>
                        )}

                        {project.masterPrompt.rules.length > 0 && (
                          <div>
                            <h3 className="font-mono-tech text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FA551E]">
                              GLOBAL ART DIRECTION · 全局美术铁律
                            </h3>
                            <ul className="mt-3 space-y-2.5">
                              {project.masterPrompt.rules.map((rule, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-3 bg-white/[0.05] px-4 py-3 text-sm leading-relaxed text-white/90"
                                >
                                  <span className="mt-0.5 font-mono-tech text-xs font-bold text-[#FAD24B]">
                                    0{i + 1}
                                  </span>
                                  <span>{renderInlineCode(rule)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {project.masterPrompt.stages.length > 0 && (
                          <div>
                            <h3 className="font-mono-tech text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B4DC19]">
                              MODULAR PIPELINE · 分阶段实现要求
                            </h3>
                            <div className="mt-4 space-y-3">
                              {project.masterPrompt.stages.map((stage) => {
                                const done = completedStages.includes(stage.index);
                                return (
                                  <div
                                    key={stage.index}
                                    className={`border p-5 transition-colors ${
                                      done
                                        ? 'border-[#B4DC19]/60 bg-[#B4DC19]/10'
                                        : 'border-white/12 bg-white/[0.03]'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-center gap-2.5">
                                        <span className="bg-[var(--brand-blue)] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-white">
                                          STAGE 0{stage.index}
                                        </span>
                                        <h4 className="font-display text-base font-bold text-white">
                                          {stage.title}
                                        </h4>
                                      </div>
                                      <button
                                        onClick={() => toggleStage(stage.index)}
                                        className="inline-flex shrink-0 items-center gap-1.5 border border-white/20 px-2.5 py-1 font-mono-tech text-[10px] text-white/75 transition-colors hover:border-white hover:text-white"
                                      >
                                        {done ? (
                                          <>
                                            <CheckCircle2 className="h-3.5 w-3.5 text-[#B4DC19]" />
                                            <span className="text-[#B4DC19]">已完成</span>
                                          </>
                                        ) : (
                                          <>
                                            <Circle className="h-3.5 w-3.5" />
                                            <span>标记完成</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <ul className="mt-3 space-y-2 pl-1">
                                      {stage.details.map((detail, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-white/80"
                                        >
                                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#3DD6F5]" />
                                          <span>{renderInlineCode(detail)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {project.masterPrompt.outro && (
                          <div className="border border-white/15 bg-white/[0.05] px-4 py-3 font-mono-tech text-xs leading-relaxed text-white/90">
                            {project.masterPrompt.outro}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sticky Checklist Rail */}
                  <aside className="lg:col-span-4">
                    <div className="sticky top-20 border border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-6">
                      <div className="flex items-center justify-between border-b border-[var(--blueprint-line)] pb-3">
                        <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                          IMPLEMENTATION TRACKER
                        </span>
                        <span className="font-mono-tech text-xs font-bold text-[var(--ink-base)]">
                          {completedStages.length} / {project.masterPrompt.stages.length}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-[var(--ink-secondary)]">
                        复现工程 Prompt 时勾选已验证的阶段，进度本地自动保存。
                      </p>
                      <div className="mt-4 h-2 w-full bg-white">
                        <div
                          className="h-full bg-[var(--brand-blue)] transition-all duration-300"
                          style={{
                            width: `${
                              project.masterPrompt.stages.length > 0
                                ? (completedStages.length /
                                    project.masterPrompt.stages.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <div className="mt-4 space-y-1.5">
                        {project.masterPrompt.stages.map((s) => {
                          const done = completedStages.includes(s.index);
                          return (
                            <button
                              key={s.index}
                              onClick={() => toggleStage(s.index)}
                              className="flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-xs transition-colors hover:bg-white"
                            >
                              {done ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--brand-blue)]" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
                              )}
                              <span
                                className={
                                  done
                                    ? 'line-through text-[var(--ink-muted)]'
                                    : 'font-medium text-[var(--ink-base)]'
                                }
                              >
                                Stage {s.index} · {s.title.replace(/（Stage \d+）/, '')}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </aside>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TECH BREAKDOWN ARTICLE & INTERACTIVE SPECIMENS */}
          {activeTab === 'tech' && hasTech && (
            <div className="space-y-12">
              {project.analysisHtml && (
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                  <article
                    className="swiss-prose lg:col-span-8"
                    dangerouslySetInnerHTML={{ __html: project.analysisHtml }}
                  />
                  {project.analysisToc.length > 0 && (
                    <aside className="hidden lg:col-span-4 lg:block">
                      <div className="sticky top-20 border border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-6">
                        <div className="border-b border-[var(--blueprint-line)] pb-3 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                          TABLE OF CONTENTS · 目录大纲
                        </div>
                        <nav className="mt-4 space-y-2">
                          {project.analysisToc.map((item) => (
                            <a
                              key={item.id}
                              href={`#${item.id}`}
                              className={`block text-xs leading-relaxed text-[var(--ink-secondary)] transition-colors hover:text-[var(--brand-blue)] ${
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
              )}

              {project.specimens === 'painted-valley' && (
                <InteractiveSpecimenWidgets />
              )}
            </div>
          )}

          {/* TAB 4: SOURCE CODE REPO & MODULE FILE INDEX */}
          {activeTab === 'source' && hasSource && (
            <SourceCodePanel project={project} mode="source-only" />
          )}
        </div>
      </section>
    </div>
  );
}

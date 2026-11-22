import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  LayoutGrid,
  GalleryHorizontalEnd,
  FileCode2,
  Layers,
  Terminal,
  CheckCircle2,
  Circle,
  BookOpen,
  Sliders,
  FolderGit2,
  ArrowUpRight,
} from 'lucide-react';
import type { ArchiveDoc, PromptCard } from '../lib/content';
import { useCopy } from '../lib/useCopy';
import { PromptCardItem } from './PromptCardItem';
import { InteractiveSpecimenWidgets } from './InteractiveSpecimenWidgets';
import { SourceCodePanel } from './SourceCodePanel';

interface DocumentViewProps {
  doc: ArchiveDoc;
  initialTab?: 'cards' | 'master' | 'source';
  onBack: () => void;
  onFocusCard: (card: PromptCard, pool: PromptCard[]) => void;
}

type DocTab = 'cards' | 'master' | 'specimen' | 'source' | 'article' | 'raw';

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

export function DocumentView({
  doc,
  initialTab,
  onBack,
  onFocusCard,
}: DocumentViewProps) {
  const isPromptDeck = doc.promptCards.length > 0;
  const hasInteractiveSpecimens = doc.rawMarkdown.includes('Kuwahara') && doc.rawMarkdown.includes('Alpha');

  const [activeTab, setActiveTab] = useState<DocTab>(
    initialTab ?? (isPromptDeck ? 'cards' : 'article')
  );
  const [deckLayout, setDeckLayout] = useState<'grid' | 'filmstrip'>('grid');
  const { copiedId, copy } = useCopy();

  const storageKey = `atelier-stage-progress:${doc.slug}`;
  const [completedStages, setCompletedStages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setActiveTab(initialTab ?? (doc.promptCards.length > 0 ? 'cards' : 'article'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [doc.slug, initialTab, doc.promptCards.length]);

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

  const allCardsCombined = doc.promptCards
    .map((c) => `### 卡片 #${c.number}｜${c.title}（${c.stage}）\n${c.rawPrompt}`)
    .join('\n\n');

  return (
    <div className="animate-dropbox-in">
      {/* Bold Dropbox-Style Saturated Hero Header Band */}
      <section className="blueprint-grid-bg border-b border-[var(--blueprint-line)] bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[var(--ink-secondary)] transition-colors hover:text-[var(--brand-blue)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>返回知识矩阵 / INDEX</span>
            </button>

            <div className="flex items-center gap-3 font-mono-tech text-[11px] text-[var(--ink-muted)]">
              <span className="bg-[var(--brand-blue)] px-2 py-0.5 font-bold text-white">
                NO.{doc.number}
              </span>
              <span>{doc.date}</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">{doc.filePath}</span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#FAD24B] px-2.5 py-1 font-mono-tech text-[11px] font-bold text-[#1E1919]">
                  {doc.category}
                </span>
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[var(--hairline-strong)] bg-white px-2.5 py-0.5 font-mono-tech text-[11px] text-[var(--ink-secondary)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-[var(--ink-base)] sm:text-5xl">
                {doc.title}
              </h1>
              <p className="mt-2.5 text-base text-[var(--ink-secondary)]">
                {doc.subtitle}
              </p>
            </div>

            {/* Bulk Copy & Repo Actions */}
            <div className="flex flex-wrap gap-2.5 lg:col-span-4 lg:justify-end">
              {doc.repo && (
                <a
                  href={doc.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[var(--blueprint-line-strong)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--brand-blue)] transition-colors hover:bg-[var(--brand-blue)] hover:text-white"
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  <span>GitHub 源码</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}

              {isPromptDeck && (
                <button
                  onClick={() => copy(allCardsCombined, 'copy-all-cards')}
                  className="inline-flex items-center gap-1.5 border border-[var(--ink-base)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:bg-[var(--ink-base)] hover:text-white"
                >
                  {copiedId === 'copy-all-cards' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>已复制全部 {doc.promptCards.length} 张卡片</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>复制全部卡片</span>
                    </>
                  )}
                </button>
              )}

              {doc.masterPrompt && (
                <button
                  onClick={() => copy(doc.masterPrompt!.content, 'header-master')}
                  className="inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--ink-base)]"
                >
                  {copiedId === 'header-master' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>完整模板已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>一键复制完整工程模板</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Crisp Section Switcher Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--blueprint-line)] pt-5">
            <div className="flex flex-wrap items-center gap-1.5">
              {isPromptDeck && (
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'cards'
                      ? 'bg-[var(--ink-base)] text-white'
                      : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-secondary)] hover:border-[var(--ink-base)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>01 / 精炼卡片集 ({doc.promptCards.length})</span>
                </button>
              )}

              {doc.masterPrompt && (
                <button
                  onClick={() => setActiveTab('master')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'master'
                      ? 'bg-[var(--ink-base)] text-white'
                      : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-secondary)] hover:border-[var(--ink-base)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>02 / 完整工程蓝图</span>
                </button>
              )}

              {hasInteractiveSpecimens && (
                <button
                  onClick={() => setActiveTab('specimen')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'specimen'
                      ? 'bg-[var(--brand-blue)] text-white'
                      : 'border border-[var(--blueprint-line-strong)] bg-white text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white'
                  }`}
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>03 / 交互色板 &amp; Alpha</span>
                </button>
              )}

              {!isPromptDeck && (
                <button
                  onClick={() => setActiveTab('article')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'article'
                      ? 'bg-[var(--ink-base)] text-white'
                      : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-secondary)] hover:border-[var(--ink-base)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>01 / 技术拆解正文</span>
                </button>
              )}

              {(doc.repo || doc.demo) && (
                <button
                  onClick={() => setActiveTab('source')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'source'
                      ? 'bg-[#FA551E] text-white'
                      : 'border border-[#FA551E]/40 bg-white text-[#FA551E] hover:bg-[#FA551E] hover:text-white'
                  }`}
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  <span>
                    {isPromptDeck ? '04 / ' : '02 / '}
                    {doc.demo ? '源码仓库 & 实时 3D' : '源码仓库 & 模块索引'}
                  </span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('raw')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                  activeTab === 'raw'
                    ? 'bg-[var(--ink-base)] text-white'
                    : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-secondary)] hover:border-[var(--ink-base)] hover:text-[var(--ink-base)]'
                }`}
              >
                <FileCode2 className="h-3.5 w-3.5" />
                <span>原始 Markdown</span>
              </button>
            </div>

            {activeTab === 'cards' && (
              <div className="flex border border-[var(--hairline-strong)] bg-white">
                <button
                  onClick={() => setDeckLayout('grid')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
                    deckLayout === 'grid'
                      ? 'bg-[var(--ink-base)] text-white'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>网格陈列</span>
                </button>
                <button
                  onClick={() => setDeckLayout('filmstrip')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
                    deckLayout === 'filmstrip'
                      ? 'bg-[var(--ink-base)] text-white'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  <GalleryHorizontalEnd className="h-3.5 w-3.5" />
                  <span>横向卷轴</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Body Framed by Blueprint Rails */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          {/* TAB 1: PROMPT CARDS */}
          {activeTab === 'cards' && isPromptDeck && (
            <div className="space-y-12">
              {deckLayout === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {doc.promptCards.map((card) => (
                    <PromptCardItem
                      key={card.id}
                      card={card}
                      copied={copiedId === card.id}
                      onCopy={() => copy(card.rawPrompt, card.id)}
                      onFocus={() => onFocusCard(card, doc.promptCards)}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between font-mono-tech text-[11px] text-[var(--ink-muted)]">
                    <span>HORIZONTAL DECK · STAGE 01 → 0{doc.promptCards.length}</span>
                    <span>点击卡片右上角进入全屏专注模式</span>
                  </div>
                  <div className="flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-6 pt-1">
                    {doc.promptCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex w-[88vw] shrink-0 snap-start sm:w-[420px]"
                      >
                        <div className="w-full">
                          <PromptCardItem
                            card={card}
                            copied={copiedId === card.id}
                            onCopy={() => copy(card.rawPrompt, card.id)}
                            onFocus={() => onFocusCard(card, doc.promptCards)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Embedded Interactive Widgets directly below cards for immediate playfulness */}
              {hasInteractiveSpecimens && (
                <div className="border-t border-[var(--blueprint-line)] pt-12">
                  <InteractiveSpecimenWidgets />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MASTER ENGINEERING BLUEPRINT */}
          {activeTab === 'master' && doc.masterPrompt && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                <div className="bg-[var(--bg-dark-band)] text-white">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 px-6 py-4 sm:px-8">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 bg-[var(--brand-blue)]" />
                      <span className="font-mono-tech text-xs font-semibold uppercase tracking-[0.14em] text-[#3DD6F5]">
                        MASTER ENGINEERING BLUEPRINT
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        copy(doc.masterPrompt!.content, 'specimen-copy')
                      }
                      className="inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#1E1919]"
                    >
                      {copiedId === 'specimen-copy' ? (
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
                    {doc.masterPrompt.intro && (
                      <p className="border-l-4 border-[#FAD24B] pl-4 font-display text-lg font-medium leading-relaxed text-white">
                        {doc.masterPrompt.intro}
                      </p>
                    )}

                    {doc.masterPrompt.rules.length > 0 && (
                      <div>
                        <h3 className="font-mono-tech text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FA551E]">
                          GLOBAL ART DIRECTION · 全局美术铁律
                        </h3>
                        <ul className="mt-3 space-y-2.5">
                          {doc.masterPrompt.rules.map((rule, i) => (
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

                    {doc.masterPrompt.stages.length > 0 && (
                      <div>
                        <h3 className="font-mono-tech text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B4DC19]">
                          MODULAR PIPELINE · STAGE 1 → 6 分阶段实现要求
                        </h3>
                        <div className="mt-4 space-y-3">
                          {doc.masterPrompt.stages.map((stage) => {
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

                    {doc.masterPrompt.outro && (
                      <div className="border border-white/15 bg-white/[0.05] px-4 py-3 font-mono-tech text-xs leading-relaxed text-white/90">
                        {doc.masterPrompt.outro}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sticky Progress Rail */}
              <aside className="lg:col-span-4">
                <div className="sticky top-20 border border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-6">
                  <div className="flex items-center justify-between border-b border-[var(--blueprint-line)] pb-3">
                    <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                      IMPLEMENTATION TRACKER
                    </span>
                    <span className="font-mono-tech text-xs font-bold text-[var(--ink-base)]">
                      {completedStages.length} / {doc.masterPrompt.stages.length}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--ink-secondary)]">
                    分阶段用 AI 生成并验证代码时，勾选已完成阶段，进度将保存在本地浏览器。
                  </p>
                  <div className="mt-4 h-2 w-full bg-white">
                    <div
                      className="h-full bg-[var(--brand-blue)] transition-all duration-300"
                      style={{
                        width: `${
                          doc.masterPrompt.stages.length > 0
                            ? (completedStages.length /
                                doc.masterPrompt.stages.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="mt-4 space-y-1.5">
                    {doc.masterPrompt.stages.map((s) => {
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

          {/* TAB 3: DEDICATED INTERACTIVE SPECIMEN LAB */}
          {activeTab === 'specimen' && hasInteractiveSpecimens && (
            <InteractiveSpecimenWidgets />
          )}

          {/* TAB 4: LINKED GITHUB SOURCE REPO & LIVE 3D DEMO */}
          {activeTab === 'source' && (doc.repo || doc.demo) && (
            <SourceCodePanel doc={doc} />
          )}

          {/* TAB 4: REGULAR MARKDOWN READER */}
          {activeTab === 'article' && (
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

          {/* TAB 5: RAW MARKDOWN */}
          {activeTab === 'raw' && (
            <div className="bg-[var(--bg-dark-band)] text-white">
              <div className="flex items-center justify-between border-b border-white/12 px-6 py-3.5">
                <span className="font-mono-tech text-xs text-white/60">
                  {doc.filePath} · {doc.charCount} chars
                </span>
                <button
                  onClick={() => copy(doc.bodyMarkdown, 'raw-md-copy')}
                  className="inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white hover:text-[#1E1919]"
                >
                  {copiedId === 'raw-md-copy' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>已复制原文</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>复制 Markdown</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-6 font-mono-tech text-xs leading-7 text-white/90 sm:p-8">
                {doc.bodyMarkdown}
              </pre>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

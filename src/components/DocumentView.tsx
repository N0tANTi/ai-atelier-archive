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
} from 'lucide-react';
import type { ArchiveDoc, PromptCard } from '../lib/content';
import { useCopy } from '../lib/useCopy';
import { PromptCardItem } from './PromptCardItem';

interface DocumentViewProps {
  doc: ArchiveDoc;
  onBack: () => void;
  onFocusCard: (card: PromptCard, pool: PromptCard[]) => void;
}

type DocTab = 'cards' | 'master' | 'article' | 'raw';

function renderInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={i}
          className="mx-0.5 rounded bg-white/10 px-1.5 py-0.5 font-mono-tech text-[12px] text-[#f4b197]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function DocumentView({ doc, onBack, onFocusCard }: DocumentViewProps) {
  const isPromptDeck = doc.promptCards.length > 0;
  const [activeTab, setActiveTab] = useState<DocTab>(
    isPromptDeck ? 'cards' : 'article'
  );
  const [deckLayout, setDeckLayout] = useState<'grid' | 'filmstrip'>('grid');
  const { copiedId, copy } = useCopy();

  // Interactive Stage Checklist persisted per document in localStorage
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
    setActiveTab(doc.promptCards.length > 0 ? 'cards' : 'article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [doc.slug, doc.promptCards.length]);

  const toggleStage = (stageIndex: number) => {
    setCompletedStages((prev) => {
      const next = prev.includes(stageIndex)
        ? prev.filter((i) => i !== stageIndex)
        : [...prev, stageIndex].sort((a, b) => a - b);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const allCardsCombined = doc.promptCards
    .map((c) => `### 卡片 #${c.number}｜${c.title}（${c.stage}）\n${c.rawPrompt}`)
    .join('\n\n');

  return (
    <div className="animate-atelier-in">
      {/* Editorial Document Cover Header */}
      <section className="bg-atelier-grid border-b border-[var(--line-subtle)]">
        <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
          {/* Top Breadcrumb Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 font-mono-tech text-xs text-[var(--ink-secondary)] transition-colors hover:text-[var(--accent)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>返回档案目录 / INDEX</span>
            </button>

            <div className="flex items-center gap-3 font-mono-tech text-[11px] text-[var(--ink-muted)]">
              <span>ARCHIVE NO. {doc.number}</span>
              <span>·</span>
              <span>{doc.date}</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">{doc.filePath}</span>
            </div>
          </div>

          {/* Main Title & Actions */}
          <div className="mt-8 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-mono-tech text-[11px] font-medium text-[var(--accent)]">
                  {doc.category}
                </span>
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] px-2.5 py-0.5 font-mono-tech text-[11px] text-[var(--ink-secondary)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 font-serif-cn text-3xl font-semibold leading-tight tracking-tight text-[var(--ink-primary)] sm:text-5xl">
                {doc.title}
              </h1>
              <p className="mt-3 text-base text-[var(--ink-secondary)]">
                {doc.subtitle}
              </p>
            </div>

            {/* Right: Swatches & Bulk Copy Actions */}
            <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:items-end">
              <div className="flex items-center gap-2 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5">
                <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                  PALETTE
                </span>
                <div className="flex items-center gap-1.5">
                  {doc.palette.map((hex) => (
                    <span
                      key={hex}
                      title={hex}
                      className="h-3.5 w-3.5 rounded-full border border-black/15"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {isPromptDeck && (
                  <button
                    onClick={() => copy(allCardsCombined, 'copy-all-cards')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--line-solid)]"
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
                    onClick={() =>
                      copy(doc.masterPrompt!.content, 'header-master')
                    }
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-primary)] px-4 py-2 text-xs font-medium text-[var(--bg-canvas)] transition-colors hover:bg-[var(--accent)]"
                  >
                    {copiedId === 'header-master' ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>完整模板已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>复制完整工程 Prompt</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line-subtle)] pt-5">
            <div className="flex flex-wrap items-center gap-1.5">
              {isPromptDeck && (
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    activeTab === 'cards'
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                      : 'border border-[var(--line-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>01 / 精炼卡片集 ({doc.promptCards.length})</span>
                </button>
              )}

              {doc.masterPrompt && (
                <button
                  onClick={() => setActiveTab('master')}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    activeTab === 'master'
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                      : 'border border-[var(--line-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>02 / 完整工程模板</span>
                </button>
              )}

              {!isPromptDeck && (
                <button
                  onClick={() => setActiveTab('article')}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    activeTab === 'article'
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                      : 'border border-[var(--line-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>正文阅读</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('raw')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  activeTab === 'raw'
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                    : 'border border-[var(--line-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
                }`}
              >
                <FileCode2 className="h-3.5 w-3.5" />
                <span>{isPromptDeck ? '03 / ' : ''}原始 Markdown</span>
              </button>
            </div>

            {/* Layout Switcher when in Cards tab */}
            {activeTab === 'cards' && (
              <div className="flex items-center rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] p-0.5">
                <button
                  onClick={() => setDeckLayout('grid')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${
                    deckLayout === 'grid'
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>网格陈列</span>
                </button>
                <button
                  onClick={() => setDeckLayout('filmstrip')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${
                    deckLayout === 'filmstrip'
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  <GalleryHorizontalEnd className="h-3.5 w-3.5" />
                  <span>胶片横滑</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16">
        {/* TAB 1: PROMPT CARDS DECK */}
        {activeTab === 'cards' && isPromptDeck && (
          <div className="space-y-14">
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
              /* Siena Film Foundation Inspired Horizontal Filmstrip */
              <div>
                <div className="mb-3 flex items-center justify-between font-mono-tech text-[11px] text-[var(--ink-muted)]">
                  <span>FILMSTRIP MODE · 左右滑动浏览 STAGE 01 → 0{doc.promptCards.length}</span>
                  <span>点击任意卡片右上角进入专注全屏</span>
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

            {/* Quick Bridge to Master Engineering Template */}
            {doc.masterPrompt && (
              <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-specimen)] p-6 text-[var(--ink-on-specimen)] sm:p-8">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-[var(--ink-on-specimen-muted)]">
                      NEXT SECTION · FULL ENGINEERING BLUEPRINT
                    </span>
                    <h3 className="mt-1.5 font-serif-cn text-2xl font-semibold text-white">
                      {doc.masterPrompt.heading.replace(/^二、\s*/, '')}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--ink-on-specimen-muted)]">
                      包含全局美术铁律与 Stage 1 → Stage 6 模块化实现指令，附带可勾选的阶段验证清单。
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setActiveTab('master')}
                      className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#171615] transition-colors hover:bg-[var(--accent)] hover:text-white"
                    >
                      展开工程蓝图视图 →
                    </button>
                    <button
                      onClick={() =>
                        copy(doc.masterPrompt!.content, 'bridge-master')
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:border-white/50"
                    >
                      {copiedId === 'bridge-master' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>直接复制</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MASTER ENGINEERING PROMPT SPECIMEN */}
        {activeTab === 'master' && doc.masterPrompt && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left 8 Cols: Structured Engineering Specimen */}
            <div className="space-y-6 lg:col-span-8">
              <div className="overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-specimen)] text-[var(--ink-on-specimen)] shadow-xl">
                {/* Specimen Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4 sm:px-8">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                    <span className="font-mono-tech text-xs uppercase tracking-[0.14em] text-[var(--ink-on-specimen-muted)]">
                      MASTER PROMPT SPECIMEN
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      copy(doc.masterPrompt!.content, 'specimen-copy')
                    }
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#171615] transition-colors hover:bg-[var(--accent)] hover:text-white"
                  >
                    {copiedId === 'specimen-copy' ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>完整 Prompt 已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>一键复制完整模板</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Structured Content */}
                <div className="space-y-8 p-6 sm:p-8">
                  {doc.masterPrompt.intro && (
                    <p className="border-l-2 border-[var(--accent)] pl-4 font-serif-cn text-lg leading-relaxed text-white">
                      {doc.masterPrompt.intro}
                    </p>
                  )}

                  {/* Art Direction Iron Laws */}
                  {doc.masterPrompt.rules.length > 0 && (
                    <div>
                      <h3 className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                        GLOBAL ART DIRECTION · 全局美术铁律
                      </h3>
                      <ul className="mt-3 space-y-2.5">
                        {doc.masterPrompt.rules.map((rule, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 rounded-lg bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-[var(--ink-on-specimen)]/90"
                          >
                            <span className="mt-0.5 font-mono-tech text-xs text-[var(--accent)]">
                              0{i + 1}
                            </span>
                            <span>{renderInlineCode(rule)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Modular Stages */}
                  {doc.masterPrompt.stages.length > 0 && (
                    <div>
                      <h3 className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[var(--ink-on-specimen-muted)]">
                        MODULAR PIPELINE · 分阶段实现要求
                      </h3>
                      <div className="mt-4 space-y-3">
                        {doc.masterPrompt.stages.map((stage) => {
                          const done = completedStages.includes(stage.index);
                          return (
                            <div
                              key={stage.index}
                              className={`rounded-xl border p-5 transition-colors ${
                                done
                                  ? 'border-emerald-500/35 bg-emerald-500/[0.06]'
                                  : 'border-white/10 bg-white/[0.025]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono-tech text-xs font-semibold text-[var(--accent)]">
                                    STAGE 0{stage.index}
                                  </span>
                                  <h4 className="font-serif-cn text-base font-semibold text-white">
                                    {stage.title}
                                  </h4>
                                </div>
                                <button
                                  onClick={() => toggleStage(stage.index)}
                                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 font-mono-tech text-[10px] text-[var(--ink-on-specimen-muted)] transition-colors hover:border-white/40 hover:text-white"
                                >
                                  {done ? (
                                    <>
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                      <span className="text-emerald-300">已完成</span>
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
                                    className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[var(--ink-on-specimen)]/80"
                                  >
                                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
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
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 font-mono-tech text-xs leading-relaxed text-[var(--ink-on-specimen)]/90">
                      {doc.masterPrompt.outro}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Sticky Progress & Quick Copy */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-5">
                <div className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--bg-surface)] p-6">
                  <div className="flex items-center justify-between border-b border-[var(--line-subtle)] pb-3">
                    <span className="font-mono-tech text-[10px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                      IMPLEMENTATION TRACKER
                    </span>
                    <span className="font-mono-tech text-xs font-semibold text-[var(--accent)]">
                      {completedStages.length} / {doc.masterPrompt.stages.length}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--ink-secondary)]">
                    复现本工程 Prompt 时，可逐阶段勾选已验证完成的模块，进度将保存在本地浏览器。
                  </p>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface-alt)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
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
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-[var(--bg-surface-alt)]"
                        >
                          {done ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
                          )}
                          <span
                            className={
                              done
                                ? 'line-through text-[var(--ink-muted)]'
                                : 'text-[var(--ink-primary)]'
                            }
                          >
                            Stage {s.index} · {s.title.replace(/（Stage \d+）/, '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* TAB 3: GENERIC EDITORIAL MARKDOWN READER (for future notes/papers) */}
        {activeTab === 'article' && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <article
              className="editorial-prose lg:col-span-8"
              dangerouslySetInnerHTML={{ __html: doc.htmlContent }}
            />
            {doc.toc.length > 0 && (
              <aside className="hidden lg:col-span-4 lg:block">
                <div className="sticky top-24 rounded-2xl border border-[var(--line-subtle)] bg-[var(--bg-surface)] p-6">
                  <div className="border-b border-[var(--line-subtle)] pb-3 font-mono-tech text-[10px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                    TABLE OF CONTENTS · 目录大纲
                  </div>
                  <nav className="mt-4 space-y-2">
                    {doc.toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-xs leading-relaxed text-[var(--ink-secondary)] transition-colors hover:text-[var(--accent)] ${
                          item.level === 3 ? 'pl-4' : 'font-medium'
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

        {/* TAB 4: RAW MARKDOWN SOURCE */}
        {activeTab === 'raw' && (
          <div className="overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-specimen)] text-[var(--ink-on-specimen)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-3.5">
              <span className="font-mono-tech text-xs text-[var(--ink-on-specimen-muted)]">
                {doc.filePath} · {doc.charCount} chars
              </span>
              <button
                onClick={() => copy(doc.bodyMarkdown, 'raw-md-copy')}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-white transition-colors hover:bg-white/20"
              >
                {copiedId === 'raw-md-copy' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>已复制全文 Markdown</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>复制原文</span>
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-6 font-mono-tech text-xs leading-7 text-[var(--ink-on-specimen)]/90 sm:p-8">
              {doc.bodyMarkdown}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
}

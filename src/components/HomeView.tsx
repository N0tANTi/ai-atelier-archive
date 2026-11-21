import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  LayoutGrid,
  List,
  Copy,
  Check,
  Plus,
  Sparkles,
  Layers,
} from 'lucide-react';
import { siteConfig } from '../site.config';
import {
  archiveDocs,
  allCategories,
  allPromptCards,
  type ArchiveDoc,
  type PromptCard,
} from '../lib/content';
import { useCopy } from '../lib/useCopy';
import { PromptCardItem } from './PromptCardItem';

interface HomeViewProps {
  onOpenDoc: (slug: string) => void;
  onOpenCards: () => void;
  onOpenGuide: () => void;
  onFocusCard: (card: PromptCard, pool: PromptCard[]) => void;
}

export function HomeView({
  onOpenDoc,
  onOpenCards,
  onOpenGuide,
  onFocusCard,
}: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [viewMode, setViewMode] = useState<'index' | 'grid'>('index');
  const { copiedId, copy } = useCopy();

  const featuredDoc: ArchiveDoc | undefined = archiveDocs[0];

  const filteredDocs = useMemo(() => {
    if (selectedCategory === '全部') return archiveDocs;
    return archiveDocs.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="animate-atelier-in">
      {/* 1. Editorial Masthead Hero (Drafting Grid + Archival Rules) */}
      <section className="bg-atelier-grid border-b border-[var(--line-subtle)]">
        <div className="mx-auto max-w-[1320px] px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
          {/* Top Archival Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-subtle)] pb-4 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
              <span>{siteConfig.edition}</span>
              <span className="hidden sm:inline">/</span>
              <span className="hidden sm:inline">CURATED AI KNOWLEDGE BASE</span>
            </div>
            <div className="flex items-center gap-4">
              <span>MARKDOWN-DRIVEN</span>
              <span>·</span>
              <span>ARCHIVE {String(archiveDocs.length).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Asymmetric Editorial Title Block */}
          <div className="mt-10 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-editorial text-2xl italic tracking-wide text-[var(--accent)] sm:text-3xl">
                Curated Field Notes &amp; Prompt Systems
              </p>
              <h1 className="mt-3 font-serif-cn text-4xl font-semibold leading-[1.14] tracking-[-0.02em] text-[var(--ink-primary)] sm:text-6xl">
                AI 研习档案
                <span className="ml-3 font-editorial text-3xl font-normal italic text-[var(--ink-muted)] sm:text-5xl">
                  Archive
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--ink-secondary)] sm:text-base">
                {siteConfig.manifesto}
              </p>

              {/* Quick Actions */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {featuredDoc && (
                  <button
                    onClick={() => onOpenDoc(featuredDoc.slug)}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--ink-primary)] px-6 py-3 text-sm font-medium text-[var(--bg-canvas)] transition-all duration-300 ease-atelier hover:bg-[var(--accent)]"
                  >
                    <span>阅读最新收录：{featuredDoc.title}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
                <button
                  onClick={onOpenGuide}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--bg-surface)]/80 px-5 py-3 text-sm text-[var(--ink-primary)] transition-colors hover:border-[var(--line-solid)] hover:bg-[var(--bg-surface)]"
                >
                  <Plus className="h-4 w-4 text-[var(--accent)]" />
                  <span>如何扩展新资料</span>
                </button>
              </div>
            </div>

            {/* Right Column: Curatorial Index Ledger Card */}
            <div className="lg:col-span-5">
              <div
                className="overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-surface)] p-6"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-center justify-between border-b border-[var(--line-subtle)] pb-3">
                  <span className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    ARCHIVE TELEMETRY
                  </span>
                  <span className="font-mono-tech text-[10px] text-[var(--accent)]">
                    LIVE INDEX
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--line-subtle)]">
                  <div className="pr-4">
                    <div className="font-editorial text-4xl leading-none text-[var(--ink-primary)]">
                      {String(archiveDocs.length).padStart(2, '0')}
                    </div>
                    <div className="mt-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                      归档文档
                    </div>
                  </div>
                  <div className="px-4">
                    <div className="font-editorial text-4xl leading-none text-[var(--ink-primary)]">
                      {String(allPromptCards.length).padStart(2, '0')}
                    </div>
                    <div className="mt-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                      Prompt 卡片
                    </div>
                  </div>
                  <div className="pl-4">
                    <div className="font-editorial text-4xl leading-none text-[var(--ink-primary)]">
                      04
                    </div>
                    <div className="mt-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                      预置分类槽
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-[var(--line-subtle)] pt-4">
                  <div className="flex items-center justify-between text-xs text-[var(--ink-secondary)]">
                    <span>目录结构自动收录</span>
                    <code className="rounded bg-[var(--bg-canvas)] px-2 py-0.5 font-mono-tech text-[11px] text-[var(--accent)]">
                      content/**/*.md
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Monograph Spotlight (No. 01) */}
      {featuredDoc && (
        <section className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 sm:py-16">
          <div className="mb-6 flex items-baseline justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                FEATURED MONOGRAPH · 首期精选档案
              </span>
            </div>
            <span className="font-mono-tech text-[11px] text-[var(--ink-muted)]">
              NO. {featuredDoc.number} / {featuredDoc.date}
            </span>
          </div>

          <div
            className="group relative overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-surface)] transition-all duration-500 ease-atelier hover:border-[var(--line-solid)]"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Editorial Info */}
              <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-7">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-mono-tech text-[11px] font-medium text-[var(--accent)]">
                      {featuredDoc.category}
                    </span>
                    <span className="rounded-full border border-[var(--line-subtle)] px-3 py-1 font-mono-tech text-[11px] text-[var(--ink-muted)]">
                      {featuredDoc.promptCards.length} 张阶段卡片 + 1 套完整工程模板
                    </span>
                  </div>

                  <h2 className="mt-5 font-serif-cn text-3xl font-semibold leading-tight tracking-tight text-[var(--ink-primary)] sm:text-4xl">
                    {featuredDoc.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-[var(--ink-secondary)]">
                    {featuredDoc.subtitle}
                  </p>
                  <p className="mt-4 text-[14px] leading-relaxed text-[var(--ink-secondary)]">
                    {featuredDoc.summary}
                  </p>

                  {/* Tags */}
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {featuredDoc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-[var(--line-subtle)] bg-[var(--bg-canvas)]/70 px-2.5 py-1 font-mono-tech text-[11px] text-[var(--ink-secondary)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--line-subtle)] pt-6">
                  <button
                    onClick={() => onOpenDoc(featuredDoc.slug)}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--ink-primary)] px-5 py-2.5 text-sm font-medium text-[var(--bg-canvas)] transition-colors hover:bg-[var(--accent)]"
                  >
                    <span>进入沉浸式卡片工作台</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>

                  {featuredDoc.masterPrompt && (
                    <button
                      onClick={() =>
                        copy(featuredDoc.masterPrompt!.content, 'featured-master')
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--bg-canvas)] px-5 py-2.5 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--line-solid)]"
                    >
                      {copiedId === 'featured-master' ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span>完整工程 Prompt 已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>一键复制完整工程模板</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Right Tactile Visual Plate (Pipeline Specimen) */}
              <div className="flex flex-col justify-between border-t border-[var(--line-subtle)] bg-[var(--bg-specimen)] p-7 text-[var(--ink-on-specimen)] sm:p-9 lg:col-span-5 lg:border-l lg:border-t-0">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-[var(--ink-on-specimen-muted)]">
                      PIPELINE SPECIMEN · STAGE 01 → 06
                    </span>
                    <div className="flex items-center gap-1.5">
                      {featuredDoc.palette.map((hex) => (
                        <span
                          key={hex}
                          title={hex}
                          className="h-3 w-3 rounded-full border border-white/20"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Interactive 6-stage list */}
                  <div className="mt-4 divide-y divide-white/10">
                    {featuredDoc.promptCards.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => onFocusCard(card, featuredDoc.promptCards)}
                        className="group/row flex w-full items-center justify-between py-2.5 text-left transition-colors hover:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: card.accentHex }}
                          />
                          <span className="font-mono-tech text-[11px] text-[var(--ink-on-specimen-muted)]">
                            0{card.number}
                          </span>
                          <span className="text-sm text-[var(--ink-on-specimen)]/90 transition-transform duration-200 group-hover/row:translate-x-1 group-hover/row:text-white">
                            {card.title}
                          </span>
                        </div>
                        <span className="font-mono-tech text-[10px] text-[var(--ink-on-specimen-muted)] group-hover/row:text-[var(--accent)]">
                          {card.stage} →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono-tech text-[10px] text-[var(--ink-on-specimen-muted)]">
                  <span>CLICK ANY STAGE TO INSPECT CARD</span>
                  <span>GLSL3 / WEBGL2</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Prompt Cards Filmstrip Showcase (Auto-aggregated from all decks) */}
      {allPromptCards.length > 0 && (
        <section className="border-y border-[var(--line-subtle)] bg-[var(--bg-surface-alt)]/45 py-14 sm:py-16">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                  <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>PROMPT DECK GALLERY · 可复用精炼卡片</span>
                </div>
                <h2 className="mt-2 font-serif-cn text-2xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-3xl">
                  精炼 Prompt 卡片陈列
                </h2>
              </div>

              <button
                onClick={onOpenCards}
                className="group inline-flex items-center gap-1.5 border-b border-[var(--line-solid)] pb-0.5 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>查看完整卡片库 ({allPromptCards.length})</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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

      {/* 4. Siena-Inspired Hairline Archive Index */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line-solid)] pb-5">
          <div>
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
              COMPLETE CATALOG · 档案总目
            </span>
            <h2 className="mt-1.5 font-serif-cn text-2xl font-semibold text-[var(--ink-primary)] sm:text-3xl">
              全部学习资料索引
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['全部', ...allCategories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-medium'
                      : 'border border-[var(--line-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Toggle: Siena Index vs Editorial Grid */}
            <div className="flex items-center rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] p-0.5">
              <button
                onClick={() => setViewMode('index')}
                title="目录索引视图"
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors ${
                  viewMode === 'index'
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">目录</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="画廊卡片视图"
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">画廊</span>
              </button>
            </div>
          </div>
        </div>

        {/* Siena Hairline Table Mode */}
        {viewMode === 'index' ? (
          <div className="divide-y divide-[var(--line-subtle)]">
            {/* Column Labels */}
            <div className="hidden grid-cols-12 gap-4 py-3 font-mono-tech text-[10px] uppercase tracking-[0.14em] text-[var(--ink-muted)] md:grid">
              <div className="col-span-1">NO.</div>
              <div className="col-span-5">TITLE / SUBJECT</div>
              <div className="col-span-2">CATEGORY</div>
              <div className="col-span-2">STRUCTURE</div>
              <div className="col-span-2 text-right">UPDATED</div>
            </div>

            {filteredDocs.map((doc) => (
              <button
                key={doc.slug}
                onClick={() => onOpenDoc(doc.slug)}
                className="group grid w-full grid-cols-1 items-center gap-3 py-5 text-left transition-all duration-300 ease-atelier hover:bg-[var(--bg-surface)]/80 hover:px-3 md:grid-cols-12 md:gap-4"
              >
                <div className="font-mono-tech text-xs font-medium text-[var(--ink-muted)] group-hover:text-[var(--accent)] md:col-span-1">
                  {doc.number}
                </div>
                <div className="md:col-span-5">
                  <div className="font-serif-cn text-lg font-semibold text-[var(--ink-primary)] transition-colors group-hover:text-[var(--accent)]">
                    {doc.title}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-[var(--ink-muted)]">
                    {doc.subtitle}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="inline-block rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] px-2.5 py-0.5 font-mono-tech text-[11px] text-[var(--ink-secondary)]">
                    {doc.category}
                  </span>
                </div>
                <div className="font-mono-tech text-xs text-[var(--ink-secondary)] md:col-span-2">
                  {doc.promptCards.length > 0
                    ? `${doc.promptCards.length} Cards · 模板`
                    : `${doc.readingMinutes} min read`}
                </div>
                <div className="flex items-center justify-between gap-2 md:col-span-2 md:justify-end">
                  <span className="font-mono-tech text-xs text-[var(--ink-muted)]">
                    {doc.date}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--ink-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Editorial Grid Mode */
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <button
                key={doc.slug}
                onClick={() => onOpenDoc(doc.slug)}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--line-subtle)] bg-[var(--bg-surface)] p-6 text-left transition-all duration-300 ease-atelier hover:-translate-y-1 hover:border-[var(--line-strong)]"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div>
                  <div className="flex items-center justify-between font-mono-tech text-[11px] text-[var(--ink-muted)]">
                    <span>NO. {doc.number}</span>
                    <span>{doc.category}</span>
                  </div>
                  <h3 className="mt-4 font-serif-cn text-xl font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent)]">
                    {doc.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--ink-secondary)]">
                    {doc.summary}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[var(--line-subtle)] pt-4 font-mono-tech text-[11px] text-[var(--ink-muted)]">
                  <span>{doc.date}</span>
                  <span className="inline-flex items-center gap-1 text-[var(--ink-primary)] group-hover:text-[var(--accent)]">
                    打开档案 <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Future Extension Archival Slot */}
        <div className="mt-8 rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--bg-surface)]/55 p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--line-subtle)] bg-[var(--bg-canvas)] font-mono-tech text-xs text-[var(--ink-muted)]">
                02+
              </span>
              <div>
                <p className="text-sm font-medium text-[var(--ink-primary)]">
                  下一份学习资料将自动出现在这里
                </p>
                <p className="mt-0.5 text-xs text-[var(--ink-secondary)]">
                  将任意 <code className="font-mono-tech text-[var(--accent)]">.md</code>{' '}
                  文件放入{' '}
                  <code className="font-mono-tech text-[var(--ink-primary)]">
                    content/prompts/
                  </code>{' '}
                  或{' '}
                  <code className="font-mono-tech text-[var(--ink-primary)]">
                    content/notes/
                  </code>{' '}
                  目录，即可自动解析目录、卡片与全文检索。
                </p>
              </div>
            </div>
            <button
              onClick={onOpenGuide}
              className="shrink-0 rounded-full border border-[var(--line-strong)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--line-solid)] hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)]"
            >
              查看归档模板与规范 →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

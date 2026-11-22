import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  LayoutGrid,
  List,
  Copy,
  Check,
  Plus,
  FolderGit2,
} from 'lucide-react';
import {
  archiveDocs,
  allPromptCards,
  type PromptCard,
} from '../lib/content';
import { useCopy } from '../lib/useCopy';
import { type MosaicAction } from './PinwheelMosaic';
import { BlueprintIntroStage } from './BlueprintIntroStage';
import { PromptCardItem } from './PromptCardItem';

interface HomeViewProps {
  onOpenDoc: (slug: string, tab?: 'cards' | 'master' | 'source') => void;
  onOpenCards: () => void;
  onOpenGuide: () => void;
  onOpenSearch: () => void;
  onFocusCard: (card: PromptCard, pool: PromptCard[]) => void;
  onIntroProgress?: (progress: number) => void;
}

const FIXED_CATEGORIES = [
  '全部',
  'Prompt 卡片集',
  '技术笔记',
  '论文拆解',
  'AI 工作流',
];

export function HomeView({
  onOpenDoc,
  onOpenCards,
  onOpenGuide,
  onOpenSearch,
  onFocusCard,
  onIntroProgress,
}: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [viewMode, setViewMode] = useState<'index' | 'grid'>('index');
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const catalogRef = useRef<HTMLElement>(null);
  const { copiedId, copy } = useCopy();

  const featuredList = useMemo(() => {
    const list = archiveDocs.filter((d) => d.featured);
    return list.length > 0 ? list : archiveDocs.slice(0, 1);
  }, []);

  const featuredDoc = featuredList[featuredIdx] ?? featuredList[0];

  const filteredDocs = useMemo(() => {
    if (selectedCategory === '全部') return archiveDocs;
    return archiveDocs.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  const handleMosaicAction = (action: MosaicAction) => {
    if (action.type === 'cards') onOpenCards();
    else if (action.type === 'guide') onOpenGuide();
    else if (action.type === 'search') onOpenSearch();
    else if (action.type === 'doc') onOpenDoc(action.slug, action.tab);
    else if (action.type === 'category') {
      setSelectedCategory(action.category);
      catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-dropbox-in">
      {/* 1. AUTHENTIC DROPBOX 3-ACT SCROLL-DRIVEN OPENING HERO -> 8-TILE PINWHEEL MOSAIC */}
      <BlueprintIntroStage
        onAction={handleMosaicAction}
        onProgressChange={onIntroProgress}
      />

      {/* 2. HIGH-CONTRAST DARK #1E1919 BAND — FEATURED MONOGRAPH SPOTLIGHT */}
      {featuredDoc && (
        <section className="bg-[var(--bg-dark-band)] text-white">
          <div className="mx-auto max-w-[1400px] border-x border-white/10 px-5 py-16 sm:px-8 sm:py-20">
            {/* Multi-Featured Switcher Pill Bar */}
            {featuredList.length > 1 && (
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-5">
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3DD6F5]">
                  FEATURED SHOWCASE · 精选作品切换 ({featuredList.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {featuredList.map((item, idx) => {
                    const active = idx === featuredIdx;
                    return (
                      <button
                        key={item.slug}
                        onClick={() => setFeaturedIdx(idx)}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-[var(--brand-blue)] text-white'
                            : 'border border-white/20 bg-white/[0.04] text-white/75 hover:border-white hover:text-white'
                        }`}
                      >
                        <span className="font-mono-tech text-[10px] opacity-80">
                          NO.{item.number}
                        </span>
                        <span>{item.title.split('·')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[var(--brand-blue)] px-2.5 py-1 font-mono-tech text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    FEATURED NO.{featuredDoc.number}
                  </span>
                  <span className="bg-[#FAD24B] px-2.5 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-[0.12em] text-[#1E1919]">
                    {featuredDoc.category}
                  </span>
                  <span className="font-mono-tech text-[11px] text-white/55">
                    {featuredDoc.date}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
                  {featuredDoc.title}
                </h2>
                <p className="mt-3 text-base text-white/75">
                  {featuredDoc.subtitle}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
                  {featuredDoc.summary}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      onOpenDoc(
                        featuredDoc.slug,
                        featuredDoc.promptCards.length > 0 ? 'cards' : undefined
                      )
                    }
                    className="group inline-flex items-center gap-2 bg-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#1E1919]"
                  >
                    <span>
                      {featuredDoc.promptCards.length > 0
                        ? `进入 ${featuredDoc.promptCards.length} 张卡片与交互工作台`
                        : '阅读完整技术拆解与架构'}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  {featuredDoc.repo && (
                    <button
                      onClick={() => onOpenDoc(featuredDoc.slug, 'source')}
                      className="inline-flex items-center gap-2 bg-[#FA551E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#1E1919]"
                    >
                      <FolderGit2 className="h-4 w-4" />
                      <span>
                        {featuredDoc.demo ? '源码仓库 & 实时 3D 预览' : '源码仓库 & 模块索引'}
                      </span>
                    </button>
                  )}

                  {featuredDoc.masterPrompt && (
                    <button
                      onClick={() =>
                        copy(featuredDoc.masterPrompt!.content, 'hero-master-copy')
                      }
                      className="inline-flex items-center gap-2 border border-white/25 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-[#1E1919]"
                    >
                      {copiedId === 'hero-master-copy' ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span>完整工程 Prompt 已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>复制完整工程模板</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Visual Preview + Interactive Quick Inspector */}
              <div className="border border-white/15 bg-white/[0.03] lg:col-span-5">
                {featuredDoc.preview ? (
                  <button
                    onClick={() => onOpenDoc(featuredDoc.slug, 'source')}
                    className="group relative block h-44 w-full overflow-hidden border-b border-white/12 text-left"
                  >
                    <img
                      src={featuredDoc.preview}
                      alt={featuredDoc.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-dropbox group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.14em] text-[#FAD24B]">
                        {featuredDoc.demoTag || 'LIVE THREE.JS SCENE · OPEN SOURCE'}
                      </span>
                      <span className="bg-[var(--brand-blue)] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-white">
                        RUN 3D →
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenDoc(featuredDoc.slug, 'source')}
                    className="group relative block h-36 w-full overflow-hidden border-b border-white/12 p-5 text-left"
                    style={{
                      background: `linear-gradient(135deg, ${featuredDoc.palette[0] || '#31554B'} 0%, #1E1919 72%, ${featuredDoc.palette[1] || '#914631'} 100%)`,
                    }}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.14em] text-[#FAD24B]">
                          {featuredDoc.demoTag || 'INTERACTIVE 3D REPOSITORY'}
                        </span>
                        <div className="flex gap-1.5">
                          {featuredDoc.palette.map((hex) => (
                            <span
                              key={hex}
                              className="h-3 w-3 border border-white/30"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="font-display text-lg font-bold text-white">
                          {featuredDoc.repo?.replace(/^https?:\/\/github\.com\//i, '')}
                        </span>
                        <span className="bg-[var(--brand-blue)] px-2.5 py-0.5 font-mono-tech text-[10px] font-bold text-white transition-colors group-hover:bg-white group-hover:text-[#1E1919]">
                          {featuredDoc.demo ? 'RUN 3D →' : 'OPEN SOURCE →'}
                        </span>
                      </div>
                    </div>
                  </button>
                )}

                <div className="p-6">
                  {featuredDoc.promptCards.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between border-b border-white/12 pb-3">
                        <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3DD6F5]">
                          STAGE 01 → 0{featuredDoc.promptCards.length} QUICK INSPECTOR
                        </span>
                        <span className="font-mono-tech text-[10px] text-white/50">
                          CLICK TO PREVIEW
                        </span>
                      </div>

                      <div className="mt-2 divide-y divide-white/10">
                        {featuredDoc.promptCards.map((card) => (
                          <button
                            key={card.id}
                            onClick={() => onFocusCard(card, featuredDoc.promptCards)}
                            className="group flex w-full items-center justify-between py-2.5 text-left transition-colors hover:text-[#FAD24B]"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="h-2.5 w-2.5 shrink-0"
                                style={{ backgroundColor: card.accentHex }}
                              />
                              <span className="font-mono-tech text-xs text-white/50">
                                0{card.number}
                              </span>
                              <span className="text-sm font-medium text-white/90 group-hover:text-white">
                                {card.title}
                              </span>
                            </div>
                            <span className="font-mono-tech text-[10px] text-white/45 group-hover:text-[#FAD24B]">
                              {card.stage} →
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between border-b border-white/12 pb-3">
                        <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3DD6F5]">
                          SOURCE ARCHITECTURE · CORE MODULES
                        </span>
                        <span className="font-mono-tech text-[10px] text-white/50">
                          GITHUB FILES
                        </span>
                      </div>

                      <div className="mt-2 divide-y divide-white/10">
                        {featuredDoc.sourceMap.map((entry) => (
                          <a
                            key={entry.stage}
                            href={
                              featuredDoc.repo && entry.files[0]
                                ? `${featuredDoc.repo}/blob/main/${entry.files[0]}`
                                : '#'
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="group flex w-full items-center justify-between gap-2 py-2.5 text-left transition-colors hover:text-[#FAD24B]"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <span className="shrink-0 font-mono-tech text-[10px] text-[#3DD6F5]">
                                {entry.stage}
                              </span>
                              <span className="truncate text-sm font-medium text-white/90 group-hover:text-white">
                                {entry.label}
                              </span>
                            </div>
                            <span className="shrink-0 font-mono-tech text-[10px] text-white/45 group-hover:text-[#FAD24B]">
                              {entry.files[0]?.split('/').pop()} ↗
                            </span>
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. DUOTONE PROMPT CARDS GALLERY BAND */}
      {allPromptCards.length > 0 && (
        <section className="border-b border-[var(--blueprint-line)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-16 sm:px-8 sm:py-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  DUOTONE PROMPT SYSTEM · 跨文档精选卡片
                </span>
                <h2 className="mt-2 font-display text-3xl font-bold text-[var(--ink-base)] sm:text-4xl">
                  精炼 Prompt 卡片陈列
                </h2>
              </div>

              <button
                onClick={onOpenCards}
                className="group inline-flex items-center gap-2 border-b-2 border-[var(--ink-base)] pb-1 font-display text-sm font-semibold text-[var(--ink-base)] transition-colors hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                <span>进入完整卡片库 ({allPromptCards.length})</span>
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

      {/* 4. SCALABLE SWISS BLUEPRINT ARCHIVE CATALOG (For 100+ Future .md Files) */}
      <section ref={catalogRef} className="bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--ink-base)] pb-5">
            <div>
              <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                SCALABLE KNOWLEDGE INDEX · 全站档案总目
              </span>
              <h2 className="mt-1.5 font-display text-3xl font-bold text-[var(--ink-base)]">
                全部学习资料目录
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {FIXED_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[var(--brand-blue)] text-white'
                        : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-secondary)] hover:bg-[var(--ink-base)] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex border border-[var(--hairline-strong)]">
                <button
                  onClick={() => setViewMode('index')}
                  title="列表目录视图"
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === 'index'
                      ? 'bg-[var(--ink-base)] text-white'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  title="方块画廊视图"
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[var(--ink-base)] text-white'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink-base)]'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="mt-6 border border-dashed border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-10 text-center">
              <p className="font-display text-lg font-bold text-[var(--ink-base)]">
                「{selectedCategory}」分类目前虚位以待
              </p>
              <p className="mt-1.5 text-xs text-[var(--ink-secondary)]">
                只需将你的 Markdown 笔记放入对应目录，提交后这里就会自动填充。
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => setSelectedCategory('全部')}
                  className="border border-[var(--ink-base)] px-4 py-2 text-xs font-semibold text-[var(--ink-base)] hover:bg-[var(--ink-base)] hover:text-white"
                >
                  查看全部已收录资料
                </button>
                <button
                  onClick={onOpenGuide}
                  className="bg-[var(--brand-blue)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--ink-base)]"
                >
                  查看归档目录规范 →
                </button>
              </div>
            </div>
          ) : viewMode === 'index' ? (
            <div className="divide-y divide-[var(--hairline)]">
              <div className="hidden grid-cols-12 gap-4 py-3 font-mono-tech text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)] md:grid">
                <div className="col-span-1">NO.</div>
                <div className="col-span-5">DOCUMENT</div>
                <div className="col-span-2">CATEGORY</div>
                <div className="col-span-2">FORMAT</div>
                <div className="col-span-2 text-right">DATE</div>
              </div>

              {filteredDocs.map((doc) => (
                <button
                  key={doc.slug}
                  onClick={() => onOpenDoc(doc.slug)}
                  className="group grid w-full grid-cols-1 items-center gap-3 py-5 text-left transition-all duration-200 hover:bg-[var(--bg-subtle)] hover:px-3 md:grid-cols-12 md:gap-4"
                >
                  <div className="md:col-span-1">
                    <span className="inline-block bg-[var(--bg-subtle)] px-2 py-0.5 font-mono-tech text-xs font-bold text-[var(--ink-base)] transition-colors group-hover:bg-[var(--brand-blue)] group-hover:text-white">
                      {doc.number}
                    </span>
                  </div>
                  <div className="md:col-span-5">
                    <div className="font-display text-lg font-bold text-[var(--ink-base)] group-hover:text-[var(--brand-blue)]">
                      {doc.title}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-[var(--ink-secondary)]">
                      {doc.subtitle}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="inline-block bg-[#FAD24B] px-2.5 py-0.5 font-mono-tech text-[10px] font-bold text-[#1E1919]">
                      {doc.category}
                    </span>
                  </div>
                  <div className="font-mono-tech text-xs text-[var(--ink-secondary)] md:col-span-2">
                    {doc.promptCards.length > 0
                      ? `${doc.promptCards.length} Cards + 模板`
                      : `${doc.readingMinutes} min read`}
                  </div>
                  <div className="flex items-center justify-between gap-2 md:col-span-2 md:justify-end">
                    <span className="font-mono-tech text-xs text-[var(--ink-muted)]">
                      {doc.date}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--ink-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--brand-blue)]" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.slug}
                  onClick={() => onOpenDoc(doc.slug)}
                  className="group flex flex-col justify-between border border-[var(--hairline-strong)] bg-white p-6 text-left transition-all hover:border-[var(--ink-base)] hover:bg-[var(--bg-subtle)]"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono-tech text-[11px]">
                      <span className="bg-[var(--brand-blue)] px-2 py-0.5 font-bold text-white">
                        NO.{doc.number}
                      </span>
                      <span className="text-[var(--ink-muted)]">{doc.category}</span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold text-[var(--ink-base)] group-hover:text-[var(--brand-blue)]">
                      {doc.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--ink-secondary)]">
                      {doc.summary}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--hairline)] pt-4 font-mono-tech text-[11px]">
                    <span className="text-[var(--ink-muted)]">{doc.date}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[var(--ink-base)] group-hover:text-[var(--brand-blue)]">
                      OPEN <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Blueprint Quick-Add Slot */}
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border border-dashed border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--brand-blue)] font-mono-tech text-xs font-bold text-white">
                <Plus className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-[var(--ink-base)]">
                  直接放入新的 Markdown 文件即可持续扩展
                </p>
                <p className="mt-0.5 text-xs text-[var(--ink-secondary)]">
                  将学习资料放入 <code className="font-mono-tech text-[var(--brand-blue)]">content/prompts/</code>、
                  <code className="font-mono-tech text-[var(--brand-blue)]">content/notes/</code>、
                  <code className="font-mono-tech text-[var(--brand-blue)]">content/papers/</code> 或{' '}
                  <code className="font-mono-tech text-[var(--brand-blue)]">content/workflows/</code>，推送 GitHub 即自动上线。
                </p>
              </div>
            </div>
            <button
              onClick={onOpenGuide}
              className="shrink-0 bg-[var(--ink-base)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
            >
              查看扩展模板 →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

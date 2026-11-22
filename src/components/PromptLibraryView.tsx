import { useMemo, useState } from 'react';
import {
  Search,
  FolderKanban,
  ArrowRight,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  FolderTree,
  Layers,
} from 'lucide-react';
import {
  projects,
  standaloneDocs,
  allPromptCards,
  type ProjectRecord,
  type PromptCard,
} from '../lib/content';
import { useCopy } from '../lib/useCopy';
import { PromptCardItem } from './PromptCardItem';
import type { ProjectTab } from './ProjectView';

interface PromptLibraryViewProps {
  onFocusCard: (card: PromptCard, pool: PromptCard[]) => void;
  onOpenProject: (slug: string, tab?: ProjectTab) => void;
  onOpenDoc: (slug: string) => void;
}

export function PromptLibraryView({
  onFocusCard,
  onOpenProject,
  onOpenDoc,
}: PromptLibraryViewProps) {
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'by-project' | 'flat'>('by-project');
  const [filterText, setFilterText] = useState('');
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
  const { copiedId, copy } = useCopy();

  const projectsWithPrompts = useMemo(
    () => projects.filter((p) => p.promptCards.length > 0 || Boolean(p.masterPrompt)),
    []
  );

  const projectsWithoutPrompts = useMemo(
    () => projects.filter((p) => p.promptCards.length === 0 && !p.masterPrompt),
    []
  );

  const standalonePromptDocs = useMemo(
    () => standaloneDocs.filter((d) => d.promptCards.length > 0),
    []
  );

  const query = filterText.trim().toLowerCase();

  const matchesCard = (card: PromptCard) => {
    if (!query) return true;
    return (
      card.title.toLowerCase().includes(query) ||
      (card.promptSubtitle ?? '').toLowerCase().includes(query) ||
      card.ownerTitle.toLowerCase().includes(query) ||
      card.rawPrompt.toLowerCase().includes(query) ||
      card.tags.some((t) => t.toLowerCase().includes(query))
    );
  };

  // Grouped project sections filtered by project pill + search text
  const visibleProjectGroups = useMemo(() => {
    return projectsWithPrompts
      .filter(
        (p) => selectedProjectSlug === 'ALL' || p.slug === selectedProjectSlug
      )
      .map((project) => ({
        project,
        cards: project.promptCards.filter(matchesCard),
      }))
      .filter((group) => group.cards.length > 0 || (!query && Boolean(group.project.masterPrompt)));
  }, [projectsWithPrompts, selectedProjectSlug, query]);

  const visibleStandaloneGroups = useMemo(() => {
    if (selectedProjectSlug !== 'ALL' && selectedProjectSlug !== 'STANDALONE') {
      return [];
    }
    return standalonePromptDocs
      .map((doc) => ({
        doc,
        cards: doc.promptCards.filter(matchesCard),
      }))
      .filter((g) => g.cards.length > 0);
  }, [standalonePromptDocs, selectedProjectSlug, query]);

  const flatFilteredCards = useMemo(() => {
    return allPromptCards.filter((card) => {
      const ownerMatch =
        selectedProjectSlug === 'ALL' ||
        (selectedProjectSlug === 'STANDALONE'
          ? card.ownerType === 'doc'
          : card.ownerType === 'project' && card.ownerSlug === selectedProjectSlug);
      return ownerMatch && matchesCard(card);
    });
  }, [selectedProjectSlug, query]);

  const toggleCollapse = (slug: string) => {
    setCollapsedMap((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const renderProjectDeckSection = (
    project: ProjectRecord,
    cards: PromptCard[]
  ) => {
    const isCollapsed = Boolean(collapsedMap[project.slug]);
    const allCardsText = cards
      .map((c) => `### 卡片 #${c.number}｜${c.title}（${c.stage}）\n${c.rawPrompt}`)
      .join('\n\n');

    return (
      <section
        key={project.slug}
        className="border border-[var(--blueprint-line-strong)] bg-white"
      >
        {/* Project-First Directory Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--blueprint-line)] bg-[var(--bg-subtle)] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => toggleCollapse(project.slug)}
              aria-label={isCollapsed ? '展开项目卡片' : '收起项目卡片'}
              className="flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--hairline-strong)] bg-white text-[var(--ink-base)] transition-colors hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[var(--brand-blue)] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-white">
                  PROJECT P{project.number}
                </span>
                <button
                  onClick={() => onOpenProject(project.slug, 'prompts')}
                  className="font-display text-xl font-bold text-[var(--ink-base)] transition-colors hover:text-[var(--brand-blue)]"
                >
                  {project.title}
                </button>
                <span className="bg-[#FAD24B] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[#1E1919]">
                  {cards.length} 张卡片
                </span>
                {project.masterPrompt && (
                  <span className="border border-[var(--hairline-strong)] bg-white px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-[var(--ink-secondary)]">
                    含完整工程模板
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-xs text-[var(--ink-secondary)]">
                {project.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.masterPrompt && (
              <button
                onClick={() =>
                  copy(project.masterPrompt!.content, `master-${project.slug}`)
                }
                className="inline-flex items-center gap-1.5 border border-[var(--hairline-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:bg-[var(--ink-base)] hover:text-white"
              >
                {copiedId === `master-${project.slug}` ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>已复制工程模板</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>复制工程模板</span>
                  </>
                )}
              </button>
            )}

            {cards.length > 0 && (
              <button
                onClick={() => copy(allCardsText, `all-${project.slug}`)}
                className="inline-flex items-center gap-1.5 border border-[var(--hairline-strong)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:bg-[var(--ink-base)] hover:text-white"
              >
                {copiedId === `all-${project.slug}` ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>已复制全部卡片</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>复制全套</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => onOpenProject(project.slug, 'prompts')}
              className="inline-flex items-center gap-1.5 bg-[var(--ink-base)] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
            >
              <span>进入项目专页</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Cards Grid inside Project Directory */}
        {!isCollapsed && (
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <PromptCardItem
                  key={card.id}
                  card={card}
                  copied={copiedId === card.id}
                  onCopy={() => copy(card.rawPrompt, card.id)}
                  onFocus={() => onFocusCard(card, cards)}
                  compact
                />
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="animate-dropbox-in">
      {/* Header Band (Warm Gold matching Tile 02 in Pinwheel Mosaic!) */}
      <section className="bg-[#FAD24B] text-[#1E1919]">
        <div className="mx-auto max-w-[1400px] border-x border-black/10 px-5 pb-12 pt-10 sm:px-8 sm:pb-14">
          <div className="flex items-center gap-2 font-mono-tech text-[11px] font-bold uppercase tracking-[0.16em] text-[#594404]">
            <Layers className="h-3.5 w-3.5" />
            <span>PROMPT DECKS DIRECTORY · 按项目归档的 Prompt 卡片库</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-[#1E1919] sm:text-5xl">
            Prompt 卡片库
            <span className="ml-3 font-mono-tech text-2xl font-normal text-[#594404] sm:text-3xl">
              ({String(projectsWithPrompts.length).padStart(2, '0')} 项目 ·{' '}
              {String(allPromptCards.length).padStart(2, '0')} 卡片)
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#1E1919]/80">
            以<strong>项目作为一级目录</strong>归档所有 Prompt 卡片集与工程模板，保留每套 Prompt 的完整上下文；也支持切换为平铺视图跨项目检索单张卡片。
          </p>

          {/* Project-First Directory Filter + View Mode Toggle + Search */}
          <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedProjectSlug('ALL')}
                className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  selectedProjectSlug === 'ALL'
                    ? 'bg-[#1E1919] text-white'
                    : 'border border-black/20 bg-white/55 text-[#1E1919] hover:bg-[#1E1919] hover:text-white'
                }`}
              >
                全部项目 ({allPromptCards.length})
              </button>

              {projectsWithPrompts.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setSelectedProjectSlug(p.slug)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    selectedProjectSlug === p.slug
                      ? 'bg-[#1E1919] text-white'
                      : 'border border-black/20 bg-white/55 text-[#1E1919] hover:bg-[#1E1919] hover:text-white'
                  }`}
                >
                  <span className="font-mono-tech text-[10px] opacity-75">
                    P{p.number}
                  </span>
                  <span>{p.title}</span>
                  <span className="font-mono-tech text-[10px] opacity-75">
                    ({p.promptCards.length})
                  </span>
                </button>
              ))}

              {standalonePromptDocs.length > 0 && (
                <button
                  onClick={() => setSelectedProjectSlug('STANDALONE')}
                  className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    selectedProjectSlug === 'STANDALONE'
                      ? 'bg-[#1E1919] text-white'
                      : 'border border-black/20 bg-white/55 text-[#1E1919] hover:bg-[#1E1919] hover:text-white'
                  }`}
                >
                  独立卡片集 ({standalonePromptDocs.length})
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Switcher: Project Directory vs Flat Cards */}
              <div className="flex border border-black/25 bg-white/70">
                <button
                  onClick={() => setViewMode('by-project')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
                    viewMode === 'by-project'
                      ? 'bg-[#1E1919] text-white'
                      : 'text-[#1E1919]'
                  }`}
                >
                  <FolderTree className="h-3.5 w-3.5" />
                  <span>按项目目录</span>
                </button>
                <button
                  onClick={() => setViewMode('flat')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
                    viewMode === 'flat'
                      ? 'bg-[#1E1919] text-white'
                      : 'text-[#1E1919]'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>全部平铺</span>
                </button>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#594404]" />
                <input
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="筛选卡片关键词..."
                  className="w-full border border-black/25 bg-white/80 py-1.5 pl-9 pr-3 text-xs text-[#1E1919] placeholder:text-[#594404]/70 focus:border-[#1E1919] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] space-y-8 border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          {viewMode === 'by-project' ? (
            <>
              {visibleProjectGroups.length === 0 &&
              visibleStandaloneGroups.length === 0 ? (
                <div className="border border-dashed border-[var(--blueprint-line-strong)] py-16 text-center">
                  <p className="font-display text-xl font-bold text-[var(--ink-base)]">
                    暂无匹配的 Prompt 卡片
                  </p>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">
                    请尝试清空关键词或切换项目筛选
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {visibleProjectGroups.map(({ project, cards }) =>
                    renderProjectDeckSection(project, cards)
                  )}

                  {visibleStandaloneGroups.map(({ doc, cards }) => (
                    <section
                      key={doc.slug}
                      className="border border-[var(--blueprint-line-strong)] bg-white"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--blueprint-line)] bg-[var(--bg-subtle)] px-6 py-4">
                        <div>
                          <span className="bg-[#1E1919] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-white">
                            STANDALONE DECK
                          </span>
                          <h2 className="mt-1 font-display text-xl font-bold text-[var(--ink-base)]">
                            {doc.title}
                          </h2>
                        </div>
                        <button
                          onClick={() => onOpenDoc(doc.slug)}
                          className="inline-flex items-center gap-1.5 bg-[var(--ink-base)] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[var(--brand-blue)]"
                        >
                          <span>打开原文</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
                        {cards.map((card) => (
                          <PromptCardItem
                            key={card.id}
                            card={card}
                            copied={copiedId === card.id}
                            onCopy={() => copy(card.rawPrompt, card.id)}
                            onFocus={() => onFocusCard(card, cards)}
                            compact
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {/* Projects without Prompt Cards yet (keeps Project-First Directory 100% transparent!) */}
              {selectedProjectSlug === 'ALL' &&
                !query &&
                projectsWithoutPrompts.length > 0 && (
                  <div className="border border-dashed border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-6">
                    <div className="flex items-center gap-2 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                      <FolderKanban className="h-3.5 w-3.5 text-[var(--brand-blue)]" />
                      <span>PENDING PROMPT DECKS · 尚未补充 Prompt 卡片的项目</span>
                    </div>
                    <div className="mt-4 divide-y divide-[var(--hairline)]">
                      {projectsWithoutPrompts.map((p) => (
                        <div
                          key={p.slug}
                          className="flex flex-wrap items-center justify-between gap-3 py-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="bg-white px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[var(--ink-secondary)]">
                              P{p.number}
                            </span>
                            <span className="font-display text-sm font-bold text-[var(--ink-base)]">
                              {p.title}
                            </span>
                            <span className="text-xs text-[var(--ink-muted)]">
                              — 在{' '}
                              <code className="font-mono-tech text-[var(--brand-blue)]">
                                {p.folderPath}prompts.md
                              </code>{' '}
                              写入卡片后自动展开
                            </span>
                          </div>
                          <button
                            onClick={() => onOpenProject(p.slug, 'overview')}
                            className="font-mono-tech text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--brand-blue)]"
                          >
                            查看该项目 →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </>
          ) : flatFilteredCards.length === 0 ? (
            <div className="border border-dashed border-[var(--blueprint-line-strong)] py-16 text-center">
              <p className="font-display text-xl font-bold text-[var(--ink-base)]">
                暂无匹配的 Prompt 卡片
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {flatFilteredCards.map((card) => (
                <PromptCardItem
                  key={card.id}
                  card={card}
                  copied={copiedId === card.id}
                  onCopy={() => copy(card.rawPrompt, card.id)}
                  onFocus={() => onFocusCard(card, flatFilteredCards)}
                  showOwnerBadge
                  onOpenOwner={() =>
                    card.ownerType === 'project'
                      ? onOpenProject(card.ownerSlug, 'prompts')
                      : onOpenDoc(card.ownerSlug)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

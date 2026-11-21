import { useMemo, useState } from 'react';
import { Layers, Search } from 'lucide-react';
import { allPromptCards, allTags, type PromptCard } from '../lib/content';
import { useCopy } from '../lib/useCopy';
import { PromptCardItem } from './PromptCardItem';

interface PromptLibraryViewProps {
  onFocusCard: (card: PromptCard, pool: PromptCard[]) => void;
}

export function PromptLibraryView({ onFocusCard }: PromptLibraryViewProps) {
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [filterText, setFilterText] = useState('');
  const { copiedId, copy } = useCopy();

  const filteredCards = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return allPromptCards.filter((card) => {
      const tagMatch =
        selectedTag === '全部' || card.tags.includes(selectedTag);
      const textMatch =
        !q ||
        card.title.toLowerCase().includes(q) ||
        (card.promptSubtitle ?? '').toLowerCase().includes(q) ||
        card.rawPrompt.toLowerCase().includes(q);
      return tagMatch && textMatch;
    });
  }, [selectedTag, filterText]);

  return (
    <div className="animate-atelier-in">
      <section className="bg-atelier-grid border-b border-[var(--line-subtle)]">
        <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-10 sm:px-8 sm:pb-12">
          <div className="flex items-center gap-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>PROMPT CARDS LIBRARY · 跨文档聚合卡片库</span>
          </div>
          <h1 className="mt-3 font-serif-cn text-3xl font-semibold text-[var(--ink-primary)] sm:text-5xl">
            Prompt 卡片库
            <span className="ml-3 font-editorial text-2xl font-normal italic text-[var(--ink-muted)] sm:text-4xl">
              ({allPromptCards.length})
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-secondary)]">
            系统会自动从所有 <code className="font-mono-tech text-[var(--accent)]">content/prompts/</code>{' '}
            档案中抽取「卡片单元」并汇集于此。随着后续不断新增 Prompt 卡片集，这里会成长为可按标签瞬间检索与复制的个人 Prompt 武器库。
          </p>

          {/* Filter & Search Bar */}
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              {['全部', ...allTags].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition-all ${
                    selectedTag === tag
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-medium'
                      : 'border border-[var(--line-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  {tag === '全部' ? '全部标签' : `#${tag}`}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="筛选卡片关键词..."
                className="w-full rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] py-2 pl-9 pr-4 text-xs text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:border-[var(--line-strong)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16">
        {filteredCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line-strong)] py-16 text-center">
            <p className="font-editorial text-2xl italic text-[var(--ink-muted)]">
              No matching cards
            </p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              当前筛选条件下没有匹配的 Prompt 卡片
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => (
              <PromptCardItem
                key={card.id}
                card={card}
                copied={copiedId === card.id}
                onCopy={() => copy(card.rawPrompt, card.id)}
                onFocus={() => onFocusCard(card, filteredCards)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

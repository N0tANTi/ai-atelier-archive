import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
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
    <div className="animate-dropbox-in">
      <section className="bg-[#2B4464] text-white">
        <div className="mx-auto max-w-[1400px] border-x border-white/15 px-5 pb-12 pt-10 sm:px-8 sm:pb-14">
          <span className="font-mono-tech text-[11px] font-semibold uppercase tracking-[0.16em] text-[#82B8FF]">
            PROMPT DECKS LIBRARY · 跨文档聚合卡片库
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
            Prompt 卡片库
            <span className="ml-3 font-mono-tech text-2xl font-normal text-[#82B8FF] sm:text-3xl">
              ({String(allPromptCards.length).padStart(2, '0')})
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
            自动从所有 <code className="bg-white/15 px-1.5 py-0.5 font-mono-tech text-[#FAD24B]">content/prompts/</code>{' '}
            文件中抽取卡片单元并按双色调系统陈列。悬停卡片可切换至暗黑高亮模式，支持一键复制与专注全屏检视。
          </p>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              {['全部', ...allTags].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    selectedTag === tag
                      ? 'bg-[#FAD24B] text-[#1E1919]'
                      : 'border border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#1E1919]'
                  }`}
                >
                  {tag === '全部' ? '全部标签' : `#${tag}`}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/60" />
              <input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="筛选卡片关键词..."
                className="w-full border border-white/25 bg-white/10 py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/55 focus:border-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          {filteredCards.length === 0 ? (
            <div className="border border-dashed border-[var(--blueprint-line-strong)] py-16 text-center">
              <p className="font-display text-xl font-bold text-[var(--ink-base)]">
                暂无匹配的 Prompt 卡片
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                请尝试更换标签或清空关键词筛选
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
        </div>
      </section>
    </div>
  );
}

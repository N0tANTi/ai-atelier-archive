import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  X,
  FolderKanban,
  FileText,
  FolderGit2,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import {
  projects,
  allPromptCards,
  allNotes,
  allRepos,
  type PromptCard,
} from '../lib/content';
import { useCopy } from '../lib/useCopy';

interface CommandSearchProps {
  open: boolean;
  onClose: () => void;
  onSelectProject: (slug: string, tab?: 'overview' | 'prompts' | 'tech' | 'source') => void;
  onSelectDoc: (slug: string) => void;
  onFocusCard: (card: PromptCard) => void;
}

export function CommandSearch({
  open,
  onClose,
  onSelectProject,
  onSelectDoc,
  onFocusCard,
}: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { copiedId, copy } = useCopy();

  useEffect(() => {
    if (open) {
      setQuery('');
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const { matchedProjects, matchedCards, matchedNotes, matchedRepos } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        matchedProjects: projects,
        matchedCards: allPromptCards.slice(0, 6),
        matchedNotes: allNotes,
        matchedRepos: allRepos,
      };
    }

    return {
      matchedProjects: projects.filter((p) => p.searchText.includes(q)),
      matchedCards: allPromptCards.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.promptSubtitle ?? '').toLowerCase().includes(q) ||
          (c.stage ?? '').toLowerCase().includes(q) ||
          c.rawPrompt.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      ),
      matchedNotes: allNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subtitle.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      ),
      matchedRepos: allRepos.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      ),
    };
  }, [query]);

  if (!open) return null;

  const empty =
    matchedProjects.length === 0 &&
    matchedCards.length === 0 &&
    matchedNotes.length === 0 &&
    matchedRepos.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-[9vh] backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="animate-dropbox-in w-full max-w-2xl overflow-hidden border-2 border-[var(--ink-base)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--blueprint-line)] px-5 py-4">
          <Search className="h-4 w-4 shrink-0 text-[var(--brand-blue)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索项目、Prompt 卡片、技术拆解或开源仓库（如 绿野晚霞、雨过山寺、Kuwahara、水彩）..."
            className="w-full bg-transparent text-sm text-[var(--ink-base)] placeholder:text-[var(--ink-muted)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink-base)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="border border-[var(--hairline-strong)] px-1.5 py-0.5 font-mono-tech text-[10px] text-[var(--ink-muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[64vh] overflow-y-auto p-3">
          {empty ? (
            <div className="py-12 text-center">
              <p className="font-display text-lg font-bold text-[var(--ink-base)]">
                未找到包含「{query}」的记录
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                试试搜索项目名、技术词或仓库名
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 1. PROJECTS */}
              {matchedProjects.length > 0 && (
                <div>
                  <div className="mb-1.5 px-2.5 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                    PROJECTS · 核心项目 ({matchedProjects.length})
                  </div>
                  <div className="space-y-1">
                    {matchedProjects.map((project) => (
                      <button
                        key={project.slug}
                        onClick={() => {
                          onSelectProject(project.slug, 'overview');
                          onClose();
                        }}
                        className="group flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-subtle)]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#2B4464] text-white">
                            <FolderKanban className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono-tech text-[10px] font-bold text-[var(--brand-blue)]">
                                P{project.number}
                              </span>
                              <span className="truncate font-display text-sm font-bold text-[var(--ink-base)]">
                                {project.title}
                              </span>
                            </div>
                            <p className="truncate text-xs text-[var(--ink-secondary)]">
                              {project.subtitle}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--ink-muted)] group-hover:text-[var(--brand-blue)]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. PROMPT CARDS */}
              {matchedCards.length > 0 && (
                <div>
                  <div className="mb-1.5 px-2.5 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                    PROMPT CARDS · 精炼卡片 ({matchedCards.length})
                  </div>
                  <div className="space-y-1">
                    {matchedCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 transition-colors hover:bg-[var(--bg-subtle)]"
                      >
                        <button
                          onClick={() => {
                            onFocusCard(card);
                            onClose();
                          }}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center font-mono-tech text-[11px] font-bold text-white"
                            style={{ backgroundColor: card.accentHex }}
                          >
                            #{card.number}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-display text-sm font-bold text-[var(--ink-base)]">
                                {card.title}
                              </span>
                              <span className="bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono-tech text-[10px] text-[var(--ink-secondary)]">
                                {card.ownerTitle}
                              </span>
                            </div>
                            <p className="truncate text-xs text-[var(--ink-secondary)]">
                              {card.promptSubtitle}
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() => copy(card.rawPrompt, card.id)}
                          className="flex shrink-0 items-center gap-1 bg-[var(--ink-base)] px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
                        >
                          {copiedId === card.id ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>复制</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. TECH NOTES */}
              {matchedNotes.length > 0 && (
                <div>
                  <div className="mb-1.5 px-2.5 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                    TECH NOTES · 技术拆解与笔记 ({matchedNotes.length})
                  </div>
                  <div className="space-y-1">
                    {matchedNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => {
                          if (note.source === 'project' && note.projectSlug) {
                            onSelectProject(note.projectSlug, 'tech');
                          } else if (note.docSlug) {
                            onSelectDoc(note.docSlug);
                          }
                          onClose();
                        }}
                        className="group flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-[var(--bg-subtle)]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#FA551E] text-white">
                            <FileText className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate font-display text-sm font-bold text-[var(--ink-base)]">
                              {note.title}
                            </span>
                            <span className="block truncate text-xs text-[var(--ink-secondary)]">
                              {note.projectTitle
                                ? `所属项目：${note.projectTitle}`
                                : note.subtitle}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--ink-muted)] group-hover:text-[var(--brand-blue)]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. REPOS */}
              {matchedRepos.length > 0 && (
                <div>
                  <div className="mb-1.5 px-2.5 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                    REPOSITORIES · 开源仓库 ({matchedRepos.length})
                  </div>
                  <div className="space-y-1">
                    {matchedRepos.map((repo) => (
                      <a
                        key={repo.id}
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-[var(--bg-subtle)]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#61082B] text-white">
                            <FolderGit2 className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate font-mono-tech text-xs font-bold text-[var(--ink-base)]">
                              {repo.repoSlug}
                            </span>
                            <span className="block truncate text-xs text-[var(--ink-secondary)]">
                              {repo.title}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--ink-muted)] group-hover:text-[var(--brand-blue)]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--hairline)] bg-[var(--bg-subtle)] px-5 py-2.5 font-mono-tech text-[10px] text-[var(--ink-muted)]">
          <span>PROJECTS · PROMPTS · NOTES · REPOS</span>
          <span>⌘K / CTRL+K</span>
        </div>
      </div>
    </div>
  );
}

import { ArrowUpRight, BookOpen, FolderKanban, Plus } from 'lucide-react';
import { allNotes, allPapers, allWorkflows } from '../lib/content';
import type { ProjectTab } from './ProjectView';

export type ArchiveHubKind = 'notes' | 'papers' | 'workflows';

interface NotesHubViewProps {
  kind: ArchiveHubKind;
  onOpenProject: (slug: string, tab?: ProjectTab) => void;
  onOpenDoc: (slug: string) => void;
  onOpenGuide: () => void;
}

const HUB_THEMES: Record<
  ArchiveHubKind,
  {
    bg: string;
    fg: string;
    sub: string;
    en: string;
    title: string;
    desc: string;
    folderHint: string;
  }
> = {
  notes: {
    bg: '#FA551E',
    fg: '#1E1919',
    sub: '#6B1506',
    en: 'TECHNICAL NOTES & BREAKDOWNS',
    title: '技术笔记与架构拆解',
    desc: '自动汇集各项目下的技术架构拆解（analysis.md）以及 content/notes/ 中的独立 AI 技术学习笔记。',
    folderHint: 'content/notes/ 或 content/projects/<slug>/analysis.md',
  },
  papers: {
    bg: '#FF8C19',
    fg: '#1E1919',
    sub: '#5C2704',
    en: 'RESEARCH PAPERS & READINGS',
    title: '论文拆解',
    desc: '用于系统沉淀前沿 AI / 图形学论文精读笔记、核心公式直觉与复现实验记录。',
    folderHint: 'content/papers/',
  },
  workflows: {
    bg: '#B4DC19',
    fg: '#1E1919',
    sub: '#24450A',
    en: 'AI AGENT WORKFLOWS & SOPS',
    title: 'AI 工作流',
    desc: '沉淀多步 Agent 编排流程、视频/代码自动化制作管线与可复用 SOP。',
    folderHint: 'content/workflows/',
  },
};

export function NotesHubView({
  kind,
  onOpenProject,
  onOpenDoc,
  onOpenGuide,
}: NotesHubViewProps) {
  const theme = HUB_THEMES[kind];

  const items =
    kind === 'notes'
      ? allNotes
      : (kind === 'papers' ? allPapers : allWorkflows).map((d) => ({
          id: d.slug,
          source: 'standalone' as const,
          title: d.title,
          subtitle: d.subtitle,
          date: d.date,
          tags: d.tags,
          readingMinutes: d.readingMinutes,
          docSlug: d.slug,
          projectSlug: undefined,
          projectTitle: undefined,
          projectNumber: undefined,
        }));

  return (
    <div className="animate-dropbox-in">
      <section style={{ backgroundColor: theme.bg, color: theme.fg }}>
        <div className="mx-auto max-w-[1400px] border-x border-black/10 px-5 pb-12 pt-10 sm:px-8 sm:pb-14">
          <div
            className="flex items-center gap-2 font-mono-tech text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ color: theme.sub }}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{theme.en}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            {theme.title}
            <span
              className="ml-3 font-mono-tech text-2xl font-normal sm:text-3xl"
              style={{ color: theme.sub }}
            >
              ({String(items.length).padStart(2, '0')})
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-85">
            {theme.desc}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          {items.length === 0 ? (
            <div className="border border-dashed border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-12 text-center">
              <p className="font-display text-xl font-bold text-[var(--ink-base)]">
                「{theme.title}」栏目已就绪，虚位以待
              </p>
              <p className="mt-2 text-xs text-[var(--ink-secondary)]">
                将你的 Markdown 笔记直接放入{' '}
                <code className="font-mono-tech text-[var(--brand-blue)]">
                  {theme.folderHint}
                </code>{' '}
                目录，系统会自动收录、生成目录大纲并进入全局检索。
              </p>
              <button
                onClick={onOpenGuide}
                className="mt-5 inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--ink-base)]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>查看 Markdown 归档模板</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[var(--hairline)] border-t-2 border-[var(--ink-base)]">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.source === 'project' && item.projectSlug) {
                      onOpenProject(item.projectSlug, 'tech');
                    } else if (item.docSlug) {
                      onOpenDoc(item.docSlug);
                    }
                  }}
                  className="group grid w-full grid-cols-1 items-center gap-3 py-5 text-left transition-all hover:bg-[var(--bg-subtle)] hover:px-3 md:grid-cols-12 md:gap-4"
                >
                  <div className="md:col-span-1">
                    <span className="inline-block bg-[var(--bg-subtle)] px-2 py-0.5 font-mono-tech text-xs font-bold text-[var(--ink-base)] group-hover:bg-[var(--brand-blue)] group-hover:text-white">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="md:col-span-6">
                    <div className="font-display text-lg font-bold text-[var(--ink-base)] group-hover:text-[var(--brand-blue)]">
                      {item.title}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-[var(--ink-secondary)]">
                      {item.subtitle}
                    </p>
                  </div>
                  <div className="md:col-span-3">
                    {item.projectTitle ? (
                      <span className="inline-flex items-center gap-1 bg-[#2B4464] px-2.5 py-1 font-mono-tech text-[10px] font-semibold text-white">
                        <FolderKanban className="h-3 w-3 text-[#82B8FF]" />
                        <span>
                          P{item.projectNumber} · {item.projectTitle}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-block border border-[var(--hairline-strong)] px-2.5 py-0.5 font-mono-tech text-[10px] text-[var(--ink-secondary)]">
                        独立笔记
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 md:col-span-2 md:justify-end">
                    <span className="font-mono-tech text-xs text-[var(--ink-muted)]">
                      {item.readingMinutes} min · {item.date}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--ink-muted)] group-hover:text-[var(--brand-blue)]" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

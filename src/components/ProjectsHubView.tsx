import { useMemo, useState } from 'react';
import { FolderKanban } from 'lucide-react';
import { projects, allTags } from '../lib/content';
import { ProjectCard } from './ProjectCard';
import type { ProjectTab } from './ProjectView';

interface ProjectsHubViewProps {
  onOpenProject: (slug: string, tab?: ProjectTab) => void;
  onOpenGuide: () => void;
}

export function ProjectsHubView({
  onOpenProject,
  onOpenGuide,
}: ProjectsHubViewProps) {
  const [selectedTag, setSelectedTag] = useState<string>('全部');

  const filteredProjects = useMemo(() => {
    if (selectedTag === '全部') return projects;
    return projects.filter((p) => p.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <div className="animate-dropbox-in">
      <section className="bg-[#2B4464] text-white">
        <div className="mx-auto max-w-[1400px] border-x border-white/15 px-5 pb-12 pt-10 sm:px-8 sm:pb-14">
          <div className="flex items-center gap-2 font-mono-tech text-[11px] font-semibold uppercase tracking-[0.16em] text-[#82B8FF]">
            <FolderKanban className="h-3.5 w-3.5" />
            <span>PROJECTS INDEX · 项目总览主轴</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
            全部项目作品集
            <span className="ml-3 font-mono-tech text-2xl font-normal text-[#82B8FF] sm:text-3xl">
              ({String(projects.length).padStart(2, '0')})
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
            每个项目均拥有统一的 4 层档案结构：<strong>项目概览与 3D 体验</strong>、<strong>Prompt 卡片与模板</strong>、<strong>技术拆解与实验</strong>、<strong>源码文件索引</strong>。点击任意项目，入口逻辑完全一致。
          </p>

          <div className="mt-7 flex flex-wrap gap-1.5">
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
                {tag === '全部' ? '全部项目' : `#${tag}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                variant="light"
                onOpenProject={onOpenProject}
              />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 border border-dashed border-[var(--blueprint-line-strong)] bg-[var(--bg-subtle)] p-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-sm font-bold text-[var(--ink-base)]">
                新增下一个项目？
              </p>
              <p className="mt-0.5 text-xs text-[var(--ink-secondary)]">
                在 <code className="font-mono-tech text-[var(--brand-blue)]">content/projects/你的项目名/</code> 下创建 <code className="font-mono-tech">project.md</code>（以及可选的 <code className="font-mono-tech">prompts.md</code> / <code className="font-mono-tech">analysis.md</code>）即可自动收录。
              </p>
            </div>
            <button
              onClick={onOpenGuide}
              className="shrink-0 bg-[var(--ink-base)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--brand-blue)]"
            >
              查看项目目录规范 →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

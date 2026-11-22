import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  BookOpen,
  FolderGit2,
  Play,
  Sliders,
} from 'lucide-react';
import type { ProjectRecord } from '../lib/content';

interface ProjectCardProps {
  project: ProjectRecord;
  variant?: 'dark' | 'light';
  onOpenProject: (
    slug: string,
    tab?: 'overview' | 'prompts' | 'tech' | 'source'
  ) => void;
}

export function ProjectCard({
  project,
  variant = 'light',
  onOpenProject,
}: ProjectCardProps) {
  const isDark = variant === 'dark';
  const totalSourceFiles = project.sourceMap.reduce(
    (sum, s) => sum + s.files.length,
    0
  );
  const p0 = project.palette[0] || '#2B4464';
  const p1 = project.palette[1] || '#FA551E';
  const p2 = project.palette[2] || '#FAD24B';

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden border transition-all duration-300 ease-dropbox ${
        isDark
          ? 'border-white/15 bg-white/[0.03] text-white hover:border-white/50'
          : 'border-[var(--hairline-strong)] bg-white text-[var(--ink-base)] hover:border-[var(--ink-base)]'
      }`}
    >
      {/* Unified Visual Cover Plate */}
      <button
        onClick={() => onOpenProject(project.slug, 'overview')}
        className="relative block aspect-[16/9] w-full overflow-hidden border-b border-white/10 text-left focus:outline-none"
      >
        {project.preview ? (
          <img
            src={project.preview}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-dropbox group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${p0} 0%, #1E1919 65%, ${p1} 100%)`,
            }}
          >
            <svg
              viewBox="0 0 640 360"
              className="h-full w-full opacity-40 transition-transform duration-500 ease-dropbox group-hover:scale-[1.04]"
              fill="none"
            >
              <path
                d="M0 280 Q 160 190 320 240 T 640 210 L 640 360 L 0 360 Z"
                fill={p2}
                fillOpacity="0.38"
              />
              <path
                d="M170 215 L320 118 L470 215"
                stroke="#F6F1E6"
                strokeWidth="3"
              />
              <path
                d="M210 215 H430 V265 H210 Z"
                stroke="#F6F1E6"
                strokeWidth="2"
              />
              <circle
                cx="495"
                cy="95"
                r="34"
                stroke="#F6F1E6"
                strokeWidth="2"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <span className="bg-[var(--brand-blue)] px-2.5 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-white">
            PROJECT P{project.number}
          </span>
          <span className="bg-black/55 px-2 py-0.5 font-mono-tech text-[10px] text-white/90 backdrop-blur-xs">
            {project.date}
          </span>
        </div>

        <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2">
          <div>
            <span className="font-mono-tech text-[10px] uppercase tracking-[0.14em] text-[#FAD24B]">
              {project.demoTag || 'INTERACTIVE PROJECT'}
            </span>
            <h3 className="mt-0.5 font-display text-2xl font-bold text-white">
              {project.title}
            </h3>
          </div>
          <div className="flex gap-1">
            {project.palette.map((hex) => (
              <span
                key={hex}
                className="h-3 w-3 border border-white/35"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      </button>

      {/* Uniform Body */}
      <div className="flex flex-1 flex-col p-6">
        <p
          className={`text-xs font-medium ${
            isDark ? 'text-white/80' : 'text-[var(--ink-base)]'
          }`}
        >
          {project.subtitle}
        </p>
        <p
          className={`mt-2.5 line-clamp-3 text-xs leading-relaxed ${
            isDark ? 'text-white/60' : 'text-[var(--ink-secondary)]'
          }`}
        >
          {project.summary}
        </p>

        {/* Uniform Included-Asset Module Badges */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.demo && (
            <span className="inline-flex items-center gap-1 bg-[#3DD6F5] px-2 py-1 font-mono-tech text-[10px] font-bold text-[#1E1919]">
              <Play className="h-2.5 w-2.5 fill-current" />
              <span>实时 3D 体验</span>
            </span>
          )}
          {project.promptCards.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-[#FAD24B] px-2 py-1 font-mono-tech text-[10px] font-bold text-[#1E1919]">
              <Layers className="h-2.5 w-2.5" />
              <span>{project.promptCards.length} 张 Prompt 卡</span>
            </span>
          )}
          {(project.analysisHtml || project.specimens) && (
            <span className="inline-flex items-center gap-1 bg-[#FA551E] px-2 py-1 font-mono-tech text-[10px] font-bold text-white">
              {project.analysisHtml ? (
                <BookOpen className="h-2.5 w-2.5" />
              ) : (
                <Sliders className="h-2.5 w-2.5" />
              )}
              <span>{project.analysisHtml ? '技术拆解' : '交互实验室'}</span>
            </span>
          )}
          {project.repo && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 font-mono-tech text-[10px] font-bold ${
                isDark
                  ? 'bg-white/15 text-white'
                  : 'bg-[#2B4464] text-white'
              }`}
            >
              <FolderGit2 className="h-2.5 w-2.5" />
              <span>{totalSourceFiles} 源码文件</span>
            </span>
          )}
        </div>
      </div>

      {/* Unified Action Bar */}
      <div
        className={`mt-auto flex flex-wrap items-center justify-between gap-2 border-t px-6 py-4 ${
          isDark
            ? 'border-white/12 bg-white/[0.02]'
            : 'border-[var(--hairline)] bg-[var(--bg-subtle)]'
        }`}
      >
        <button
          onClick={() => onOpenProject(project.slug, 'overview')}
          className="group/btn inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--ink-base)] hover:text-white"
        >
          <span>进入项目档案</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </button>

        <div className="flex items-center gap-2">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1 border px-3 py-1.5 font-mono-tech text-[11px] font-semibold transition-colors ${
                isDark
                  ? 'border-white/25 text-white/85 hover:border-white hover:text-white'
                  : 'border-[var(--hairline-strong)] bg-white text-[var(--ink-base)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]'
              }`}
            >
              <span>3D</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1 border px-3 py-1.5 font-mono-tech text-[11px] font-semibold transition-colors ${
                isDark
                  ? 'border-white/25 text-white/85 hover:border-white hover:text-white'
                  : 'border-[var(--hairline-strong)] bg-white text-[var(--ink-base)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]'
              }`}
            >
              <span>GitHub</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

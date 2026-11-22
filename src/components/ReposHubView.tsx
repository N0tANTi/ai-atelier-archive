import {
  FolderGit2,
  ArrowUpRight,
  Copy,
  Check,
  FileCode2,
  Play,
  FolderKanban,
} from 'lucide-react';
import { allRepos } from '../lib/content';
import { useCopy } from '../lib/useCopy';
import type { ProjectTab } from './ProjectView';

interface ReposHubViewProps {
  onOpenProject: (slug: string, tab?: ProjectTab) => void;
}

export function ReposHubView({ onOpenProject }: ReposHubViewProps) {
  const { copiedId, copy } = useCopy();

  return (
    <div className="animate-dropbox-in">
      <section className="bg-[#61082B] text-white">
        <div className="mx-auto max-w-[1400px] border-x border-white/15 px-5 pb-12 pt-10 sm:px-8 sm:pb-14">
          <div className="flex items-center gap-2 font-mono-tech text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF9EC7]">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>OPEN SOURCE REPOSITORIES · 全局开源仓库索引</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
            开源仓库合集
            <span className="ml-3 font-mono-tech text-2xl font-normal text-[#FF9EC7] sm:text-3xl">
              ({String(allRepos.length).padStart(2, '0')})
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
            统一索引本档案库关联的全部 GitHub 开源仓库（含各个 3D 交互项目及本站主仓库）。支持一键复制 Clone 命令、直达源码目录或返回所属项目详情页。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] space-y-6 border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          {allRepos.map((repo, idx) => {
            const cloneCmd = `git clone ${repo.repoUrl}.git`;
            const copied = copiedId === repo.id;
            return (
              <article
                key={repo.id}
                className="border border-[var(--hairline-strong)] bg-white transition-colors hover:border-[var(--ink-base)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Left Info */}
                  <div className="p-6 sm:p-7 lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[var(--brand-blue)] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-white">
                        REPO 0{idx + 1}
                      </span>
                      <span className="bg-[#FAD24B] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[#1E1919]">
                        {repo.license}
                      </span>
                      {repo.isPlatform ? (
                        <span className="border border-[var(--hairline-strong)] px-2 py-0.5 font-mono-tech text-[10px] text-[var(--ink-secondary)]">
                          PLATFORM SITE
                        </span>
                      ) : (
                        <span className="border border-[var(--hairline-strong)] px-2 py-0.5 font-mono-tech text-[10px] text-[var(--ink-secondary)]">
                          {repo.moduleCount} MODULES · {repo.fileCount} INDEXED FILES
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-baseline gap-3">
                      <h2 className="font-display text-2xl font-bold text-[var(--ink-base)]">
                        {repo.title}
                      </h2>
                      <span className="font-mono-tech text-xs font-medium text-[var(--brand-blue)]">
                        {repo.repoSlug}
                      </span>
                    </div>

                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink-secondary)]">
                      {repo.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {repo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-[var(--hairline)] bg-[var(--bg-subtle)] px-2 py-0.5 font-mono-tech text-[10px] text-[var(--ink-secondary)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col justify-between gap-4 border-t border-[var(--hairline)] bg-[var(--bg-subtle)] p-6 lg:col-span-4 lg:border-l lg:border-t-0">
                    <div>
                      <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                        CLONE COMMAND
                      </span>
                      <div className="mt-2 flex items-center justify-between gap-2 bg-[var(--bg-dark-band)] px-3 py-2.5">
                        <code className="truncate font-mono-tech text-[11px] text-[#3DD6F5]">
                          {cloneCmd}
                        </code>
                        <button
                          onClick={() => copy(cloneCmd, repo.id)}
                          className="shrink-0 bg-white/10 p-1.5 text-white transition-colors hover:bg-[var(--brand-blue)]"
                          title="复制 git clone 命令"
                        >
                          {copied ? (
                            <Check className="h-3.5 w-3.5 text-[#B4DC19]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 bg-[var(--ink-base)] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
                      >
                        <FileCode2 className="h-3.5 w-3.5" />
                        <span>GitHub</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>

                      {repo.projectSlug && (
                        <button
                          onClick={() =>
                            onOpenProject(repo.projectSlug!, 'source')
                          }
                          className="inline-flex items-center gap-1.5 border border-[var(--ink-base)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:bg-[var(--brand-blue)] hover:border-[var(--brand-blue)] hover:text-white"
                        >
                          <FolderKanban className="h-3.5 w-3.5" />
                          <span>源码索引</span>
                        </button>
                      )}

                      {repo.demoUrl && (
                        <a
                          href={repo.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 bg-[#3DD6F5] px-3 py-2 text-xs font-bold text-[#1E1919] transition-colors hover:bg-[#FAD24B]"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>在线</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

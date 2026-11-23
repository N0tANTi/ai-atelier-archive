import { useState } from 'react';
import {
  ArrowUpRight,
  Copy,
  Check,
  Play,
  X,
  FolderGit2,
  FileCode2,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import type { ProjectRecord } from '../lib/content';
import { useCopy } from '../lib/useCopy';

interface SourceCodePanelProps {
  project: ProjectRecord;
  mode?: 'full' | 'demo-only' | 'source-only';
}

const STAGE_BADGE_COLORS = [
  '#2B4464',
  '#00A5CF',
  '#D99B00',
  '#6E9400',
  '#7D4FD1',
  '#FA551E',
];

export function SourceCodePanel({
  project,
  mode = 'full',
}: SourceCodePanelProps) {
  const [liveDemoOpen, setLiveDemoOpen] = useState(false);
  const { copiedId, copy } = useCopy();

  const repoUrl = project.repo;
  const demoUrl = project.demo;
  const videoUrl = project.video;
  const repoSlug = repoUrl
    ? repoUrl.replace(/^https?:\/\/github\.com\//i, '')
    : '';
  const repoName = repoSlug.split('/')[1] || project.slug;
  const cloneCommand =
    project.runCommand ||
    (repoUrl
      ? `git clone ${repoUrl}.git && cd ${repoName} && npm ci && npm run build && npm run serve`
      : '');

  const p0 = project.palette[0] || '#2B4464';
  const p1 = project.palette[1] || '#FA551E';
  const p2 = project.palette[2] || '#FAD24B';

  const mediaUrl = demoUrl || videoUrl;

  const demoCanvasBlock = (
    <div className="overflow-hidden border border-[var(--ink-base)] bg-[var(--bg-dark-band)] text-white">
      <div className="flex items-center justify-between border-b border-white/12 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#B4DC19]" />
          <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3DD6F5]">
            {project.demoTag || 'INTERACTIVE PROJECT · THREE.JS WEBGL2'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {mediaUrl && (
            <a
              href={mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono-tech text-[10px] font-semibold text-white/75 transition-colors hover:text-[#FAD24B]"
            >
              <span>{demoUrl ? '全屏新窗口打开' : '下载 / 新窗口观看'}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {liveDemoOpen && (
            <button
              onClick={() => setLiveDemoOpen(false)}
              className="inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 font-mono-tech text-[10px] text-white hover:bg-[#FA551E]"
            >
              <X className="h-3 w-3" />
              <span>{demoUrl ? '关闭画布' : '关闭播放'}</span>
            </button>
          )}
        </div>
      </div>

      {liveDemoOpen && demoUrl ? (
        <div>
          <div className="relative aspect-[16/10] w-full bg-black">
            <iframe
              src={demoUrl}
              title={`${project.title} Live 3D Demo`}
              className="h-full w-full border-0"
              allow="fullscreen"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/12 bg-black/40 px-5 py-2.5 font-mono-tech text-[10px] text-white/70">
            <span>
              操作提示：{project.demoControls || '拖动环视 · 滚轮缩放'}
            </span>
            <span className="text-[#B4DC19]">HOSTED ON GITHUB PAGES</span>
          </div>
        </div>
      ) : liveDemoOpen && videoUrl ? (
        <div>
          <div className="relative aspect-[16/9] w-full bg-black">
            <video
              src={videoUrl}
              poster={project.preview}
              controls
              autoPlay
              playsInline
              className="h-full w-full"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/12 bg-black/40 px-5 py-2.5 font-mono-tech text-[10px] text-white/70">
            <span>
              {project.demoControls || '1080p 30fps · 含原创配乐'}
            </span>
            <span className="text-[#B4DC19]">HOSTED ON GITHUB RELEASES</span>
          </div>
        </div>
      ) : (
        <div className="group relative aspect-[16/10] w-full overflow-hidden bg-[#161414]">
          {project.preview ? (
            <img
              src={project.preview}
              alt={project.title}
              className="h-full w-full object-cover opacity-85 transition-transform duration-700 ease-dropbox group-hover:scale-[1.03]"
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
                className="h-full w-full opacity-35"
                fill="none"
              >
                <path
                  d="M0 280 Q 160 190 320 240 T 640 210 L 640 360 L 0 360 Z"
                  fill={p2}
                  fillOpacity="0.35"
                />
                <path
                  d="M170 215 L320 120 L470 215"
                  stroke="#F6F1E6"
                  strokeWidth="3"
                />
                <path
                  d="M210 215 H430 V265 H210 Z"
                  stroke="#F6F1E6"
                  strokeWidth="2"
                />
                <line
                  x1="60"
                  y1="265"
                  x2="580"
                  y2="265"
                  stroke="#F6F1E6"
                  strokeWidth="2"
                  strokeDasharray="6 6"
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <span className="bg-black/55 px-2.5 py-1 font-mono-tech text-[10px] text-white backdrop-blur-xs">
                {demoUrl
                  ? 'CLICK TO LAUNCH INTERACTIVE 3D'
                  : videoUrl
                    ? 'CLICK TO PLAY 1080P FILM'
                    : 'OPEN SOURCE PROJECT'}
              </span>
              <div className="flex items-center gap-1.5">
                {project.palette.map((hex) => (
                  <span
                    key={hex}
                    title={hex}
                    className="h-3 w-3 border border-white/30"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-lg">
                <p className="font-display text-2xl font-bold text-white">
                  {project.title}
                </p>
                <p className="mt-1 text-xs text-white/80">
                  {project.demoControls || project.subtitle}
                </p>
              </div>

              {mediaUrl && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setLiveDemoOpen(true)}
                    className="inline-flex items-center gap-2 bg-[var(--brand-blue)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#1E1919]"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{demoUrl ? '站内直接运行 3D' : '站内播放 1080p 成片'}</span>
                  </button>
                  <a
                    href={mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 border border-white/40 bg-black/45 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white hover:text-[#1E1919]"
                  >
                    <span>{demoUrl ? '全屏体验' : '下载成片'}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (mode === 'demo-only') {
    return demoCanvasBlock;
  }

  return (
    <div className="space-y-8">
      {mode === 'full' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">{demoCanvasBlock}</div>
          <div className="flex flex-col justify-between border border-[var(--blueprint-line-strong)] bg-white lg:col-span-5">
            {renderRepoCard(
              project,
              repoSlug,
              repoUrl,
              cloneCommand,
              copiedId,
              copy
            )}
          </div>
        </div>
      ) : (
        <div className="border border-[var(--blueprint-line-strong)] bg-white">
          {renderRepoCard(
            project,
            repoSlug,
            repoUrl,
            cloneCommand,
            copiedId,
            copy
          )}
        </div>
      )}

      {/* Module / Stage -> Source File Matrix */}
      {project.sourceMap.length > 0 && repoUrl && (
        <div className="border border-[var(--blueprint-line-strong)] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--blueprint-line)] bg-[var(--bg-subtle)] px-6 py-4">
            <div>
              <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                ARCHITECTURE ↔ SOURCE CODE MATRIX
              </span>
              <h3 className="mt-1 font-display text-lg font-bold text-[var(--ink-base)]">
                核心模块源码文件精准索引（点击直达 GitHub 对应文件）
              </h3>
            </div>
            <span className="font-mono-tech text-[11px] text-[var(--ink-muted)]">
              {project.sourceMap.reduce((sum, item) => sum + item.files.length, 0)}{' '}
              CORE FILES
            </span>
          </div>

          <div className="divide-y divide-[var(--hairline)]">
            {project.sourceMap.map((entry, idx) => {
              const badgeColor =
                STAGE_BADGE_COLORS[idx % STAGE_BADGE_COLORS.length];
              return (
                <div
                  key={entry.stage}
                  className="grid grid-cols-1 items-center gap-4 px-6 py-4 transition-colors hover:bg-[var(--bg-subtle)]/70 md:grid-cols-12"
                >
                  <div className="flex items-center gap-3 md:col-span-5">
                    <span
                      className="shrink-0 px-2.5 py-1 font-mono-tech text-[10px] font-bold uppercase text-white"
                      style={{ backgroundColor: badgeColor }}
                    >
                      {entry.stage}
                    </span>
                    <span className="text-sm font-semibold text-[var(--ink-base)]">
                      {entry.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 md:col-span-7 md:justify-end">
                    {entry.files.map((file) => (
                      <a
                        key={file}
                        href={`${repoUrl}/blob/main/${file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1.5 border border-[var(--hairline-strong)] bg-white px-3 py-1.5 font-mono-tech text-[11px] font-medium text-[var(--ink-base)] transition-colors hover:border-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white"
                      >
                        <FileCode2 className="h-3 w-3 text-[var(--brand-blue)] group-hover:text-white" />
                        <span>{file}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function renderRepoCard(
  project: ProjectRecord,
  repoSlug: string,
  repoUrl: string | undefined,
  cloneCommand: string,
  copiedId: string | null,
  copy: (text: string, id?: string) => Promise<boolean>
) {
  return (
    <>
      <div>
        <div className="bg-[#2B4464] p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[#82B8FF]">
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>LINKED GITHUB REPOSITORY</span>
            </span>
            {project.license && (
              <span className="bg-[#FAD24B] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[#1E1919]">
                {project.license}
              </span>
            )}
          </div>

          <h3 className="mt-3 break-all font-display text-2xl font-bold text-white">
            {repoSlug || 'Source Repository'}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-white/80">
            {project.summary}
          </p>
        </div>

        {cloneCommand && (
          <div className="border-b border-[var(--hairline)] p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
                <Terminal className="h-3.5 w-3.5" />
                <span>LOCAL QUICK START</span>
              </span>
              <button
                onClick={() => copy(cloneCommand, `clone-${project.slug}`)}
                className="inline-flex items-center gap-1 bg-[var(--ink-base)] px-2.5 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
              >
                {copiedId === `clone-${project.slug}` ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>已复制命令</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>复制命令</span>
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto bg-[var(--bg-dark-band)] p-3.5 font-mono-tech text-[11px] leading-relaxed text-[#3DD6F5]">
              {cloneCommand}
            </pre>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 bg-[var(--bg-subtle)] p-5">
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 bg-[var(--brand-blue)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--ink-base)]"
          >
            <span>打开 GitHub 源码仓库</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
        {repoUrl && (
          <a
            href={`${repoUrl}/tree/main/${project.sourceMap[0]?.files[0]?.split('/')[0] || 'src'}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 border border-[var(--ink-base)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:bg-[var(--ink-base)] hover:text-white"
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>浏览 {project.sourceMap[0]?.files[0]?.split('/')[0] || 'src'}/</span>
          </a>
        )}
      </div>
    </>
  );
}

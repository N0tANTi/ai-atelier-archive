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
import type { ArchiveDoc } from '../lib/content';
import { useCopy } from '../lib/useCopy';

interface SourceCodePanelProps {
  doc: ArchiveDoc;
}

const STAGE_BADGE_COLORS = [
  '#2B4464',
  '#00A5CF',
  '#D99B00',
  '#6E9400',
  '#7D4FD1',
  '#FA551E',
];

export function SourceCodePanel({ doc }: SourceCodePanelProps) {
  const [liveDemoOpen, setLiveDemoOpen] = useState(false);
  const { copiedId, copy } = useCopy();

  const repoUrl = doc.repo;
  const demoUrl = doc.demo;
  const repoSlug = repoUrl
    ? repoUrl.replace(/^https?:\/\/github\.com\//i, '')
    : '';
  const cloneCommand = repoUrl
    ? `git clone ${repoUrl}.git && cd ${repoSlug.split('/')[1] || 'repo'} && npm install && npm run dev`
    : '';

  return (
    <div className="space-y-8">
      {/* Top Split: Live 3D Interactive Demo + GitHub Repo Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 Cols: Real Rendered Sunset Preview / Click-to-Launch Embedded Live WebGL2 3D */}
        <div className="overflow-hidden border border-[var(--ink-base)] bg-[var(--bg-dark-band)] text-white lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/12 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#B4DC19]" />
              <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3DD6F5]">
                LIVE 3D RUNTIME · THREE.JS WEBGL2
              </span>
            </div>
            <div className="flex items-center gap-2">
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono-tech text-[10px] font-semibold text-white/75 transition-colors hover:text-[#FAD24B]"
                >
                  <span>全屏新窗口打开</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {liveDemoOpen && (
                <button
                  onClick={() => setLiveDemoOpen(false)}
                  className="inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 font-mono-tech text-[10px] text-white hover:bg-[#FA551E]"
                >
                  <X className="h-3 w-3" />
                  <span>关闭画布</span>
                </button>
              )}
            </div>
          </div>

          {liveDemoOpen && demoUrl ? (
            <div>
              <div className="relative aspect-[16/10] w-full bg-black">
                <iframe
                  src={demoUrl}
                  title={`${doc.title} Live 3D Demo`}
                  className="h-full w-full border-0"
                  allow="fullscreen"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/12 bg-black/40 px-5 py-2.5 font-mono-tech text-[10px] text-white/70">
                <span>操作提示：点击画面开始漫游 · WASD 移动 · T 切换时间色板 · V 切换视角</span>
                <span className="text-[#B4DC19]">HOSTED ON GITHUB PAGES</span>
              </div>
            </div>
          ) : (
            <div className="group relative aspect-[16/10] w-full overflow-hidden bg-[#161414]">
              {doc.preview && (
                <img
                  src={doc.preview}
                  alt={doc.title}
                  className="h-full w-full object-cover opacity-85 transition-transform duration-700 ease-dropbox group-hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex justify-between">
                  <span className="bg-black/55 px-2.5 py-1 font-mono-tech text-[10px] text-white backdrop-blur-xs">
                    CLICK TO LAUNCH INTERACTIVE 3D
                  </span>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-bold text-white">
                      绿野晚霞 · 实时 3D 探索场景
                    </p>
                    <p className="mt-1 text-xs text-white/80">
                      内置 WASD 漫游、T 键切换 4 套时间色板与 V 键第一人称视角
                    </p>
                  </div>

                  {demoUrl && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setLiveDemoOpen(true)}
                        className="inline-flex items-center gap-2 bg-[var(--brand-blue)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#1E1919]"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>站内直接运行 3D</span>
                      </button>
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 border border-white/40 bg-black/45 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white hover:text-[#1E1919]"
                      >
                        <span>全屏体验</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: GitHub Source Repository Card */}
        <div className="flex flex-col justify-between border border-[var(--blueprint-line-strong)] bg-white lg:col-span-5">
          <div>
            <div className="bg-[#2B4464] p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-[0.14em] text-[#82B8FF]">
                  <FolderGit2 className="h-3.5 w-3.5" />
                  <span>LINKED GITHUB REPOSITORY</span>
                </span>
                {doc.license && (
                  <span className="bg-[#FAD24B] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[#1E1919]">
                    {doc.license}
                  </span>
                )}
              </div>

              <h3 className="mt-3 break-all font-display text-2xl font-bold text-white">
                {repoSlug || 'Source Repository'}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                独立托管的完整工程源码仓库，包含 Three.js 着色器管线、程序化地形笔触、LOD 草海、体积云烘焙、角色布料物理与后处理源码。
              </p>
            </div>

            {/* Clone & Run Snippet */}
            {cloneCommand && (
              <div className="border-b border-[var(--hairline)] p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>LOCAL QUICK START</span>
                  </span>
                  <button
                    onClick={() => copy(cloneCommand, 'clone-cmd')}
                    className="inline-flex items-center gap-1 bg-[var(--ink-base)] px-2.5 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-[var(--brand-blue)]"
                  >
                    {copiedId === 'clone-cmd' ? (
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
                href={`${repoUrl}/tree/main/src`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 border border-[var(--ink-base)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--ink-base)] transition-colors hover:bg-[var(--ink-base)] hover:text-white"
              >
                <FileCode2 className="h-3.5 w-3.5" />
                <span>浏览 src/</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stage 1 -> Stage 6 Prompt-to-Source File Matrix */}
      {doc.sourceMap.length > 0 && repoUrl && (
        <div className="border border-[var(--blueprint-line-strong)] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--blueprint-line)] bg-[var(--bg-subtle)] px-6 py-4">
            <div>
              <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                PROMPT ↔ SOURCE CODE MATRIX
              </span>
              <h3 className="mt-1 font-display text-lg font-bold text-[var(--ink-base)]">
                Stage 1 → Stage 6 源码文件精准索引（点击直达 GitHub 对应文件）
              </h3>
            </div>
            <span className="font-mono-tech text-[11px] text-[var(--ink-muted)]">
              {doc.sourceMap.reduce((sum, item) => sum + item.files.length, 0)} CORE MODULES
            </span>
          </div>

          <div className="divide-y divide-[var(--hairline)]">
            {doc.sourceMap.map((entry, idx) => {
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

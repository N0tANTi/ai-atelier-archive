import { Copy, Check, FolderKanban, FileText } from 'lucide-react';
import { useCopy } from '../lib/useCopy';

const PROJECT_TEMPLATE = `---
id: "03"
slug: "my-new-ai-project"
title: "新项目名称"
subtitle: "一句话说明项目的技术栈与核心亮点"
date: "2026-11-23"
tags:
  - "Three.js"
  - "AI工程"
summary: "用于首页与项目总览卡片展示的精炼介绍。"
featured: true
repo: "https://github.com/N0tANTi/your-repo"
demo: "https://n0tanti.github.io/your-repo/"
demoTag: "LIVE 3D RUNTIME · WEBGL2"
demoControls: "操作提示：鼠标拖动环视 · 滚轮缩放"
license: "MIT"
palette:
  - "#2B4464"
  - "#0061FF"
  - "#FAD24B"
  - "#1E1919"
sourceMap:
  - "Module 01|核心模块说明|src/main.js, src/shader.js"
---

这里写项目的背景定位与核心亮点概览（显示在「01 / 项目概览」中）。
同目录下可选放置：
- prompts.md   → 自动点亮「02 / Prompt 卡片与模板」并汇总到全局 Prompt 卡片库
- analysis.md  → 自动点亮「03 / 技术拆解与实验」并汇总到全局技术笔记`;

const STANDALONE_NOTE_TEMPLATE = `---
title: "独立 AI 技术笔记 / 论文拆解标题"
subtitle: "一句话说明核心主题"
date: "2026-11-23"
tags:
  - "LLM"
  - "Agent"
summary: "用于在对应栏目列表展示的摘要。"
---

## 一、 核心直觉

这里直接写标准 Markdown 正文、代码块、表格与引用，系统会自动生成右侧目录大纲（TOC）与阅读时间。`;

export function GuideView() {
  const { copiedId, copy } = useCopy();

  const folders = [
    {
      path: 'content/projects/<slug>/',
      cat: '核心项目主轴（推荐）',
      bg: '#2B4464',
      fg: '#FFFFFF',
      desc: '放 project.md（必选）+ prompts.md（可选）+ analysis.md（可选）。系统自动生成统一 4-Tab 项目页，并把它的 Demo、Prompt 卡、技术拆解与 GitHub 仓库自动分发到全局 8 格展厅。',
    },
    {
      path: 'content/notes/',
      cat: '独立技术笔记',
      bg: '#FA551E',
      fg: '#1E1919',
      desc: '不依附于单个项目的通用 AI / 图形学笔记，自动汇入「技术笔记」栏目。',
    },
    {
      path: 'content/papers/',
      cat: '论文拆解',
      bg: '#FF8C19',
      fg: '#1E1919',
      desc: '论文精读笔记、核心公式直觉与实验对比，自动汇入「论文拆解」栏目。',
    },
    {
      path: 'content/workflows/',
      cat: 'AI 工作流',
      bg: '#B4DC19',
      fg: '#1E1919',
      desc: 'Agent 编排流程、自动化脚本与可复用 SOP，自动汇入「AI 工作流」栏目。',
    },
  ];

  return (
    <div className="animate-dropbox-in">
      <section className="bg-[#C8AFF0] text-[#1E1919]">
        <div className="mx-auto max-w-[1400px] border-x border-black/10 px-5 pb-12 pt-10 sm:px-8 sm:pb-14">
          <span className="font-mono-tech text-[11px] font-bold uppercase tracking-[0.16em] text-[#441C78]">
            INFORMATION ARCHITECTURE · 项目为主轴 + 全局横向聚合
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-[#1E1919] sm:text-5xl">
            归档规范与扩展指南
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#1E1919]/80">
            全站采用<strong>「项目作纵向主轴 + 8 格作横向资源池」</strong>的 Markdown 驱动架构：把同一个项目的概览、Prompt 卡片、技术拆解与 GitHub 源码聚合在同一文件夹下，所有全局展厅自动同步更新。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] space-y-12 border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          <div>
            <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              STEP 01 · DIRECTORY SCHEMA
            </span>
            <h2 className="mt-1.5 font-display text-2xl font-bold text-[var(--ink-base)]">
              目录即结构（放入即自动收录）
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {folders.map((f) => (
                <div
                  key={f.path}
                  className="mosaic-tile p-6"
                  style={{ backgroundColor: f.bg, color: f.fg }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <code className="tile-label font-mono-tech text-sm font-bold">
                      {f.path}
                    </code>
                    <span
                      className="tile-meta px-2.5 py-0.5 font-mono-tech text-[10px] font-bold"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.14)',
                        color: f.fg,
                      }}
                    >
                      {f.cat}
                    </span>
                  </div>
                  <p className="tile-meta-muted mt-3 text-xs leading-relaxed opacity-90">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              STEP 02 · COPYABLE TEMPLATES
            </span>
            <h2 className="mt-1.5 font-display text-2xl font-bold text-[var(--ink-base)]">
              标准文件模板（一键复制）
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-[var(--bg-dark-band)] text-white">
                <div className="flex items-center justify-between border-b border-white/12 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-[#FAD24B]" />
                    <span className="font-display text-xs font-semibold text-white">
                      新项目主档案（content/projects/&lt;slug&gt;/project.md）
                    </span>
                  </div>
                  <button
                    onClick={() => copy(PROJECT_TEMPLATE, 'tpl-project')}
                    className="inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-3 py-1 text-[11px] font-semibold text-white hover:bg-white hover:text-[#1E1919]"
                  >
                    {copiedId === 'tpl-project' ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>复制模板</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto p-5 font-mono-tech text-[11.5px] leading-6 text-white/90">
                  {PROJECT_TEMPLATE}
                </pre>
              </div>

              <div className="bg-[var(--bg-dark-band)] text-white">
                <div className="flex items-center justify-between border-b border-white/12 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#3DD6F5]" />
                    <span className="font-display text-xs font-semibold text-white">
                      独立技术笔记 / 论文 / 工作流模板
                    </span>
                  </div>
                  <button
                    onClick={() => copy(STANDALONE_NOTE_TEMPLATE, 'tpl-note')}
                    className="inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-3 py-1 text-[11px] font-semibold text-white hover:bg-white hover:text-[#1E1919]"
                  >
                    {copiedId === 'tpl-note' ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>复制模板</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto p-5 font-mono-tech text-[11.5px] leading-6 text-white/90">
                  {STANDALONE_NOTE_TEMPLATE}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Copy, Check, Layers, FileText } from 'lucide-react';
import { useCopy } from '../lib/useCopy';

const PROMPT_DECK_TEMPLATE = `---
id: "02"
title: "你的新 Prompt 卡片集标题"
subtitle: "一句话说明这套 Prompt 解决的核心场景"
category: "Prompt 卡片集"
type: "prompt-deck"
date: "2026-11-22"
tags:
  - "Agent"
  - "Prompt工程"
summary: "用于在首页档案目录中展示的精炼摘要。"
---

## 一、 精炼 Prompt 卡片

### 卡片 #1｜角色与约束（Stage 1）
\`\`\`text
[PROMPT 01 · 核心设定]
1. 明确角色与输出边界
2. 给出结构化约束与禁止项
\`\`\`

## 二、 完整工程级 Prompt 模板

\`\`\`markdown
这里放完整的长 Prompt 模板...
\`\`\``;

const STUDY_NOTE_TEMPLATE = `---
id: "03"
title: "Transformer 注意力机制学习笔记"
subtitle: "从 Scaled Dot-Product 到 FlashAttention 的核心直觉"
category: "技术笔记"
type: "note"
date: "2026-11-22"
tags:
  - "LLM"
  - "架构原理"
summary: "梳理注意力计算的复杂度瓶颈、KV Cache 机制与工程优化要点。"
---

## 一、 核心直觉

这里直接写标准 Markdown 正文、代码块、表格与引用，系统会自动生成右侧大纲（TOC）与阅读时间。`;

export function GuideView() {
  const { copiedId, copy } = useCopy();

  const folders = [
    {
      path: 'content/prompts/',
      cat: 'Prompt 卡片集',
      bg: '#2B4464',
      fg: '#FFFFFF',
      sub: '#82B8FF',
      desc: '自动识别 ### 卡片 #N 与工程模板，渲染为双色卡片台 + 聚合进 Prompt 卡片库。',
    },
    {
      path: 'content/notes/',
      cat: '技术笔记',
      bg: '#FA551E',
      fg: '#1E1919',
      sub: '#6B1506',
      desc: '渲染为瑞士极简长文研习专刊，自动生成目录大纲（TOC）与代码高亮。',
    },
    {
      path: 'content/papers/',
      cat: '论文拆解',
      bg: '#FF8C19',
      fg: '#1E1919',
      sub: '#5C2704',
      desc: '用于沉淀论文精读笔记、复现要点与实验对比表格。',
    },
    {
      path: 'content/workflows/',
      cat: 'AI 工作流',
      bg: '#B4DC19',
      fg: '#1E1919',
      sub: '#24450A',
      desc: '收纳 Agent 编排流程、多步 SOP 与自动化脚本说明。',
    },
  ];

  return (
    <div className="animate-dropbox-in">
      <section className="bg-[#C8AFF0] text-[#1E1919]">
        <div className="mx-auto max-w-[1400px] border-x border-black/10 px-5 pb-12 pt-10 sm:px-8 sm:pb-14">
          <span className="font-mono-tech text-[11px] font-bold uppercase tracking-[0.16em] text-[#441C78]">
            MARKDOWN SCHEMA · 零配置内容扩展方案
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-[#1E1919] sm:text-5xl">
            归档规范与扩展指南
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#1E1919]/80">
            全站采用 <strong>Markdown-as-Database</strong> 架构。未来新增 10 份或 500 份 AI 学习资料，只需将{' '}
            <code className="bg-black/10 px-1.5 py-0.5 font-mono-tech font-semibold">.md</code>{' '}
            放进对应目录并推送至 GitHub，即可自动收录、归类、检索并部署上线。
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] space-y-12 border-x border-[var(--blueprint-line)] px-5 py-12 sm:px-8 sm:py-16">
          <div>
            <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              STEP 01 · DIRECTORY MAPPING
            </span>
            <h2 className="mt-1.5 font-display text-2xl font-bold text-[var(--ink-base)]">
              目录即分类（直接放入即可）
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
              推荐 Markdown 模板（一键复制）
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-[var(--bg-dark-band)] text-white">
                <div className="flex items-center justify-between border-b border-white/12 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#FAD24B]" />
                    <span className="font-display text-xs font-semibold text-white">
                      Prompt 卡片集模板
                    </span>
                  </div>
                  <button
                    onClick={() => copy(PROMPT_DECK_TEMPLATE, 'tpl-prompt')}
                    className="inline-flex items-center gap-1.5 bg-[var(--brand-blue)] px-3 py-1 text-[11px] font-semibold text-white hover:bg-white hover:text-[#1E1919]"
                  >
                    {copiedId === 'tpl-prompt' ? (
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
                  {PROMPT_DECK_TEMPLATE}
                </pre>
              </div>

              <div className="bg-[var(--bg-dark-band)] text-white">
                <div className="flex items-center justify-between border-b border-white/12 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#3DD6F5]" />
                    <span className="font-display text-xs font-semibold text-white">
                      技术笔记 / 论文拆解模板
                    </span>
                  </div>
                  <button
                    onClick={() => copy(STUDY_NOTE_TEMPLATE, 'tpl-note')}
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
                  {STUDY_NOTE_TEMPLATE}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Copy, Check, FolderTree, Sparkles, FileText, Layers } from 'lucide-react';
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
      desc: '自动识别 ### 卡片 #N 与工程模板，渲染为交互式卡片台 + 聚合进 Prompt 卡片库。',
    },
    {
      path: 'content/notes/',
      cat: '技术笔记',
      desc: '渲染为精排版长文研习专刊，自动生成目录大纲（TOC）与代码高亮。',
    },
    {
      path: 'content/papers/',
      cat: '论文拆解',
      desc: '用于沉淀论文精读笔记、复现要点与实验记录。',
    },
    {
      path: 'content/workflows/',
      cat: 'AI 工作流',
      desc: '收纳 Agent 编排流程、多步 SOP 与自动化脚本说明。',
    },
  ];

  return (
    <div className="animate-atelier-in">
      <section className="bg-atelier-grid border-b border-[var(--line-subtle)]">
        <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-10 sm:px-8 sm:pb-12">
          <div className="flex items-center gap-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            <FolderTree className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>CONTENT ARCHITECTURE · 零配置内容扩展方案</span>
          </div>
          <h1 className="mt-3 font-serif-cn text-3xl font-semibold text-[var(--ink-primary)] sm:text-5xl">
            归档指南与扩展规范
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-secondary)]">
            整座网站采用 <strong>Markdown-as-Database（文档即数据库）</strong> 架构。未来无论是新增
            10 份还是 500 份 AI 学习资料，都不需要改一行前端代码——直接把{' '}
            <code className="font-mono-tech text-[var(--accent)]">.md</code>{' '}
            文件放进对应目录，提交到 GitHub 即可自动收录、分类、检索与上线。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] space-y-12 px-5 py-12 sm:px-8 sm:py-16">
        {/* Directory Schema */}
        <div>
          <h2 className="font-serif-cn text-2xl font-semibold text-[var(--ink-primary)]">
            1. 目录即分类（推荐存放结构）
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {folders.map((f) => (
              <div
                key={f.path}
                className="rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface)] p-5"
              >
                <div className="flex items-center justify-between">
                  <code className="font-mono-tech text-sm font-semibold text-[var(--accent)]">
                    {f.path}
                  </code>
                  <span className="rounded-full border border-[var(--line-subtle)] bg-[var(--bg-canvas)] px-2.5 py-0.5 font-mono-tech text-[11px] text-[var(--ink-secondary)]">
                    {f.cat}
                  </span>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-[var(--ink-secondary)]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface-alt)]/60 p-4 text-xs leading-relaxed text-[var(--ink-secondary)]">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
            <span>
              <strong>免 Frontmatter 兼容：</strong>
              就算直接把一份没有任何头信息的原始 <code className="font-mono-tech">.md</code>{' '}
              文件丢进 <code className="font-mono-tech">content/</code>，解析引擎也会自动以文件名作为标题、按目录归类，并自动检测其中是否包含「卡片 #N」结构。
            </span>
          </div>
        </div>

        {/* Copyable Templates */}
        <div>
          <h2 className="font-serif-cn text-2xl font-semibold text-[var(--ink-primary)]">
            2. 推荐文档模板（一键复制）
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Template A */}
            <div className="overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-specimen)] text-[var(--ink-on-specimen)]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-xs font-medium text-white">
                    Prompt 卡片集模板
                  </span>
                </div>
                <button
                  onClick={() => copy(PROMPT_DECK_TEMPLATE, 'tpl-prompt')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] text-white hover:bg-white/20"
                >
                  {copiedId === 'tpl-prompt' ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
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
              <pre className="overflow-x-auto p-5 font-mono-tech text-[11.5px] leading-6 text-[var(--ink-on-specimen)]/90">
                {PROMPT_DECK_TEMPLATE}
              </pre>
            </div>

            {/* Template B */}
            <div className="overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-specimen)] text-[var(--ink-on-specimen)]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-xs font-medium text-white">
                    技术笔记 / 论文拆解模板
                  </span>
                </div>
                <button
                  onClick={() => copy(STUDY_NOTE_TEMPLATE, 'tpl-note')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] text-white hover:bg-white/20"
                >
                  {copiedId === 'tpl-note' ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
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
              <pre className="overflow-x-auto p-5 font-mono-tech text-[11.5px] leading-6 text-[var(--ink-on-specimen)]/90">
                {STUDY_NOTE_TEMPLATE}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

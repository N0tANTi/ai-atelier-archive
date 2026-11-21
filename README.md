# ATELIER AI · AI 研习指南与档案库

一座以 **Markdown 驱动（Markdown-as-Database）** 的个人 AI 学习资料、Prompt 卡片集与工程笔记档案库。  
视觉系统深度参考 [Dropbox Brand Guidelines](https://brand.dropbox.com/)：纯净白底 + `1px` 蓝图网格辅助线 + 高饱和双色块风车拼图矩阵（Pinwheel Mosaic）+ 悬停 `#1E1919` 暗黑极细线框翻转 + 底部中控矩阵浮层。

## 核心特性

- **8 格风车拼图知识矩阵**：围绕中心标志性 `#0061FF` 方块旋转咬合的 8 块双色模块，悬停即翻转为深炭黑 `#1E1919` + 白色极细线框（Wireframe）。
- **底部中控栏与全屏拼图浮层**：内置顶部细蓝色阅读进度条，随时点击底部居中 `#0061FF` 方块展开全屏色块导航矩阵。
- **Prompt 卡片工作台 + 交互标本实验室**：
  - 自动解析 `### 卡片 #N` 卡片单元与工程级 Prompt 模板，支持双色卡片网格 / 横向卷轴切换、专注全屏（`←`/`→` 翻卡）与一键复制。
  - 针对《绿野晚霞》内置 **4 套线性光时间色板实时预览（正午 / 午后 / 黄金时刻 / 日落）** 与 **Alpha 通道暗码分层图谱（`0.03~0.21` / `0.25~0.59` / `1.00`）**。
  - 工程蓝图支持 Stage 1 → 6 可勾选复现进度清单（本地持久化）。
- **零配置内容扩展**：将任意 `.md` 文件放入 `content/` 目录即可自动收录、归类、建立目录大纲并进入 `⌘K` 全文检索。

## 目录结构

```text
content/
├── prompts/      # Prompt 卡片集（自动解析卡片并汇总至 Prompt 卡片库）
├── notes/        # AI 技术笔记（瑞士极简长文 + 自动目录 TOC）
├── papers/       # 论文精读与拆解
└── workflows/    # AI Agent 工作流与 SOP
```

## 在线预览 & 本地运行

- **GitHub Pages**：https://n0tanti.github.io/ai-atelier-archive/

```bash
npm install
npm run dev
```

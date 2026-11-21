# ATELIER AI · AI 研习档案

一座以 **Markdown 驱动（Markdown-as-Database）** 的个人 AI 学习资料、Prompt 卡片集与工程笔记档案库。  
视觉与交互灵感融合自 Awwwards Sites of the Month 获奖作品：**Siena Film Foundation**（暖纸档案质感与细线目录索引）、**Floema**（克制留白与瞬时检索）及 **Dropbox Brand**（建筑草图网格与模块化索引卡片）。

## 核心特性

- **零配置内容扩展**：将任意 `.md` 文件放入 `content/` 目录即可自动收录、归类、建立目录大纲并进入全文检索。
- **Prompt 卡片工作台**：自动识别 `### 卡片 #N` 卡片单元与工程级 Prompt 模板，支持：
  - 网格陈列 / 胶片横滑（Filmstrip）双视图切换
  - 卡片专注模式（Focus Lightbox + 键盘 `←`/`→` 翻卡）
  - 单个卡片 / 全部卡片 / 完整工程模板一键复制
  - 工程模板分阶段（Stage 1 → 6）可勾选复现进度清单（本地持久化）
- **双模式档案目录**：支持细线档案目录（Index）与画廊卡片（Grid）切换。
- **瞬时命令检索**：按 `⌘K` / `Ctrl+K` 或 `/` 全局检索所有文档正文与 Prompt 卡片。
- **暖纸 / 墨黑双主题**：护眼出版级暖纸白（`#F5F1E8`）与深邃暖黑墨色（`#131211`）一键切换。

## 目录结构

```text
content/
├── prompts/      # Prompt 卡片集（自动解析卡片并汇总至 Prompt 卡片库）
├── notes/        # AI 技术笔记（精排长文 + 自动目录 TOC）
├── papers/       # 论文精读与拆解
└── workflows/    # AI Agent 工作流与 SOP
```

## 本地运行

```bash
npm install
npm run dev
```

## 构建与自动部署

```bash
npm run build
```

项目内置 `.github/workflows/deploy.yml`，推送至 `main` 分支后可自动部署至 GitHub Pages。

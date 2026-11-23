import { marked } from 'marked';
import { siteConfig } from '../site.config';

export type StandaloneCategory = '技术笔记' | '论文拆解' | 'AI 工作流' | 'Prompt 卡片集' | '学习资料';

export interface SourceMapEntry {
  stage: string;
  stageNumber: number;
  label: string;
  files: string[];
}

export interface PromptReferenceImage {
  label: string;
  url: string;
}

export interface PromptCard {
  id: string;
  ownerType: 'project' | 'doc';
  ownerSlug: string;
  ownerTitle: string;
  number: number;
  title: string;
  stage?: string;
  promptCode?: string;
  promptSubtitle?: string;
  points: string[];
  rawPrompt: string;
  accentHex: string;
  tags: string[];
  repoUrl?: string;
  sourceFiles?: string[];
  references: PromptReferenceImage[];
}

export interface MasterPromptSection {
  heading: string;
  content: string;
  stages: {
    index: number;
    title: string;
    details: string[];
  }[];
  rules: string[];
  intro: string;
  outro: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface DownloadLink {
  label: string;
  url: string;
}

export interface ProjectRecord {
  slug: string;
  number: string;
  folderPath: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  summary: string;
  featured: boolean;
  repo?: string;
  demo?: string;
  video?: string;
  demoTag?: string;
  demoControls?: string;
  runCommand?: string;
  downloads: DownloadLink[];
  preview?: string;
  license?: string;
  specimens?: string;
  palette: string[];
  sourceMap: SourceMapEntry[];
  overviewMarkdown: string;
  overviewHtml: string;
  // Optional attached prompt deck
  promptsTitle?: string;
  promptsRawMarkdown?: string;
  promptCards: PromptCard[];
  masterPrompt: MasterPromptSection | null;
  // Optional attached technical breakdown
  analysisTitle?: string;
  analysisRawMarkdown?: string;
  analysisHtml?: string;
  analysisToc: TocItem[];
  analysisReadingMinutes: number;
  // Combined searchable text
  searchText: string;
}

export interface StandaloneDoc {
  slug: string;
  number: string;
  filePath: string;
  fileName: string;
  title: string;
  subtitle: string;
  category: StandaloneCategory;
  folder: string;
  date: string;
  tags: string[];
  summary: string;
  readingMinutes: number;
  charCount: number;
  rawMarkdown: string;
  bodyMarkdown: string;
  htmlContent: string;
  toc: TocItem[];
  promptCards: PromptCard[];
  masterPrompt: MasterPromptSection | null;
}

export interface NoteCatalogEntry {
  id: string;
  source: 'project' | 'standalone';
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  readingMinutes: number;
  projectSlug?: string;
  projectTitle?: string;
  projectNumber?: string;
  docSlug?: string;
}

export interface RepoCatalogEntry {
  id: string;
  name: string;
  repoSlug: string;
  repoUrl: string;
  demoUrl?: string;
  title: string;
  description: string;
  license: string;
  tags: string[];
  moduleCount: number;
  fileCount: number;
  projectSlug?: string;
  projectNumber?: string;
  isPlatform?: boolean;
  palette: string[];
}

const STAGE_ACCENTS = [
  '#2B4464', // Dropbox Slate Navy
  '#00A5CF', // Dropbox Bright Cyan
  '#D99B00', // Dropbox Warm Gold
  '#6E9400', // Dropbox Chartreuse Lime
  '#7D4FD1', // Dropbox Soft Lavender Deep
  '#FA551E', // Dropbox Vivid Vermilion
];

interface FrontmatterResult {
  data: Record<string, unknown>;
  body: string;
}

function stripQuotes(str: string): string {
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    return str.slice(1, -1);
  }
  return str;
}

function parseFrontmatter(raw: string): FrontmatterResult {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { data: {}, body: normalized.trim() };
  }

  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) {
    return { data: {}, body: normalized.trim() };
  }

  const fmBlock = normalized.slice(4, endIdx);
  const body = normalized.slice(endIdx + 5).trim();
  const data: Record<string, unknown> = {};

  let currentArrayKey: string | null = null;
  for (const line of fmBlock.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (currentArrayKey && trimmed.startsWith('- ')) {
      const val = stripQuotes(trimmed.slice(2).trim());
      (data[currentArrayKey] as string[]).push(val);
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      const rawVal = line.slice(colonIdx + 1).trim();

      if (rawVal === '') {
        data[key] = [];
        currentArrayKey = key;
      } else {
        currentArrayKey = null;
        if (rawVal === 'true') data[key] = true;
        else if (rawVal === 'false') data[key] = false;
        else if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
          data[key] = rawVal
            .slice(1, -1)
            .split(',')
            .map((item) => stripQuotes(item.trim()))
            .filter(Boolean);
        } else {
          data[key] = stripQuotes(rawVal);
        }
      }
    }
  }

  return { data, body };
}

function parseDownloads(rawList: unknown): DownloadLink[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((item) => {
      const parts = String(item).split('|').map((s) => s.trim());
      if (parts.length < 2 || !parts[0] || !parts[1]) return null;
      return { label: parts[0], url: parts[1] };
    })
    .filter((d): d is DownloadLink => d !== null);
}

function parseSourceMap(rawList: unknown): SourceMapEntry[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((item, idx) => {
      const str = String(item);
      const parts = str.split('|').map((s) => s.trim());
      if (parts.length < 3) return null;
      const stage = parts[0];
      const numMatch = stage.match(/(\d+)/);
      const stageNumber = numMatch ? parseInt(numMatch[1], 10) : idx + 1;
      const label = parts[1];
      const files = parts[2]
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);
      return { stage, stageNumber, label, files };
    })
    .filter((entry): entry is SourceMapEntry => entry !== null);
}

function extractPromptCards(
  body: string,
  ownerType: 'project' | 'doc',
  ownerSlug: string,
  ownerTitle: string,
  tags: string[],
  repoUrl?: string,
  sourceMap: SourceMapEntry[] = []
): PromptCard[] {
  const cards: PromptCard[] = [];
  const cardRegex =
    /^###\s*(?:卡片|Card)\s*#?(\d+)\s*[｜|:\-·]\s*(.+?)\s*\n+((?:!\[[^\]]*\]\([^)]+\)\s*\n+)*)```[a-zA-Z0-9_-]*\n([\s\S]*?)```/gim;

  let match: RegExpExecArray | null;
  while ((match = cardRegex.exec(body)) !== null) {
    const num = parseInt(match[1], 10);
    const rawHeading = match[2].trim();
    const refsBlock = match[3] || '';
    const rawPrompt = match[4].trim();

    const references: PromptReferenceImage[] = [];
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let imgMatch: RegExpExecArray | null;
    while ((imgMatch = imgRegex.exec(refsBlock)) !== null) {
      references.push({
        label: imgMatch[1].trim() || `ref-${num}`,
        url: imgMatch[2].trim(),
      });
    }

    let title = rawHeading;
    let stage: string | undefined;
    const stageMatch = rawHeading.match(/[（(]([^）)]+)[）)]$/);
    if (stageMatch) {
      stage = stageMatch[1].trim();
      title = rawHeading.slice(0, stageMatch.index).trim();
    }

    const lines = rawPrompt
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    let promptCode: string | undefined;
    let promptSubtitle: string | undefined;
    const points: string[] = [];

    for (const line of lines) {
      const bracketMatch = line.match(/^\[(.+?)\s*[·|]\s*(.+?)\]$/);
      if (bracketMatch && !promptCode) {
        promptCode = bracketMatch[1].trim();
        promptSubtitle = bracketMatch[2].trim();
        continue;
      }
      const numberedMatch = line.match(/^\d+\.\s*(.+)$/);
      if (numberedMatch) {
        points.push(numberedMatch[1].trim());
      } else if (!line.startsWith('[')) {
        points.push(line);
      }
    }

    const matchedSource = sourceMap.find((s) => s.stageNumber === num);

    cards.push({
      id: `${ownerSlug}-card-${num}`,
      ownerType,
      ownerSlug,
      ownerTitle,
      number: num,
      title,
      stage: stage ?? `Stage ${num}`,
      promptCode: promptCode ?? `PROMPT ${String(num).padStart(2, '0')}`,
      promptSubtitle: promptSubtitle ?? title,
      points,
      rawPrompt,
      accentHex: STAGE_ACCENTS[(num - 1) % STAGE_ACCENTS.length],
      tags,
      repoUrl,
      sourceFiles: matchedSource?.files,
      references,
    });
  }

  return cards;
}

function extractMasterPrompt(body: string): MasterPromptSection | null {
  const sectionRegex =
    /^##\s+([^\n]*(?:模板|Template|Master|完整)[^\n]*)\n+```(?:markdown|md|text)?\n([\s\S]*?)```/im;
  const match = body.match(sectionRegex);
  if (!match) return null;

  const heading = match[1].trim();
  const content = match[2].trim();

  const lines = content.split('\n');
  let intro = '';
  let outro = '';
  const rules: string[] = [];
  const stages: { index: number; title: string; details: string[] }[] = [];

  let mode: 'intro' | 'rules' | 'stages' | 'outro' = 'intro';
  let currentStage: { index: number; title: string; details: string[] } | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('### ')) {
      if (line.includes('铁律') || line.includes('原则') || line.includes('规范')) {
        mode = 'rules';
      } else if (line.includes('分阶段') || line.includes('模块') || line.includes('步骤')) {
        mode = 'stages';
      }
      continue;
    }

    if (mode === 'intro') {
      intro = intro ? `${intro}\n${line}` : line;
      continue;
    }

    if (mode === 'rules') {
      if (line.startsWith('- ')) rules.push(line.slice(2).trim());
      continue;
    }

    if (mode === 'stages') {
      const stageHeader = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*[：:]?\s*(.*)$/);
      if (stageHeader) {
        currentStage = {
          index: parseInt(stageHeader[1], 10),
          title: stageHeader[2].trim(),
          details: stageHeader[3] ? [stageHeader[3].trim()] : [],
        };
        stages.push(currentStage);
        continue;
      }

      if (line.startsWith('- ') && currentStage) {
        currentStage.details.push(line.slice(2).trim());
        continue;
      }

      if (!line.startsWith('-') && !line.match(/^\d+\./)) {
        mode = 'outro';
        outro = line;
      }
      continue;
    }

    if (mode === 'outro') {
      outro = outro ? `${outro}\n${line}` : line;
    }
  }

  return { heading, content, stages, rules, intro, outro };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractToc(body: string): TocItem[] {
  const toc: TocItem[] = [];
  const lines = body.split('\n');
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      toc.push({ id: slugify(text), text, level: match[1].length });
    }
  }
  return toc;
}

const renderer = new marked.Renderer();
renderer.heading = ({ tokens, depth }) => {
  const text = tokens.map((t) => ('text' in t ? t.text : '')).join('');
  return `<h${depth} id="${slugify(text)}">${text}</h${depth}>\n`;
};

marked.setOptions({ gfm: true, breaks: false, renderer });

// Auto-discover ALL markdown files inside /content/**/*.md
const rawFiles = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function buildContentStore() {
  const projectBuckets = new Map<
    string,
    {
      main?: { path: string; data: Record<string, unknown>; body: string };
      prompts?: { path: string; data: Record<string, unknown>; body: string };
      analysis?: { path: string; data: Record<string, unknown>; body: string };
    }
  >();

  const standaloneList: StandaloneDoc[] = [];

  Object.entries(rawFiles).forEach(([filePath, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    const rel = filePath.replace(/^\/content\//, '');
    const segments = rel.split('/');

    // 1. Project-grouped content: content/projects/<slug>/*.md
    if (segments[0] === 'projects' && segments.length >= 3) {
      const folderSlug = segments[1];
      const fileName = segments[segments.length - 1].toLowerCase();
      if (!projectBuckets.has(folderSlug)) {
        projectBuckets.set(folderSlug, {});
      }
      const bucket = projectBuckets.get(folderSlug)!;

      if (fileName === 'project.md' || fileName === 'index.md') {
        bucket.main = { path: filePath, data, body };
      } else if (
        fileName.includes('prompt') ||
        data.type === 'prompt-deck'
      ) {
        bucket.prompts = { path: filePath, data, body };
      } else {
        bucket.analysis = { path: filePath, data, body };
      }
      return;
    }

    // 2. Standalone content: content/notes/, content/papers/, content/workflows/, content/prompts/
    const folder = segments.length > 1 ? segments[0] : '';
    const fileName = segments[segments.length - 1];
    const fallbackTitle = fileName.replace(/\.md$/i, '');
    const title = (data.title as string) || fallbackTitle;
    const slug = encodeURIComponent(rel.replace(/\.md$/i, '').replace(/\//g, '--'));
    const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
    const promptCards = extractPromptCards(body, 'doc', slug, title, tags);
    const masterPrompt = extractMasterPrompt(body);

    const category = ((data.category as string) ||
      siteConfig.folderCategories[folder] ||
      (promptCards.length > 0 ? 'Prompt 卡片集' : '学习资料')) as StandaloneCategory;

    const charCount = body.length;
    const readingMinutes = Math.max(1, Math.ceil(charCount / 420));
    const plainText = body.replace(/```[\s\S]*?```/g, '').replace(/[#*`>\-_]/g, '');
    const firstLine =
      plainText
        .split('\n')
        .map((l) => l.trim())
        .find((l) => l.length > 14) || title;

    standaloneList.push({
      slug,
      number: (data.id as string) || String(standaloneList.length + 1).padStart(2, '0'),
      filePath: filePath.replace(/^\//, ''),
      fileName,
      title,
      subtitle: (data.subtitle as string) || `${category} · Markdown 归档`,
      category,
      folder,
      date: (data.date as string) || '2026-11-22',
      tags,
      summary: (data.summary as string) || firstLine.slice(0, 120),
      readingMinutes,
      charCount,
      rawMarkdown: raw,
      bodyMarkdown: body,
      htmlContent: marked.parse(body) as string,
      toc: extractToc(body),
      promptCards,
      masterPrompt,
    });
  });

  // Assemble unified ProjectRecords
  const projectList: ProjectRecord[] = Array.from(projectBuckets.entries()).map(
    ([folderSlug, bucket], idx) => {
      const d = bucket.main?.data ?? {};
      const overviewMd = bucket.main?.body ?? '';
      const slug = (typeof d.slug === 'string' && d.slug) || folderSlug;
      const title = (typeof d.title === 'string' && d.title) || folderSlug;
      const tags = Array.isArray(d.tags) ? (d.tags as string[]) : [];
      const repo = typeof d.repo === 'string' ? d.repo : undefined;
      const demo = typeof d.demo === 'string' ? d.demo : undefined;
      const video = typeof d.video === 'string' ? d.video : undefined;
      const demoTag = typeof d.demoTag === 'string' ? d.demoTag : undefined;
      const demoControls =
        typeof d.demoControls === 'string' ? d.demoControls : undefined;
      const runCommand =
        typeof d.runCommand === 'string' ? d.runCommand : undefined;
      const downloads = parseDownloads(d.downloads);
      const preview = typeof d.preview === 'string' ? d.preview : undefined;
      const license = typeof d.license === 'string' ? d.license : undefined;
      const specimens = typeof d.specimens === 'string' ? d.specimens : undefined;
      const palette = Array.isArray(d.palette)
        ? (d.palette as string[])
        : ['#2B4464', '#0061FF', '#FAD24B', '#1E1919'];
      const sourceMap = parseSourceMap(d.sourceMap);

      const promptsBody = bucket.prompts?.body ?? '';
      const promptCards = promptsBody
        ? extractPromptCards(
            promptsBody,
            'project',
            slug,
            title,
            tags,
            repo,
            sourceMap
          )
        : [];
      const masterPrompt = promptsBody ? extractMasterPrompt(promptsBody) : null;

      const analysisBody = bucket.analysis?.body ?? '';
      const analysisTitle =
        (bucket.analysis?.data.title as string) ||
        (analysisBody ? `${title} · 技术架构拆解` : undefined);

      const searchText = [
        title,
        (d.subtitle as string) || '',
        (d.summary as string) || '',
        tags.join(' '),
        overviewMd,
        promptsBody,
        analysisBody,
        repo || '',
      ]
        .join('\n')
        .toLowerCase();

      return {
        slug,
        number: (d.id as string) || String(idx + 1).padStart(2, '0'),
        folderPath: `content/projects/${folderSlug}/`,
        title,
        subtitle: (d.subtitle as string) || '',
        date: (d.date as string) || '2026-11-22',
        tags,
        summary: (d.summary as string) || overviewMd.slice(0, 120),
        featured: Boolean(d.featured),
        repo,
        demo,
        video,
        demoTag,
        demoControls,
        runCommand,
        downloads,
        preview,
        license,
        specimens,
        palette,
        sourceMap,
        overviewMarkdown: overviewMd,
        overviewHtml: marked.parse(overviewMd) as string,
        promptsTitle: (bucket.prompts?.data.title as string) || undefined,
        promptsRawMarkdown: promptsBody || undefined,
        promptCards,
        masterPrompt,
        analysisTitle,
        analysisRawMarkdown: analysisBody || undefined,
        analysisHtml: analysisBody ? (marked.parse(analysisBody) as string) : undefined,
        analysisToc: analysisBody ? extractToc(analysisBody) : [],
        analysisReadingMinutes: analysisBody
          ? Math.max(1, Math.ceil(analysisBody.length / 420))
          : 0,
        searchText,
      };
    }
  );

  // Sort projects: newest date first, then number desc
  projectList.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.number.localeCompare(a.number);
  });

  standaloneList.sort((a, b) => b.date.localeCompare(a.date));

  return { projectList, standaloneList };
}

const store = buildContentStore();

export const projects: ProjectRecord[] = store.projectList;
export const standaloneDocs: StandaloneDoc[] = store.standaloneList;

// Global Horizontal Pools (Cross-Project Aggregations)
export const allPromptCards: PromptCard[] = [
  ...projects.flatMap((p) => p.promptCards),
  ...standaloneDocs.flatMap((d) => d.promptCards),
];

export const allDemos: ProjectRecord[] = projects.filter(
  (p) => Boolean(p.demo) || Boolean(p.video)
);

export const allNotes: NoteCatalogEntry[] = [
  ...projects
    .filter((p) => Boolean(p.analysisHtml))
    .map((p) => ({
      id: `project-note-${p.slug}`,
      source: 'project' as const,
      title: p.analysisTitle || `${p.title} · 技术拆解`,
      subtitle: p.subtitle,
      date: p.date,
      tags: p.tags,
      readingMinutes: p.analysisReadingMinutes,
      projectSlug: p.slug,
      projectTitle: p.title,
      projectNumber: p.number,
    })),
  ...standaloneDocs
    .filter((d) => d.category === '技术笔记' || d.folder === 'notes')
    .map((d) => ({
      id: `doc-note-${d.slug}`,
      source: 'standalone' as const,
      title: d.title,
      subtitle: d.subtitle,
      date: d.date,
      tags: d.tags,
      readingMinutes: d.readingMinutes,
      docSlug: d.slug,
    })),
];

export const allPapers: StandaloneDoc[] = standaloneDocs.filter(
  (d) => d.category === '论文拆解' || d.folder === 'papers'
);

export const allWorkflows: StandaloneDoc[] = standaloneDocs.filter(
  (d) => d.category === 'AI 工作流' || d.folder === 'workflows'
);

export const allRepos: RepoCatalogEntry[] = [
  ...projects
    .filter((p) => Boolean(p.repo))
    .map((p) => {
      const repoSlug = p.repo!.replace(/^https?:\/\/github\.com\//i, '');
      return {
        id: `repo-${p.slug}`,
        name: repoSlug.split('/')[1] || p.slug,
        repoSlug,
        repoUrl: p.repo!,
        demoUrl: p.demo || p.video,
        title: p.title,
        description: p.summary,
        license: p.license || 'MIT',
        tags: p.tags,
        moduleCount: p.sourceMap.length,
        fileCount: p.sourceMap.reduce((sum, s) => sum + s.files.length, 0),
        projectSlug: p.slug,
        projectNumber: p.number,
        palette: p.palette,
      };
    }),
  {
    id: 'repo-platform',
    name: 'ai-atelier-archive',
    repoSlug: siteConfig.githubRepo.replace(/^https?:\/\/github\.com\//i, ''),
    repoUrl: siteConfig.githubRepo,
    demoUrl: 'https://note.archein.site/',
    title: 'ATELIER AI · 个人知识库主站',
    description:
      '本站完整源码：React + TypeScript + Vite + Tailwind CSS v4，基于 Markdown-as-Database 驱动的 Dropbox Brand 风格知识与项目档案馆。',
    license: 'MIT',
    tags: ['React', 'TypeScript', 'Vite', 'Markdown'],
    moduleCount: 0,
    fileCount: 0,
    isPlatform: true,
    palette: ['#0061FF', '#1E1919', '#FAD24B', '#3DD6F5'],
  },
];

export const allTags: string[] = Array.from(
  new Set([
    ...projects.flatMap((p) => p.tags),
    ...standaloneDocs.flatMap((d) => d.tags),
  ])
);

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  return projects.find(
    (p) => p.slug === slug || decodeURIComponent(p.slug) === decodeURIComponent(slug)
  );
}

export function getStandaloneDocBySlug(slug: string): StandaloneDoc | undefined {
  return standaloneDocs.find(
    (d) => d.slug === slug || decodeURIComponent(d.slug) === decodeURIComponent(slug)
  );
}

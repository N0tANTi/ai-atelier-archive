import { marked } from 'marked';
import { siteConfig } from '../site.config';

export type DocType = 'prompt-deck' | 'note' | 'paper' | 'workflow';

export interface SourceMapEntry {
  stage: string;
  stageNumber: number;
  label: string;
  files: string[];
}

export interface PromptCard {
  id: string;
  docSlug: string;
  docTitle: string;
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

export interface ArchiveDoc {
  slug: string;
  number: string;
  filePath: string;
  fileName: string;
  title: string;
  subtitle: string;
  category: string;
  type: DocType;
  date: string;
  tags: string[];
  summary: string;
  featured: boolean;
  palette: string[];
  repo?: string;
  demo?: string;
  preview?: string;
  license?: string;
  sourceMap: SourceMapEntry[];
  readingMinutes: number;
  charCount: number;
  rawMarkdown: string;
  bodyMarkdown: string;
  htmlContent: string;
  toc: TocItem[];
  promptCards: PromptCard[];
  masterPrompt: MasterPromptSection | null;
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

function stripQuotes(str: string): string {
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    return str.slice(1, -1);
  }
  return str;
}

function extractPromptCards(
  body: string,
  docSlug: string,
  docTitle: string,
  tags: string[]
): PromptCard[] {
  const cards: PromptCard[] = [];
  // Matches: ### 卡片 #1｜地形与笔触（Stage 1） followed by ```...```
  const cardRegex =
    /^###\s*(?:卡片|Card)\s*#?(\d+)\s*[｜|:\-·]\s*(.+?)\s*\n+```[a-zA-Z0-9_-]*\n([\s\S]*?)```/gim;

  let match: RegExpExecArray | null;
  while ((match = cardRegex.exec(body)) !== null) {
    const num = parseInt(match[1], 10);
    const rawHeading = match[2].trim();
    const rawPrompt = match[3].trim();

    let title = rawHeading;
    let stage: string | undefined;
    const stageMatch = rawHeading.match(/[（(]([^）)]+)[）)]$/);
    if (stageMatch) {
      stage = stageMatch[1].trim();
      title = rawHeading.slice(0, stageMatch.index).trim();
    }

    const lines = rawPrompt.split('\n').map((l) => l.trim()).filter(Boolean);
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

    cards.push({
      id: `${docSlug}-card-${num}`,
      docSlug,
      docTitle,
      number: num,
      title,
      stage: stage ?? `Stage ${num}`,
      promptCode: promptCode ?? `PROMPT ${String(num).padStart(2, '0')}`,
      promptSubtitle: promptSubtitle ?? title,
      points,
      rawPrompt,
      accentHex: STAGE_ACCENTS[(num - 1) % STAGE_ACCENTS.length],
      tags,
    });
  }

  return cards;
}

function extractMasterPrompt(body: string): MasterPromptSection | null {
  // Look for a heading mentioning 模板 / Prompt / Master followed by a ```markdown or ``` block
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
      if (line.startsWith('- ')) {
        rules.push(line.slice(2).trim());
      }
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

      // Closing instruction after stages
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

  return {
    heading,
    content,
    stages,
    rules,
    intro,
    outro,
  };
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
      const id = slugify(text);
      toc.push({ id, text, level: match[1].length });
    }
  }
  return toc;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createDocSlug(filePath: string): string {
  const cleaned = filePath
    .replace(/^\/content\//, '')
    .replace(/\.md$/i, '');
  return encodeURIComponent(cleaned.replace(/\//g, '--'));
}

// Configure marked renderer for clean heading IDs
const renderer = new marked.Renderer();
renderer.heading = ({ tokens, depth }) => {
  const text = tokens.map((t) => ('text' in t ? t.text : '')).join('');
  const id = slugify(text);
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};

marked.setOptions({
  gfm: true,
  breaks: false,
  renderer,
});

// Auto-discover ALL markdown files inside /content/**/*.md
const rawFiles = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

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

function loadArchive(): ArchiveDoc[] {
  const docs: ArchiveDoc[] = Object.entries(rawFiles).map(([filePath, raw], idx) => {
    const { data, body } = parseFrontmatter(raw);
    const segments = filePath.replace(/^\/content\//, '').split('/');
    const fileName = segments[segments.length - 1];
    const folder = segments.length > 1 ? segments[0] : '';
    const fallbackTitle = fileName.replace(/\.md$/i, '');

    const title = (data.title as string) || fallbackTitle;
    const slug = createDocSlug(filePath);
    const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
    const repo = typeof data.repo === 'string' ? data.repo : undefined;
    const demo = typeof data.demo === 'string' ? data.demo : undefined;
    const preview = typeof data.preview === 'string' ? data.preview : undefined;
    const license = typeof data.license === 'string' ? data.license : undefined;
    const sourceMap = parseSourceMap(data.sourceMap);

    const promptCards = extractPromptCards(body, slug, title, tags).map((card) => {
      const matched = sourceMap.find((entry) => entry.stageNumber === card.number);
      return {
        ...card,
        repoUrl: repo,
        sourceFiles: matched?.files,
      };
    });
    const masterPrompt = extractMasterPrompt(body);

    const inferredType: DocType =
      (data.type as DocType) ||
      (promptCards.length > 0
        ? 'prompt-deck'
        : folder === 'papers'
          ? 'paper'
          : folder === 'workflows'
            ? 'workflow'
            : 'note');

    const category =
      (data.category as string) ||
      siteConfig.folderCategories[folder] ||
      (inferredType === 'prompt-deck' ? 'Prompt 卡片集' : '学习资料');

    const plainText = body.replace(/```[\s\S]*?```/g, '').replace(/[#*`>\-_]/g, '');
    const charCount = body.length;
    const readingMinutes = Math.max(1, Math.ceil(charCount / 420));

    const firstParagraph =
      plainText
        .split('\n')
        .map((l) => l.trim())
        .find((l) => l.length > 16) || title;

    const palette = Array.isArray(data.palette)
      ? (data.palette as string[])
      : ['#5A7D5E', '#3A6B8C', '#B84A2A', '#191816'];

    return {
      slug,
      number: (data.id as string) || String(idx + 1).padStart(2, '0'),
      filePath: filePath.replace(/^\//, ''),
      fileName,
      title,
      subtitle: (data.subtitle as string) || `${category} · Markdown 归档文档`,
      category,
      type: inferredType,
      date: (data.date as string) || '2026-11-21',
      tags,
      summary: (data.summary as string) || firstParagraph.slice(0, 120),
      featured: Boolean(data.featured),
      palette,
      repo,
      demo,
      preview,
      license,
      sourceMap,
      readingMinutes,
      charCount,
      rawMarkdown: raw,
      bodyMarkdown: body,
      htmlContent: marked.parse(body) as string,
      toc: extractToc(body),
      promptCards,
      masterPrompt,
    };
  });

  // Sort by featured first, then date desc, then number asc
  return docs.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.number.localeCompare(b.number);
  });
}

export const archiveDocs: ArchiveDoc[] = loadArchive();

export const allPromptCards: PromptCard[] = archiveDocs.flatMap(
  (doc) => doc.promptCards
);

export const allCategories: string[] = Array.from(
  new Set(archiveDocs.map((d) => d.category))
);

export const allTags: string[] = Array.from(
  new Set(archiveDocs.flatMap((d) => d.tags))
);

export function getDocBySlug(slug: string): ArchiveDoc | undefined {
  return archiveDocs.find(
    (d) => d.slug === slug || decodeURIComponent(d.slug) === decodeURIComponent(slug)
  );
}

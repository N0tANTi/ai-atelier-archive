import { Search, X } from 'lucide-react';
import { archiveDocs, allPromptCards } from '../lib/content';

export type MosaicAction =
  | { type: 'cards' }
  | { type: 'doc'; slug: string; tab?: 'cards' | 'master' }
  | { type: 'category'; category: string }
  | { type: 'guide' }
  | { type: 'search' }
  | { type: 'close' };

interface PinwheelMosaicProps {
  variant?: 'hero' | 'overlay';
  onAction: (action: MosaicAction) => void;
}

export function PinwheelMosaic({
  variant = 'hero',
  onAction,
}: PinwheelMosaicProps) {
  const featuredDoc = archiveDocs[0];
  const isOverlay = variant === 'overlay';

  return (
    <div
      className={
        isOverlay
          ? 'dropbox-mosaic-overlay mx-auto w-full max-w-[960px]'
          : 'dropbox-mosaic mx-auto w-full max-w-[1060px]'
      }
    >
      {/* TILE 1: Framework / Prompt Decks (Slate Navy) */}
      <button
        onClick={() => onAction({ type: 'cards' })}
        className="mosaic-tile dm-tile dm-1 group flex flex-col justify-between p-5 text-left sm:p-6"
        style={{ backgroundColor: 'var(--tile-navy-bg)', color: '#FFFFFF' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="tile-label block font-display text-lg font-semibold leading-tight text-white sm:text-xl">
              Prompt 卡片库
            </span>
            <span className="tile-meta-muted mt-0.5 block font-mono-tech text-[10px] uppercase tracking-[0.12em] text-[#82B8FF]">
              PROMPT DECKS · {String(allPromptCards.length).padStart(2, '0')} CARDS
            </span>
          </div>
          <span className="tile-meta-muted font-mono-tech text-[10px] text-white/60">
            01
          </span>
        </div>

        {/* Solid -> Wireframe SVG (3-node connector homage to Framework) */}
        <div className="relative mt-2 h-16 w-full">
          <svg
            viewBox="0 0 220 72"
            className="tile-solid-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <line x1="26" y1="36" x2="110" y2="36" stroke="#82B8FF" strokeWidth="5" />
            <line x1="110" y1="36" x2="194" y2="36" stroke="#82B8FF" strokeWidth="5" />
            <circle cx="26" cy="36" r="14" fill="#82B8FF" />
            <rect x="96" y="22" width="28" height="28" fill="#82B8FF" />
            <polygon points="194,20 210,50 178,50" fill="#82B8FF" />
          </svg>
          <svg
            viewBox="0 0 220 72"
            className="tile-wire-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <path
              d="M26 36 C 58 8, 78 64, 110 36 C 142 8, 162 64, 194 36"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <circle cx="26" cy="36" r="13" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="97" y="23" width="26" height="26" stroke="#FFFFFF" strokeWidth="2" />
            <polygon points="194,21 209,49 179,49" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>
      </button>

      {/* TILE 2: Featured Monograph - 绿野晚霞 (Warm Gold) */}
      <button
        onClick={() =>
          featuredDoc
            ? onAction({ type: 'doc', slug: featuredDoc.slug, tab: 'cards' })
            : onAction({ type: 'cards' })
        }
        className="mosaic-tile dm-tile dm-2 group flex flex-col justify-between p-5 text-left sm:p-6"
        style={{ backgroundColor: 'var(--tile-gold-bg)', color: '#1E1919' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="tile-label block font-display text-lg font-semibold leading-tight text-[#1E1919] sm:text-2xl">
              精选 · 绿野晚霞 Prompt 卡片集
            </span>
            <span className="tile-meta-muted mt-0.5 block font-mono-tech text-[10px] uppercase tracking-[0.12em] text-[#594404]">
              FEATURED NO.01 · THREE.JS STAGE 1 → 6
            </span>
          </div>
          <span className="tile-meta shrink-0 whitespace-nowrap rounded bg-black/10 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-[#1E1919] group-hover:bg-white/15">
            OPEN →
          </span>
        </div>

        {/* Solid -> Wireframe SVG (Quotation / Voice & Tone homage) */}
        <div className="relative mt-2 h-16 w-full">
          <svg
            viewBox="0 0 240 72"
            className="tile-solid-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <path d="M22 14 H76 V48 L50 64 V48 H22 Z" fill="#594404" />
            <path d="M96 14 H150 V48 L124 64 V48 H96 Z" fill="#594404" />
            <circle cx="196" cy="36" r="18" fill="#594404" />
          </svg>
          <svg
            viewBox="0 0 240 72"
            className="tile-wire-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <path d="M22 14 H76 V48 L50 64 V48 H22 Z" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M96 14 H150 V48 L124 64 V48 H96 Z" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="196" cy="36" r="18" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="184" y1="36" x2="208" y2="36" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="196" y1="24" x2="196" y2="48" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </div>
      </button>

      {/* TILE 3: Visual & Shader / 3D Rendering (Bright Cyan) */}
      <button
        onClick={() =>
          featuredDoc
            ? onAction({ type: 'doc', slug: featuredDoc.slug, tab: 'cards' })
            : onAction({ type: 'category', category: 'Prompt 卡片集' })
        }
        className="mosaic-tile dm-tile dm-3 group flex flex-col justify-between p-5 text-left sm:p-6"
        style={{ backgroundColor: 'var(--tile-cyan-bg)', color: '#1E1919' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="tile-label block font-display text-lg font-semibold leading-tight text-[#1E1919] sm:text-xl">
              图形学与手绘渲染
            </span>
            <span className="tile-meta-muted mt-0.5 block font-mono-tech text-[10px] uppercase tracking-[0.12em] text-[#0B4C5F]">
              GLSL3 · SHADER · KUWAHARA
            </span>
          </div>
          <span className="tile-meta-muted font-mono-tech text-[10px] text-[#0B4C5F]">
            03
          </span>
        </div>

        {/* Solid -> Wireframe SVG (Faceted Prism / Dropbox Logo Diamond homage) */}
        <div className="relative mt-1 h-16 w-full">
          <svg
            viewBox="0 0 180 72"
            className="tile-solid-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <polygon points="56,10 92,28 56,46 20,28" fill="#0B4C5F" />
            <polygon points="128,10 164,28 128,46 92,28" fill="#0B4C5F" />
            <polygon points="92,28 128,46 92,64 56,46" fill="#0B4C5F" />
          </svg>
          <svg
            viewBox="0 0 180 72"
            className="tile-wire-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <polygon points="56,10 92,28 56,46 20,28" stroke="#FFFFFF" strokeWidth="2" />
            <polygon points="128,10 164,28 128,46 92,28" stroke="#FFFFFF" strokeWidth="2" />
            <polygon points="92,28 128,46 92,64 56,46" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="92" y1="10" x2="92" y2="64" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>
      </button>

      {/* TILE 4: LLM & Technical Notes (Vivid Vermilion - Iconic Giant "Ai" Glyph!) */}
      <button
        onClick={() => onAction({ type: 'category', category: '技术笔记' })}
        className="mosaic-tile dm-tile dm-4 group flex flex-col justify-between p-5 text-left sm:p-6"
        style={{ backgroundColor: 'var(--tile-vermilion-bg)', color: '#1E1919' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="tile-label block font-display text-lg font-semibold leading-tight text-[#1E1919] sm:text-xl">
              技术笔记
            </span>
            <span className="tile-meta-muted mt-0.5 block font-mono-tech text-[10px] uppercase tracking-[0.12em] text-[#6B1506]">
              LLM NOTES · CONTENT/NOTES/
            </span>
          </div>
          <span className="tile-meta-muted font-mono-tech text-[10px] text-[#6B1506]">
            04
          </span>
        </div>

        {/* Giant "Ai" Glyph Homage to Dropbox's iconic "Aa" Typography Tile */}
        <div className="relative flex flex-1 items-end justify-end pt-2">
          <svg
            viewBox="0 0 190 124"
            className="tile-solid-art h-24 w-auto sm:h-28"
            fill="none"
          >
            <text
              x="184"
              y="108"
              textAnchor="end"
              fill="#6B1506"
              fontFamily="Space Grotesk, sans-serif"
              fontWeight="700"
              fontSize="118"
              letterSpacing="-6"
            >
              Ai
            </text>
          </svg>
          <svg
            viewBox="0 0 190 124"
            className="tile-wire-art absolute bottom-0 right-0 h-24 w-auto sm:h-28"
            fill="none"
          >
            <text
              x="184"
              y="108"
              textAnchor="end"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              fontFamily="Space Grotesk, sans-serif"
              fontWeight="700"
              fontSize="118"
              letterSpacing="-6"
            >
              Ai
            </text>
          </svg>
        </div>
      </button>

      {/* CENTER SIGNATURE BLUE SQUARE (#0061FF) */}
      <button
        onClick={() =>
          onAction(isOverlay ? { type: 'close' } : { type: 'search' })
        }
        aria-label={isOverlay ? '关闭导航矩阵' : '打开全局快捷检索'}
        title={isOverlay ? '关闭导航矩阵 (ESC)' : '全局快捷检索 (⌘K)'}
        className="dm-center group flex items-center justify-center bg-[var(--brand-blue)] text-white transition-all duration-300 ease-dropbox hover:bg-[var(--ink-base)]"
      >
        {isOverlay ? (
          <X className="h-7 w-7 transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1">
            <Search className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-mono-tech text-[9px] font-semibold tracking-widest opacity-90">
              ⌘K
            </span>
          </div>
        )}
      </button>

      {/* TILE 5: Agent Workflows (Electric Chartreuse Lime - Tall Left) */}
      <button
        onClick={() => onAction({ type: 'category', category: 'AI 工作流' })}
        className="mosaic-tile dm-tile dm-5 group flex flex-col justify-between p-5 text-left sm:p-6"
        style={{ backgroundColor: 'var(--tile-lime-bg)', color: '#1E1919' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="tile-label block font-display text-lg font-semibold leading-tight text-[#1E1919] sm:text-xl">
              AI 工作流
            </span>
            <span className="tile-meta-muted mt-0.5 block font-mono-tech text-[10px] uppercase tracking-[0.12em] text-[#24450A]">
              AGENTS · SOP · WORKFLOWS
            </span>
          </div>
          <span className="tile-meta-muted font-mono-tech text-[10px] text-[#24450A]">
            05
          </span>
        </div>

        {/* Modular Agent Nodes SVG (Iconography homage) */}
        <div className="relative flex flex-1 items-end justify-end pt-2">
          <svg
            viewBox="0 0 140 110"
            className="tile-solid-art h-24 w-auto sm:h-28"
            fill="none"
          >
            <rect x="20" y="16" width="44" height="44" rx="4" fill="#24450A" />
            <rect x="78" y="50" width="44" height="44" rx="22" fill="#24450A" />
            <path d="M64 38 H100 V50" stroke="#24450A" strokeWidth="5" />
            <path d="M42 60 V72 H78" stroke="#24450A" strokeWidth="5" />
          </svg>
          <svg
            viewBox="0 0 140 110"
            className="tile-wire-art absolute bottom-0 right-0 h-24 w-auto sm:h-28"
            fill="none"
          >
            <rect x="20" y="16" width="44" height="44" rx="4" stroke="#FFFFFF" strokeWidth="2.2" />
            <rect x="78" y="50" width="44" height="44" rx="22" stroke="#FFFFFF" strokeWidth="2.2" />
            <path d="M64 38 H100 V50" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M42 60 V72 H78" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 3" />
          </svg>
        </div>
      </button>

      {/* TILE 6: Papers & Palette Swatches (Warm Tangerine - Color Tile Homage) */}
      <button
        onClick={() => onAction({ type: 'category', category: '论文拆解' })}
        className="mosaic-tile dm-tile dm-6 group flex flex-col justify-between p-5 text-left sm:p-6"
        style={{ backgroundColor: 'var(--tile-tangerine-bg)', color: '#1E1919' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="tile-label block font-display text-lg font-semibold leading-tight text-[#1E1919] sm:text-xl">
              论文拆解
            </span>
            <span className="tile-meta-muted mt-0.5 block font-mono-tech text-[10px] uppercase tracking-[0.12em] text-[#5C2704]">
              PAPERS · RESEARCH NOTES
            </span>
          </div>
          <span className="tile-meta-muted font-mono-tech text-[10px] text-[#5C2704]">
            06
          </span>
        </div>

        {/* Overlapping Square + Circle Swatch Badges (Direct Color Tile Homage) */}
        <div className="relative mt-1 h-16 w-full">
          <svg
            viewBox="0 0 180 72"
            className="tile-solid-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <rect x="36" y="10" width="46" height="46" fill="#5C2704" />
            <circle cx="116" cy="36" r="24" fill="#5C2704" />
            <rect x="148" y="20" width="22" height="36" fill="#5C2704" />
          </svg>
          <svg
            viewBox="0 0 180 72"
            className="tile-wire-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <rect x="36" y="10" width="46" height="46" stroke="#FFFFFF" strokeWidth="2.2" />
            <circle cx="116" cy="36" r="24" stroke="#FFFFFF" strokeWidth="2.2" />
            <rect x="148" y="20" width="22" height="36" stroke="#FFFFFF" strokeWidth="2.2" />
          </svg>
        </div>
      </button>

      {/* TILE 7: Interactive Master Engineering Blueprint (Deep Burgundy/Maroon - Imagery Homage) */}
      <button
        onClick={() =>
          featuredDoc
            ? onAction({ type: 'doc', slug: featuredDoc.slug, tab: 'master' })
            : onAction({ type: 'cards' })
        }
        className="mosaic-tile dm-tile dm-7 group flex flex-col justify-between p-5 text-left sm:p-6"
        style={{ backgroundColor: 'var(--tile-maroon-bg)', color: '#FFFFFF' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="tile-label block font-display text-lg font-semibold leading-tight text-white sm:text-xl">
              工程蓝图与交互色板
            </span>
            <span className="tile-meta-muted mt-0.5 block font-mono-tech text-[10px] uppercase tracking-[0.12em] text-[#FF9EC7]">
              SPECIMEN LAB · 4 TIME-OF-DAY PALETTES &amp; ALPHA MAP
            </span>
          </div>
          <span className="tile-meta shrink-0 whitespace-nowrap rounded bg-white/15 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-white">
            LIVE →
          </span>
        </div>

        {/* Framed Mountain Landscape Homage to Dropbox's Imagery Tile */}
        <div className="relative mt-2 h-16 w-full">
          <svg
            viewBox="0 0 240 72"
            className="tile-solid-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <rect x="52" y="8" width="180" height="58" stroke="#FF9EC7" strokeWidth="4" />
            <circle cx="94" cy="27" r="9" fill="#FF9EC7" />
            <polygon points="62,64 118,24 162,64" fill="#FF9EC7" />
            <polygon points="134,64 182,18 224,64" fill="#FF9EC7" fillOpacity="0.72" />
          </svg>
          <svg
            viewBox="0 0 240 72"
            className="tile-wire-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <rect x="52" y="8" width="180" height="58" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="94" cy="27" r="9" stroke="#FFFFFF" strokeWidth="2" />
            <polygon points="62,64 118,24 162,64" stroke="#FFFFFF" strokeWidth="2" />
            <polygon points="134,64 182,18 224,64" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>
      </button>

      {/* TILE 8: Archive Schema & Markdown Guide (Soft Lavender - Motion Bezier Homage!) */}
      <button
        onClick={() => onAction({ type: 'guide' })}
        className="mosaic-tile dm-tile dm-8 group flex flex-col justify-between p-5 text-left sm:p-6"
        style={{ backgroundColor: 'var(--tile-lavender-bg)', color: '#1E1919' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="tile-label block font-display text-lg font-semibold leading-tight text-[#1E1919] sm:text-xl">
              归档规范与扩展
            </span>
            <span className="tile-meta-muted mt-0.5 block font-mono-tech text-[10px] uppercase tracking-[0.12em] text-[#441C78]">
              MARKDOWN SCHEMA · HOW TO ADD
            </span>
          </div>
          <span className="tile-meta-muted font-mono-tech text-[10px] text-[#441C78]">
            08
          </span>
        </div>

        {/* Cubic-Bezier Curve with Control Handles (Direct Motion Tile Homage!) */}
        <div className="relative mt-2 h-16 w-full">
          <svg
            viewBox="0 0 200 72"
            className="tile-solid-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <path d="M20 58 C 88 58, 112 14, 180 14" stroke="#441C78" strokeWidth="5" />
            <line x1="20" y1="58" x2="88" y2="58" stroke="#441C78" strokeWidth="2" />
            <line x1="112" y1="14" x2="180" y2="14" stroke="#441C78" strokeWidth="2" />
            <circle cx="20" cy="58" r="7" fill="#441C78" />
            <circle cx="88" cy="58" r="6" fill="#441C78" />
            <circle cx="112" cy="14" r="6" fill="#441C78" />
            <circle cx="180" cy="14" r="7" fill="#441C78" />
          </svg>
          <svg
            viewBox="0 0 200 72"
            className="tile-wire-art absolute bottom-0 right-0 h-full w-auto"
            fill="none"
          >
            <path d="M20 58 C 88 58, 112 14, 180 14" stroke="#FFFFFF" strokeWidth="2.2" />
            <line x1="20" y1="58" x2="88" y2="58" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="112" y1="14" x2="180" y2="14" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="20" cy="58" r="7" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="88" cy="58" r="5" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="112" cy="14" r="5" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="180" cy="14" r="7" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>
      </button>
    </div>
  );
}

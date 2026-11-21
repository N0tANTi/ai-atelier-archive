import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { siteConfig } from '../site.config';
import { archiveDocs, allPromptCards } from '../lib/content';
import { PinwheelMosaic, type MosaicAction } from './PinwheelMosaic';

interface BlueprintIntroStageProps {
  onAction: (action: MosaicAction) => void;
  onProgressChange?: (progress: number) => void;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function easeInOutCubic(t: number) {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function BlueprintIntroStage({
  onAction,
  onProgressChange,
}: BlueprintIntroStageProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const measure = () => {
      const el = runwayRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollable = Math.max(1, el.offsetHeight - viewportH);
      const scrolled = -rect.top;
      const next = clamp01(scrolled / scrollable);
      setProgress(next);
      onProgressChange?.(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onProgressChange]);

  const scrollToBeat = (targetProgress: number) => {
    const el = runwayRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: top + scrollable * targetProgress,
      behavior: 'smooth',
    });
  };

  // 3-Act Choreography Math:
  // Act 1 (0.00 -> 0.28): Pure white blueprint square with blue typography
  // Act 2 (0.28 -> 0.56): Square fills solid Dropbox Blue (#0061FF) with white manifesto
  // Act 3 (0.56 -> 0.96): Blue square shrinks 428px -> 76px center square while 8 tiles lock in!
  const bluePhase = easeInOutCubic((progress - 0.22) / 0.26);
  const unfoldPhase = easeOutCubic((progress - 0.54) / 0.42);
  const mosaicInteractive = progress >= 0.86;

  // Interpolate center hero square dimensions: 428px -> 76px (exact center tile size!)
  const boxSize = 428 - (428 - 76) * unfoldPhase;
  const heroBoxOpacity = progress >= 0.95 ? Math.max(0, 1 - (progress - 0.95) / 0.04) : 1;
  const heroTextOpacity = Math.max(0, 1 - easeOutCubic((progress - 0.52) / 0.14));

  // Crossfade Act 1 white-card text -> Act 2 blue-card text
  const act1TextOpacity = Math.max(0, 1 - bluePhase * 1.6) * heroTextOpacity;
  const act2TextOpacity = Math.max(0, Math.min(1, (bluePhase - 0.25) * 1.6)) * heroTextOpacity;

  // Mosaic reveal physics (scales smoothly from 1.14 outward -> 1.00 locked!)
  const mosaicOpacity = easeOutCubic((progress - 0.56) / 0.34);
  const mosaicScale = 1.12 - 0.12 * unfoldPhase;

  // Blueprint tangent framing lines smoothly widen as the square unfolds
  const frameHalfW = 214 + (510 - 214) * unfoldPhase;
  const frameHalfH = 214 + (324 - 214) * unfoldPhase;

  const currentBeat = progress < 0.28 ? 0 : progress < 0.64 ? 1 : 2;

  return (
    <>
      {/* DESKTOP / TABLET (>=900px): Authentic Dropbox Scroll-Driven 3-Act Opening Runway */}
      <div
        ref={runwayRef}
        className="relative hidden min-[900px]:block"
        style={{ height: '245vh' }}
      >
        <div className="sticky top-0 flex h-[calc(100vh-48px)] w-full items-center justify-center overflow-hidden bg-white">
          {/* Ultra-subtle drafting background grid */}
          <div
            className="blueprint-grid-bg pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{ opacity: 0.45 + 0.35 * unfoldPhase }}
          />

          {/* 4 Dynamic Intersecting 1px Blueprint Tangent Hairlines (Dropbox Signature!) */}
          <div className="pointer-events-none absolute inset-0">
            {/* Left vertical hairline */}
            <div
              className="absolute bottom-0 top-0 w-px bg-[#0061FF]/22"
              style={{ left: `calc(50% - ${frameHalfW}px)` }}
            />
            {/* Right vertical hairline */}
            <div
              className="absolute bottom-0 top-0 w-px bg-[#0061FF]/22"
              style={{ left: `calc(50% + ${frameHalfW}px)` }}
            />
            {/* Top horizontal hairline */}
            <div
              className="absolute left-0 right-0 h-px bg-[#0061FF]/22"
              style={{ top: `calc(50% - ${frameHalfH}px)` }}
            />
            {/* Bottom horizontal hairline */}
            <div
              className="absolute left-0 right-0 h-px bg-[#0061FF]/22"
              style={{ top: `calc(50% + ${frameHalfH}px)` }}
            />

            {/* Outer architectural side margins (120px rails like Dropbox) */}
            <div className="absolute bottom-0 left-10 top-0 hidden w-px bg-[#0061FF]/12 xl:block" />
            <div className="absolute bottom-0 right-10 top-0 hidden w-px bg-[#0061FF]/12 xl:block" />
          </div>

          {/* Minimal Top Blueprint Corner Markers during Opening */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-8 py-5 xl:px-14">
            <div className="pointer-events-auto flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center bg-[var(--brand-blue)] font-display text-xs font-bold text-white">
                Ai
              </span>
              <span className="font-mono-tech text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-base)]">
                {siteConfig.brandEn}
              </span>
              <span className="font-mono-tech text-[10px] text-[var(--brand-blue)]">
                · {String(archiveDocs.length).padStart(2, '0')} DOCS /{' '}
                {String(allPromptCards.length).padStart(2, '0')} CARDS
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-3">
              {progress < 0.85 && (
                <button
                  onClick={() => scrollToBeat(1)}
                  className="font-mono-tech text-[11px] font-medium text-[var(--brand-blue)] transition-colors hover:text-[var(--ink-base)]"
                >
                  直接展开矩阵 ↓
                </button>
              )}
              <button
                onClick={() => onAction({ type: 'search' })}
                className="flex items-center gap-2 border border-[var(--blueprint-line-strong)] bg-white/90 px-3 py-1 font-mono-tech text-[11px] text-[var(--ink-base)] transition-colors hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                <Search className="h-3 w-3 text-[var(--brand-blue)]" />
                <span>⌘K</span>
              </button>
            </div>
          </div>

          {/* Right Rail 3-Act Beat Selector (Click OR Scroll) */}
          <div className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex">
            {[
              { idx: 0, label: '01 OPENING', target: 0 },
              { idx: 1, label: '02 SYSTEM', target: 0.44 },
              { idx: 2, label: '03 MATRIX', target: 1 },
            ].map((beat) => {
              const active = currentBeat === beat.idx;
              return (
                <button
                  key={beat.idx}
                  onClick={() => scrollToBeat(beat.target)}
                  className="group flex items-center gap-2"
                >
                  <span
                    className={`font-mono-tech text-[9px] tracking-[0.14em] transition-opacity ${
                      active
                        ? 'font-bold text-[var(--brand-blue)] opacity-100'
                        : 'text-[var(--ink-muted)] opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {beat.label}
                  </span>
                  <span
                    className={`block transition-all duration-300 ${
                      active
                        ? 'h-5 w-1.5 bg-[var(--brand-blue)]'
                        : 'h-2 w-1.5 bg-[#0061FF]/25 group-hover:bg-[var(--brand-blue)]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* LAYER A: The Unfolding 8-Tile Pinwheel Mosaic */}
          <div
            className="relative z-10 w-full px-6"
            style={{
              opacity: mosaicOpacity,
              transform: `scale(${mosaicScale})`,
              pointerEvents: mosaicInteractive ? 'auto' : 'none',
            }}
          >
            <PinwheelMosaic variant="stage" onAction={onAction} />
          </div>

          {/* LAYER B: The Morphing Center Opening Square (White -> Electric Blue -> 76×76 Tile!) */}
          {heroBoxOpacity > 0.01 && (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-between overflow-hidden"
              style={{
                width: `${boxSize}px`,
                height: `${boxSize}px`,
                opacity: heroBoxOpacity,
                backgroundColor: `rgb(${Math.round(255 - 255 * bluePhase)}, ${Math.round(255 - 158 * bluePhase)}, 255)`,
                border: `1px solid rgba(0, 97, 255, ${0.28 + 0.72 * bluePhase})`,
                boxShadow:
                  bluePhase > 0.2
                    ? '0 24px 60px -24px rgba(0, 97, 255, 0.35)'
                    : 'none',
              }}
            >
              {/* Act 1 Content: Pure White Square + Sharp Dropbox Blue Copy */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-9"
                style={{ opacity: act1TextOpacity }}
              >
                <div>
                  <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue)]">
                    {siteConfig.edition}
                  </span>
                  <h1 className="mt-4 font-display text-[32px] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--brand-blue)]">
                    在 ATELIER AI，
                    <br />
                    用设计规范的秩序
                    <br />
                    沉淀每一份 AI 研习资料。
                  </h1>
                  <p className="mt-4 text-[13px] leading-relaxed text-[var(--brand-blue)]/80">
                    Prompt 卡片集、图形学着色器、大模型笔记与工作流——全部由 Markdown 文件自动驱动。
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  {/* Iconic Geometric Emblem */}
                  <div className="flex h-11 w-11 items-center justify-center bg-[var(--brand-blue)] font-display text-lg font-bold text-white">
                    Ai
                  </div>
                  <span className="font-mono-tech text-[10px] uppercase tracking-[0.14em] text-[var(--brand-blue)]/75">
                    SCROLL TO UNFOLD ↓
                  </span>
                </div>
              </div>

              {/* Act 2 Content: Solid Electric Blue Square + Crisp White Statement */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-9 text-white"
                style={{ opacity: act2TextOpacity }}
              >
                <div>
                  <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
                    MODULAR KNOWLEDGE SYSTEM
                  </span>
                  <h2 className="mt-4 font-display text-[30px] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                    从精炼 Prompt 卡片，
                    <br />
                    到完整工程蓝图，
                    <br />
                    一处展开，随放随收。
                  </h2>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-2 font-mono-tech text-[11px] text-white/90">
                    <span className="h-2 w-2 bg-[#FAD24B]" />
                    <span className="h-2 w-2 bg-[#3DD6F5]" />
                    <span className="h-2 w-2 bg-[#FA551E]" />
                    <span className="h-2 w-2 bg-[#B4DC19]" />
                    <span className="ml-1 text-[10px] tracking-wider">8 MODULES READY</span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-white/80">
                    KEEP SCROLLING ↓
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Bottom Scroll Cue Button during Act 1 & Act 2 */}
          {progress < 0.78 && (
            <button
              onClick={() => scrollToBeat(progress < 0.25 ? 0.44 : 1)}
              aria-label="向下展开知识矩阵"
              className="group absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-[var(--brand-blue)] transition-opacity hover:opacity-80"
            >
              <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em]">
                {progress < 0.25 ? '向下滚动 · 展开体系' : '继续滚动 · 展开 8 格矩阵'}
              </span>
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </button>
          )}

          {/* Subtle scroll-down hint once Mosaic is locked */}
          {progress >= 0.94 && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
              继续向下浏览首期精选档案与完整目录 ↓
            </div>
          )}
        </div>
      </div>

      {/* MOBILE (<900px): Crisp Full-Screen Blueprint Opening Card + 2-Col Mosaic */}
      <div className="min-[900px]:hidden">
        <section className="blueprint-grid-bg flex min-h-[calc(100vh-105px)] flex-col items-center justify-center border-b border-[var(--blueprint-line)] bg-white px-5 py-10">
          <div className="w-full max-w-[380px] border border-[var(--brand-blue)]/35 bg-white p-7">
            <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              {siteConfig.edition}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-[var(--brand-blue)]">
              在 ATELIER AI，
              <br />
              用设计规范的秩序
              <br />
              沉淀每一份 AI 资料。
            </h1>
            <p className="mt-3 text-xs leading-relaxed text-[var(--brand-blue)]/80">
              {siteConfig.manifesto}
            </p>
            <div className="mt-8 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center bg-[var(--brand-blue)] font-display text-base font-bold text-white">
                Ai
              </div>
              <a
                href="#mobile-mosaic"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('mobile-mosaic')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 bg-[var(--brand-blue)] px-3.5 py-2 font-mono-tech text-[11px] font-semibold text-white"
              >
                <span>展开矩阵</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        <section
          id="mobile-mosaic"
          className="blueprint-grid-bg border-b border-[var(--blueprint-line)] bg-white px-4 py-8"
        >
          <PinwheelMosaic variant="hero" onAction={onAction} />
        </section>
      </div>
    </>
  );
}

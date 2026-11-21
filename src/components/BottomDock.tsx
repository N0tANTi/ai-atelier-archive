import { useEffect, useState } from 'react';
import { LayoutGrid, X, Search } from 'lucide-react';
import { siteConfig } from '../site.config';
import { PinwheelMosaic, type MosaicAction } from './PinwheelMosaic';

interface BottomDockProps {
  sectionLabel: string;
  mosaicOpen: boolean;
  onToggleMosaic: () => void;
  onCloseMosaic: () => void;
  onMosaicAction: (action: MosaicAction) => void;
  onOpenSearch: () => void;
  onOpenGuide: () => void;
}

export function BottomDock({
  sectionLabel,
  mosaicOpen,
  onToggleMosaic,
  onCloseMosaic,
  onMosaicAction,
  onOpenSearch,
  onOpenGuide,
}: BottomDockProps) {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      if (maxScroll <= 0) {
        setScrollPercent(0);
        return;
      }
      setScrollPercent(Math.min(100, Math.round((window.scrollY / maxScroll) * 100)));
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  useEffect(() => {
    if (!mosaicOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseMosaic();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mosaicOpen, onCloseMosaic]);

  return (
    <>
      {/* Full-Viewport Dropbox Mosaic Navigation Overlay */}
      {mosaicOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col justify-center overflow-y-auto bg-white/97 px-4 pb-20 pt-8 backdrop-blur-md"
          onClick={onCloseMosaic}
        >
          <div
            className="animate-dropbox-in mx-auto w-full max-w-[980px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-[var(--blueprint-line)] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 bg-[var(--brand-blue)]" />
                <span className="font-mono-tech text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  {siteConfig.brandEn} · NAVIGATION MOSAIC
                </span>
              </div>
              <span className="font-mono-tech text-[11px] text-[var(--ink-muted)]">
                CLICK ANY TILE OR PRESS ESC
              </span>
            </div>

            <PinwheelMosaic
              variant="overlay"
              onAction={(action) => {
                onCloseMosaic();
                if (action.type !== 'close') {
                  onMosaicAction(action);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Signature Fixed Bottom Dock (48px) with Reading Progress Line */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--hairline)] bg-white/96 backdrop-blur-md">
        {/* Thin Blue Reading Progress Bar */}
        <div className="h-[2px] w-full bg-[var(--blueprint-line)]">
          <div
            className="h-full bg-[var(--brand-blue)] transition-[width] duration-150 ease-out"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>

        <div className="mx-auto grid h-12 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8">
          {/* Left: Guide / Schema Quick Link */}
          <div className="flex justify-start">
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-2 whitespace-nowrap font-mono-tech text-[11px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--brand-blue)]"
            >
              <span className="hidden sm:inline">{siteConfig.brandEn}</span>
              <span className="hidden text-[var(--hairline-strong)] sm:inline">/</span>
              <span>归档规范</span>
            </button>
          </div>

          {/* Center: Iconic 48x48 Electric Blue Square Mosaic Toggle (exact 50% center) */}
          <button
            onClick={onToggleMosaic}
            aria-label={mosaicOpen ? '关闭全屏导航矩阵' : '展开全屏拼图导航矩阵'}
            title="全屏拼图导航矩阵"
            className={`flex h-12 w-12 items-center justify-center transition-colors duration-200 ${
              mosaicOpen
                ? 'bg-[var(--ink-base)] text-white'
                : 'bg-[var(--brand-blue)] text-white hover:bg-[var(--ink-base)]'
            }`}
          >
            {mosaicOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <LayoutGrid className="h-5 w-5" />
            )}
          </button>

          {/* Right: Current Section + Scroll % + Search Trigger */}
          <div className="flex items-center justify-end gap-3">
            <span className="hidden font-mono-tech text-[10px] text-[var(--ink-muted)] md:inline">
              {String(scrollPercent).padStart(2, '0')}%
            </span>
            <span className="max-w-[120px] truncate font-display text-xs font-semibold text-[var(--ink-base)] sm:max-w-[200px]">
              {sectionLabel}
            </span>
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1 rounded border border-[var(--hairline-strong)] px-2 py-0.5 font-mono-tech text-[10px] text-[var(--ink-secondary)] transition-colors hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              title="搜索 (⌘K)"
            >
              <Search className="h-3 w-3" />
              <span className="hidden sm:inline">⌘K</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

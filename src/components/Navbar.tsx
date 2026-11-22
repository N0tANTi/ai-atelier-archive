import { Search, LayoutGrid } from 'lucide-react';
import { siteConfig } from '../site.config';
import { projects, allPromptCards } from '../lib/content';
import type { GlobalHubRoute } from './PinwheelMosaic';

export type ActiveViewType = GlobalHubRoute | 'project' | 'doc';

interface NavbarProps {
  activeView: ActiveViewType;
  onNavigate: (route: GlobalHubRoute) => void;
  onOpenSearch: () => void;
  onOpenMosaic: () => void;
}

export function Navbar({
  activeView,
  onNavigate,
  onOpenSearch,
  onOpenMosaic,
}: NavbarProps) {
  const navItems: { id: GlobalHubRoute; label: string; en: string }[] = [
    { id: 'home', label: '首页', en: 'INDEX' },
    { id: 'projects', label: '项目', en: 'PROJECTS' },
    { id: 'prompts', label: 'Prompt 库', en: 'PROMPTS' },
    { id: 'demos', label: '3D 展厅', en: 'DEMOS' },
    { id: 'repos', label: '开源仓库', en: 'REPOS' },
    { id: 'guide', label: '规范', en: 'SCHEMA' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--blueprint-line)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-5 py-3 sm:px-8">
        {/* Left: Electric Blue Brand Square + Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="group flex shrink-0 items-center gap-3 whitespace-nowrap text-left focus:outline-none"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--brand-blue)] font-display text-sm font-bold text-white transition-colors duration-200 group-hover:bg-[var(--ink-base)]">
            Ai
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold tracking-tight text-[var(--ink-base)]">
                {siteConfig.brandEn}
              </span>
              <span className="hidden text-xs font-medium text-[var(--ink-secondary)] xl:inline">
                {siteConfig.brandZh}
              </span>
            </div>
            <span className="font-mono-tech text-[10px] tracking-[0.1em] text-[var(--brand-blue)]">
              {String(projects.length).padStart(2, '0')} PROJECTS ·{' '}
              {String(allPromptCards.length).padStart(2, '0')} CARDS
            </span>
          </div>
        </button>

        {/* Center: Clean Global Hub Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive =
              activeView === item.id ||
              (activeView === 'project' && item.id === 'projects') ||
              (activeView === 'doc' && item.id === 'home');
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-[var(--ink-base)] text-white'
                    : 'text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-base)]'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`hidden font-mono-tech text-[9px] tracking-[0.08em] xl:inline ${
                    isActive ? 'text-white/70' : 'text-[var(--ink-muted)]'
                  }`}
                >
                  {item.en}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Search + Mosaic Drawer Trigger */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="group flex items-center gap-2 whitespace-nowrap border border-[var(--hairline-strong)] bg-white px-3 py-1.5 text-xs text-[var(--ink-secondary)] transition-colors hover:border-[var(--brand-blue)] hover:text-[var(--ink-base)]"
            title="检索项目、卡片、笔记与仓库 (⌘K / /)"
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-[var(--brand-blue)]" />
            <span className="hidden sm:inline">全局检索…</span>
            <kbd className="border border-[var(--hairline)] bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono-tech text-[10px] text-[var(--ink-muted)]">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenMosaic}
            title="展开全屏色块矩阵导航"
            className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--brand-blue)] text-white transition-colors hover:bg-[var(--ink-base)]"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Horizontal Bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-[var(--blueprint-line)] px-5 py-2 lg:hidden">
        {navItems.map((item) => {
          const isActive =
            activeView === item.id ||
            (activeView === 'project' && item.id === 'projects');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`shrink-0 whitespace-nowrap px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--ink-base)] text-white'
                  : 'text-[var(--ink-secondary)]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}

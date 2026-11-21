import { Search, Moon, Sun, Layers, BookOpen, Compass } from 'lucide-react';
import { siteConfig } from '../site.config';
import { archiveDocs, allPromptCards } from '../lib/content';

export type NavRoute = 'home' | 'cards' | 'guide' | 'doc';

interface NavbarProps {
  activeRoute: NavRoute;
  onNavigate: (route: 'home' | 'cards' | 'guide') => void;
  onOpenSearch: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Navbar({
  activeRoute,
  onNavigate,
  onOpenSearch,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const navItems: {
    id: 'home' | 'cards' | 'guide';
    label: string;
    en: string;
    icon: typeof BookOpen;
  }[] = [
    { id: 'home', label: '档案目录', en: 'INDEX', icon: BookOpen },
    { id: 'cards', label: 'Prompt 卡片库', en: 'DECKS', icon: Layers },
    { id: 'guide', label: '归档指南', en: 'SCHEMA', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line-subtle)] bg-[var(--bg-canvas)]/88 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-3.5 sm:px-8">
        {/* Left: Editorial Monogram */}
        <button
          onClick={() => onNavigate('home')}
          className="group flex shrink-0 items-center gap-3 whitespace-nowrap text-left focus:outline-none"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--line-strong)] bg-[var(--bg-surface)] font-editorial text-lg italic leading-none text-[var(--ink-primary)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
            A
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-[11px] font-semibold tracking-[0.16em] text-[var(--ink-primary)]">
                {siteConfig.brandEn}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-[var(--accent)] sm:inline-block" />
              <span className="hidden text-xs font-medium text-[var(--ink-secondary)] sm:inline">
                {siteConfig.brandZh}
              </span>
            </div>
            <span className="font-mono-tech text-[10px] tracking-[0.1em] text-[var(--ink-muted)]">
              {String(archiveDocs.length).padStart(2, '0')} DOCS ·{' '}
              {String(allPromptCards.length).padStart(2, '0')} CARDS
            </span>
          </div>
        </button>

        {/* Center: Minimal Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive =
              activeRoute === item.id ||
              (activeRoute === 'doc' && item.id === 'home');
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] transition-all duration-300 ease-atelier ${
                  isActive
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-medium'
                    : 'text-[var(--ink-secondary)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--ink-primary)]'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`font-mono-tech text-[10px] tracking-[0.08em] ${
                    isActive ? 'opacity-75' : 'text-[var(--ink-muted)]'
                  }`}
                >
                  {item.en}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Search & Paper/Ink Switch */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="group flex items-center gap-2.5 whitespace-nowrap rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs text-[var(--ink-secondary)] transition-all duration-200 hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]"
            title="搜索档案与 Prompt 卡片 (⌘K / /)"
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-[var(--ink-muted)] transition-colors group-hover:text-[var(--accent)]" />
            <span className="hidden sm:inline">检索资料与卡片…</span>
            <kbd className="rounded border border-[var(--line-subtle)] bg-[var(--bg-canvas)] px-1.5 py-0.5 font-mono-tech text-[10px] text-[var(--ink-muted)]">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label="切换纸张/墨黑模式"
            title={theme === 'light' ? '切换至墨黑暗色模式' : '切换至暖纸亮色模式'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] transition-all duration-200 hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]"
          >
            {theme === 'light' ? (
              <Moon className="h-3.5 w-3.5" />
            ) : (
              <Sun className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-[var(--line-subtle)] px-5 py-2 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeRoute === item.id ||
            (activeRoute === 'doc' && item.id === 'home');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${
                isActive
                  ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-medium'
                  : 'text-[var(--ink-secondary)]'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

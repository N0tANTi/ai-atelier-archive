import { useEffect, useState, useCallback } from 'react';
import { Navbar, type NavRoute } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DocumentView } from './components/DocumentView';
import { PromptLibraryView } from './components/PromptLibraryView';
import { GuideView } from './components/GuideView';
import { CommandSearch } from './components/CommandSearch';
import { CardFocusModal } from './components/CardFocusModal';
import { Footer } from './components/Footer';
import {
  allPromptCards,
  getDocBySlug,
  type PromptCard,
} from './lib/content';

interface RouteState {
  view: NavRoute;
  slug?: string;
}

function parseHash(): RouteState {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  if (raw === '/cards') return { view: 'cards' };
  if (raw === '/guide') return { view: 'guide' };
  if (raw.startsWith('/doc/')) {
    return { view: 'doc', slug: raw.slice('/doc/'.length) };
  }
  return { view: 'home' };
}

export function App() {
  const [route, setRoute] = useState<RouteState>(() => parseHash());
  const [searchOpen, setSearchOpen] = useState(false);
  const [focusPool, setFocusPool] = useState<PromptCard[]>(allPromptCards);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('atelier-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem('atelier-theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Global ⌘K / Ctrl+K and '/' shortcut for Command Search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        !searchOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen]);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNav = useCallback(
    (target: 'home' | 'cards' | 'guide') => {
      if (target === 'home') navigate('/');
      if (target === 'cards') navigate('/cards');
      if (target === 'guide') navigate('/guide');
    },
    [navigate]
  );

  const handleOpenDoc = useCallback(
    (slug: string) => {
      navigate(`/doc/${slug}`);
    },
    [navigate]
  );

  const handleFocusCard = useCallback(
    (card: PromptCard, pool: PromptCard[] = allPromptCards) => {
      const idx = pool.findIndex((c) => c.id === card.id);
      setFocusPool(pool);
      setFocusIndex(idx >= 0 ? idx : 0);
    },
    []
  );

  const activeDoc =
    route.view === 'doc' && route.slug ? getDocBySlug(route.slug) : undefined;

  return (
    <div className="paper-grain flex min-h-screen flex-col">
      <Navbar
        activeRoute={route.view}
        onNavigate={handleNav}
        onOpenSearch={() => setSearchOpen(true)}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
        }
      />

      <main className="flex-1">
        {route.view === 'home' && (
          <HomeView
            onOpenDoc={handleOpenDoc}
            onOpenCards={() => handleNav('cards')}
            onOpenGuide={() => handleNav('guide')}
            onFocusCard={handleFocusCard}
          />
        )}

        {route.view === 'cards' && (
          <PromptLibraryView onFocusCard={handleFocusCard} />
        )}

        {route.view === 'guide' && <GuideView />}

        {route.view === 'doc' && activeDoc && (
          <DocumentView
            doc={activeDoc}
            onBack={() => handleNav('home')}
            onFocusCard={handleFocusCard}
          />
        )}

        {route.view === 'doc' && !activeDoc && (
          <div className="mx-auto max-w-xl px-5 py-24 text-center">
            <p className="font-editorial text-4xl italic text-[var(--ink-muted)]">
              Document not found
            </p>
            <p className="mt-2 text-sm text-[var(--ink-secondary)]">
              未找到对应的档案文档，可能已被移动或重命名。
            </p>
            <button
              onClick={() => handleNav('home')}
              className="mt-6 rounded-full bg-[var(--ink-primary)] px-5 py-2.5 text-xs font-medium text-[var(--bg-canvas)]"
            >
              返回档案目录
            </button>
          </div>
        )}
      </main>

      <Footer />

      <CommandSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDoc={handleOpenDoc}
        onFocusCard={(card) => handleFocusCard(card, allPromptCards)}
      />

      <CardFocusModal
        cards={focusPool}
        activeIndex={focusIndex}
        onClose={() => setFocusIndex(null)}
        onChangeIndex={setFocusIndex}
        onGoToDoc={handleOpenDoc}
      />
    </div>
  );
}

export default App;

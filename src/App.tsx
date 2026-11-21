import { useEffect, useState, useCallback } from 'react';
import { Navbar, type NavRoute } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DocumentView } from './components/DocumentView';
import { PromptLibraryView } from './components/PromptLibraryView';
import { GuideView } from './components/GuideView';
import { CommandSearch } from './components/CommandSearch';
import { CardFocusModal } from './components/CardFocusModal';
import { BottomDock } from './components/BottomDock';
import { Footer } from './components/Footer';
import type { MosaicAction } from './components/PinwheelMosaic';
import {
  allPromptCards,
  getDocBySlug,
  type PromptCard,
} from './lib/content';

interface RouteState {
  view: NavRoute;
  slug?: string;
  docTab?: 'cards' | 'master' | 'source';
}

function parseHash(): RouteState {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  if (raw === '/cards') return { view: 'cards' };
  if (raw === '/guide') return { view: 'guide' };
  if (raw.startsWith('/doc/')) {
    const [slugPart, queryPart] = raw.slice('/doc/'.length).split('?');
    const params = new URLSearchParams(queryPart || '');
    const tabParam = params.get('tab');
    return {
      view: 'doc',
      slug: slugPart,
      docTab:
        tabParam === 'master'
          ? 'master'
          : tabParam === 'source'
            ? 'source'
            : tabParam === 'cards'
              ? 'cards'
              : undefined,
    };
  }
  return { view: 'home' };
}

export function App() {
  const [route, setRoute] = useState<RouteState>(() => parseHash());
  const [searchOpen, setSearchOpen] = useState(false);
  const [mosaicOpen, setMosaicOpen] = useState(false);
  const [introProgress, setIntroProgress] = useState(0);
  const [focusPool, setFocusPool] = useState<PromptCard[]>(allPromptCards);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setMosaicOpen(false);
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        !searchOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setMosaicOpen(false);
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
    (slug: string, tab?: 'cards' | 'master' | 'source') => {
      navigate(tab ? `/doc/${slug}?tab=${tab}` : `/doc/${slug}`);
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

  const handleOverlayMosaicAction = useCallback(
    (action: MosaicAction) => {
      if (action.type === 'cards') handleNav('cards');
      else if (action.type === 'guide') handleNav('guide');
      else if (action.type === 'search') setSearchOpen(true);
      else if (action.type === 'doc') handleOpenDoc(action.slug, action.tab);
      else if (action.type === 'category') handleNav('home');
    },
    [handleNav, handleOpenDoc]
  );

  const activeDoc =
    route.view === 'doc' && route.slug ? getDocBySlug(route.slug) : undefined;

  const currentSectionLabel =
    route.view === 'home'
      ? '首页矩阵 · INDEX'
      : route.view === 'cards'
        ? 'Prompt 卡片库'
        : route.view === 'guide'
          ? '归档规范'
          : activeDoc?.title ?? '档案详情';

  const isHome = route.view === 'home';
  const showHomeTopNav = introProgress >= 0.98;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div
        className={
          isHome
            ? `sticky top-0 z-30 min-[900px]:fixed min-[900px]:left-0 min-[900px]:right-0 min-[900px]:top-0 transition-all duration-300 ease-dropbox ${
                showHomeTopNav
                  ? 'min-[900px]:translate-y-0 min-[900px]:opacity-100'
                  : 'min-[900px]:pointer-events-none min-[900px]:-translate-y-full min-[900px]:opacity-0'
              }`
            : 'sticky top-0 z-30'
        }
      >
        <Navbar
          activeRoute={route.view}
          onNavigate={handleNav}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMosaic={() => setMosaicOpen((prev) => !prev)}
        />
      </div>

      <main className="flex-1">
        {route.view === 'home' && (
          <HomeView
            onOpenDoc={handleOpenDoc}
            onOpenCards={() => handleNav('cards')}
            onOpenGuide={() => handleNav('guide')}
            onOpenSearch={() => setSearchOpen(true)}
            onFocusCard={handleFocusCard}
            onIntroProgress={setIntroProgress}
          />
        )}

        {route.view === 'cards' && (
          <PromptLibraryView onFocusCard={handleFocusCard} />
        )}

        {route.view === 'guide' && <GuideView />}

        {route.view === 'doc' && activeDoc && (
          <DocumentView
            doc={activeDoc}
            initialTab={route.docTab}
            onBack={() => handleNav('home')}
            onFocusCard={handleFocusCard}
          />
        )}

        {route.view === 'doc' && !activeDoc && (
          <div className="mx-auto max-w-xl px-5 py-24 text-center">
            <p className="font-display text-3xl font-bold text-[var(--ink-base)]">
              Document not found
            </p>
            <p className="mt-2 text-sm text-[var(--ink-secondary)]">
              未找到对应的档案文档，可能已被移动或重命名。
            </p>
            <button
              onClick={() => handleNav('home')}
              className="mt-6 bg-[var(--brand-blue)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[var(--ink-base)]"
            >
              返回首页矩阵
            </button>
          </div>
        )}
      </main>

      <Footer />

      <BottomDock
        sectionLabel={currentSectionLabel}
        mosaicOpen={mosaicOpen}
        onToggleMosaic={() => setMosaicOpen((prev) => !prev)}
        onCloseMosaic={() => setMosaicOpen(false)}
        onMosaicAction={handleOverlayMosaicAction}
        onOpenSearch={() => {
          setMosaicOpen(false);
          setSearchOpen(true);
        }}
        onOpenGuide={() => {
          setMosaicOpen(false);
          handleNav('guide');
        }}
      />

      <CommandSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDoc={(slug) => handleOpenDoc(slug)}
        onFocusCard={(card) => handleFocusCard(card, allPromptCards)}
      />

      <CardFocusModal
        cards={focusPool}
        activeIndex={focusIndex}
        onClose={() => setFocusIndex(null)}
        onChangeIndex={setFocusIndex}
        onGoToDoc={(slug) => handleOpenDoc(slug)}
      />
    </div>
  );
}

export default App;

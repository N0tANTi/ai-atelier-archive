import { useEffect, useState, useCallback } from 'react';
import { Navbar, type ActiveViewType } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ProjectsHubView } from './components/ProjectsHubView';
import { ProjectView, type ProjectTab } from './components/ProjectView';
import { PromptLibraryView } from './components/PromptLibraryView';
import { DemosHubView } from './components/DemosHubView';
import { ReposHubView } from './components/ReposHubView';
import { NotesHubView } from './components/NotesHubView';
import { StandaloneDocView } from './components/StandaloneDocView';
import { GuideView } from './components/GuideView';
import { CommandSearch } from './components/CommandSearch';
import { CardFocusModal } from './components/CardFocusModal';
import { BottomDock } from './components/BottomDock';
import { Footer } from './components/Footer';
import type { GlobalHubRoute, MosaicAction } from './components/PinwheelMosaic';
import {
  allPromptCards,
  getProjectBySlug,
  getStandaloneDocBySlug,
  type PromptCard,
} from './lib/content';

interface RouteState {
  view: ActiveViewType;
  slug?: string;
  projectTab?: ProjectTab;
}

function parseHash(): RouteState {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  if (raw === '/projects') return { view: 'projects' };
  if (raw === '/prompts' || raw === '/cards') return { view: 'prompts' };
  if (raw === '/demos') return { view: 'demos' };
  if (raw === '/notes') return { view: 'notes' };
  if (raw === '/papers') return { view: 'papers' };
  if (raw === '/workflows') return { view: 'workflows' };
  if (raw === '/repos') return { view: 'repos' };
  if (raw === '/guide') return { view: 'guide' };

  if (raw.startsWith('/project/')) {
    const [slugPart, queryPart] = raw.slice('/project/'.length).split('?');
    const params = new URLSearchParams(queryPart || '');
    const t = params.get('tab');
    const projectTab: ProjectTab =
      t === 'prompts' || t === 'tech' || t === 'source' ? t : 'overview';
    return { view: 'project', slug: slugPart, projectTab };
  }

  if (raw.startsWith('/doc/')) {
    const slugPart = raw.slice('/doc/'.length).split('?')[0];
    return { view: 'doc', slug: slugPart };
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

  const handleNavigateHub = useCallback(
    (target: GlobalHubRoute) => {
      if (target === 'home') navigate('/');
      else navigate(`/${target}`);
    },
    [navigate]
  );

  const handleOpenProject = useCallback(
    (slug: string, tab: ProjectTab = 'overview') => {
      navigate(
        tab === 'overview' ? `/project/${slug}` : `/project/${slug}?tab=${tab}`
      );
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

  const handleOverlayMosaicAction = useCallback(
    (action: MosaicAction) => {
      if (action.type === 'route') handleNavigateHub(action.route);
      else if (action.type === 'search') setSearchOpen(true);
    },
    [handleNavigateHub]
  );

  const activeProject =
    route.view === 'project' && route.slug
      ? getProjectBySlug(route.slug)
      : undefined;

  const activeDoc =
    route.view === 'doc' && route.slug
      ? getStandaloneDocBySlug(route.slug)
      : undefined;

  const sectionLabels: Record<ActiveViewType, string> = {
    home: '首页矩阵 · INDEX',
    projects: '全部项目 · PROJECTS',
    prompts: 'Prompt 卡片库',
    demos: '在线 3D 展厅',
    notes: '技术笔记',
    papers: '论文拆解',
    workflows: 'AI 工作流',
    repos: '开源仓库合集',
    guide: '归档规范',
    project: activeProject ? `P${activeProject.number} · ${activeProject.title}` : '项目档案',
    doc: activeDoc?.title ?? '文档阅读',
  };

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
          activeView={route.view}
          onNavigate={handleNavigateHub}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMosaic={() => setMosaicOpen((prev) => !prev)}
        />
      </div>

      <main className="flex-1">
        {route.view === 'home' && (
          <HomeView
            onNavigateHub={handleNavigateHub}
            onOpenProject={handleOpenProject}
            onOpenDoc={handleOpenDoc}
            onOpenSearch={() => setSearchOpen(true)}
            onFocusCard={handleFocusCard}
            onIntroProgress={setIntroProgress}
          />
        )}

        {route.view === 'projects' && (
          <ProjectsHubView
            onOpenProject={handleOpenProject}
            onOpenGuide={() => handleNavigateHub('guide')}
          />
        )}

        {route.view === 'project' && activeProject && (
          <ProjectView
            project={activeProject}
            initialTab={route.projectTab}
            onBack={() => handleNavigateHub('projects')}
            onFocusCard={handleFocusCard}
          />
        )}

        {route.view === 'prompts' && (
          <PromptLibraryView onFocusCard={handleFocusCard} />
        )}

        {route.view === 'demos' && (
          <DemosHubView onOpenProject={handleOpenProject} />
        )}

        {route.view === 'repos' && (
          <ReposHubView onOpenProject={handleOpenProject} />
        )}

        {(route.view === 'notes' ||
          route.view === 'papers' ||
          route.view === 'workflows') && (
          <NotesHubView
            kind={route.view}
            onOpenProject={handleOpenProject}
            onOpenDoc={handleOpenDoc}
            onOpenGuide={() => handleNavigateHub('guide')}
          />
        )}

        {route.view === 'guide' && <GuideView />}

        {route.view === 'doc' && activeDoc && (
          <StandaloneDocView
            doc={activeDoc}
            onBack={() => handleNavigateHub('notes')}
          />
        )}

        {((route.view === 'project' && !activeProject) ||
          (route.view === 'doc' && !activeDoc)) && (
          <div className="mx-auto max-w-xl px-5 py-24 text-center">
            <p className="font-display text-3xl font-bold text-[var(--ink-base)]">
              Record not found
            </p>
            <p className="mt-2 text-sm text-[var(--ink-secondary)]">
              未找到对应的项目或文档，可能已被移动或重命名。
            </p>
            <button
              onClick={() => handleNavigateHub('projects')}
              className="mt-6 bg-[var(--brand-blue)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[var(--ink-base)]"
            >
              返回全部项目
            </button>
          </div>
        )}
      </main>

      <Footer />

      <BottomDock
        sectionLabel={sectionLabels[route.view]}
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
          handleNavigateHub('guide');
        }}
      />

      <CommandSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProject={handleOpenProject}
        onSelectDoc={handleOpenDoc}
        onFocusCard={(card) => handleFocusCard(card, allPromptCards)}
      />

      <CardFocusModal
        cards={focusPool}
        activeIndex={focusIndex}
        onClose={() => setFocusIndex(null)}
        onChangeIndex={setFocusIndex}
        onGoToOwner={(card) => {
          if (card.ownerType === 'project') {
            handleOpenProject(card.ownerSlug, 'prompts');
          } else {
            handleOpenDoc(card.ownerSlug);
          }
        }}
      />
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DiscoverPage from './pages/DiscoverPage';
import MoodPage from './pages/MoodPage';
import WatchRoomPage from './pages/WatchRoomPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import CompanionPage from './pages/CompanionPage';
import { Page } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      if (hash) setCurrentPage(hash);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage onNavigate={handleNavigate} />;
      case 'discover': return <DiscoverPage />;
      case 'mood': return <MoodPage />;
      case 'watchroom': return <WatchRoomPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'profile': return <ProfilePage />;
      case 'companion': return <CompanionPage />;
      default: return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-900">
      {currentPage !== 'landing' && (
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      {currentPage === 'landing' && (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
            <button onClick={() => handleNavigate('landing')} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                </svg>
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Stream<span className="gradient-text">Mind</span>
              </span>
            </button>
            <div className="hidden md:flex items-center gap-1">
              {([['discover', 'Discover'], ['mood', 'Mood AI'], ['watchroom', 'Watch Room'], ['analytics', 'Analytics']] as [Page, string][]).map(([id, label]) => (
                <button key={id} onClick={() => handleNavigate(id)} className="px-3.5 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => handleNavigate('mood')} className="btn-primary text-sm px-5 py-2.5">
              Get Started
            </button>
          </div>
        </div>
      )}
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

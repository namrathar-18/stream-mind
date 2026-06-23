import { Zap, Brain, Play, BarChart3, Users, User, Compass } from 'lucide-react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'discover', label: 'Discover', icon: <Compass size={16} /> },
  { id: 'mood', label: 'Mood AI', icon: <Brain size={16} /> },
  { id: 'watchroom', label: 'Watch Room', icon: <Play size={16} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  { id: 'companion', label: 'AI Companion', icon: <Zap size={16} /> },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-brand transition-shadow">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Stream<span className="gradient-text">Mind</span>
          </span>
        </button>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === 'profile'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Users size={16} />
            <span className="hidden sm:block">Community</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-600 flex items-center justify-center shadow-glow-sm hover:shadow-glow-brand transition-shadow"
          >
            <User size={16} className="text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}

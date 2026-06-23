import { useState } from 'react';
import { User, Star, TrendingUp, Heart, Plus, Edit3, BookOpen, Award, Zap, ChevronRight, Grid3x3, List } from 'lucide-react';
import { CONTENT_CATALOG, MOODS } from '../data/content';
import ContentCard from '../components/ContentCard';

const PLAYLISTS = [
  { id: '1', name: 'Inspiration Queue', count: 8, gradient: 'from-brand-500 to-cyan-500' },
  { id: '2', name: 'Weekend Binge', count: 12, gradient: 'from-pink-500 to-rose-600' },
  { id: '3', name: 'Study Companion', count: 5, gradient: 'from-green-500 to-teal-600' },
];

const ACHIEVEMENTS = [
  { icon: '🎬', label: '100 Watch Hours', earned: true },
  { icon: '🧠', label: 'Mood Master', earned: true },
  { icon: '🔥', label: '7-Day Streak', earned: true },
  { icon: '🌟', label: 'Top Curator', earned: false },
  { icon: '🚀', label: 'Power User', earned: false },
  { icon: '💡', label: 'Early Adopter', earned: true },
];

const COMMUNITY_CREATORS = [
  { name: 'CinephileSam', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60', followers: '12.4K', specialty: 'Sci-Fi Curator' },
  { name: 'MoodMovies', avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=60', followers: '8.1K', specialty: 'Wellness Content' },
  { name: 'DeepDiveDoc', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60', followers: '5.7K', specialty: 'Documentary Expert' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'playlists' | 'community' | 'achievements'>('watchlist');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const favoriteContent = CONTENT_CATALOG.slice(0, 6);
  const topMood = MOODS.find(m => m.id === 'inspired')!;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-900/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-brand">
                <User size={40} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-green-500 border-2 border-surface-800 flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-black text-white">Alex Mercer</h1>
                  <p className="text-white/50 text-sm">@alexmercer · Product Designer · San Francisco</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${topMood.bg} ${topMood.border} ${topMood.text} border`}>
                      {topMood.emoji} {topMood.label} streak
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-400">
                      🔥 7-day streak
                    </div>
                  </div>
                </div>
                <button className="btn-secondary text-xs px-3 py-2">
                  <Edit3 size={13} />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 md:flex md:gap-8">
              {[
                { label: 'Watched', value: '247' },
                { label: 'Hours', value: '312' },
                { label: 'Playlists', value: '14' },
                { label: 'Following', value: '89' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Personality Profile */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="glass-card rounded-2xl p-5 md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <h2 className="font-display font-bold text-white">AI Personality Profile</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Curiosity', value: 92, color: '#6366f1' },
                { label: 'Emotionality', value: 78, color: '#22d3ee' },
                { label: 'Adventure', value: 65, color: '#10b981' },
                { label: 'Comfort Seeking', value: 55, color: '#f59e0b' },
              ].map(trait => (
                <div key={trait.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-white/60">{trait.label}</span>
                    <span className="text-xs font-bold text-white">{trait.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${trait.value}%`, backgroundColor: trait.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-brand-500/5 border border-brand-500/15">
              <p className="text-xs text-brand-300 leading-relaxed">
                <span className="font-semibold">AI Profile:</span> You're a curious intellectual who values deep narratives and aspirational stories. You consume content most effectively in 2-hour blocks on evenings.
              </p>
            </div>
          </div>

          {/* Top Moods */}
          <div className="glass-card rounded-2xl p-5">
            <h2 className="font-display font-bold text-white mb-5">Top Moods</h2>
            <div className="space-y-3">
              {[
                { mood: 'inspired', count: 23, percentage: 35 },
                { mood: 'motivated', count: 18, percentage: 27 },
                { mood: 'relaxed', count: 14, percentage: 21 },
                { mood: 'curious', count: 11, percentage: 17 },
              ].map(({ mood, count, percentage }) => {
                const m = MOODS.find(mo => mo.id === mood);
                return m ? (
                  <div key={mood} className="flex items-center gap-3">
                    <span className="text-lg w-7 text-center">{m.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-white/70 font-medium capitalize">{mood}</span>
                        <span className="text-xs text-white/40">{count}x</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 p-1 rounded-xl glass border border-white/[0.06]">
            {[
              { id: 'watchlist', label: 'Watchlist', icon: <BookOpen size={14} /> },
              { id: 'playlists', label: 'Playlists', icon: <Heart size={14} /> },
              { id: 'community', label: 'Community', icon: <Star size={14} /> },
              { id: 'achievements', label: 'Achievements', icon: <Award size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-glow-sm'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'watchlist' && (
            <div className="flex items-center gap-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-white/40 hover:text-white glass border border-white/[0.06]'}`}>
                <Grid3x3 size={14} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-white/40 hover:text-white glass border border-white/[0.06]'}`}>
                <List size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'watchlist' && (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favoriteContent.map(c => <ContentCard key={c.id} content={c} size="sm" />)}
                <div className="flex items-center justify-center aspect-[4/3] rounded-2xl glass border border-dashed border-white/10 cursor-pointer hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group">
                  <div className="text-center">
                    <Plus size={20} className="text-white/20 group-hover:text-brand-400 transition-colors mx-auto mb-1" />
                    <span className="text-xs text-white/20 group-hover:text-white/50 transition-colors">Add</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteContent.map(c => (
                  <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/[0.04] hover:border-white/8 transition-all cursor-pointer">
                    <img src={c.image} alt={c.title} className="w-16 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{c.title}</p>
                      <p className="text-xs text-white/40 mt-0.5 capitalize">{c.type} · {c.genre[0]} · {c.duration}m</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-white/60">{c.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={12} className="text-brand-400" />
                        <span className="text-xs font-bold text-brand-300">{c.matchScore}%</span>
                      </div>
                      <ChevronRight size={14} className="text-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="grid md:grid-cols-3 gap-5">
            {PLAYLISTS.map(pl => (
              <div key={pl.id} className="glass-card rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-200 hover:shadow-card-hover group">
                <div className={`w-full h-24 rounded-xl mb-4 bg-gradient-to-br ${pl.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="grid grid-cols-3 gap-1 w-full h-full absolute inset-0 opacity-30">
                    {CONTENT_CATALOG.slice(0, 3).map(c => (
                      <img key={c.id} src={c.image} alt="" className="w-full h-full object-cover" />
                    ))}
                  </div>
                  <BookOpen size={28} className="text-white relative z-10 opacity-80" />
                </div>
                <p className="font-display font-bold text-white mb-1">{pl.name}</p>
                <p className="text-xs text-white/40">{pl.count} items</p>
              </div>
            ))}
            <div className="glass-card rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-200 border-dashed border-white/10 flex items-center justify-center group min-h-[160px]">
              <div className="text-center">
                <Plus size={24} className="text-white/20 group-hover:text-brand-400 transition-colors mx-auto mb-2" />
                <p className="text-sm text-white/30 group-hover:text-white/60 transition-colors font-medium">New Playlist</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div>
            <h3 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-400" />
              Top Creators to Follow
            </h3>
            <div className="space-y-4">
              {COMMUNITY_CREATORS.map(creator => (
                <div key={creator.name} className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/[0.04] hover:border-white/8 transition-all">
                  <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{creator.name}</p>
                    <p className="text-xs text-white/40">{creator.specialty}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">{creator.followers}</p>
                    <p className="text-xs text-white/30">followers</p>
                  </div>
                  <button className="btn-secondary text-xs px-3 py-2 flex-shrink-0">Follow</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ACHIEVEMENTS.map(a => (
              <div key={a.label} className={`glass-card rounded-2xl p-5 text-center transition-all ${a.earned ? 'border-brand-500/20 hover:-translate-y-1 cursor-pointer' : 'opacity-40'}`}>
                <div className={`text-3xl mb-3 ${!a.earned ? 'grayscale' : ''}`}>{a.icon}</div>
                <p className="text-xs font-semibold text-white/70 leading-tight">{a.label}</p>
                {a.earned && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-xs text-green-400">Earned</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

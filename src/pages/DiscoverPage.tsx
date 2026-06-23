import { useState, useMemo } from 'react';
import { Search, Filter, Zap, Clock, SlidersHorizontal, X, ChevronDown, TrendingUp, Sparkles } from 'lucide-react';
import { CONTENT_CATALOG } from '../data/content';
import ContentCard from '../components/ContentCard';
import { Content } from '../types';

const GENRES = ['All', 'Sci-Fi', 'Drama', 'Comedy', 'Documentary', 'Thriller', 'Action', 'Nature', 'Tech', 'Biography', 'Wellness'];
const TYPES = ['All', 'movie', 'series', 'documentary', 'podcast', 'short'];
const AI_SEARCHES = [
  'Motivational movies about startups',
  'Dark sci-fi with strong female leads',
  'Feel-good shows under 45 minutes',
  'Inspiring documentaries about science',
  'Comedies for stress relief',
  'Epic adventures for movie night',
];

const TIME_FILTERS = [
  { label: 'Any', value: 9999 },
  { label: '< 30 min', value: 30 },
  { label: '< 1 hour', value: 60 },
  { label: '< 2 hours', value: 120 },
];

function scoreContent(content: Content, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (content.title.toLowerCase().includes(q)) score += 40;
  if (content.description.toLowerCase().includes(q)) score += 20;
  content.genre.forEach(g => { if (g.toLowerCase().includes(q) || q.includes(g.toLowerCase())) score += 15; });
  content.mood.forEach(m => { if (m.toLowerCase().includes(q) || q.includes(m.toLowerCase())) score += 10; });
  if (content.type.includes(q)) score += 10;
  // Keyword matching
  const keywords = ['startup', 'startup', 'female', 'woman', 'inspire', 'motivat', 'feel-good', 'relax', 'stress', 'science', 'nature', 'dark', 'epic', 'comedy', 'thriller'];
  keywords.forEach(kw => {
    if (q.includes(kw)) {
      if (content.description.toLowerCase().includes(kw) || content.genre.some(g => g.toLowerCase().includes(kw))) score += 25;
    }
  });
  return score;
}

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [maxTime, setMaxTime] = useState(9999);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'recent'>('match');
  const [aiSearched, setAiSearched] = useState(false);

  const filtered = useMemo(() => {
    let results = [...CONTENT_CATALOG];

    if (query.trim()) {
      results = results.map(c => ({ ...c, matchScore: scoreContent(c, query) + (c.matchScore || 80) }))
        .filter(c => (c.matchScore || 0) > 80 || c.title.toLowerCase().includes(query.toLowerCase()));
    }

    if (activeGenre !== 'All') {
      results = results.filter(c => c.genre.some(g => g.toLowerCase() === activeGenre.toLowerCase()));
    }

    if (activeType !== 'All') {
      results = results.filter(c => c.type === activeType);
    }

    results = results.filter(c => c.duration <= maxTime);

    if (sortBy === 'match') results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    else if (sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);
    else results.sort((a, b) => b.year - a.year);

    return results;
  }, [query, activeGenre, activeType, maxTime, sortBy]);

  const handleAISearch = (prompt: string) => {
    setQuery(prompt);
    setAiSearched(true);
  };

  const clearSearch = () => {
    setQuery('');
    setAiSearched(false);
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="section-label mb-3">Content Discovery</div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-2">
            Discover <span className="gradient-text">everything</span>
          </h1>
          <p className="text-white/40">Search with natural language. AI understands context, not just keywords.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Search size={18} className="text-white/30 group-focus-within:text-brand-400 transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setAiSearched(false); }}
            placeholder='Try: "Inspiring startup documentaries" or "Dark sci-fi with strong leads"'
            className="w-full pl-12 pr-20 py-4 rounded-2xl glass text-white placeholder:text-white/20 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200 text-sm border border-white/[0.06]"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button onClick={clearSearch} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <X size={14} />
              </button>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20">
              <Zap size={12} className="text-brand-400" />
              <span className="text-xs text-brand-400 font-semibold">AI</span>
            </div>
          </div>
        </div>

        {/* AI Search Suggestions */}
        {!query && (
          <div className="mb-8">
            <p className="text-xs text-white/30 mb-3 font-medium uppercase tracking-widest">Try an AI search</p>
            <div className="flex flex-wrap gap-2">
              {AI_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleAISearch(s)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass border border-white/[0.06] text-xs text-white/60 hover:text-white hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-200"
                >
                  <Sparkles size={11} className="text-brand-400" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Result Header */}
        {aiSearched && query && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AI Search Results</p>
              <p className="text-xs text-white/50">Found {filtered.length} results matching "{query}"</p>
            </div>
          </div>
        )}

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Genre chips */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeGenre === g
                      ? 'bg-brand-600 text-white shadow-glow-sm'
                      : 'glass text-white/50 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0 ${showFilters ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20' : 'glass text-white/50 hover:text-white border border-white/[0.06]'}`}
          >
            <SlidersHorizontal size={15} />
            Filters
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="glass-card p-5 rounded-2xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in">
            {/* Type Filter */}
            <div>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-3">Content Type</p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${activeType === t ? 'bg-brand-600 text-white' : 'glass text-white/50 hover:text-white border border-white/[0.06]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Clock size={12} /> Duration
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_FILTERS.map(t => (
                  <button
                    key={t.label}
                    onClick={() => setMaxTime(t.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${maxTime === t.value ? 'bg-brand-600 text-white' : 'glass text-white/50 hover:text-white border border-white/[0.06]'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Filter size={12} /> Sort By
              </p>
              <div className="flex flex-wrap gap-2">
                {[{ v: 'match', l: 'AI Match' }, { v: 'rating', l: 'Rating' }, { v: 'recent', l: 'Newest' }].map(s => (
                  <button
                    key={s.v}
                    onClick={() => setSortBy(s.v as 'match' | 'rating' | 'recent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === s.v ? 'bg-brand-600 text-white' : 'glass text-white/50 hover:text-white border border-white/[0.06]'}`}
                  >
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trending Row */}
        {!query && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={16} className="text-orange-400" />
              <h2 className="font-display font-bold text-white">Trending Now</h2>
              <span className="text-xs text-white/30 ml-1">— AI-ranked by engagement</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CONTENT_CATALOG.sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0)).slice(0, 4).map(c => (
                <ContentCard key={c.id} content={c} size="sm" />
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display font-bold text-white flex items-center gap-2">
            {query ? 'Search Results' : 'All Content'}
            <span className="text-sm text-white/30 font-normal">({filtered.length})</span>
          </h2>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(c => (
              <ContentCard key={c.id} content={c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-white/20" />
            </div>
            <p className="text-white/40 font-medium mb-2">No content matched your search</p>
            <p className="text-xs text-white/20">Try different keywords or remove some filters</p>
            <button onClick={clearSearch} className="mt-4 btn-ghost text-brand-400 hover:text-brand-300">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

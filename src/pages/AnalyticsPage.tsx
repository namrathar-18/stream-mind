import { TrendingUp, Clock, Brain, BarChart3, Zap, Star, Award, Target, Activity } from 'lucide-react';
import { MOCK_ANALYTICS, CONTENT_CATALOG, MOODS } from '../data/content';

const WEEKLY_MAX = 4.0;

function BarBlock({ height, color, label, value }: { height: number; color: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold text-white/60">{value}h</span>
      <div className="w-full relative flex items-end rounded-lg overflow-hidden" style={{ height: '80px', background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="w-full rounded-lg transition-all duration-700"
          style={{ height: `${(height / WEEKLY_MAX) * 100}%`, background: color }}
        />
      </div>
      <span className="text-xs text-white/40">{label}</span>
    </div>
  );
}

function MoodDot({ mood, score, date }: { mood: string; score: number; date: string }) {
  const moodData = MOODS.find(m => m.id === mood);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${moodData?.border || 'border-white/20'} ${moodData?.bg || 'bg-white/5'}`}
        style={{ boxShadow: score > 75 ? `0 0 12px rgba(99,102,241,0.3)` : 'none' }}>
        <span className="text-sm">{moodData?.emoji || '😐'}</span>
      </div>
      <div className="text-center">
        <div className="text-xs font-bold text-white">{score}</div>
        <div className="text-xs text-white/30">{date}</div>
      </div>
    </div>
  );
}

const TOP_STATS = [
  { icon: <Clock size={18} />, label: 'Hours This Week', value: '15.5', change: '+12%', positive: true, color: 'from-brand-500 to-brand-700' },
  { icon: <Brain size={18} />, label: 'Avg Mood Score', value: '74', change: '+8pts', positive: true, color: 'from-cyan-500 to-blue-600' },
  { icon: <Target size={18} />, label: 'Completion Rate', value: '89%', change: '+4%', positive: true, color: 'from-green-500 to-teal-600' },
  { icon: <Zap size={18} />, label: 'AI Match Score', value: '94%', change: 'avg', positive: true, color: 'from-orange-500 to-amber-600' },
];

export default function AnalyticsPage() {
  const analytics = MOCK_ANALYTICS;
  const topContent = CONTENT_CATALOG.sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0)).slice(0, 5);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="section-label mb-3">Intelligence Insights</div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-2">
            Your Entertainment <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-white/40">AI-powered insights into your watch habits, mood patterns, and content preferences.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TOP_STATS.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-white">{stat.icon}</span>
              </div>
              <div className="text-2xl font-display font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-white/40 mb-2">{stat.label}</div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp size={11} />
                {stat.change} vs last week
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Weekly Watch Hours */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-white">Weekly Watch Hours</h2>
                <p className="text-xs text-white/40 mt-0.5">Last 7 days</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/[0.06]">
                <Activity size={13} className="text-brand-400" />
                <span className="text-xs text-white/60">15.5h total</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {analytics.weeklyHours.map((day) => (
                <BarBlock
                  key={day.day}
                  height={day.hours}
                  color="linear-gradient(to top, #4f46e5, #22d3ee)"
                  label={day.day}
                  value={String(day.hours)}
                />
              ))}
            </div>
          </div>

          {/* Genre Breakdown */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-display font-bold text-white mb-6">Genre Breakdown</h2>
            <div className="space-y-4">
              {analytics.genreBreakdown.map((item) => (
                <div key={item.genre}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white/70 font-medium">{item.genre}</span>
                    <span className="text-sm font-bold text-white">{item.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-2">
              {analytics.genreBreakdown.slice(0, 4).map(item => (
                <div key={item.genre} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-white/30">{item.genre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Mood Trend */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-white">Mood Trend</h2>
                <p className="text-xs text-white/40 mt-0.5">Emotional state over the week</p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <span className="text-xs text-brand-400 font-semibold">AI Tracked</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4">
              {analytics.moodTrend.map((entry) => (
                <MoodDot key={entry.date} mood={entry.mood} score={entry.score} date={entry.date} />
              ))}
            </div>
            {/* Trend line representation */}
            <div className="mt-6 h-1.5 rounded-full overflow-hidden bg-white/[0.04]">
              <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-brand-500 rounded-full" style={{ width: '100%' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white/20">Low</span>
              <span className="text-xs text-white/20">High</span>
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <h2 className="font-display font-bold text-white">AI Insights</h2>
            </div>
            <div className="space-y-4">
              {analytics.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Engaged Content */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-orange-400" />
              <h2 className="font-display font-bold text-white">Top Engaged Content</h2>
            </div>
            <span className="text-xs text-white/30">by AI Engagement Score</span>
          </div>
          <div className="space-y-3">
            {topContent.map((content, i) => (
              <div key={content.id} className="flex items-center gap-4 p-3 rounded-xl glass border border-white/[0.04] hover:border-white/10 transition-all group cursor-pointer">
                <span className="text-sm font-black text-white/20 w-6 text-center">{i + 1}</span>
                <img src={content.image} alt={content.title} className="w-12 h-9 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{content.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-white/40 capitalize">{content.type}</span>
                    <span className="text-white/20">·</span>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white/40">{content.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-white/30 mb-1">Engagement</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full" style={{ width: `${content.engagementScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white">{content.engagementScore}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/30 mb-1">Match</p>
                    <div className="flex items-center gap-1">
                      <Zap size={11} className="text-brand-400" />
                      <span className="text-xs font-bold text-brand-300">{content.matchScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Impact */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-cyan-400" />
            <h2 className="font-display font-bold text-white">Entertainment Wellness Impact</h2>
            <div className="ml-auto px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="text-xs text-green-400 font-semibold">Positive Trend</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Sleep Quality', value: 78, change: '+6%', desc: 'Improved after comedies', color: '#6366f1' },
              { label: 'Stress Reduction', value: 65, change: '+12%', desc: 'Nature docs most effective', color: '#22d3ee' },
              { label: 'Focus Score', value: 82, change: '+3%', desc: 'Documentary binge effect', color: '#10b981' },
            ].map(m => (
              <div key={m.label} className="p-4 rounded-xl glass border border-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/70 font-medium">{m.label}</span>
                  <span className="text-xs text-green-400 font-semibold">{m.change}</span>
                </div>
                <div className="text-2xl font-display font-black text-white mb-2">{m.value}<span className="text-sm text-white/30">/100</span></div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                </div>
                <p className="text-xs text-white/30">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

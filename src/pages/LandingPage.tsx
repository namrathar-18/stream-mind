import { Brain, Zap, TrendingUp, Users, Shield, ChevronRight, Star, Clock, Sparkles, MessageSquare, BarChart3, Tv, Compass } from 'lucide-react';
import { Page } from '../types';
import { CONTENT_CATALOG } from '../data/content';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const features = [
  {
    icon: <Brain size={22} />,
    title: 'Mood-Aware AI',
    description: 'Tell the AI how you feel and it curates a perfect watch plan scientifically tuned to your emotional state.',
    color: 'from-brand-500 to-brand-700',
    glow: 'group-hover:shadow-glow-brand',
  },
  {
    icon: <Zap size={22} />,
    title: 'AI Match Engine',
    description: 'Every recommendation comes with an AI match score, engagement prediction, and completion probability.',
    color: 'from-cyan-500 to-blue-600',
    glow: 'group-hover:shadow-glow-cyan',
  },
  {
    icon: <MessageSquare size={22} />,
    title: 'AI Watch Companion',
    description: 'Ask questions about scenes, characters, and plot — get answers without spoilers in real time.',
    color: 'from-green-500 to-teal-600',
    glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]',
  },
  {
    icon: <Users size={22} />,
    title: 'Social Watch Rooms',
    description: 'Watch together with synchronized playback, live chat, reactions, and audience polls.',
    color: 'from-pink-500 to-rose-600',
    glow: 'group-hover:shadow-[0_0_40px_rgba(236,72,153,0.3)]',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Entertainment Analytics',
    description: 'Track mood trends, watch habits, genre patterns, and how content impacts your daily wellbeing.',
    color: 'from-orange-500 to-amber-600',
    glow: 'group-hover:shadow-[0_0_40px_rgba(249,115,22,0.3)]',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'AI Recap Generator',
    description: 'Missed an episode? Get AI-generated episode, season, and character recaps instantly.',
    color: 'from-violet-500 to-brand-600',
    glow: 'group-hover:shadow-glow-brand',
  },
];

const stats = [
  { value: '50M+', label: 'Active Users' },
  { value: '99.2%', label: 'Match Accuracy' },
  { value: '2.3B+', label: 'Recommendations' },
  { value: '187', label: 'Countries' },
];

const testimonials = [
  {
    name: 'Aria Chen',
    role: 'Product Designer',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'StreamMind understood I was stressed before I finished typing. The recommendations genuinely helped me unwind.',
  },
  {
    name: 'Marcus Silva',
    role: 'Software Engineer',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'The AI Companion feature is like having a film critic in the room who never spoils anything.',
  },
  {
    name: 'Lena Vogel',
    role: 'Therapist',
    avatar: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'I recommend StreamMind to my patients. The mood-based recommendations align with therapeutic content principles.',
  },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const featuredContent = CONTENT_CATALOG.slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background mesh */}
      <div className="fixed inset-0 bg-surface-900 bg-mesh-gradient pointer-events-none" />
      <div className="fixed inset-0 bg-noise pointer-events-none opacity-30" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass border border-brand-500/20 text-xs font-semibold text-brand-300">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Powered by GPT-4 + Custom Recommendation Engine
            <ChevronRight size={12} className="text-brand-400" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8 text-balance">
            Entertainment that{' '}
            <br />
            <span className="gradient-text">understands you.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed text-balance">
            StreamMind reads your mood, energy, and available time to deliver hyper-personalized content experiences. Beyond recommendations — this is AI-powered entertainment intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button onClick={() => onNavigate('mood')} className="btn-primary text-base px-8 py-4">
              <Brain size={18} />
              Try Mood AI
            </button>
            <button onClick={() => onNavigate('discover')} className="btn-secondary text-base px-8 py-4">
              <Tv size={18} />
              Browse Content
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-5 rounded-2xl text-center">
                <div className="font-display text-2xl md:text-3xl font-black gradient-text mb-1">{stat.value}</div>
                <div className="text-xs text-white/40 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Hero Visual - Featured Content Row */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-x-0 -top-10 h-20 bg-gradient-to-b from-surface-900 to-transparent pointer-events-none z-10" />
            <div className="grid grid-cols-3 gap-4">
              {featuredContent.map((content, i) => (
                <div
                  key={content.id}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover ${i === 1 ? 'scale-105 shadow-card' : 'scale-100 opacity-70 hover:opacity-100'}`}
                  onClick={() => onNavigate('discover')}
                >
                  <img src={content.image} alt={content.title} className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-brand-500/90 text-xs font-bold text-white backdrop-blur-sm">
                    <Zap size={10} />
                    {content.matchScore}%
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-bold text-white text-sm">{content.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white/60">{content.rating}</span>
                      <Clock size={11} className="text-white/40" />
                      <span className="text-xs text-white/60">{content.duration}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 -bottom-2 h-24 bg-gradient-to-t from-surface-900 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-4">Platform Features</div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              The full intelligence stack
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-lg">
              Every feature is built with AI at its core — not bolted on as an afterthought.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group glass-card p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${feature.glow} cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <span className="text-white">{feature.icon}</span>
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mood Demo Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label mb-6">Mood Intelligence</div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Your AI entertainment <span className="gradient-text">therapist</span>
            </h2>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              Describe how you feel in plain English. StreamMind's AI analyzes your emotional state and maps it to scientifically-validated content recommendations.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                '"I feel stressed and overwhelmed" → Calming nature docs + mindfulness podcasts',
                '"I want something inspiring" → Startup biopics + TED-style documentaries',
                '"I have 20 minutes" → Optimized short-form watch plan curated for you',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  </div>
                  <span className="text-white/60 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => onNavigate('mood')} className="btn-primary">
              <Brain size={16} />
              Try Mood Assistant
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Mood UI preview */}
          <div className="relative">
            <div className="glass-card rounded-3xl p-6 border border-white/[0.08]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                  <Brain size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">StreamMind AI</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Analyzing your mood
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-end">
                  <div className="bg-brand-600/40 border border-brand-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm text-white">I feel stressed and need to unwind</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-white/80 leading-relaxed">I understand. Your stress pattern suggests sensory overwhelm. I'm recommending calming nature content and a guided audio session. These activate your parasympathetic nervous system within 8-12 minutes.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CONTENT_CATALOG.filter(c => c.mood.includes('relaxed')).slice(0, 2).map(c => (
                  <div key={c.id} className="rounded-xl overflow-hidden relative group cursor-pointer">
                    <img src={c.image} alt={c.title} className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-semibold text-white leading-tight">{c.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Zap size={9} className="text-brand-400" />
                        <span className="text-xs text-brand-300 font-bold">{c.matchScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 glass-card px-3 py-2 rounded-xl border border-green-500/20 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp size={12} className="text-green-400" />
                </div>
                <span className="text-xs font-semibold text-white/80">Cortisol -27%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-4">Testimonials</div>
            <h2 className="font-display text-4xl font-black text-white">Loved by audiences worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6 rounded-2xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 border border-brand-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-brand-900/40 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              <div className="section-label mb-6 mx-auto">Get Started Free</div>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Start your intelligent <br /><span className="gradient-text">entertainment journey</span>
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">No credit card. No subscription required to start. Just smarter entertainment.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => onNavigate('mood')} className="btn-primary text-base px-8 py-4">
                  <Brain size={18} />
                  Start with Mood AI
                </button>
                <button onClick={() => onNavigate('discover')} className="btn-secondary text-base px-8 py-4">
                  <Compass size={18} />
                  Explore Platform
                </button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/30">
                <span className="flex items-center gap-1.5"><Shield size={12} /> Privacy first</span>
                <span className="flex items-center gap-1.5"><Zap size={12} /> Instant setup</span>
                <span className="flex items-center gap-1.5"><Star size={12} /> No ads ever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <Brain size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm">Stream<span className="gradient-text">Mind</span></span>
          </div>
          <p className="text-xs text-white/20">© 2024 StreamMind. AI-Powered Entertainment Intelligence Platform.</p>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

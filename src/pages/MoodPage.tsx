import { useState, useRef, useEffect } from 'react';
import { Brain, Send, Zap, Clock, ChevronRight, Mic, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { MOODS, TIME_SLOTS, CONTENT_CATALOG, MOOD_RECOMMENDATIONS } from '../data/content';
import ContentCard from '../components/ContentCard';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const THERAPIST_RESPONSES: Record<string, string> = {
  stressed: "I can sense you're carrying a lot right now. Acute stress elevates cortisol, which makes complex narratives feel overwhelming. I'm recommending gentle, visually immersive content that activates your parasympathetic nervous system. Nature documentaries and calming audio are clinically shown to reduce cortisol by 27% within 15 minutes.",
  anxious: "Anxiety often comes with a need for predictability and safety. I'm steering away from suspenseful thrillers and toward warm, character-driven stories with known positive outcomes. The characters in these recommendations are going to feel like trusted friends.",
  happy: "What a great mental state! This is the perfect time to consume intellectually ambitious content you might otherwise find challenging. Your elevated serotonin makes complex narratives more enjoyable and memorable.",
  inspired: "You're in a peak inspiration window — roughly 40 minutes where your mind is most receptive to motivational material. I'm surfacing content that amplifies and channels this energy into something tangible.",
  bored: "Boredom is your brain signaling it needs novelty and challenge. High-stakes narratives with strong mystery elements trigger dopamine release most effectively here. I've found your next obsession.",
  sad: "Sadness benefits most from warmth over wallowing. I'm not going to recommend tearjerkers — instead, content that features genuine human connection and small victories. These help rebuild positive emotional architecture.",
  motivated: "Motivation is precious — let's not waste it on filler content. I'm matching your state with stories of real human achievement and ambition. This pairing creates a reinforcement loop.",
  relaxed: "You're in a beautiful flow state. Gentle content that maintains this without spiking stress hormones is ideal. Visually stunning and slowly paced works beautifully here.",
};

function generateAIResponse(input: string, mood: string | null, time: number | null): string {
  const lower = input.toLowerCase();

  if (lower.includes('feel') || lower.includes('stress') || lower.includes('anxious') || lower.includes('sad') || lower.includes('happy') || lower.includes('bored')) {
    const detectedMood = Object.keys(THERAPIST_RESPONSES).find(m => lower.includes(m));
    if (detectedMood) return THERAPIST_RESPONSES[detectedMood];
  }

  if (mood && THERAPIST_RESPONSES[mood]) return THERAPIST_RESPONSES[mood];

  if (lower.includes('minute') || lower.includes('hour') || lower.includes('time')) {
    const minutes = time || 60;
    return `With ${minutes} minutes available, I'll build you an optimized watch plan. I'll prioritize content that delivers maximum emotional payoff within your time window — no cliffhangers if you're short on time.`;
  }

  if (lower.includes('inspire') || lower.includes('motivat')) {
    return THERAPIST_RESPONSES.inspired;
  }

  if (lower.includes('relax') || lower.includes('calm') || lower.includes('unwind')) {
    return THERAPIST_RESPONSES.relaxed;
  }

  return "Tell me how you're feeling right now, or describe what kind of experience you're looking for. I can analyze your mood, available time, and energy level to find perfect content matches. Try: 'I feel stressed and have 30 minutes' or 'I want something inspiring about science'.";
}

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'ai',
      text: "Hi! I'm your AI Entertainment Therapist. Tell me how you're feeling today, and I'll find the perfect content to match — or improve — your mood. You can also tell me how much time you have.",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState<typeof CONTENT_CATALOG>([]);
  const [therapistNote, setTherapistNote] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    const moodData = MOOD_RECOMMENDATIONS[moodId];
    if (moodData) {
      const recs = moodData.content.map(id => CONTENT_CATALOG.find(c => c.id === id)).filter(Boolean) as typeof CONTENT_CATALOG;
      setRecommendations(recs);
      setTherapistNote(moodData.therapy);

      const aiMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'ai',
        text: THERAPIST_RESPONSES[moodId] || `I've analyzed your ${moodId} state and found ${recs.length} perfectly matched recommendations for you.`,
        timestamp: new Date(),
      };

      setMessages(prev => [
        ...prev,
        { id: Date.now().toString() + '-user', role: 'user', text: `I'm feeling ${moodId}`, timestamp: new Date() },
        aiMsg,
      ]);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Detect mood from text
    const lower = chatInput.toLowerCase();
    const detectedMood = Object.keys(THERAPIST_RESPONSES).find(m => lower.includes(m)) || selectedMood;

    setTimeout(() => {
      const response = generateAIResponse(chatInput, detectedMood, selectedTime);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'ai', text: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      if (detectedMood) {
        setSelectedMood(detectedMood);
        const moodData = MOOD_RECOMMENDATIONS[detectedMood];
        if (moodData) {
          const recs = moodData.content.map(id => CONTENT_CATALOG.find(c => c.id === id)).filter(Boolean) as typeof CONTENT_CATALOG;
          setRecommendations(recs);
          setTherapistNote(moodData.therapy);
        }
      }
    }, 1200 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentMoodData = selectedMood ? MOODS.find(m => m.id === selectedMood) : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="section-label mb-3">Mood Intelligence</div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-2">
            AI <span className="gradient-text">Mood Assistant</span>
          </h1>
          <p className="text-white/40">Tell the AI how you feel. Get hyper-personalized recommendations backed by behavioral science.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Chat + Mood Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Selector */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">How are you feeling?</p>
              <div className="grid grid-cols-4 gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                      selectedMood === mood.id
                        ? `${mood.bg} ${mood.border} shadow-glow-sm`
                        : 'glass border-white/[0.06] hover:border-white/10'
                    }`}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className={`text-xs font-medium ${selectedMood === mood.id ? mood.text : 'text-white/40'}`}>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Availability */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Clock size={12} /> Time Available
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => setSelectedTime(slot.value)}
                    className={`flex-1 min-w-[calc(33%-0.5rem)] flex flex-col items-center px-2 py-3 rounded-xl border text-center transition-all duration-200 ${
                      selectedTime === slot.value
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        : 'glass border-white/[0.06] text-white/40 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-bold">{slot.label}</span>
                    <span className="text-xs text-white/30">{slot.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Therapist Note */}
            {therapistNote && currentMoodData && (
              <div className={`glass-card rounded-2xl p-5 border ${currentMoodData.border}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${currentMoodData.color} flex items-center justify-center`}>
                    <Brain size={14} className="text-white" />
                  </div>
                  <p className="text-xs font-semibold text-white">AI Therapist Analysis</p>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{therapistNote}</p>
              </div>
            )}
          </div>

          {/* Middle: Chat Interface */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="glass-card rounded-2xl flex flex-col" style={{ height: '520px' }}>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-sm">
                  <Brain size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">StreamMind AI Therapist</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400">Active — analyzing your state</span>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center gap-1.5">
                    <Zap size={11} className="text-brand-400" />
                    <span className="text-xs text-brand-400 font-semibold">GPT-4</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-brand-600/40 border border-brand-500/30 rounded-tr-sm'
                        : 'glass border border-white/[0.08] rounded-tl-sm'
                    }`}>
                      <p className="text-sm text-white/85 leading-relaxed">{msg.text}</p>
                      <p className="text-xs text-white/20 mt-1.5">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="glass border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:300ms]" />
                        <span className="text-xs text-white/30 ml-1">Analyzing your mood...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Starters */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {[
                      'I feel stressed and overwhelmed',
                      'I want something inspiring',
                      'I have 20 minutes',
                      'I need to laugh',
                    ].map(s => (
                      <button
                        key={s}
                        onClick={() => { setChatInput(s); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/[0.06] text-xs text-white/50 hover:text-white hover:border-brand-500/30 transition-all"
                      >
                        <Sparkles size={10} className="text-brand-400" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-white/[0.06]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tell me how you feel..."
                    className="flex-1 px-4 py-3 rounded-xl glass text-white placeholder:text-white/20 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all text-sm border border-white/[0.06]"
                  />
                  <button className="p-3 rounded-xl glass border border-white/[0.06] text-white/40 hover:text-white transition-all">
                    <Mic size={18} />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!chatInput.trim()}
                    className="p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-white hover:from-brand-500 hover:to-brand-400 transition-all disabled:opacity-40 shadow-glow-sm"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Time-based watch plan */}
            {selectedTime && selectedMood && (
              <div className="mt-5 glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-cyan-400" />
                    <p className="font-semibold text-white text-sm">
                      {selectedTime}-Minute Watch Plan
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                    <RefreshCw size={12} /> Regenerate
                  </button>
                </div>
                <div className="space-y-3">
                  {CONTENT_CATALOG
                    .filter(c => c.duration <= selectedTime && c.mood.some(m => m === selectedMood || m === 'relaxed'))
                    .slice(0, 2)
                    .map((c, i) => (
                      <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl glass border border-white/[0.06]">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400">{i + 1}</div>
                        <img src={c.image} alt={c.title} className="w-12 h-9 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{c.title}</p>
                          <p className="text-xs text-white/40">{c.duration}m • {c.type}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Zap size={12} className="text-brand-400" />
                          <span className="text-xs font-bold text-brand-300">{c.matchScore}%</span>
                        </div>
                        <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-400" />
                <h2 className="font-display font-bold text-white text-xl">
                  AI Recommendations for {currentMoodData?.label || 'your'} mood
                </h2>
              </div>
              {currentMoodData && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentMoodData.bg} ${currentMoodData.border} ${currentMoodData.text} border`}>
                  {currentMoodData.emoji} {currentMoodData.label}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recommendations.map(c => (
                <ContentCard key={c.id} content={c} size="lg" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

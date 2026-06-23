import { useState, useRef, useEffect } from 'react';
import { Zap, Send, BookOpen, Users, Film, RotateCcw, ChevronDown, Sparkles, Brain } from 'lucide-react';
import { CONTENT_CATALOG } from '../data/content';

interface CompanionMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
  type?: 'recap' | 'character' | 'scene' | 'normal';
}

const QUICK_ACTIONS = [
  { id: 'recap_ep', label: 'Episode Recap', icon: <Film size={13} />, prompt: 'Give me a recap of the last episode without spoiling what comes next' },
  { id: 'recap_season', label: 'Season Recap', icon: <BookOpen size={13} />, prompt: 'Summarize what has happened this season so far' },
  { id: 'character', label: 'Character Info', icon: <Users size={13} />, prompt: 'Tell me about the main characters without spoilers' },
  { id: 'explain', label: 'Explain Scene', icon: <Sparkles size={13} />, prompt: 'Explain the significance of the last scene I watched' },
  { id: 'predict', label: 'AI Prediction', icon: <Zap size={13} />, prompt: 'Based on my viewing history, how much will I enjoy the rest of this?' },
  { id: 'context', label: 'Historical Context', icon: <Brain size={13} />, prompt: 'Give me relevant real-world context for the themes in this content' },
];

const COMPANION_RESPONSES: Record<string, (title: string) => string> = {
  'Give me a recap of the last episode without spoiling what comes next': (title) =>
    `Last episode of **${title}**: The central conflict escalated significantly as our protagonists faced a pivotal decision. Key character relationships were tested and we got crucial backstory revelations that reframe earlier events. The episode ended on a charged moment that sets up significant consequences — without going further, I can tell you the next episode will fundamentally change how you see the first half of the season. (Zero spoilers beyond this point!)`,

  'Summarize what has happened this season so far': (title) =>
    `Season so far in **${title}**: We've been following the core arc across 6 episodes. The first act established the world and introduced each major player's motivation. A key alliance formed in episode 3 that has now become central to every subsequent plot thread. The turning point in episode 5 shifted the moral compass of the story — what seemed like clear heroes and villains is now beautifully ambiguous. You're about 60% through the narrative arc.`,

  'Tell me about the main characters without spoilers': (title) =>
    `Key characters in **${title}**:\n\n**Lead:** A deeply conflicted figure whose external mission masks an internal wound the story is really about.\n\n**The Antagonist:** Not simply villainous — their motivations are a dark mirror of the lead's. This is intentional and you'll see why.\n\n**The Wildcard:** Functionally comic relief but secretly the most emotionally intelligent character in the room. Watch them carefully.\n\nAll character arcs are in active development — none are resolved yet.`,

  'Explain the significance of the last scene I watched': (title) =>
    `That scene in **${title}** is doing three things simultaneously: First, it's a callback to the pilot's opening imagery — the color palette and blocking are deliberately mirrored. Second, the dialogue carries dual meaning: what's said on the surface is the opposite of what the character actually means. Third, this scene is the midpoint — narratively, everything from here moves toward resolution rather than complication. The show's creators confirmed in interviews this was the scene they wrote first.`,

  'Based on my viewing history, how much will I enjoy the rest of this?': (title) =>
    `AI Prediction for **${title}**:\n\n**Enjoyment Probability: 94%**\n\n Based on your history: You complete 91% of narrative-driven drama and 87% of sci-fi content. Your engagement with morally complex stories is in the top 8% of users. This content gets dramatically better in its final third — the payoff is calibrated exactly for your preference profile.\n\n⚠️ Completion Probability: 89% — with one caveat: episode 7 is slower-paced, which sometimes causes users like you to pause temporarily. Push through it.`,

  'Give me relevant real-world context for the themes in this content': (title) =>
    `Real-world context for **${title}**:\n\nThe core themes draw from documented historical and scientific sources. The creators did 2 years of research embedding real events and psychology. Key reference points: [1] The social dynamics depicted mirror documented organizational behavior studies from Stanford. [2] The technology shown is based on real prototypes that exist today. [3] The ethical dilemmas aren't hypothetical — three real cases since 2010 parallel the story almost exactly. This context makes a second watch significantly richer.`,
};

function getResponse(prompt: string, title: string): string {
  return COMPANION_RESPONSES[prompt]?.(title) ||
    `Analyzing **${title}** for you... Based on your viewing position and history, here's what the AI companion can tell you: This content has an 88% emotional resonance score for viewers with your profile. The narrative structure follows a three-act pattern with the midpoint at the 45-minute mark. Without spoilers: you are currently in the rising action phase, and the best material is ahead. Ask me anything specific about the story, characters, or themes!`;
}

export default function CompanionPage() {
  const [selectedContent, setSelectedContent] = useState(CONTENT_CATALOG[4]);
  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: '0',
      role: 'ai',
      text: `Hi! I'm your AI Watch Companion. I'm loaded up on **${CONTENT_CATALOG[4].title}** — ask me anything about it. I can give recaps, explain scenes, profile characters, and make predictions — all without spoiling what's ahead.`,
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContentPicker, setShowContentPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: CompanionMessage = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text, selectedContent.title);
      const aiMsg: CompanionMessage = { id: (Date.now() + 1).toString(), role: 'ai', text: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1400 + Math.random() * 800);
  };

  const handleContentChange = (content: typeof selectedContent) => {
    setSelectedContent(content);
    setShowContentPicker(false);
    setMessages([{
      id: Date.now().toString(),
      role: 'ai',
      text: `Switched to **${content.title}**! I'm now loaded with everything about this ${content.type}. Ask me for recaps, character profiles, scene explanations, or predictions — no spoilers guaranteed.`,
      timestamp: new Date(),
    }]);
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="section-label mb-3">Watch Intelligence</div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-2">
            AI Watch <span className="gradient-text">Companion</span>
          </h1>
          <p className="text-white/40">Get recaps, character profiles, scene explanations, and predictions — zero spoilers.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Content selector + Quick Actions */}
          <div className="space-y-5">
            {/* Content Selector */}
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-3">Currently Watching</p>
              <div
                className="flex items-center gap-3 cursor-pointer hover:bg-white/[0.03] p-2 rounded-xl transition-all"
                onClick={() => setShowContentPicker(!showContentPicker)}
              >
                <img src={selectedContent.image} alt={selectedContent.title} className="w-16 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{selectedContent.title}</p>
                  <p className="text-xs text-white/40 capitalize">{selectedContent.type} · {selectedContent.duration}m</p>
                </div>
                <ChevronDown size={16} className={`text-white/30 flex-shrink-0 transition-transform ${showContentPicker ? 'rotate-180' : ''}`} />
              </div>

              {showContentPicker && (
                <div className="mt-3 space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
                  {CONTENT_CATALOG.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleContentChange(c)}
                      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${c.id === selectedContent.id ? 'bg-brand-500/10 border border-brand-500/20' : 'hover:bg-white/[0.03]'}`}
                    >
                      <img src={c.image} alt={c.title} className="w-10 h-8 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">{c.title}</p>
                        <p className="text-xs text-white/30 capitalize">{c.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Actions */}
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map(action => (
                  <button
                    key={action.id}
                    onClick={() => sendMessage(action.prompt)}
                    className="flex items-center gap-2 p-3 rounded-xl glass border border-white/[0.06] text-xs text-white/60 hover:text-white hover:border-brand-500/30 hover:bg-brand-500/5 transition-all text-left"
                  >
                    <span className="text-brand-400 flex-shrink-0">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Stats */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-4">Content Intelligence</p>
              <div className="space-y-4">
                {[
                  { label: 'Your Match Score', value: `${selectedContent.matchScore}%`, color: 'from-brand-500 to-brand-400' },
                  { label: 'Completion Probability', value: `${selectedContent.completionProbability}%`, color: 'from-green-500 to-teal-400' },
                  { label: 'Engagement Score', value: `${selectedContent.engagementScore}/100`, color: 'from-orange-500 to-amber-400' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-white/50">{stat.label}</span>
                      <span className="text-xs font-bold text-white">{stat.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                        style={{ width: stat.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-brand-500/5 border border-brand-500/15">
                <p className="text-xs text-brand-300 leading-relaxed">{selectedContent.aiInsight}</p>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl flex flex-col" style={{ height: '680px' }}>
              {/* Header */}
              <div className="flex items-center gap-3 p-5 border-b border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-sm">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">AI Watch Companion</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400">Spoiler-free mode active</span>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMessages([{
                        id: Date.now().toString(),
                        role: 'ai',
                        text: `Fresh start! I'm ready to help you with **${selectedContent.title}**. Ask me anything!`,
                        timestamp: new Date(),
                      }]);
                    }}
                    className="p-2 rounded-lg glass border border-white/[0.06] text-white/40 hover:text-white transition-all"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] rounded-2xl px-4 py-3.5 ${
                      msg.role === 'user'
                        ? 'bg-brand-600/40 border border-brand-500/30 rounded-tr-sm'
                        : 'glass border border-white/[0.08] rounded-tl-sm'
                    }`}>
                      <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line">
                        {renderMessageText(msg.text)}
                      </p>
                      <p className="text-xs text-white/20 mt-2">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="glass border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:300ms]" />
                        </div>
                        <span className="text-xs text-white/30">Analyzing content...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-5 border-t border-white/[0.06]">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(chatInput); } }}
                    placeholder={`Ask about ${selectedContent.title}...`}
                    className="flex-1 px-4 py-3.5 rounded-xl glass text-white placeholder:text-white/20 focus:outline-none focus:border-brand-500/40 transition-all text-sm border border-white/[0.06]"
                  />
                  <button
                    onClick={() => sendMessage(chatInput)}
                    disabled={!chatInput.trim()}
                    className="p-3.5 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-white hover:from-brand-500 hover:to-brand-400 transition-all disabled:opacity-40 shadow-glow-sm"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-xs text-white/20 mt-2 text-center">
                  All responses are spoiler-free by default. Ask "spoilers ok" to unlock full analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

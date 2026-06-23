import { useState, useRef, useEffect } from 'react';
import { Users, Send, Play, Pause, Volume2, MessageSquare, ThumbsUp, Heart, Laugh, SmilePlus, BarChart2, Clock, Zap, Settings, Copy } from 'lucide-react';
import { CONTENT_CATALOG } from '../data/content';
import { Message } from '../types';

const SAMPLE_USERS = [
  { name: 'Alex', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60' },
  { name: 'Priya', avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=60' },
  { name: 'Marco', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60' },
  { name: 'Yuki', avatar: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=60' },
  { name: 'Sam', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=60' },
];

const SAMPLE_MESSAGES: Message[] = [
  { id: '1', user: 'Alex', avatar: SAMPLE_USERS[0].avatar, text: 'This scene is incredible!', timestamp: new Date(Date.now() - 300000), type: 'text' },
  { id: '2', user: 'Priya', avatar: SAMPLE_USERS[1].avatar, text: 'The cinematography here is next level', timestamp: new Date(Date.now() - 240000), type: 'text' },
  { id: '3', user: 'System', avatar: '', text: 'Marco joined the room', timestamp: new Date(Date.now() - 180000), type: 'system' },
  { id: '4', user: 'Marco', avatar: SAMPLE_USERS[2].avatar, text: 'Already knew this scene was coming and it still hits hard every time', timestamp: new Date(Date.now() - 120000), type: 'text' },
  { id: '5', user: 'Yuki', avatar: SAMPLE_USERS[3].avatar, text: 'No spoilers! First time watching 😄', timestamp: new Date(Date.now() - 60000), type: 'text' },
];

const ROOMS = [
  { id: '1', name: "Friday Night Cinema", content: CONTENT_CATALOG[5], participants: 8, isLive: true },
  { id: '2', name: "Sci-Fi Sundays", content: CONTENT_CATALOG[2], participants: 4, isLive: true },
  { id: '3', name: "Documentary Club", content: CONTENT_CATALOG[1], participants: 12, isLive: false },
  { id: '4', name: "Startup Stories", content: CONTENT_CATALOG[0], participants: 6, isLive: false },
];

const REACTIONS = [
  { emoji: '❤️', icon: <Heart size={14} /> },
  { emoji: '😂', icon: <Laugh size={14} /> },
  { emoji: '👍', icon: <ThumbsUp size={14} /> },
  { emoji: '🔥', icon: '🔥' },
  { emoji: '😮', icon: '😮' },
];

export default function WatchRoomPage() {
  const [activeRoom, setActiveRoom] = useState<typeof ROOMS[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [progress, setProgress] = useState(23);
  const [showPoll, setShowPoll] = useState(false);
  const [pollVotes, setPollVotes] = useState([14, 7, 3]);
  const [showReactions, setShowReactions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 0.1, 100));
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      user: 'You',
      avatar: SAMPLE_USERS[4].avatar,
      text: chatInput,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleVote = (i: number) => {
    setPollVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v));
  };

  const totalVotes = pollVotes.reduce((a, b) => a + b, 0);

  if (!activeRoom) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="section-label mb-3">Social Experience</div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-2">
              Watch <span className="gradient-text">Together</span>
            </h1>
            <p className="text-white/40">Synchronized watch rooms with real-time chat, polls, and reactions.</p>
          </div>

          {/* Create Room CTA */}
          <div className="glass-card rounded-2xl p-8 mb-8 border border-brand-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-brand-900/20 to-transparent pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="font-display font-bold text-white text-xl mb-2">Host a Watch Room</h2>
                <p className="text-white/50 text-sm max-w-md">Create a synchronized watch room and invite friends. AI moderates, generates recaps, and keeps the experience smooth.</p>
              </div>
              <button
                onClick={() => setActiveRoom(ROOMS[0])}
                className="btn-primary flex-shrink-0"
              >
                <Play size={16} />
                Create Room
              </button>
            </div>
          </div>

          {/* Live Rooms */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-white text-lg mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Live Rooms
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5 mb-10">
            {ROOMS.filter(r => r.isLive).map((room) => (
              <RoomCard key={room.id} room={room} onClick={() => setActiveRoom(room)} />
            ))}
          </div>

          <h2 className="font-display font-bold text-white text-lg mb-5">Upcoming Rooms</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {ROOMS.filter(r => !r.isLive).map((room) => (
              <RoomCard key={room.id} room={room} onClick={() => setActiveRoom(room)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-4 px-4">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-7rem)]">
          {/* Video Player */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Back + Room info */}
            <div className="flex items-center justify-between">
              <button onClick={() => setActiveRoom(null)} className="btn-ghost text-xs">
                ← Back to Rooms
              </button>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-xs font-semibold text-red-400">LIVE</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/[0.06]">
                  <Users size={13} className="text-white/50" />
                  <span className="text-xs text-white/60">{activeRoom.participants} watching</span>
                </div>
              </div>
            </div>

            {/* Video Frame */}
            <div className="relative rounded-2xl overflow-hidden flex-1 min-h-0 bg-black cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
              <img
                src={activeRoom.content.image}
                alt={activeRoom.content.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-all duration-200 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                  {isPlaying ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
                </div>
              </div>
              {/* Participant avatars */}
              <div className="absolute top-4 right-4 flex -space-x-2">
                {SAMPLE_USERS.slice(0, 4).map((u, i) => (
                  <img key={i} src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border-2 border-surface-800 object-cover" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-surface-800 bg-brand-600 flex items-center justify-center text-xs font-bold text-white">+3</div>
              </div>
              {/* Floating reactions */}
              <div className="absolute bottom-16 left-4 flex gap-2">
                {['❤️', '🔥', '😮'].map((e, i) => (
                  <div key={i} className="text-2xl animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{e}</div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-white/40 w-10 text-right">
                  {Math.floor(progress * 0.55)}:{String(Math.floor((progress * 0.55 % 1) * 60)).padStart(2, '0')}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-white/40 w-10">{activeRoom.content.duration}m</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-500 flex items-center justify-center transition-colors">
                    {isPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white ml-0.5" />}
                  </button>
                  <button className="btn-ghost p-2"><Volume2 size={16} /></button>
                  <div>
                    <p className="text-sm font-semibold text-white">{activeRoom.content.title}</p>
                    <p className="text-xs text-white/40">{activeRoom.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Reactions */}
                  <div className="relative">
                    <button onClick={() => setShowReactions(!showReactions)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/[0.06] text-xs text-white/60 hover:text-white transition-all">
                      <SmilePlus size={14} />
                      React
                    </button>
                    {showReactions && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass-strong rounded-xl p-2 flex gap-1.5 z-10 border border-white/10">
                        {REACTIONS.map((r, i) => (
                          <button key={i} onClick={() => setShowReactions(false)} className="text-xl hover:scale-125 transition-transform w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10">
                            {r.emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Poll */}
                  <button onClick={() => setShowPoll(!showPoll)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showPoll ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20' : 'glass border border-white/[0.06] text-white/60 hover:text-white'}`}>
                    <BarChart2 size={14} />
                    Poll
                  </button>
                  <button className="btn-ghost p-2"><Settings size={16} /></button>
                </div>
              </div>

              {/* Poll */}
              {showPoll && (
                <div className="mt-4 p-4 rounded-xl bg-brand-500/5 border border-brand-500/15">
                  <p className="text-sm font-semibold text-white mb-3">Is this the best episode of the season?</p>
                  {['Yes, absolute banger!', 'It\'s good, not great', 'Haven\'t decided yet'].map((opt, i) => (
                    <button key={i} onClick={() => handleVote(i)} className="w-full mb-2 last:mb-0">
                      <div className="relative h-9 rounded-lg overflow-hidden glass border border-white/[0.06] hover:border-brand-500/30 transition-all">
                        <div className="absolute inset-y-0 left-0 bg-brand-500/20 transition-all duration-500" style={{ width: `${(pollVotes[i] / totalVotes) * 100}%` }} />
                        <div className="relative h-full flex items-center justify-between px-3">
                          <span className="text-xs text-white/70">{opt}</span>
                          <span className="text-xs font-bold text-brand-300">{Math.round((pollVotes[i] / totalVotes) * 100)}%</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  <p className="text-xs text-white/30 mt-2">{totalVotes} total votes</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="glass-card rounded-2xl flex flex-col min-h-0">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-brand-400" />
                <span className="font-semibold text-white text-sm">Live Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">{SAMPLE_USERS.length + 1} online</span>
                <button className="btn-ghost p-1.5 text-xs flex items-center gap-1 text-white/40">
                  <Copy size={12} />
                </button>
              </div>
            </div>

            {/* Online Users */}
            <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {SAMPLE_USERS.slice(0, 5).map((u, i) => (
                  <div key={i} className="relative">
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full border border-surface-800 object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-surface-800" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-white/30">all watching in sync</span>
              <div className="ml-auto flex items-center gap-1">
                <Zap size={10} className="text-brand-400" />
                <span className="text-xs text-brand-400 font-semibold">synced</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide min-h-0">
              {messages.map((msg) => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <span className="text-xs text-white/20 px-3 py-1 rounded-full glass">{msg.text}</span>
                    </div>
                  );
                }
                const isMe = msg.user === 'You';
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {!isMe && <img src={msg.avatar} alt={msg.user} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5" />}
                    <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                      {!isMe && <span className="text-xs text-white/30 px-1">{msg.user}</span>}
                      <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-brand-600/40 border border-brand-500/30 rounded-tr-sm' : 'glass border border-white/[0.08] rounded-tl-sm'}`}>
                        <p className="text-white/85 text-xs leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Room Info */}
            <div className="px-4 py-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-500/5 border border-brand-500/15">
                <Zap size={12} className="text-brand-400 flex-shrink-0" />
                <p className="text-xs text-brand-300 leading-relaxed">AI says: This scene has 94% emotional resonance. Engagement peak in ~4 minutes.</p>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/[0.06]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Say something..."
                  className="flex-1 px-3 py-2.5 rounded-xl glass text-white placeholder:text-white/20 focus:outline-none focus:border-brand-500/40 transition-all text-xs border border-white/[0.06]"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-white hover:from-brand-500 hover:to-brand-400 transition-all disabled:opacity-40 flex-shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, onClick }: { room: typeof ROOMS[0]; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group relative rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover">
      <div className="relative aspect-video">
        <img src={room.content.image} alt={room.content.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {room.isLive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/90 text-xs font-bold text-white backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-xs text-white/60 backdrop-blur-sm border border-white/10">
              <Clock size={10} />
              Upcoming
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white/70">
          <Users size={11} />
          {room.participants}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-display font-bold text-white">{room.name}</p>
          <p className="text-xs text-white/50 mt-0.5">{room.content.title} • {room.content.duration}m</p>
        </div>
      </div>
    </div>
  );
}

import { Star, Clock, Zap, TrendingUp } from 'lucide-react';
import { Content } from '../types';

interface ContentCardProps {
  content: Content;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showAI?: boolean;
}

export default function ContentCard({ content, onClick, size = 'md', showAI = true }: ContentCardProps) {
  const aspectRatio = size === 'lg' ? 'aspect-[16/10]' : size === 'sm' ? 'aspect-[4/3]' : 'aspect-[16/10]';
  
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Image */}
      <div className={`relative ${aspectRatio} overflow-hidden`}>
        <img
          src={content.image}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Match Score Badge */}
        {content.matchScore && showAI && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/90 backdrop-blur-sm text-xs font-bold text-white shadow-glow-sm">
            <Zap size={11} />
            {content.matchScore}%
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide ${
            content.type === 'movie' ? 'bg-blue-500/80' :
            content.type === 'series' ? 'bg-brand-500/80' :
            content.type === 'documentary' ? 'bg-green-500/80' :
            content.type === 'podcast' ? 'bg-orange-500/80' :
            'bg-pink-500/80'
          } text-white backdrop-blur-sm`}>
            {content.type}
          </span>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display font-bold text-white text-sm md:text-base leading-tight mb-1.5 line-clamp-2">{content.title}</h3>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span className="flex items-center gap-1">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              {content.rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {content.duration}m
            </span>
            <span>{content.year}</span>
          </div>
          {content.genre.slice(0, 2).map(g => (
            <span key={g} className="inline-block mr-1 mt-1.5 px-2 py-0.5 rounded text-xs bg-white/10 text-white/60">{g}</span>
          ))}
        </div>
      </div>

      {/* AI Insight Panel */}
      {showAI && content.aiInsight && (
        <div className="absolute inset-0 bg-gradient-to-t from-surface-800/98 via-surface-800/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="font-display font-bold text-white text-sm mb-2">{content.title}</h3>
          <p className="text-xs text-white/70 mb-3 line-clamp-2">{content.description}</p>
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <Zap size={13} className="text-brand-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-brand-300 leading-relaxed">{content.aiInsight}</p>
          </div>
          {content.completionProbability && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-white/40">Completion Probability</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${content.completionProbability}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-white/70">{content.completionProbability}%</span>
              </div>
            </div>
          )}
          {content.engagementScore && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-white/40">Engagement Score</span>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={12} className="text-green-400" />
                <span className="text-xs font-bold text-green-400">{content.engagementScore}</span>
              </div>
            </div>
          )}
          <button className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-semibold hover:from-brand-500 hover:to-brand-400 transition-all">
            Watch Now
          </button>
        </div>
      )}
    </div>
  );
}

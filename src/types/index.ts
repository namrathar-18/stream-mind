export type Page = 'landing' | 'discover' | 'mood' | 'watchroom' | 'analytics' | 'profile' | 'companion';

export interface Content {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'podcast' | 'documentary' | 'short';
  genre: string[];
  mood: string[];
  duration: number; // minutes
  rating: number;
  year: number;
  image: string;
  description: string;
  matchScore?: number;
  engagementScore?: number;
  completionProbability?: number;
  aiInsight?: string;
  platform?: string;
}

export interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  timestamp: Date;
  recommendations: string[];
}

export interface WatchRoom {
  id: string;
  name: string;
  content: Content;
  host: string;
  participants: number;
  isLive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  moodHistory: MoodEntry[];
  watchedCount: number;
  totalHours: number;
  favoriteGenres: string[];
  currentStreak: number;
}

export interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'reaction' | 'system';
}

export interface AnalyticsData {
  moodTrend: { date: string; mood: string; score: number }[];
  genreBreakdown: { genre: string; percentage: number; color: string }[];
  weeklyHours: { day: string; hours: number }[];
  topContent: Content[];
  insights: string[];
}

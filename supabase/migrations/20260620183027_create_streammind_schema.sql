
-- StreamMind: AI-Powered Entertainment Intelligence Platform
-- Complete Database Schema

-- =====================
-- USERS & PROFILES
-- =====================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  personality_curiosity int DEFAULT 50,
  personality_emotionality int DEFAULT 50,
  personality_adventure int DEFAULT 50,
  personality_comfort int DEFAULT 50,
  favorite_genres text[] DEFAULT '{}',
  preferred_duration_max int DEFAULT 180,
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  onboarding_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================
-- CONTENT CATALOG
-- =====================

CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('movie', 'series', 'documentary', 'podcast', 'short')),
  description text,
  genre text[] DEFAULT '{}',
  mood_tags text[] DEFAULT '{}',
  duration_minutes int,
  release_year int,
  rating numeric(3,1),
  poster_url text,
  trailer_url text,
  platform text,
  external_id text,
  created_at timestamptz DEFAULT now()
);

-- =====================
-- WATCH HISTORY
-- =====================

CREATE TABLE IF NOT EXISTS watch_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  progress_percent int DEFAULT 0,
  completed boolean DEFAULT false,
  watched_at timestamptz DEFAULT now(),
  mood_at_watch text,
  rating_given numeric(2,1),
  UNIQUE(user_id, content_id)
);
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- =====================
-- RECOMMENDATIONS
-- =====================

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  match_score int DEFAULT 0,
  engagement_score int DEFAULT 0,
  completion_probability int DEFAULT 0,
  reason text,
  mood_context text,
  time_context int,
  generated_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '24 hours',
  clicked boolean DEFAULT false,
  watched boolean DEFAULT false
);
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- =====================
-- MOOD LOGS
-- =====================

CREATE TABLE IF NOT EXISTS mood_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood text NOT NULL,
  intensity int DEFAULT 5 CHECK (intensity BETWEEN 1 AND 10),
  input_text text,
  input_method text DEFAULT 'text' CHECK (input_method IN ('text', 'voice', 'webcam', 'manual')),
  energy_level int DEFAULT 5 CHECK (energy_level BETWEEN 1 AND 10),
  available_time int,
  logged_at timestamptz DEFAULT now()
);
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

-- =====================
-- WATCH ROOMS
-- =====================

CREATE TABLE IF NOT EXISTS watch_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_live boolean DEFAULT false,
  is_public boolean DEFAULT true,
  max_participants int DEFAULT 20,
  invite_code text UNIQUE DEFAULT substring(gen_random_uuid()::text, 1, 8),
  playback_position int DEFAULT 0,
  scheduled_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE watch_rooms ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS watch_room_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES watch_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  role text DEFAULT 'viewer' CHECK (role IN ('host', 'moderator', 'viewer')),
  UNIQUE(room_id, user_id)
);
ALTER TABLE watch_room_participants ENABLE ROW LEVEL SECURITY;

-- =====================
-- MESSAGES (Watch Room Chat)
-- =====================

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES watch_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text DEFAULT 'text' CHECK (type IN ('text', 'reaction', 'system', 'poll', 'ai')),
  metadata jsonb DEFAULT '{}',
  sent_at timestamptz DEFAULT now(),
  deleted boolean DEFAULT false
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- =====================
-- POLLS (Watch Room)
-- =====================

CREATE TABLE IF NOT EXISTS polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES watch_rooms(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question text NOT NULL,
  options text[] NOT NULL,
  votes jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  closed_at timestamptz
);
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

-- =====================
-- ANALYTICS
-- =====================

CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_watch_minutes int DEFAULT 0,
  content_count int DEFAULT 0,
  avg_mood_score int DEFAULT 0,
  dominant_mood text,
  dominant_genre text,
  ai_interactions int DEFAULT 0,
  UNIQUE(user_id, date)
);
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- =====================
-- REVIEWS & RATINGS
-- =====================

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  rating numeric(2,1) NOT NULL CHECK (rating BETWEEN 0 AND 10),
  review_text text,
  contains_spoilers boolean DEFAULT false,
  helpful_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- =====================
-- PLAYLISTS
-- =====================

CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT true,
  cover_url text,
  mood_tag text,
  follower_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS playlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  position int NOT NULL,
  added_at timestamptz DEFAULT now(),
  note text,
  UNIQUE(playlist_id, content_id)
);
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;

-- =====================
-- FOLLOWS (Social)
-- =====================

CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- =====================
-- AI SESSIONS (Companion / Mood Chat)
-- =====================

CREATE TABLE IF NOT EXISTS ai_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type text DEFAULT 'companion' CHECK (session_type IN ('companion', 'mood', 'recap', 'search')),
  context_content_id uuid REFERENCES content(id) ON DELETE SET NULL,
  messages jsonb DEFAULT '[]',
  mood_detected text,
  recommendations_given uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now()
);
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;

-- =====================
-- RLS POLICIES
-- =====================

-- users
CREATE POLICY "users_select_own" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "users_delete_own" ON users FOR DELETE TO authenticated USING (auth.uid() = id);

-- profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- watch_history
CREATE POLICY "wh_select_own" ON watch_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wh_insert_own" ON watch_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wh_update_own" ON watch_history FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wh_delete_own" ON watch_history FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- recommendations
CREATE POLICY "recs_select_own" ON recommendations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "recs_insert_own" ON recommendations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recs_update_own" ON recommendations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recs_delete_own" ON recommendations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- mood_logs
CREATE POLICY "mood_select_own" ON mood_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "mood_insert_own" ON mood_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mood_update_own" ON mood_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mood_delete_own" ON mood_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- watch_rooms (public read, owner write)
CREATE POLICY "rooms_select_public" ON watch_rooms FOR SELECT TO authenticated USING (is_public = true OR host_id = auth.uid());
CREATE POLICY "rooms_insert_own" ON watch_rooms FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);
CREATE POLICY "rooms_update_own" ON watch_rooms FOR UPDATE TO authenticated USING (auth.uid() = host_id) WITH CHECK (auth.uid() = host_id);
CREATE POLICY "rooms_delete_own" ON watch_rooms FOR DELETE TO authenticated USING (auth.uid() = host_id);

-- watch_room_participants
CREATE POLICY "wrp_select" ON watch_room_participants FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wrp_insert" ON watch_room_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wrp_update" ON watch_room_participants FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wrp_delete" ON watch_room_participants FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- messages
CREATE POLICY "msg_select_room" ON messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM watch_room_participants WHERE room_id = messages.room_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM watch_rooms WHERE id = messages.room_id AND (is_public = true OR host_id = auth.uid()))
);
CREATE POLICY "msg_insert_own" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "msg_update_own" ON messages FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "msg_delete_own" ON messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- polls
CREATE POLICY "polls_select" ON polls FOR SELECT TO authenticated USING (true);
CREATE POLICY "polls_insert_own" ON polls FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "polls_update_own" ON polls FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "polls_delete_own" ON polls FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- analytics
CREATE POLICY "analytics_select_own" ON analytics FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "analytics_insert_own" ON analytics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analytics_update_own" ON analytics FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analytics_delete_own" ON analytics FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- reviews
CREATE POLICY "reviews_select_all" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- playlists
CREATE POLICY "pl_select_public" ON playlists FOR SELECT TO authenticated USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "pl_insert_own" ON playlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pl_update_own" ON playlists FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pl_delete_own" ON playlists FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- playlist_items
CREATE POLICY "pli_select" ON playlist_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM playlists WHERE id = playlist_items.playlist_id AND (is_public = true OR user_id = auth.uid()))
);
CREATE POLICY "pli_insert" ON playlist_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM playlists WHERE id = playlist_items.playlist_id AND user_id = auth.uid())
);
CREATE POLICY "pli_update" ON playlist_items FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM playlists WHERE id = playlist_items.playlist_id AND user_id = auth.uid())
);
CREATE POLICY "pli_delete" ON playlist_items FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM playlists WHERE id = playlist_items.playlist_id AND user_id = auth.uid())
);

-- follows
CREATE POLICY "follows_select_all" ON follows FOR SELECT TO authenticated USING (true);
CREATE POLICY "follows_insert_own" ON follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_update_own" ON follows FOR UPDATE TO authenticated USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own" ON follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- ai_sessions
CREATE POLICY "ai_select_own" ON ai_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ai_insert_own" ON ai_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_update_own" ON ai_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_delete_own" ON ai_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =====================
-- INDEXES
-- =====================

CREATE INDEX IF NOT EXISTS idx_watch_history_user ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_content ON watch_history(content_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_expires ON recommendations(expires_at);
CREATE INDEX IF NOT EXISTS idx_mood_logs_user ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_logged_at ON mood_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_playlists_user ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

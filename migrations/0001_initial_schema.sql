-- SkillSwap Database Schema
-- Core tables for MVP launch

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'both', -- 'learner', 'teacher', 'both'
  credit_balance INTEGER DEFAULT 100, -- Starting credits
  is_premium INTEGER DEFAULT 0, -- 0 = free, 1 = premium
  is_admin INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  language_preference TEXT DEFAULT 'en',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  CHECK (role IN ('learner', 'teacher', 'both'))
);

-- Skills table (master list of skills)
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'tech', 'creative', 'lifestyle', 'language', 'business'
  description TEXT,
  icon TEXT, -- Icon class or emoji
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK (category IN ('tech', 'creative', 'lifestyle', 'language', 'business'))
);

-- User skills mapping (what users can teach/learn)
CREATE TABLE IF NOT EXISTS user_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  skill_type TEXT NOT NULL, -- 'teach' or 'learn'
  proficiency_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'expert'
  hourly_credit_rate INTEGER, -- Credits per hour (for teachers)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(user_id, skill_id, skill_type),
  CHECK (skill_type IN ('teach', 'learn')),
  CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert'))
);

-- Sessions/Bookings table
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  learner_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  scheduled_date TEXT NOT NULL, -- ISO datetime string
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  credit_cost INTEGER NOT NULL,
  meeting_link TEXT, -- External Zoom/Google Meet link
  notes TEXT, -- Session notes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (learner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'declined'))
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL, -- Who's reviewing
  reviewee_id INTEGER NOT NULL, -- Who's being reviewed
  rating INTEGER NOT NULL, -- 1-5 stars
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(session_id, reviewer_id),
  CHECK (rating >= 1 AND rating <= 5)
);

-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL, -- Positive for credit, negative for debit
  transaction_type TEXT NOT NULL, -- 'purchase', 'earned', 'spent', 'refund', 'bonus'
  reference_type TEXT, -- 'session', 'payment', 'admin'
  reference_id INTEGER, -- ID of related record
  description TEXT,
  balance_after INTEGER NOT NULL, -- Balance snapshot
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (transaction_type IN ('purchase', 'earned', 'spent', 'refund', 'bonus', 'admin_adjustment'))
);

-- Micro-learning content table
CREATE TABLE IF NOT EXISTS learning_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL DEFAULT 'video', -- 'video', 'article', 'document'
  content_url TEXT NOT NULL, -- External video URL or file link
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  difficulty_level TEXT, -- 'beginner', 'intermediate', 'advanced'
  is_premium INTEGER DEFAULT 0, -- 0 = free, 1 = premium only
  view_count INTEGER DEFAULT 0,
  is_approved INTEGER DEFAULT 0, -- Admin moderation
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  CHECK (content_type IN ('video', 'article', 'document')),
  CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'))
);

-- Badges/Achievements table
CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Icon or emoji
  requirement_type TEXT NOT NULL, -- 'sessions_taught', 'sessions_completed', 'rating_average', 'credits_earned'
  requirement_value INTEGER NOT NULL, -- Threshold value
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User badges mapping
CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  badge_id INTEGER NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE(user_id, badge_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'session', 'review', 'credit', 'badge', 'system'
  reference_type TEXT,
  reference_id INTEGER,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (type IN ('session', 'review', 'credit', 'badge', 'system', 'message'))
);

-- Messages table (async messaging between users)
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  recipient_id INTEGER NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  parent_message_id INTEGER, -- For threading
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- Community forums table
CREATE TABLE IF NOT EXISTS forum_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_type ON user_skills(skill_type);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_learner ON sessions(learner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_reviews_session ON reviews(session_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_content_creator ON learning_content(creator_id);
CREATE INDEX IF NOT EXISTS idx_learning_content_skill ON learning_content(skill_id);
CREATE INDEX IF NOT EXISTS idx_learning_content_approved ON learning_content(is_approved);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category);
CREATE INDEX IF NOT EXISTS idx_forum_replies_topic ON forum_replies(topic_id);

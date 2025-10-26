// SkillSwap Type Definitions

export type UserRole = 'learner' | 'teacher' | 'both';
export type SkillCategory = 'tech' | 'creative' | 'lifestyle' | 'language' | 'business';
export type SkillType = 'teach' | 'learn';
export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'declined';
export type TransactionType = 'purchase' | 'earned' | 'spent' | 'refund' | 'bonus' | 'admin_adjustment';
export type ContentType = 'video' | 'article' | 'document';
export type NotificationType = 'session' | 'review' | 'credit' | 'badge' | 'system' | 'message';

export interface User {
  id: number;
  email: string;
  password_hash?: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  role: UserRole;
  credit_balance: number;
  is_premium: number;
  is_admin: number;
  is_active: number;
  language_preference: string;
  created_at: string;
  last_login?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  description?: string;
  icon?: string;
  is_active: number;
  created_at: string;
}

export interface UserSkill {
  id: number;
  user_id: number;
  skill_id: number;
  skill_type: SkillType;
  proficiency_level?: ProficiencyLevel;
  hourly_credit_rate?: number;
  created_at: string;
}

export interface Session {
  id: number;
  teacher_id: number;
  learner_id: number;
  skill_id: number;
  title: string;
  description?: string;
  status: SessionStatus;
  scheduled_date: string;
  duration_minutes: number;
  credit_cost: number;
  meeting_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  session_id: number;
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface CreditTransaction {
  id: number;
  user_id: number;
  amount: number;
  transaction_type: TransactionType;
  reference_type?: string;
  reference_id?: number;
  description?: string;
  balance_after: number;
  created_at: string;
}

export interface LearningContent {
  id: number;
  creator_id: number;
  skill_id: number;
  title: string;
  description?: string;
  content_type: ContentType;
  content_url: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  difficulty_level?: ProficiencyLevel;
  is_premium: number;
  view_count: number;
  is_approved: number;
  created_at: string;
}

export interface Badge {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  earned_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  reference_type?: string;
  reference_id?: number;
  is_read: number;
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  subject?: string;
  message: string;
  is_read: number;
  parent_message_id?: number;
  created_at: string;
}

export interface ForumTopic {
  id: number;
  creator_id: number;
  category: string;
  title: string;
  content: string;
  is_pinned: number;
  view_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: number;
  topic_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

// Extended types with joined data
export interface SessionWithDetails extends Session {
  teacher_name?: string;
  learner_name?: string;
  skill_name?: string;
  teacher_avatar?: string;
  learner_avatar?: string;
}

export interface UserWithStats extends User {
  total_sessions_taught?: number;
  total_sessions_learned?: number;
  average_rating?: number;
  total_reviews?: number;
  badges_earned?: number;
}

export interface ContentWithCreator extends LearningContent {
  creator_name?: string;
  creator_avatar?: string;
  skill_name?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request body types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface CreateSessionRequest {
  teacher_id: number;
  skill_id: number;
  title: string;
  description?: string;
  scheduled_date: string;
  duration_minutes: number;
}

export interface CreateReviewRequest {
  session_id: number;
  reviewee_id: number;
  rating: number;
  comment?: string;
}

export interface CreateContentRequest {
  skill_id: number;
  title: string;
  description?: string;
  content_type: ContentType;
  content_url: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  difficulty_level?: ProficiencyLevel;
}

export interface PurchaseCreditsRequest {
  amount: number;
  payment_method: string;
  payment_intent_id?: string;
}

// Cloudflare bindings
export interface Bindings {
  DB: D1Database;
}

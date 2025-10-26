-- SkillSwap Seed Data for Development

-- Insert sample skills
INSERT OR IGNORE INTO skills (name, category, description, icon) VALUES 
  ('JavaScript Programming', 'tech', 'Learn modern JavaScript ES6+', '💻'),
  ('Python Basics', 'tech', 'Python fundamentals and best practices', '🐍'),
  ('Web Design', 'creative', 'HTML, CSS, and UI/UX principles', '🎨'),
  ('Digital Marketing', 'business', 'Social media and content strategy', '📈'),
  ('Spanish Conversation', 'language', 'Practice Spanish speaking skills', '🇪🇸'),
  ('Guitar Lessons', 'creative', 'Acoustic and electric guitar basics', '🎸'),
  ('Yoga & Meditation', 'lifestyle', 'Mindfulness and flexibility training', '🧘'),
  ('Data Analysis', 'tech', 'Excel, SQL, and data visualization', '📊'),
  ('Photography', 'creative', 'Camera basics and composition', '📷'),
  ('Public Speaking', 'business', 'Presentation and communication skills', '🎤'),
  ('French Language', 'language', 'French grammar and vocabulary', '🇫🇷'),
  ('Cooking Basics', 'lifestyle', 'Kitchen fundamentals and recipes', '👨‍🍳'),
  ('React Development', 'tech', 'Build modern web apps with React', '⚛️'),
  ('Graphic Design', 'creative', 'Adobe Photoshop and Illustrator', '🖌️'),
  ('Business Strategy', 'business', 'Strategic planning and execution', '💼');

-- Insert sample users (password is 'password123' hashed - in production use proper bcrypt)
-- Note: These are demo passwords, replace with proper hashing
INSERT OR IGNORE INTO users (email, password_hash, name, bio, role, credit_balance, is_premium) VALUES 
  ('alice@skillswap.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alice Johnson', 'JavaScript expert and web development mentor. 5 years of teaching experience.', 'teacher', 500, 1),
  ('bob@skillswap.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bob Smith', 'Passionate learner exploring data science and Python.', 'learner', 150, 0),
  ('carol@skillswap.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carol Williams', 'Language enthusiast teaching Spanish and learning French.', 'both', 300, 1),
  ('david@skillswap.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'David Brown', 'Professional photographer sharing creative skills.', 'teacher', 420, 0),
  ('emma@skillswap.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Emma Davis', 'Graphic designer and UI/UX enthusiast.', 'both', 280, 1),
  ('admin@skillswap.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SkillSwap Admin', 'Platform administrator', 'both', 1000, 1);

-- Update admin user
UPDATE users SET is_admin = 1 WHERE email = 'admin@skillswap.com';

-- Map skills to users (what they teach/learn)
INSERT OR IGNORE INTO user_skills (user_id, skill_id, skill_type, proficiency_level, hourly_credit_rate) VALUES 
  -- Alice teaches JavaScript and React
  (1, 1, 'teach', 'expert', 50),
  (1, 13, 'teach', 'expert', 60),
  -- Bob learns Python and Data Analysis
  (2, 2, 'learn', 'beginner', NULL),
  (2, 8, 'learn', 'intermediate', NULL),
  -- Carol teaches Spanish, learns French
  (3, 5, 'teach', 'advanced', 40),
  (3, 11, 'learn', 'intermediate', NULL),
  -- David teaches Photography
  (4, 9, 'teach', 'expert', 55),
  (4, 3, 'teach', 'advanced', 45),
  -- Emma teaches Graphic Design and Web Design
  (5, 14, 'teach', 'expert', 50),
  (5, 3, 'teach', 'advanced', 45),
  (5, 13, 'learn', 'intermediate', NULL);

-- Insert sample sessions
INSERT OR IGNORE INTO sessions (teacher_id, learner_id, skill_id, title, description, status, scheduled_date, duration_minutes, credit_cost, meeting_link) VALUES 
  (1, 2, 1, 'JavaScript Fundamentals - Variables & Functions', 'Learn core JavaScript concepts', 'completed', '2025-10-20T14:00:00Z', 60, 50, 'https://meet.google.com/abc-defg-hij'),
  (3, 5, 5, 'Spanish Conversation Practice - Beginner Level', 'Basic Spanish dialogue practice', 'completed', '2025-10-22T16:00:00Z', 45, 30, 'https://zoom.us/j/123456789'),
  (4, 2, 9, 'Photography Basics - Camera Settings', 'Understanding aperture, shutter speed, ISO', 'confirmed', '2025-10-28T10:00:00Z', 60, 55, 'https://meet.google.com/xyz-abcd-efg'),
  (1, 5, 13, 'React Hooks Deep Dive', 'Advanced useState and useEffect patterns', 'pending', '2025-10-29T15:00:00Z', 90, 90, NULL);

-- Insert sample reviews
INSERT OR IGNORE INTO reviews (session_id, reviewer_id, reviewee_id, rating, comment) VALUES 
  (1, 2, 1, 5, 'Excellent teacher! Very clear explanations and patient. Highly recommended.'),
  (1, 1, 2, 5, 'Great student, asked thoughtful questions and engaged well.'),
  (2, 5, 3, 4, 'Very helpful session. Carol is very encouraging and makes learning fun.'),
  (2, 3, 5, 5, 'Emma was well-prepared and enthusiastic. Great learner!');

-- Insert sample credit transactions
INSERT OR IGNORE INTO credit_transactions (user_id, amount, transaction_type, reference_type, reference_id, description, balance_after) VALUES 
  (1, 100, 'bonus', 'admin', NULL, 'Welcome bonus', 100),
  (1, 50, 'earned', 'session', 1, 'Teaching session completed', 150),
  (2, 100, 'bonus', 'admin', NULL, 'Welcome bonus', 100),
  (2, -50, 'spent', 'session', 1, 'Learning session with Alice', 50),
  (3, 100, 'bonus', 'admin', NULL, 'Welcome bonus', 100),
  (3, 30, 'earned', 'session', 2, 'Teaching session completed', 130),
  (5, 100, 'bonus', 'admin', NULL, 'Welcome bonus', 100),
  (5, -30, 'spent', 'session', 2, 'Learning session with Carol', 70);

-- Insert sample learning content
INSERT OR IGNORE INTO learning_content (creator_id, skill_id, title, description, content_type, content_url, duration_minutes, difficulty_level, is_approved) VALUES 
  (1, 1, 'JavaScript ES6 Arrow Functions Explained', 'Quick tutorial on modern arrow function syntax', 'video', 'https://www.youtube.com/watch?v=6sQDTgOqh-I', 8, 'beginner', 1),
  (1, 13, 'React State Management Guide', 'Comprehensive guide to managing state in React', 'video', 'https://www.youtube.com/watch?v=35lXWvCuM8o', 15, 'intermediate', 1),
  (3, 5, 'Spanish Greetings & Introductions', 'Learn basic Spanish conversation starters', 'video', 'https://www.youtube.com/watch?v=IxNJv2xSTzM', 10, 'beginner', 1),
  (4, 9, 'Photography Composition Rules', 'Rule of thirds and other composition techniques', 'video', 'https://www.youtube.com/watch?v=7ZVyNjKSr0M', 12, 'intermediate', 1),
  (5, 14, 'Graphic Design Principles', 'Color theory and typography basics', 'video', 'https://www.youtube.com/watch?v=YqQx75OPRa0', 20, 'beginner', 1);

-- Insert sample badges
INSERT OR IGNORE INTO badges (name, description, icon, requirement_type, requirement_value) VALUES 
  ('First Session', 'Complete your first learning session', '🎓', 'sessions_completed', 1),
  ('Rookie Teacher', 'Teach your first session', '👨‍🏫', 'sessions_taught', 1),
  ('5-Star Mentor', 'Maintain a 5.0 rating across 10+ sessions', '⭐', 'rating_average', 50),
  ('Dedicated Learner', 'Complete 10 learning sessions', '📚', 'sessions_completed', 10),
  ('Expert Educator', 'Teach 25 sessions', '🏆', 'sessions_taught', 25),
  ('Credit Master', 'Earn 500 total credits', '💰', 'credits_earned', 500);

-- Award some badges
INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES 
  (1, 2), -- Alice: Rookie Teacher
  (1, 5), -- Alice: Expert Educator
  (2, 1), -- Bob: First Session
  (3, 2), -- Carol: Rookie Teacher
  (3, 1); -- Carol: First Session

-- Insert sample notifications
INSERT OR IGNORE INTO notifications (user_id, title, message, type, reference_type, reference_id) VALUES 
  (2, 'Session Confirmed!', 'Your photography session with David is confirmed for Oct 28', 'session', 'session', 3),
  (5, 'New Session Request', 'Alice requested a React session with you', 'session', 'session', 4),
  (1, 'Badge Earned!', 'Congratulations! You earned the Expert Educator badge', 'badge', 'badge', 5),
  (2, 'Credits Added', '50 credits spent on your JavaScript learning session', 'credit', 'transaction', 4);

-- Insert sample forum topics
INSERT OR IGNORE INTO forum_topics (creator_id, category, title, content, view_count) VALUES 
  (2, 'tech', 'Best resources for learning Python?', 'Hi everyone! I''m starting my Python journey. What are your favorite tutorials and books?', 45),
  (5, 'creative', 'Tips for beginners in graphic design', 'Starting out in design can be overwhelming. Here are my top 5 tips...', 89),
  (3, 'language', 'Spanish practice partners wanted', 'Looking for people to practice conversational Spanish with!', 23);

-- Insert sample forum replies
INSERT OR IGNORE INTO forum_replies (topic_id, user_id, content) VALUES 
  (1, 1, 'I highly recommend "Automate the Boring Stuff with Python" by Al Sweigart. Great for beginners!'),
  (1, 4, 'The official Python documentation is also excellent once you grasp the basics.'),
  (2, 1, 'Great tips! I''d add: practice every day, even if just for 15 minutes.'),
  (3, 1, 'I''m also learning Spanish! Would love to practice together.');

-- Insert sample messages
INSERT OR IGNORE INTO messages (sender_id, recipient_id, subject, message) VALUES 
  (2, 1, 'Question about JavaScript closures', 'Hi Alice, I''m having trouble understanding closures. Could you explain them in our next session?'),
  (1, 2, 'Re: Question about JavaScript closures', 'Absolutely! I''ll prepare some examples. Closures are one of the most powerful features in JS.'),
  (5, 4, 'Photography workshop idea', 'Hey David, I was thinking we could collaborate on a photography and editing workshop. Interested?');

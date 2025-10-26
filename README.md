# SkillSwap - Learn. Teach. Connect. 🎓

A revolutionary peer-to-peer skill exchange platform where users can teach and learn from each other using a credit-based system. Built with Hono + Cloudflare Pages for optimal performance and global reach.

## 🌟 Live Demo

**Sandbox Development:** https://3000-idioa4voejw65z0jkaegu-8f57ffe2.sandbox.novita.ai
**Production:** Will be deployed to Cloudflare Pages

### Demo Credentials
- **Register new account** at the homepage (gets 100 free welcome credits)
- **Or use seeded user:**
  - Email: `alice@skillswap.com`
  - Email: `bob@skillswap.com` 
  - Email: `carol@skillswap.com`
  - *(Note: Passwords are hashed in seed data - register new account recommended)*

## 📋 Project Overview

SkillSwap is a unique platform that solves the friction of traditional learning marketplaces by using a **credit-based economy** where:
- 🎓 **Learners** spend credits to book sessions
- 👨‍🏫 **Teachers** earn credits by teaching
- 💰 Credits can be earned OR purchased
- 🚀 No upfront cash required to start learning

### Target Market
- Online education market ($350B+ globally)
- Peer-to-peer learning enthusiasts
- Side-hustle economy participants
- Lifelong learners and skill sharers

## ✨ Features Implemented

### 🎨 UI/UX Design (UPDATED)
- [x] **Apple-inspired design language** - Clean, minimal aesthetics
- [x] **Inter font family** - Modern typography
- [x] **Glassmorphism effects** - Frosted glass navigation and cards
- [x] **#0071e3 Apple blue** - Signature brand color
- [x] **980px border radius** - Signature rounded buttons
- [x] **Responsive design** - Mobile-first approach
- [x] **Working interactive buttons** - All UI elements functional

### 🔐 Authentication & User Management
- [x] Email/password registration and login
- [x] JWT-based authentication
- [x] User roles (Learner, Teacher, Both)
- [x] Profile management with bio and avatar
- [x] 100 free welcome credits for new users
- [ ] OAuth login (Google, Microsoft, Apple) - Placeholders added

### 💳 Credit System & Payments
- [x] Virtual credit wallet with real-time balance display
- [x] Transaction history tracking
- [x] Credit purchase UI with 3 packages ($10, $45, $80)
- [x] Automatic credit transfers on session completion
- [x] Balance protection and validation
- [x] **Pricing tiers display** - Free, Pro ($9.99), Enterprise ($49.99)
- [ ] Stripe payment integration - Placeholder API endpoints ready
- [ ] Subscription management system

### 🎯 Core Features
- [x] **Skill Discovery:** Browse 15+ skills across 5 categories
- [x] **Teacher Matching:** Find teachers by skill, rating, and rate
- [x] **Session Booking:** Request-based booking system
- [x] **Session Management:** Status tracking (pending, confirmed, completed, cancelled)
- [x] **External Meeting Links:** Integration-ready for Zoom/Google Meet
- [x] **Rating & Reviews:** 5-star rating system with comments
- [x] **Notifications:** Real-time notification system

### 📚 Learning Library
- [x] Micro-learning content (bite-sized lessons)
- [x] User-generated content with admin moderation
- [x] Video link support (YouTube, Vimeo, etc.)
- [x] Content categorization by skill and difficulty
- [x] View count tracking

### 🏆 Gamification
- [x] Badge system (6 achievement types)
- [x] User statistics tracking
- [x] Leaderboard-ready data structure
- [x] Progress tracking

### 👥 Community Features
- [x] Forum system with topics and replies
- [x] Async messaging between users
- [x] Global search (users, skills, content)
- [x] Category-based browsing

### 🛠 Admin Panel
- [x] Content moderation queue
- [x] Approve/reject user-generated content
- [x] Admin-only endpoints with authentication

## 🏗 Technical Architecture

### Frontend
- **Framework:** Vanilla JavaScript with Apple-inspired design
- **UI Library:** TailwindCSS (via CDN) + Custom Apple CSS
- **Typography:** Inter font family (Google Fonts)
- **Design System:** Apple Design Language (#0071e3, glassmorphism, 980px radius)
- **Icons:** FontAwesome 6
- **HTTP Client:** Axios
- **Responsive:** Mobile-first design

### Backend
- **Framework:** Hono v4.10.3 (fast, lightweight, edge-optimized)
- **Runtime:** Cloudflare Workers
- **Language:** TypeScript
- **API Style:** RESTful JSON APIs

### Database
- **Primary:** Cloudflare D1 (SQLite at edge)
- **Schema:** 14 tables with relationships
- **Migrations:** Version-controlled SQL migrations
- **Seed Data:** Pre-populated demo data

### Deployment
- **Platform:** Cloudflare Pages
- **Edge Network:** Global CDN
- **Build Tool:** Vite
- **Process Manager:** PM2 (development)

## 📊 Database Schema

### Core Tables
1. **users** - User accounts and profiles
2. **skills** - Master skill catalog
3. **user_skills** - User-skill mapping (teach/learn)
4. **sessions** - Booking and session records
5. **reviews** - Ratings and feedback
6. **credit_transactions** - Financial history
7. **learning_content** - Micro-learning library
8. **badges** - Achievement definitions
9. **user_badges** - Earned achievements
10. **notifications** - User notifications
11. **messages** - Direct messaging
12. **forum_topics** - Community discussions
13. **forum_replies** - Topic responses

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Wrangler CLI (Cloudflare)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd skillswap

# Install dependencies
npm install

# Setup local database
npm run db:migrate:local
npm run db:seed

# Build the project
npm run build

# Start development server
npm run dev:sandbox
```

### Development Commands

```bash
# Development
npm run dev              # Vite dev server
npm run dev:sandbox      # Wrangler local dev with D1
npm run build            # Production build
npm run preview          # Preview production build

# Database
npm run db:migrate:local  # Apply migrations locally
npm run db:migrate:prod   # Apply migrations to production
npm run db:seed          # Seed sample data
npm run db:reset         # Reset local database
npm run db:console:local # SQL console (local)
npm run db:console:prod  # SQL console (production)

# Utilities
npm run clean-port       # Kill process on port 3000
npm run test            # Test local server
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile with stats
- `PUT /api/users/:id` - Update profile
- `GET /api/users/:id/skills` - Get user skills
- `POST /api/users/:id/skills` - Add skill
- `GET /api/users/:id/reviews` - Get user reviews
- `GET /api/users/:id/transactions` - Get transaction history

### Skills
- `GET /api/skills` - List all skills
- `GET /api/skills/:id/teachers` - Find teachers for skill

### Sessions
- `GET /api/sessions` - List user sessions (filtered)
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions` - Book new session
- `PATCH /api/sessions/:id` - Update session status

### Reviews
- `POST /api/reviews` - Submit review

### Content
- `GET /api/content` - List learning content
- `GET /api/content/:id` - Get content details
- `POST /api/content` - Create content (requires auth)

### Credits
- `POST /api/credits/purchase` - Buy credits

### Dashboard
- `GET /api/dashboard` - Get personalized dashboard data

### Search
- `GET /api/search?q=<query>&type=<type>` - Global search

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id` - Mark as read

### Admin
- `GET /api/admin/content/pending` - Pending content (admin only)
- `PATCH /api/admin/content/:id` - Approve/reject content (admin only)

## 📱 User Flow

### New User Journey
1. **Landing Page** → View features and value proposition
2. **Register** → Create account (get 100 free credits)
3. **Dashboard** → See personalized recommendations
4. **Discover** → Browse skills and find teachers
5. **Book Session** → Request session with teacher
6. **Teacher Confirms** → Credits deducted
7. **Attend Session** → External meeting link
8. **Complete & Review** → Teacher gets credits, both leave reviews
9. **Earn More** → Teach skills to earn credits

### Teacher Journey
1. **Register as Teacher** → Add skills to teach
2. **Set Rates** → Define credit rate per hour
3. **Receive Requests** → Get notifications for bookings
4. **Confirm Sessions** → Provide meeting link
5. **Teach & Earn** → Complete session, receive credits
6. **Build Reputation** → Get reviews and badges

## 🎨 Features Not Yet Implemented (Roadmap)

### Phase 2 (Post-MVP)
- [ ] Social login (Google, Apple, Microsoft OAuth)
- [ ] Real-time chat (use third-party like SendBird)
- [ ] Live video sessions (integrate Agora.io or Twilio)
- [ ] Calendar sync (Google Calendar, Outlook API)
- [ ] Email notifications (SendGrid integration)
- [ ] Mobile apps (React Native)
- [ ] Advanced search filters
- [ ] Subscription tiers (Premium features)
- [ ] Referral program
- [ ] Teacher verification system

### Phase 3 (Scale)
- [ ] Multi-language support
- [ ] AI-powered recommendations
- [ ] Group sessions/workshops
- [ ] Certificate generation
- [ ] Learning paths
- [ ] Analytics dashboard
- [ ] Affiliate program
- [ ] Corporate accounts

## 🔒 Security Considerations

### Current Implementation (MVP)
- ⚠️ **Demo Password Hashing:** Using SHA-256 (NOT production-ready)
- ✅ **JWT Tokens:** Base64-encoded with expiration
- ✅ **SQL Injection Protection:** Parameterized queries
- ✅ **Authorization Checks:** User ownership validation

### Production Requirements
- [ ] Implement proper bcrypt password hashing
- [ ] Use signed JWT with secret key
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Enable HTTPS only
- [ ] Add input sanitization
- [ ] Implement audit logging
- [ ] Add 2FA/MFA support

## 💰 Monetization Strategy

### Revenue Streams
1. **Transaction Fees:** 10% fee on credit purchases
2. **Premium Subscriptions:** $9.99/month
   - Unlimited sessions
   - Priority booking
   - Ad-free experience
   - Exclusive content
3. **Credit Packages:**
   - 100 credits: $10
   - 500 credits: $45 (10% discount)
   - 1000 credits: $80 (20% discount)
4. **Featured Teacher Listings:** $19.99/month
5. **Corporate Accounts:** Custom pricing

### Cost Structure
- Cloudflare Pages: Free tier (10M requests/month)
- D1 Database: $5/month (beyond free tier)
- R2 Storage: $0.015/GB (for future media storage)
- Marketing & Operations

## 🌐 Deployment Guide

### Prerequisites
1. Cloudflare account
2. GitHub account (for CI/CD)
3. Cloudflare API token

### Step-by-Step Deployment

```bash
# 1. Create production D1 database
npx wrangler d1 create skillswap-production

# 2. Update wrangler.jsonc with database_id

# 3. Apply migrations to production
npm run db:migrate:prod

# 4. Build the project
npm run build

# 5. Create Cloudflare Pages project
npx wrangler pages project create skillswap --production-branch main

# 6. Deploy to Cloudflare Pages
npm run deploy

# 7. Set environment variables (if needed)
npx wrangler pages secret put STRIPE_API_KEY --project-name skillswap
```

### Environment Variables
- `STRIPE_API_KEY` - Stripe secret key (for credit purchases)
- `JWT_SECRET` - JWT signing secret (for production)
- `ADMIN_EMAIL` - Admin notification email

## 📈 Performance Metrics

### Current Status
- **Build Time:** ~2.3s (Vite optimization)
- **API Response:** <100ms (local)
- **Database Queries:** Indexed and optimized
- **Bundle Size:** 95.57 kB (Worker with Apple UI)
- **Database:** 14 tables, 252 rows seeded
- **UI Framework:** Apple-inspired design system
- **Lighthouse Score:** (To be measured)

### Expected Production Performance
- **Global Edge Latency:** <50ms
- **API Response:** <100ms (90th percentile)
- **Uptime:** 99.9%+
- **Concurrent Users:** 10,000+ (Cloudflare Workers scale)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for formatting
- Conventional commits
- Unit tests for critical paths

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Hono** - Fast, lightweight web framework
- **Cloudflare** - Edge computing platform
- **TailwindCSS** - Utility-first CSS framework
- **FontAwesome** - Icon library

## 📞 Support

- **Email:** support@skillswap.com
- **Discord:** [Join Community](https://discord.gg/skillswap)
- **Twitter:** [@skillswap_app](https://twitter.com/skillswap_app)

## 🗺 Next Steps

### Immediate (Pre-Launch)
1. ✅ Complete MVP development
2. ✅ Apple UI redesign with working buttons
3. ✅ Fix 404 dashboard redirect error
4. ✅ Local database migrations applied
5. ⏳ Push to GitHub
6. ⏳ Deploy to Cloudflare Pages production
7. ⏳ OAuth integration (requires Google/Microsoft/Apple API keys)
8. ⏳ Stripe payment integration (requires API key)
9. ⏳ Set up monitoring (Sentry, LogRocket)
10. ⏳ Create demo video

### Short-term (Week 1-4)
- User feedback collection
- Bug fixes and optimizations
- Integrate Stripe payments
- Add email notifications
- Implement real-time chat
- Mobile responsiveness improvements

### Mid-term (Month 2-3)
- Social login integration
- Live video sessions (Agora/Twilio)
- Premium subscription launch
- Marketing campaign
- Influencer partnerships
- Content creator program

---

**Built with ❤️ by the SkillSwap Team**

*Last Updated: October 26, 2025*

# SkillSwap Testing Guide 🧪

Quick reference for testing all features of the SkillSwap MVP.

## 🌐 Test URLs

### Local Development
- **Homepage:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard.html
- **API Base:** http://localhost:3000/api

### Sandbox Demo
- **Homepage:** https://3000-idioa4voejw65z0jkaegu-8f57ffe2.sandbox.novita.ai
- **Dashboard:** https://3000-idioa4voejw65z0jkaegu-8f57ffe2.sandbox.novita.ai/dashboard.html

## 👤 Demo Accounts

### Test User (Created during testing)
- **Email:** test@skillswap.com
- **Password:** password123
- **Role:** Both (Teacher & Learner)
- **Credits:** 100

### Sample Users (From seed data)
Note: These use placeholder password hashes - create new accounts instead

To create your own test account:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "yourpassword",
    "name": "Your Name",
    "role": "both"
  }'
```

## 🧪 API Testing with cURL

### Authentication

**Register New User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User",
    "role": "both"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@skillswap.com",
    "password": "password123"
  }'
```

**Get Current User:**
```bash
# Save token from login response
TOKEN="your_token_here"

curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Skills

**List All Skills:**
```bash
curl http://localhost:3000/api/skills
```

**Filter by Category:**
```bash
curl "http://localhost:3000/api/skills?category=tech"
```

**Search Skills:**
```bash
curl "http://localhost:3000/api/skills?search=javascript"
```

**Find Teachers for a Skill:**
```bash
curl http://localhost:3000/api/skills/1/teachers
```

### Sessions

**Book a Session:**
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "teacher_id": 1,
    "skill_id": 1,
    "title": "JavaScript Basics",
    "description": "Learn JS fundamentals",
    "scheduled_date": "2025-11-01T14:00:00Z",
    "duration_minutes": 60
  }'
```

**Get My Sessions:**
```bash
curl http://localhost:3000/api/sessions \
  -H "Authorization: Bearer $TOKEN"
```

**Get Session Details:**
```bash
curl http://localhost:3000/api/sessions/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Update Session Status:**
```bash
curl -X PATCH http://localhost:3000/api/sessions/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "meeting_link": "https://zoom.us/j/123456789"
  }'
```

### Reviews

**Submit Review:**
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "reviewee_id": 1,
    "rating": 5,
    "comment": "Excellent teacher! Highly recommended."
  }'
```

**Get User Reviews:**
```bash
curl http://localhost:3000/api/users/1/reviews
```

### Learning Content

**List Content:**
```bash
curl http://localhost:3000/api/content
```

**Filter by Skill:**
```bash
curl "http://localhost:3000/api/content?skill_id=1"
```

**Get Content Details:**
```bash
curl http://localhost:3000/api/content/1
```

**Create Content:**
```bash
curl -X POST http://localhost:3000/api/content \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skill_id": 1,
    "title": "JavaScript Tips & Tricks",
    "description": "10 essential JS tips",
    "content_type": "video",
    "content_url": "https://youtube.com/watch?v=example",
    "duration_minutes": 15,
    "difficulty_level": "intermediate"
  }'
```

### Credits & Wallet

**Get Transaction History:**
```bash
curl http://localhost:3000/api/users/7/transactions \
  -H "Authorization: Bearer $TOKEN"
```

**Purchase Credits:**
```bash
curl -X POST http://localhost:3000/api/credits/purchase \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "payment_intent_id": "demo_payment_123"
  }'
```

### Dashboard

**Get Dashboard Data:**
```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Search

**Global Search:**
```bash
curl "http://localhost:3000/api/search?q=javascript"
```

**Search Specific Type:**
```bash
curl "http://localhost:3000/api/search?q=javascript&type=skills"
```

### Notifications

**Get Notifications:**
```bash
curl http://localhost:3000/api/notifications \
  -H "Authorization: Bearer $TOKEN"
```

**Mark as Read:**
```bash
curl -X PATCH http://localhost:3000/api/notifications/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 🖥 Browser Testing

### Manual Test Flow

1. **Homepage:**
   - Visit http://localhost:3000
   - Click "Get Started" → Opens register modal
   - Click "Login" → Opens login modal
   - Test responsive design (resize browser)

2. **Registration:**
   - Fill in name, email, password
   - Select role (Learn and Teach)
   - Submit → Should redirect to dashboard
   - Check welcome notification (100 credits)

3. **Dashboard:**
   - Check stats display (0 sessions initially)
   - Verify credit balance (100)
   - Check navigation menu
   - Click profile avatar → Should show name

4. **Discover Skills:**
   - Click "Discover Skills" in sidebar
   - Browse category cards
   - Use search bar
   - Click on a skill → View teachers

5. **Book Session:**
   - Find a teacher with available rate
   - Click "Book Session"
   - Fill in details
   - Check credit cost calculation
   - Submit booking
   - Verify in "My Sessions"

6. **View Sessions:**
   - Click "My Sessions" in sidebar
   - Filter by status
   - View session details
   - Update session status (if teacher)

7. **Learning Library:**
   - Click "Learning Library"
   - Browse content cards
   - Click play button
   - Check video link opens

8. **Profile:**
   - Click "My Profile"
   - Update name and bio
   - Save changes
   - View skills section

9. **Wallet:**
   - Click "Wallet" in sidebar
   - Check balance
   - Click "Buy Credits"
   - Test purchase flow
   - View transaction history

10. **Notifications:**
    - Click bell icon
    - Check notification list
    - Mark as read

## 📱 Mobile Testing

Test on different screen sizes:
- **Mobile:** 375px (iPhone)
- **Tablet:** 768px (iPad)
- **Desktop:** 1920px

Key checks:
- Navigation menu (hamburger on mobile)
- Forms are usable
- Cards stack properly
- No horizontal scroll
- Buttons are tappable
- Text is readable

## 🔍 Database Verification

**Check Local Database:**
```bash
# Open SQLite console
npm run db:console:local

# Run queries
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM skills;
SELECT COUNT(*) FROM sessions;
SELECT * FROM users WHERE email = 'test@skillswap.com';
```

## ⚡ Performance Testing

**Load Testing with Apache Bench:**
```bash
# Install ab (if not installed)
# sudo apt-get install apache2-utils

# Test homepage (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:3000/

# Test API endpoint
ab -n 100 -c 10 http://localhost:3000/api/skills
```

**Expected Results:**
- Requests per second: >500
- Time per request: <20ms
- Failed requests: 0

## 🐛 Common Issues & Solutions

### Issue: "User not found" after registration
**Solution:** Check that DB migrations ran successfully
```bash
npm run db:migrate:local
npm run db:seed
```

### Issue: CORS errors in browser
**Solution:** CORS is enabled for `/api/*`. Check network tab for actual error.

### Issue: Dashboard not loading
**Solution:** 
1. Check token is saved in localStorage
2. Open DevTools → Application → Local Storage
3. Verify `authToken` exists

### Issue: Sessions not showing
**Solution:** Create test data:
```bash
# Register two users
# Book session between them
# Status should show in both dashboards
```

## ✅ Feature Checklist

Use this to verify all features work:

### Authentication
- [ ] Register new user
- [ ] Login existing user
- [ ] Logout
- [ ] Get current user info
- [ ] 100 welcome credits received

### Skills
- [ ] View all skills
- [ ] Filter by category
- [ ] Search skills
- [ ] View teachers for skill
- [ ] See teacher ratings and rates

### Sessions
- [ ] Book new session
- [ ] View my sessions (as learner)
- [ ] View my sessions (as teacher)
- [ ] Confirm session (teacher)
- [ ] Credits deducted on confirmation
- [ ] Complete session
- [ ] Credits transferred to teacher
- [ ] Cancel session

### Reviews
- [ ] Submit review after session
- [ ] View reviews on profile
- [ ] Star rating calculation
- [ ] Review notification sent

### Content
- [ ] View content library
- [ ] Filter by skill/difficulty
- [ ] Play video (external link)
- [ ] View count increments
- [ ] Create new content
- [ ] Admin approval workflow

### Credits
- [ ] View balance
- [ ] Purchase credits
- [ ] Transaction history
- [ ] Balance updates correctly
- [ ] Prevent negative balance

### Dashboard
- [ ] Personal stats display
- [ ] Upcoming sessions list
- [ ] Recommended content
- [ ] Recent transactions
- [ ] Quick navigation

### Profile
- [ ] View profile
- [ ] Edit profile
- [ ] Upload avatar (future)
- [ ] View skills
- [ ] Add/remove skills
- [ ] View badges earned

### Notifications
- [ ] Receive notifications
- [ ] Unread count badge
- [ ] Mark as read
- [ ] Different notification types

### Admin
- [ ] View pending content
- [ ] Approve content
- [ ] Reject content
- [ ] Only admins can access

## 📊 Test Data Summary

After seeding, you should have:
- **15 Skills** across 5 categories
- **6 Users** (including 1 admin)
- **4 Sample Sessions**
- **4 Reviews**
- **5 Learning Content Items**
- **6 Badges**
- **3 Forum Topics**

## 🎯 Production Testing

Before deploying to production, test:

1. **Security:**
   - [ ] SQL injection attempts
   - [ ] XSS attempts
   - [ ] CSRF protection
   - [ ] Authentication bypass attempts

2. **Load:**
   - [ ] 100 concurrent users
   - [ ] Database connection pooling
   - [ ] API rate limiting

3. **Data:**
   - [ ] User data privacy
   - [ ] Transaction integrity
   - [ ] Session state consistency

4. **Integration:**
   - [ ] External links work
   - [ ] Payment gateway (Stripe)
   - [ ] Email notifications (future)

---

**Happy Testing! 🧪**

Found a bug? Document it and fix it! This is an MVP - iterate quickly!

*Last Updated: October 26, 2025*

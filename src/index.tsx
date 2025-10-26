import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings, ApiResponse, User, Session, Skill, LearningContent, UserWithStats } from './types'
import { hashPassword, verifyPassword, createAuthToken, getUserFromAuth, isValidEmail } from './utils/auth'
import { query, queryOne, execute, paginate, buildSearchQuery, getIntParam, formatDate } from './utils/db'
import { HomePage } from './pages/home'
import { DashboardPage } from './pages/dashboard'

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ==================== PAGE ROUTES ====================

// Home page
app.get('/', (c) => {
  return c.html(HomePage())
})

// Dashboard page
app.get('/dashboard', (c) => {
  return c.html(DashboardPage())
})

// ==================== OAUTH ROUTES (Placeholders) ====================

// Google OAuth
app.get('/api/auth/oauth/google', (c) => {
  // In production, redirect to Google OAuth
  // For now, show message
  return c.html(`
    <div style="font-family: Inter, sans-serif; text-align: center; padding: 100px 20px;">
      <h1 style="font-size: 32px; margin-bottom: 16px;">🔵 Google OAuth</h1>
      <p style="font-size: 18px; color: #6e6e73; margin-bottom: 32px;">
        Google OAuth integration will be configured here.<br>
        You'll need to set up Google Cloud Console OAuth credentials.
      </p>
      <a href="/" style="background: #0071e3; color: white; padding: 12px 24px; border-radius: 980px; text-decoration: none; font-size: 15px;">
        Back to Home
      </a>
    </div>
  `)
})

// Microsoft OAuth
app.get('/api/auth/oauth/microsoft', (c) => {
  return c.html(`
    <div style="font-family: Inter, sans-serif; text-align: center; padding: 100px 20px;">
      <h1 style="font-size: 32px; margin-bottom: 16px;">🔷 Microsoft OAuth</h1>
      <p style="font-size: 18px; color: #6e6e73; margin-bottom: 32px;">
        Microsoft OAuth integration will be configured here.<br>
        You'll need to set up Azure AD application credentials.
      </p>
      <a href="/" style="background: #0071e3; color: white; padding: 12px 24px; border-radius: 980px; text-decoration: none; font-size: 15px;">
        Back to Home
      </a>
    </div>
  `)
})

// Apple OAuth
app.get('/api/auth/oauth/apple', (c) => {
  return c.html(`
    <div style="font-family: Inter, sans-serif; text-align: center; padding: 100px 20px;">
      <h1 style="font-size: 32px; margin-bottom: 16px;">🍎 Apple OAuth</h1>
      <p style="font-size: 18px; color: #6e6e73; margin-bottom: 32px;">
        Apple Sign In integration will be configured here.<br>
        You'll need to set up Apple Developer account credentials.
      </p>
      <a href="/" style="background: #0071e3; color: white; padding: 12px 24px; border-radius: 980px; text-decoration: none; font-size: 15px;">
        Back to Home
      </a>
    </div>
  `)
})

// ==================== AUTHENTICATION ROUTES ====================

// Register new user
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, name, role = 'both' } = await c.req.json()

    // Validate input
    if (!email || !password || !name) {
      return c.json<ApiResponse>({ success: false, error: 'Email, password, and name are required' }, 400)
    }

    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({ success: false, error: 'Invalid email format' }, 400)
    }

    if (password.length < 6) {
      return c.json<ApiResponse>({ success: false, error: 'Password must be at least 6 characters' }, 400)
    }

    // Check if user exists
    const existing = await queryOne<User>(c.env.DB, 'SELECT id FROM users WHERE email = ?', [email])
    if (existing) {
      return c.json<ApiResponse>({ success: false, error: 'Email already registered' }, 400)
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const result = await execute(c.env.DB, 
      'INSERT INTO users (email, password_hash, name, role, credit_balance) VALUES (?, ?, ?, ?, 100)',
      [email, passwordHash, name, role]
    )

    // Create welcome transaction
    await execute(c.env.DB,
      'INSERT INTO credit_transactions (user_id, amount, transaction_type, description, balance_after) VALUES (?, 100, ?, ?, 100)',
      [result.meta.last_row_id, 'bonus', 'Welcome bonus']
    )

    // Create welcome notification
    await execute(c.env.DB,
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [result.meta.last_row_id, 'Welcome to SkillSwap!', 'You received 100 credits to get started. Happy learning!', 'credit']
    )

    const token = createAuthToken(result.meta.last_row_id as number, email)

    return c.json<ApiResponse>({
      success: true,
      data: {
        token,
        user: {
          id: result.meta.last_row_id,
          email,
          name,
          role,
          credit_balance: 100
        }
      },
      message: 'Registration successful!'
    })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json<ApiResponse>({ success: false, error: 'Registration failed' }, 500)
  }
})

// Login
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json<ApiResponse>({ success: false, error: 'Email and password are required' }, 400)
    }

    // Find user
    const user = await queryOne<User>(c.env.DB, 
      'SELECT id, email, password_hash, name, role, credit_balance, is_premium, is_admin FROM users WHERE email = ? AND is_active = 1',
      [email]
    )

    if (!user) {
      return c.json<ApiResponse>({ success: false, error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash!)
    if (!isValid) {
      return c.json<ApiResponse>({ success: false, error: 'Invalid credentials' }, 401)
    }

    // Update last login
    await execute(c.env.DB, 'UPDATE users SET last_login = ? WHERE id = ?', [formatDate(), user.id])

    const token = createAuthToken(user.id, user.email)

    return c.json<ApiResponse>({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          credit_balance: user.credit_balance,
          is_premium: user.is_premium,
          is_admin: user.is_admin
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json<ApiResponse>({ success: false, error: 'Login failed' }, 500)
  }
})

// Get current user
app.get('/api/auth/me', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const user = await queryOne<User>(c.env.DB,
    'SELECT id, email, name, bio, avatar_url, role, credit_balance, is_premium, is_admin, language_preference, created_at FROM users WHERE id = ?',
    [authUser.userId]
  )

  if (!user) {
    return c.json<ApiResponse>({ success: false, error: 'User not found' }, 404)
  }

  return c.json<ApiResponse>({ success: true, data: user })
})

// ==================== USER PROFILE ROUTES ====================

// Get user profile with stats
app.get('/api/users/:id', async (c) => {
  const userId = getIntParam(c.req.param('id'))

  const user = await queryOne<UserWithStats>(c.env.DB, `
    SELECT 
      u.*,
      (SELECT COUNT(*) FROM sessions WHERE teacher_id = u.id AND status = 'completed') as total_sessions_taught,
      (SELECT COUNT(*) FROM sessions WHERE learner_id = u.id AND status = 'completed') as total_sessions_learned,
      (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE reviewee_id = u.id) as average_rating,
      (SELECT COUNT(*) FROM reviews WHERE reviewee_id = u.id) as total_reviews,
      (SELECT COUNT(*) FROM user_badges WHERE user_id = u.id) as badges_earned
    FROM users u
    WHERE u.id = ? AND u.is_active = 1
  `, [userId])

  if (!user) {
    return c.json<ApiResponse>({ success: false, error: 'User not found' }, 404)
  }

  // Remove password hash
  delete user.password_hash

  return c.json<ApiResponse>({ success: true, data: user })
})

// Update user profile
app.put('/api/users/:id', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const userId = getIntParam(c.req.param('id'))
  if (authUser.userId !== userId) {
    return c.json<ApiResponse>({ success: false, error: 'Forbidden' }, 403)
  }

  const { name, bio, avatar_url, language_preference } = await c.req.json()

  await execute(c.env.DB,
    'UPDATE users SET name = COALESCE(?, name), bio = COALESCE(?, bio), avatar_url = COALESCE(?, avatar_url), language_preference = COALESCE(?, language_preference) WHERE id = ?',
    [name, bio, avatar_url, language_preference, userId]
  )

  return c.json<ApiResponse>({ success: true, message: 'Profile updated successfully' })
})

// Get user skills
app.get('/api/users/:id/skills', async (c) => {
  const userId = getIntParam(c.req.param('id'))

  const skills = await query(c.env.DB, `
    SELECT us.*, s.name as skill_name, s.category, s.icon
    FROM user_skills us
    JOIN skills s ON us.skill_id = s.id
    WHERE us.user_id = ?
    ORDER BY us.skill_type, s.name
  `, [userId])

  return c.json<ApiResponse>({ success: true, data: skills })
})

// Add user skill
app.post('/api/users/:id/skills', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const userId = getIntParam(c.req.param('id'))
  if (authUser.userId !== userId) {
    return c.json<ApiResponse>({ success: false, error: 'Forbidden' }, 403)
  }

  const { skill_id, skill_type, proficiency_level, hourly_credit_rate } = await c.req.json()

  try {
    await execute(c.env.DB,
      'INSERT INTO user_skills (user_id, skill_id, skill_type, proficiency_level, hourly_credit_rate) VALUES (?, ?, ?, ?, ?)',
      [userId, skill_id, skill_type, proficiency_level, hourly_credit_rate]
    )

    return c.json<ApiResponse>({ success: true, message: 'Skill added successfully' })
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Skill already exists or invalid data' }, 400)
  }
})

// ==================== SKILLS ROUTES ====================

// Get all skills
app.get('/api/skills', async (c) => {
  const category = c.req.query('category')
  const search = c.req.query('search')

  let sql = 'SELECT * FROM skills WHERE is_active = 1'
  const params: any[] = []

  if (category) {
    sql += ' AND category = ?'
    params.push(category)
  }

  if (search) {
    const { condition, params: searchParams } = buildSearchQuery(['name', 'description'], search)
    sql += ` AND ${condition}`
    params.push(...searchParams)
  }

  sql += ' ORDER BY name'

  const skills = await query<Skill>(c.env.DB, sql, params)

  return c.json<ApiResponse>({ success: true, data: skills })
})

// Get teachers for a skill
app.get('/api/skills/:id/teachers', async (c) => {
  const skillId = getIntParam(c.req.param('id'))

  const teachers = await query(c.env.DB, `
    SELECT 
      u.id, u.name, u.bio, u.avatar_url, u.is_premium,
      us.proficiency_level, us.hourly_credit_rate,
      (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE reviewee_id = u.id) as average_rating,
      (SELECT COUNT(*) FROM sessions WHERE teacher_id = u.id AND status = 'completed') as total_sessions
    FROM user_skills us
    JOIN users u ON us.user_id = u.id
    WHERE us.skill_id = ? AND us.skill_type = 'teach' AND u.is_active = 1
    ORDER BY average_rating DESC, total_sessions DESC
  `, [skillId])

  return c.json<ApiResponse>({ success: true, data: teachers })
})

// ==================== SESSIONS ROUTES ====================

// Get sessions (filtered)
app.get('/api/sessions', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const status = c.req.query('status')
  const role = c.req.query('role') // 'teacher' or 'learner'
  const page = getIntParam(c.req.query('page'), 1)
  const limit = getIntParam(c.req.query('limit'), 10)

  let sql = `
    SELECT 
      s.*,
      t.name as teacher_name, t.avatar_url as teacher_avatar,
      l.name as learner_name, l.avatar_url as learner_avatar,
      sk.name as skill_name, sk.icon as skill_icon
    FROM sessions s
    JOIN users t ON s.teacher_id = t.id
    JOIN users l ON s.learner_id = l.id
    JOIN skills sk ON s.skill_id = sk.id
    WHERE (s.teacher_id = ? OR s.learner_id = ?)
  `
  const params: any[] = [authUser.userId, authUser.userId]

  if (status) {
    sql += ' AND s.status = ?'
    params.push(status)
  }

  if (role === 'teacher') {
    sql += ' AND s.teacher_id = ?'
    params.push(authUser.userId)
  } else if (role === 'learner') {
    sql += ' AND s.learner_id = ?'
    params.push(authUser.userId)
  }

  sql += ' ORDER BY s.scheduled_date DESC'

  const result = await paginate(c.env.DB, sql, params, page, limit)

  return c.json<ApiResponse>({ success: true, data: result.data, pagination: result })
})

// Get single session
app.get('/api/sessions/:id', async (c) => {
  const sessionId = getIntParam(c.req.param('id'))

  const session = await queryOne(c.env.DB, `
    SELECT 
      s.*,
      t.name as teacher_name, t.email as teacher_email, t.avatar_url as teacher_avatar,
      l.name as learner_name, l.email as learner_email, l.avatar_url as learner_avatar,
      sk.name as skill_name, sk.category, sk.icon
    FROM sessions s
    JOIN users t ON s.teacher_id = t.id
    JOIN users l ON s.learner_id = l.id
    JOIN skills sk ON s.skill_id = sk.id
    WHERE s.id = ?
  `, [sessionId])

  if (!session) {
    return c.json<ApiResponse>({ success: false, error: 'Session not found' }, 404)
  }

  return c.json<ApiResponse>({ success: true, data: session })
})

// Create session booking
app.post('/api/sessions', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const { teacher_id, skill_id, title, description, scheduled_date, duration_minutes } = await c.req.json()

    // Get teacher's rate
    const teacherSkill = await queryOne<{ hourly_credit_rate: number }>(c.env.DB,
      'SELECT hourly_credit_rate FROM user_skills WHERE user_id = ? AND skill_id = ? AND skill_type = ?',
      [teacher_id, skill_id, 'teach']
    )

    if (!teacherSkill) {
      return c.json<ApiResponse>({ success: false, error: 'Teacher does not teach this skill' }, 400)
    }

    const credit_cost = Math.round((teacherSkill.hourly_credit_rate * duration_minutes) / 60)

    // Check learner's balance
    const learner = await queryOne<User>(c.env.DB, 'SELECT credit_balance FROM users WHERE id = ?', [authUser.userId])
    if (!learner || learner.credit_balance < credit_cost) {
      return c.json<ApiResponse>({ success: false, error: 'Insufficient credits' }, 400)
    }

    // Create session
    const result = await execute(c.env.DB,
      'INSERT INTO sessions (teacher_id, learner_id, skill_id, title, description, scheduled_date, duration_minutes, credit_cost, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [teacher_id, authUser.userId, skill_id, title, description, scheduled_date, duration_minutes, credit_cost, 'pending']
    )

    // Create notification for teacher
    await execute(c.env.DB,
      'INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id) VALUES (?, ?, ?, ?, ?, ?)',
      [teacher_id, 'New Session Request', `You have a new session request for "${title}"`, 'session', 'session', result.meta.last_row_id]
    )

    return c.json<ApiResponse>({
      success: true,
      data: { session_id: result.meta.last_row_id, credit_cost },
      message: 'Session request sent successfully!'
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return c.json<ApiResponse>({ success: false, error: 'Failed to create session' }, 500)
  }
})

// Update session status (confirm/decline/complete/cancel)
app.patch('/api/sessions/:id', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const sessionId = getIntParam(c.req.param('id'))
  const { status, meeting_link, notes } = await c.req.json()

  const session = await queryOne<Session>(c.env.DB, 'SELECT * FROM sessions WHERE id = ?', [sessionId])
  if (!session) {
    return c.json<ApiResponse>({ success: false, error: 'Session not found' }, 404)
  }

  // Check authorization
  if (session.teacher_id !== authUser.userId && session.learner_id !== authUser.userId) {
    return c.json<ApiResponse>({ success: false, error: 'Forbidden' }, 403)
  }

  // Handle different status updates
  if (status === 'confirmed' && session.teacher_id === authUser.userId) {
    // Teacher confirms - deduct credits from learner
    await execute(c.env.DB,
      'UPDATE users SET credit_balance = credit_balance - ? WHERE id = ?',
      [session.credit_cost, session.learner_id]
    )

    // Record transaction
    const learner = await queryOne<User>(c.env.DB, 'SELECT credit_balance FROM users WHERE id = ?', [session.learner_id])
    await execute(c.env.DB,
      'INSERT INTO credit_transactions (user_id, amount, transaction_type, reference_type, reference_id, description, balance_after) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [session.learner_id, -session.credit_cost, 'spent', 'session', sessionId, `Session: ${session.title}`, (learner?.credit_balance || 0) - session.credit_cost]
    )

    // Notify learner
    await execute(c.env.DB,
      'INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id) VALUES (?, ?, ?, ?, ?, ?)',
      [session.learner_id, 'Session Confirmed!', `Your session "${session.title}" has been confirmed`, 'session', 'session', sessionId]
    )
  }

  if (status === 'completed') {
    // Credit teacher
    await execute(c.env.DB,
      'UPDATE users SET credit_balance = credit_balance + ? WHERE id = ?',
      [session.credit_cost, session.teacher_id]
    )

    const teacher = await queryOne<User>(c.env.DB, 'SELECT credit_balance FROM users WHERE id = ?', [session.teacher_id])
    await execute(c.env.DB,
      'INSERT INTO credit_transactions (user_id, amount, transaction_type, reference_type, reference_id, description, balance_after) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [session.teacher_id, session.credit_cost, 'earned', 'session', sessionId, `Teaching: ${session.title}`, (teacher?.credit_balance || 0) + session.credit_cost]
    )

    // Notify both parties to leave reviews
    await execute(c.env.DB,
      'INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id) VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)',
      [
        session.teacher_id, 'Session Completed', 'Please rate your experience', 'session', 'session', sessionId,
        session.learner_id, 'Session Completed', 'Please rate your experience', 'session', 'session', sessionId
      ]
    )
  }

  // Update session
  await execute(c.env.DB,
    'UPDATE sessions SET status = COALESCE(?, status), meeting_link = COALESCE(?, meeting_link), notes = COALESCE(?, notes), updated_at = ? WHERE id = ?',
    [status, meeting_link, notes, formatDate(), sessionId]
  )

  return c.json<ApiResponse>({ success: true, message: 'Session updated successfully' })
})

// ==================== REVIEWS ROUTES ====================

// Get reviews for a user
app.get('/api/users/:id/reviews', async (c) => {
  const userId = getIntParam(c.req.param('id'))

  const reviews = await query(c.env.DB, `
    SELECT 
      r.*,
      u.name as reviewer_name, u.avatar_url as reviewer_avatar,
      s.title as session_title
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    JOIN sessions s ON r.session_id = s.id
    WHERE r.reviewee_id = ?
    ORDER BY r.created_at DESC
  `, [userId])

  return c.json<ApiResponse>({ success: true, data: reviews })
})

// Create review
app.post('/api/reviews', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const { session_id, reviewee_id, rating, comment } = await c.req.json()

    if (rating < 1 || rating > 5) {
      return c.json<ApiResponse>({ success: false, error: 'Rating must be between 1 and 5' }, 400)
    }

    // Verify session exists and user was part of it
    const session = await queryOne<Session>(c.env.DB,
      'SELECT * FROM sessions WHERE id = ? AND (teacher_id = ? OR learner_id = ?) AND status = ?',
      [session_id, authUser.userId, authUser.userId, 'completed']
    )

    if (!session) {
      return c.json<ApiResponse>({ success: false, error: 'Session not found or not completed' }, 404)
    }

    await execute(c.env.DB,
      'INSERT INTO reviews (session_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [session_id, authUser.userId, reviewee_id, rating, comment]
    )

    // Notify reviewee
    await execute(c.env.DB,
      'INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id) VALUES (?, ?, ?, ?, ?, ?)',
      [reviewee_id, 'New Review Received', `You received a ${rating}-star review`, 'review', 'session', session_id]
    )

    return c.json<ApiResponse>({ success: true, message: 'Review submitted successfully' })
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Failed to submit review' }, 500)
  }
})

// ==================== CREDIT ROUTES ====================

// Get user transactions
app.get('/api/users/:id/transactions', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const userId = getIntParam(c.req.param('id'))
  if (authUser.userId !== userId) {
    return c.json<ApiResponse>({ success: false, error: 'Forbidden' }, 403)
  }

  const transactions = await query(c.env.DB,
    'SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [userId]
  )

  return c.json<ApiResponse>({ success: true, data: transactions })
})

// Purchase credits (placeholder - integrate with Stripe)
app.post('/api/credits/purchase', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const { amount, payment_intent_id } = await c.req.json()

  if (amount < 10) {
    return c.json<ApiResponse>({ success: false, error: 'Minimum purchase is 10 credits' }, 400)
  }

  // TODO: Integrate with Stripe payment processing
  // For now, we'll simulate a successful purchase
  
  // Update user balance
  await execute(c.env.DB,
    'UPDATE users SET credit_balance = credit_balance + ? WHERE id = ?',
    [amount, authUser.userId]
  )

  const user = await queryOne<User>(c.env.DB, 'SELECT credit_balance FROM users WHERE id = ?', [authUser.userId])

  // Record transaction
  await execute(c.env.DB,
    'INSERT INTO credit_transactions (user_id, amount, transaction_type, description, balance_after) VALUES (?, ?, ?, ?, ?)',
    [authUser.userId, amount, 'purchase', `Purchased ${amount} credits`, user?.credit_balance || amount]
  )

  // Notify user
  await execute(c.env.DB,
    'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
    [authUser.userId, 'Credits Added', `${amount} credits added to your wallet`, 'credit']
  )

  return c.json<ApiResponse>({
    success: true,
    data: { new_balance: user?.credit_balance },
    message: 'Credits purchased successfully'
  })
})

// ==================== LEARNING CONTENT ROUTES ====================

// Get learning content
app.get('/api/content', async (c) => {
  const skill_id = c.req.query('skill_id')
  const difficulty = c.req.query('difficulty')
  const page = getIntParam(c.req.query('page'), 1)
  const limit = getIntParam(c.req.query('limit'), 12)

  let sql = `
    SELECT 
      lc.*,
      u.name as creator_name, u.avatar_url as creator_avatar,
      s.name as skill_name, s.icon as skill_icon
    FROM learning_content lc
    JOIN users u ON lc.creator_id = u.id
    JOIN skills s ON lc.skill_id = s.id
    WHERE lc.is_approved = 1
  `
  const params: any[] = []

  if (skill_id) {
    sql += ' AND lc.skill_id = ?'
    params.push(getIntParam(skill_id))
  }

  if (difficulty) {
    sql += ' AND lc.difficulty_level = ?'
    params.push(difficulty)
  }

  sql += ' ORDER BY lc.created_at DESC'

  const result = await paginate(c.env.DB, sql, params, page, limit)

  return c.json<ApiResponse>({ success: true, data: result.data, pagination: result })
})

// Get single content
app.get('/api/content/:id', async (c) => {
  const contentId = getIntParam(c.req.param('id'))

  const content = await queryOne(c.env.DB, `
    SELECT 
      lc.*,
      u.name as creator_name, u.avatar_url as creator_avatar,
      s.name as skill_name, s.category, s.icon
    FROM learning_content lc
    JOIN users u ON lc.creator_id = u.id
    JOIN skills s ON lc.skill_id = s.id
    WHERE lc.id = ?
  `, [contentId])

  if (!content) {
    return c.json<ApiResponse>({ success: false, error: 'Content not found' }, 404)
  }

  // Increment view count
  await execute(c.env.DB, 'UPDATE learning_content SET view_count = view_count + 1 WHERE id = ?', [contentId])

  return c.json<ApiResponse>({ success: true, data: content })
})

// Create learning content
app.post('/api/content', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const { skill_id, title, description, content_type, content_url, thumbnail_url, duration_minutes, difficulty_level } = await c.req.json()

    const result = await execute(c.env.DB,
      'INSERT INTO learning_content (creator_id, skill_id, title, description, content_type, content_url, thumbnail_url, duration_minutes, difficulty_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [authUser.userId, skill_id, title, description, content_type, content_url, thumbnail_url, duration_minutes, difficulty_level]
    )

    return c.json<ApiResponse>({
      success: true,
      data: { content_id: result.meta.last_row_id },
      message: 'Content submitted for review'
    })
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Failed to create content' }, 500)
  }
})

// ==================== NOTIFICATIONS ROUTES ====================

// Get user notifications
app.get('/api/notifications', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const notifications = await query(c.env.DB,
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [authUser.userId]
  )

  const unread_count = await queryOne<{ count: number }>(c.env.DB,
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
    [authUser.userId]
  )

  return c.json<ApiResponse>({
    success: true,
    data: {
      notifications,
      unread_count: unread_count?.count || 0
    }
  })
})

// Mark notification as read
app.patch('/api/notifications/:id', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const notificationId = getIntParam(c.req.param('id'))

  await execute(c.env.DB,
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
    [notificationId, authUser.userId]
  )

  return c.json<ApiResponse>({ success: true, message: 'Notification marked as read' })
})

// ==================== DASHBOARD ROUTES ====================

// Get dashboard data
app.get('/api/dashboard', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  // Get user info
  const user = await queryOne<User>(c.env.DB, 'SELECT * FROM users WHERE id = ?', [authUser.userId])

  // Get upcoming sessions
  const upcoming_sessions = await query(c.env.DB, `
    SELECT 
      s.*,
      CASE WHEN s.teacher_id = ? THEN l.name ELSE t.name END as other_user_name,
      CASE WHEN s.teacher_id = ? THEN l.avatar_url ELSE t.avatar_url END as other_user_avatar,
      sk.name as skill_name, sk.icon as skill_icon
    FROM sessions s
    JOIN users t ON s.teacher_id = t.id
    JOIN users l ON s.learner_id = l.id
    JOIN skills sk ON s.skill_id = sk.id
    WHERE (s.teacher_id = ? OR s.learner_id = ?)
      AND s.status IN ('pending', 'confirmed')
      AND s.scheduled_date >= ?
    ORDER BY s.scheduled_date
    LIMIT 5
  `, [authUser.userId, authUser.userId, authUser.userId, authUser.userId, formatDate()])

  // Get recent activity
  const recent_transactions = await query(c.env.DB,
    'SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
    [authUser.userId]
  )

  // Get recommended content
  const recommended_content = await query(c.env.DB, `
    SELECT 
      lc.*,
      u.name as creator_name,
      s.name as skill_name, s.icon as skill_icon
    FROM learning_content lc
    JOIN users u ON lc.creator_id = u.id
    JOIN skills s ON lc.skill_id = s.id
    WHERE lc.is_approved = 1
    ORDER BY lc.view_count DESC, lc.created_at DESC
    LIMIT 6
  `)

  // Get stats
  const stats = await queryOne(c.env.DB, `
    SELECT 
      (SELECT COUNT(*) FROM sessions WHERE (teacher_id = ? OR learner_id = ?) AND status = 'completed') as total_sessions,
      (SELECT COUNT(*) FROM sessions WHERE teacher_id = ? AND status = 'completed') as sessions_taught,
      (SELECT COUNT(*) FROM sessions WHERE learner_id = ? AND status = 'completed') as sessions_learned,
      (SELECT COUNT(*) FROM user_badges WHERE user_id = ?) as badges_earned
  `, [authUser.userId, authUser.userId, authUser.userId, authUser.userId, authUser.userId])

  return c.json<ApiResponse>({
    success: true,
    data: {
      user,
      upcoming_sessions,
      recent_transactions,
      recommended_content,
      stats
    }
  })
})

// ==================== SEARCH ROUTES ====================

// Global search
app.get('/api/search', async (c) => {
  const query_text = c.req.query('q')
  const type = c.req.query('type') // 'users', 'skills', 'content'

  if (!query_text) {
    return c.json<ApiResponse>({ success: false, error: 'Search query required' }, 400)
  }

  const results: any = {}

  if (!type || type === 'skills') {
    results.skills = await query(c.env.DB,
      'SELECT * FROM skills WHERE (name LIKE ? OR description LIKE ?) AND is_active = 1 LIMIT 10',
      [`%${query_text}%`, `%${query_text}%`]
    )
  }

  if (!type || type === 'users') {
    results.users = await query(c.env.DB,
      'SELECT id, name, bio, avatar_url, role FROM users WHERE (name LIKE ? OR bio LIKE ?) AND is_active = 1 LIMIT 10',
      [`%${query_text}%`, `%${query_text}%`]
    )
  }

  if (!type || type === 'content') {
    results.content = await query(c.env.DB, `
      SELECT lc.*, u.name as creator_name, s.name as skill_name
      FROM learning_content lc
      JOIN users u ON lc.creator_id = u.id
      JOIN skills s ON lc.skill_id = s.id
      WHERE (lc.title LIKE ? OR lc.description LIKE ?) AND lc.is_approved = 1
      LIMIT 10
    `, [`%${query_text}%`, `%${query_text}%`])
  }

  return c.json<ApiResponse>({ success: true, data: results })
})

// ==================== ADMIN ROUTES ====================

// Get pending content for approval
app.get('/api/admin/content/pending', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  // Check if admin
  const user = await queryOne<User>(c.env.DB, 'SELECT is_admin FROM users WHERE id = ?', [authUser.userId])
  if (!user || !user.is_admin) {
    return c.json<ApiResponse>({ success: false, error: 'Forbidden' }, 403)
  }

  const content = await query(c.env.DB, `
    SELECT lc.*, u.name as creator_name, s.name as skill_name
    FROM learning_content lc
    JOIN users u ON lc.creator_id = u.id
    JOIN skills s ON lc.skill_id = s.id
    WHERE lc.is_approved = 0
    ORDER BY lc.created_at DESC
  `)

  return c.json<ApiResponse>({ success: true, data: content })
})

// Approve/reject content
app.patch('/api/admin/content/:id', async (c) => {
  const authUser = getUserFromAuth(c.req.header('Authorization') || null)
  if (!authUser) {
    return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401)
  }

  const user = await queryOne<User>(c.env.DB, 'SELECT is_admin FROM users WHERE id = ?', [authUser.userId])
  if (!user || !user.is_admin) {
    return c.json<ApiResponse>({ success: false, error: 'Forbidden' }, 403)
  }

  const contentId = getIntParam(c.req.param('id'))
  const { is_approved } = await c.req.json()

  await execute(c.env.DB,
    'UPDATE learning_content SET is_approved = ? WHERE id = ?',
    [is_approved ? 1 : 0, contentId]
  )

  return c.json<ApiResponse>({ success: true, message: is_approved ? 'Content approved' : 'Content rejected' })
})

// Old homepage removed - now using pages/home.tsx

export default app

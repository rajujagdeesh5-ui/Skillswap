# Integration Guide - OAuth & Payments

This guide will help you integrate OAuth authentication and Stripe payments into SkillSwap.

## 🔐 OAuth Integration

### Google OAuth Setup

#### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Configure consent screen first if prompted
6. Application type: **Web application**
7. Add authorized redirect URIs:
   ```
   https://skillswap-9oj.pages.dev/api/auth/oauth/google/callback
   http://localhost:3000/api/auth/oauth/google/callback (for development)
   ```
8. Copy **Client ID** and **Client Secret**

#### 2. Set Cloudflare Environment Variables

```bash
# Add Google OAuth credentials
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name skillswap
# Paste your Client ID when prompted

npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name skillswap
# Paste your Client Secret when prompted
```

#### 3. Update Local Development (.dev.vars)

Create/update `.dev.vars` file:
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### 4. Implementation Code

Replace the placeholder in `src/index.tsx`:

```typescript
import { Hono } from 'hono'

// Google OAuth Login
app.get('/api/auth/oauth/google', (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID
  const redirectUri = `${new URL(c.req.url).origin}/api/auth/oauth/google/callback`
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `access_type=offline`
  
  return c.redirect(authUrl)
})

// Google OAuth Callback
app.get('/api/auth/oauth/google/callback', async (c) => {
  const code = c.req.query('code')
  if (!code) {
    return c.json({ success: false, error: 'No authorization code' }, 400)
  }
  
  const redirectUri = `${new URL(c.req.url).origin}/api/auth/oauth/google/callback`
  
  // Exchange code for token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  })
  
  const tokens = await tokenResponse.json()
  
  // Get user info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })
  
  const googleUser = await userResponse.json()
  
  // Check if user exists
  const existingUser = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(googleUser.email).first()
  
  let userId
  if (existingUser) {
    userId = existingUser.id
  } else {
    // Create new user
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, name, password_hash, role, credit_balance) VALUES (?, ?, ?, ?, ?)'
    ).bind(googleUser.email, googleUser.name, 'oauth-google', 'both', 100).run()
    
    userId = result.meta.last_row_id
  }
  
  // Generate JWT token
  const token = btoa(JSON.stringify({
    userId,
    email: googleUser.email,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  }))
  
  // Redirect to dashboard with token
  return c.redirect(`/?token=${token}&message=Login successful!`)
})
```

---

### Microsoft OAuth Setup

#### 1. Create Microsoft App Registration

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory > App registrations**
3. Click **New registration**
4. Name: SkillSwap
5. Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
6. Redirect URI: 
   ```
   https://skillswap-9oj.pages.dev/api/auth/oauth/microsoft/callback
   ```
7. Register and copy **Application (client) ID**
8. Go to **Certificates & secrets > New client secret**
9. Copy the **Value** (not Secret ID)

#### 2. Set Cloudflare Environment Variables

```bash
npx wrangler pages secret put MICROSOFT_CLIENT_ID --project-name skillswap
npx wrangler pages secret put MICROSOFT_CLIENT_SECRET --project-name skillswap
```

#### 3. Implementation Code

```typescript
// Microsoft OAuth Login
app.get('/api/auth/oauth/microsoft', (c) => {
  const clientId = c.env.MICROSOFT_CLIENT_ID
  const redirectUri = `${new URL(c.req.url).origin}/api/auth/oauth/microsoft/callback`
  
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
    `client_id=${clientId}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=openid profile email&` +
    `response_mode=query`
  
  return c.redirect(authUrl)
})

// Microsoft OAuth Callback
app.get('/api/auth/oauth/microsoft/callback', async (c) => {
  const code = c.req.query('code')
  if (!code) {
    return c.json({ success: false, error: 'No authorization code' }, 400)
  }
  
  const redirectUri = `${new URL(c.req.url).origin}/api/auth/oauth/microsoft/callback`
  
  // Exchange code for token
  const tokenResponse = await fetch(
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: c.env.MICROSOFT_CLIENT_ID,
        client_secret: c.env.MICROSOFT_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: 'openid profile email'
      })
    }
  )
  
  const tokens = await tokenResponse.json()
  
  // Get user info
  const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })
  
  const msUser = await userResponse.json()
  
  // Same user creation logic as Google
  // ... (see Google implementation)
})
```

---

### Apple Sign In Setup

#### 1. Create Apple Service ID

1. Go to [Apple Developer](https://developer.apple.com/account/resources/identifiers/list/serviceId)
2. Click **+** to create new identifier
3. Select **Services IDs**
4. Register with:
   - Description: SkillSwap
   - Identifier: com.skillswap.signin
5. Configure **Sign in with Apple**
6. Add domains and redirect URIs:
   ```
   Domain: skillswap-9oj.pages.dev
   Redirect URI: https://skillswap-9oj.pages.dev/api/auth/oauth/apple/callback
   ```
7. Download private key and note Key ID and Team ID

#### 2. Set Cloudflare Environment Variables

```bash
npx wrangler pages secret put APPLE_CLIENT_ID --project-name skillswap
npx wrangler pages secret put APPLE_TEAM_ID --project-name skillswap
npx wrangler pages secret put APPLE_KEY_ID --project-name skillswap
npx wrangler pages secret put APPLE_PRIVATE_KEY --project-name skillswap
# Paste the entire private key content
```

#### 3. Implementation

Apple Sign In requires JWT generation. Consider using a library like `jose` or implement server-side token generation.

---

## 💳 Stripe Payment Integration

### 1. Create Stripe Account

1. Sign up at [Stripe](https://stripe.com)
2. Verify your email
3. Get API keys from [Dashboard > Developers > API keys](https://dashboard.stripe.com/apikeys)
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)
4. Use **Test mode** keys during development

### 2. Set Cloudflare Environment Variables

```bash
# Production secret key
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name skillswap
# Paste your sk_live_... key when prompted

# Webhook signing secret (set up after creating webhook)
npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name skillswap
```

### 3. Update Local Development (.dev.vars)

```bash
STRIPE_SECRET_KEY=sk_test_...your-test-key
STRIPE_WEBHOOK_SECRET=whsec_...your-webhook-secret
```

### 4. Implementation Code

#### Credit Purchase Endpoint

Replace placeholder in `src/index.tsx`:

```typescript
import { Hono } from 'hono'

// Purchase Credits
app.post('/api/credits/purchase', async (c) => {
  const authToken = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!authToken) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const tokenData = JSON.parse(atob(authToken))
  const { amount, payment_method_id } = await c.req.json()

  // Calculate price (10 credits = $1)
  const priceInCents = Math.round((amount / 10) * 100)

  // Create Stripe Payment Intent
  const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${c.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      amount: priceInCents.toString(),
      currency: 'usd',
      payment_method: payment_method_id,
      confirm: 'true',
      description: `SkillSwap Credits: ${amount}`,
      'metadata[user_id]': tokenData.userId.toString(),
      'metadata[credit_amount]': amount.toString()
    })
  })

  const paymentIntent = await stripeResponse.json()

  if (paymentIntent.status === 'succeeded') {
    // Add credits to user account
    await c.env.DB.prepare(
      'UPDATE users SET credit_balance = credit_balance + ? WHERE id = ?'
    ).bind(amount, tokenData.userId).run()

    // Record transaction
    await c.env.DB.prepare(
      `INSERT INTO credit_transactions 
       (user_id, amount, type, description, payment_intent_id) 
       VALUES (?, ?, 'purchase', ?, ?)`
    ).bind(
      tokenData.userId,
      amount,
      `Purchased ${amount} credits`,
      paymentIntent.id
    ).run()

    // Get new balance
    const user = await c.env.DB.prepare(
      'SELECT credit_balance FROM users WHERE id = ?'
    ).bind(tokenData.userId).first()

    return c.json({
      success: true,
      data: {
        new_balance: user.credit_balance,
        transaction_id: paymentIntent.id
      },
      message: 'Credits purchased successfully!'
    })
  } else {
    return c.json({
      success: false,
      error: 'Payment failed',
      details: paymentIntent.error?.message
    }, 400)
  }
})
```

#### Stripe Webhook Endpoint

```typescript
// Stripe Webhook (for handling payment events)
app.post('/api/webhooks/stripe', async (c) => {
  const signature = c.req.header('stripe-signature')
  const body = await c.req.text()

  // Verify webhook signature
  const crypto = await import('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', c.env.STRIPE_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  // Handle the event
  const event = JSON.parse(body)

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const userId = paymentIntent.metadata.user_id
    const creditAmount = parseInt(paymentIntent.metadata.credit_amount)

    // Double-check that credits were added
    console.log(`Payment succeeded for user ${userId}: ${creditAmount} credits`)
  }

  return c.json({ received: true })
})
```

### 5. Frontend Integration

Update `src/pages/home.tsx` to include Stripe publishable key:

```javascript
// Add Stripe.js to head
<script src="https://js.stripe.com/v3/"></script>

// In the credit purchase function
async function purchaseCredits(amount, price) {
  const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY')
  
  // Create payment method
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement, // You need to add Stripe card element
  })
  
  if (error) {
    alert('Payment failed: ' + error.message)
    return
  }
  
  // Call your API
  const response = await axios.post(API_BASE + '/credits/purchase', {
    amount,
    payment_method_id: paymentMethod.id
  })
  
  if (response.data.success) {
    alert('Successfully purchased ' + amount + ' credits!')
    location.reload()
  }
}
```

### 6. Set Up Stripe Webhook

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Endpoint URL: `https://skillswap-9oj.pages.dev/api/webhooks/stripe`
4. Select events to listen:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy **Signing secret** (starts with `whsec_`)
6. Add to Cloudflare secrets:
   ```bash
   npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name skillswap
   ```

---

## 📦 Subscription Plans (Optional)

### Stripe Subscription Setup

1. Create Products in Stripe Dashboard:
   - **Pro Plan**: $9.99/month (product_id: prod_xxx)
   - **Enterprise Plan**: $49.99/month (product_id: prod_yyy)

2. Implementation:

```typescript
// Create Subscription
app.post('/api/subscriptions/create', async (c) => {
  const authToken = c.req.header('Authorization')?.replace('Bearer ', '')
  const tokenData = JSON.parse(atob(authToken))
  const { price_id, payment_method_id } = await c.req.json()

  // Create or retrieve Stripe customer
  const user = await c.env.DB.prepare(
    'SELECT email, stripe_customer_id FROM users WHERE id = ?'
  ).bind(tokenData.userId).first()

  let customerId = user.stripe_customer_id

  if (!customerId) {
    const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        email: user.email,
        payment_method: payment_method_id,
        invoice_settings: { default_payment_method: payment_method_id }
      })
    })

    const customer = await customerResponse.json()
    customerId = customer.id

    // Save customer ID
    await c.env.DB.prepare(
      'UPDATE users SET stripe_customer_id = ? WHERE id = ?'
    ).bind(customerId, tokenData.userId).run()
  }

  // Create subscription
  const subscriptionResponse = await fetch('https://api.stripe.com/v1/subscriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${c.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      customer: customerId,
      items: [{ price: price_id }],
      expand: ['latest_invoice.payment_intent']
    })
  })

  const subscription = await subscriptionResponse.json()

  return c.json({
    success: true,
    data: {
      subscription_id: subscription.id,
      status: subscription.status
    }
  })
})
```

---

## 🔒 Environment Variables Summary

### Required for OAuth
```bash
# Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Apple
APPLE_CLIENT_ID=com.skillswap.signin
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY=your-private-key
```

### Required for Stripe
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Setting All Variables

```bash
# For production
npx wrangler pages secret put VARIABLE_NAME --project-name skillswap

# For local development, create .dev.vars file:
cat > .dev.vars << EOF
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EOF
```

---

## 🧪 Testing

### Test OAuth Flow
1. Click "Sign in with Google" button
2. Authorize application
3. Should redirect to dashboard with token
4. Check database for new user entry

### Test Stripe Payments
1. Use test card: `4242 4242 4242 4242`
2. Any future expiry date (e.g., 12/25)
3. Any 3-digit CVC (e.g., 123)
4. Should see credits added to account

### Test Stripe Webhooks
Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

---

## 📚 Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft OAuth Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Subscriptions Guide](https://stripe.com/docs/billing/subscriptions/overview)
- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/platform/environment-variables/)

---

## ⚠️ Security Checklist

- [ ] Never commit API keys to git
- [ ] Use `.dev.vars` for local development (add to .gitignore)
- [ ] Always use HTTPS in production
- [ ] Verify webhook signatures
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection for OAuth callbacks
- [ ] Store sensitive data in Cloudflare secrets
- [ ] Use environment-specific keys (test vs production)
- [ ] Implement proper error handling
- [ ] Log authentication attempts for security monitoring

---

**Need Help?** Open an issue on GitHub or contact support@skillswap.com

# SkillSwap Deployment Guide 🚀

Complete step-by-step guide to deploy SkillSwap to production.

## 📋 Prerequisites

Before deployment, ensure you have:

- [x] Cloudflare account (free tier works)
- [x] GitHub account (for version control)
- [x] Node.js 18+ installed locally
- [x] Wrangler CLI installed (`npm install -g wrangler`)

## 🔐 Step 1: GitHub Setup (Optional but Recommended)

### Push Code to GitHub

```bash
# 1. Go to GitHub and create a new repository named 'skillswap'
# (Do NOT initialize with README, .gitignore, or license)

# 2. In your local project directory:
cd /home/user/webapp

# 3. Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/skillswap.git

# 4. Push to GitHub
git push -u origin main
```

**Benefits:**
- Version control and backup
- Collaboration capabilities
- Cloudflare Pages can auto-deploy from GitHub
- Professional project portfolio

## ☁️ Step 2: Cloudflare Account Setup

### 2.1 Create Cloudflare Account
1. Go to https://dash.cloudflare.com/sign-up
2. Sign up with email (free tier is sufficient)
3. Verify your email

### 2.2 Generate API Token
1. Go to **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use **Edit Cloudflare Workers** template
4. Permissions needed:
   - Account → Cloudflare Pages → Edit
   - Account → D1 → Edit
   - Zone → Workers Routes → Edit
5. Copy the API token (you'll need it)

## 💾 Step 3: Database Setup

### 3.1 Create Production D1 Database

```bash
# Login to Cloudflare
npx wrangler login

# Create production database
npx wrangler d1 create skillswap-production
```

**Output will look like:**
```
✅ Successfully created DB 'skillswap-production'!

Created your database using D1's new storage backend.
[[d1_databases]]
binding = "DB"
database_name = "skillswap-production"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 3.2 Update Configuration

Copy the `database_id` from output and update `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "skillswap-production",
      "database_id": "YOUR_ACTUAL_DATABASE_ID_HERE"  // ← Replace this
    }
  ]
}
```

### 3.3 Apply Migrations to Production

```bash
# Apply schema migrations
npm run db:migrate:prod

# Seed with initial data (optional - skip for empty production DB)
npx wrangler d1 execute skillswap-production --file=./seed.sql
```

## 🏗 Step 4: Build for Production

```bash
# Clean build
rm -rf dist node_modules/.vite

# Install dependencies (if needed)
npm install

# Build optimized production bundle
npm run build
```

**Expected output:**
```
✓ built in XXXms
dist/_worker.js  XX.XX kB
```

## 🌐 Step 5: Deploy to Cloudflare Pages

### Method A: Direct Deployment (Recommended for first deploy)

```bash
# Deploy directly from CLI
npx wrangler pages deploy dist --project-name skillswap

# If project doesn't exist, it will prompt to create it
# Select "main" as production branch
```

### Method B: GitHub Integration (Automated deployments)

1. Go to Cloudflare Dashboard → **Pages**
2. Click **Connect to Git**
3. Authorize Cloudflare to access your GitHub
4. Select your `skillswap` repository
5. Configure build settings:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
6. Add environment variables (if any)
7. Click **Save and Deploy**

### 5.1 Set D1 Binding (Pages Dashboard)

After deployment:
1. Go to **Pages** → **skillswap** → **Settings** → **Functions**
2. Scroll to **D1 database bindings**
3. Add binding:
   - **Variable name:** `DB`
   - **D1 database:** `skillswap-production`
4. Save

## 🔧 Step 6: Configure Environment Variables (Optional)

For production features like Stripe payments:

```bash
# Set secrets via CLI
npx wrangler pages secret put STRIPE_API_KEY --project-name skillswap
# Enter your Stripe secret key when prompted

npx wrangler pages secret put JWT_SECRET --project-name skillswap
# Enter a strong random string
```

Or via Dashboard:
1. **Pages** → **skillswap** → **Settings** → **Environment variables**
2. Add variables for **Production** environment
3. Save and redeploy

## 🎯 Step 7: Verify Deployment

### 7.1 Check Deployment Status

```bash
# List deployments
npx wrangler pages deployment list --project-name skillswap
```

### 7.2 Test Production URLs

Your app will be available at:
- **Production:** `https://skillswap.pages.dev`
- **Custom domain:** Configure in Cloudflare Dashboard

### 7.3 Test Key Features

```bash
# Test homepage
curl https://skillswap.pages.dev

# Test API
curl https://skillswap.pages.dev/api/skills

# Test registration
curl -X POST https://skillswap.pages.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"both"}'
```

## 🌍 Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain

1. Go to **Pages** → **skillswap** → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `skillswap.io`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic, takes ~24 hours)

### 8.2 DNS Configuration

Add these records to your domain DNS:

```
Type: CNAME
Name: @ (or your subdomain)
Content: skillswap.pages.dev
Proxy status: Proxied (orange cloud)
```

## 📊 Step 9: Monitoring & Analytics

### 9.1 Cloudflare Analytics
- Go to **Pages** → **skillswap** → **Analytics**
- View request counts, bandwidth, errors

### 9.2 Set Up External Monitoring (Recommended)

**Free options:**
- **Sentry:** Error tracking
- **LogRocket:** Session replay
- **Google Analytics:** User analytics
- **Uptime Robot:** Uptime monitoring

Add tracking codes to your HTML:

```html
<!-- In public/index.html or similar -->
<script>
  // Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 Step 10: Continuous Deployment

### Automatic Deploys (GitHub Integration)

Once GitHub is connected:
1. Make changes to your code
2. Commit and push to `main` branch
3. Cloudflare automatically deploys
4. Check **Deployments** tab for status

### Manual Deploys

```bash
# Make changes
# ...

# Build and deploy
npm run build
npx wrangler pages deploy dist --project-name skillswap
```

## 🔐 Security Checklist

Before going live:

- [ ] Change all default passwords in seed data
- [ ] Implement proper bcrypt password hashing
- [ ] Set strong JWT secret
- [ ] Enable HTTPS only (automatic with Cloudflare)
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Add CSP headers
- [ ] Set up error monitoring
- [ ] Enable DDoS protection (Cloudflare)
- [ ] Review and sanitize all user inputs

## 📈 Performance Optimization

### Already Optimized
- ✅ Edge deployment (Cloudflare Workers)
- ✅ Global CDN
- ✅ Database at edge (D1)
- ✅ Minimized bundle size
- ✅ Indexed database queries

### Additional Optimizations
- [ ] Enable Cloudflare Argo (faster routing)
- [ ] Set up caching rules
- [ ] Optimize images (use Cloudflare Images)
- [ ] Implement service worker for PWA
- [ ] Add preload/prefetch hints

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check D1 binding
npx wrangler pages deployment list --project-name skillswap

# Test database locally
npm run db:console:local
SELECT * FROM users LIMIT 1;

# Test production database
npm run db:console:prod
SELECT * FROM users LIMIT 1;
```

### Build Failures
```bash
# Clear caches
rm -rf node_modules dist .wrangler
npm install
npm run build
```

### API Not Working
- Check D1 binding in Pages dashboard
- Verify migrations applied: `npm run db:migrate:prod`
- Check error logs: Pages dashboard → Logs

### 404 Errors
- Ensure `dist/_worker.js` exists after build
- Check `wrangler.jsonc` has correct `pages_build_output_dir`
- Verify routes in `dist/_routes.json`

## 📞 Support Resources

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Hono Docs:** https://hono.dev/
- **D1 Docs:** https://developers.cloudflare.com/d1/
- **Community Discord:** https://discord.gg/cloudflaredev

## 🎉 Post-Deployment

After successful deployment:

1. **Test thoroughly:**
   - Create account
   - Browse skills
   - Book session
   - Test all features

2. **Share your app:**
   - Social media announcement
   - Product Hunt launch
   - Developer communities
   - Email newsletter

3. **Monitor:**
   - Check analytics daily
   - Monitor error rates
   - Review user feedback
   - Track performance metrics

4. **Iterate:**
   - Fix bugs
   - Add requested features
   - Optimize performance
   - Scale infrastructure

## 🚀 Next Steps

- [ ] Set up production monitoring
- [ ] Configure custom domain
- [ ] Add Stripe payment integration
- [ ] Implement email notifications
- [ ] Launch marketing campaign
- [ ] Collect user feedback
- [ ] Plan feature roadmap

---

**Congratulations! Your SkillSwap MVP is now live! 🎊**

Remember: This is an MVP. Focus on user feedback and iterate quickly!

*Last Updated: October 26, 2025*

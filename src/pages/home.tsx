// Apple-inspired Homepage for SkillSwap
export const HomePage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillSwap - Learn. Teach. Connect.</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #fff;
            color: #1d1d1f;
            -webkit-font-smoothing: antialiased;
            line-height: 1.6;
        }

        /* Apple-style Navigation */
        .nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: saturate(180%) blur(20px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }

        .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 24px;
            font-weight: 600;
            color: #1d1d1f;
            text-decoration: none;
            letter-spacing: -0.5px;
        }

        .nav-links {
            display: flex;
            gap: 32px;
            align-items: center;
        }

        .nav-link {
            color: #1d1d1f;
            text-decoration: none;
            font-size: 14px;
            font-weight: 400;
            transition: opacity 0.3s;
        }

        .nav-link:hover {
            opacity: 0.7;
        }

        .btn-primary {
            background: #0071e3;
            color: white;
            padding: 8px 18px;
            border-radius: 980px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary:hover {
            background: #0077ed;
        }

        .btn-secondary {
            background: transparent;
            color: #0071e3;
            padding: 8px 18px;
            border-radius: 980px;
            border: 1px solid #0071e3;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-secondary:hover {
            background: #0071e3;
            color: white;
        }

        /* Hero Section */
        .hero {
            padding: 140px 20px 80px;
            text-align: center;
            max-width: 900px;
            margin: 0 auto;
        }

        .hero h1 {
            font-size: 64px;
            font-weight: 700;
            line-height: 1.1;
            letter-spacing: -1.5px;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #0071e3 0%, #00c3ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero p {
            font-size: 24px;
            color: #6e6e73;
            font-weight: 400;
            margin-bottom: 32px;
            line-height: 1.4;
        }

        .hero-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 32px;
        }

        .btn-large {
            padding: 14px 32px;
            font-size: 17px;
            font-weight: 500;
            border-radius: 980px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-blue {
            background: #0071e3;
            color: white;
        }

        .btn-blue:hover {
            background: #0077ed;
            transform: scale(1.02);
        }

        .btn-outline {
            background: transparent;
            color: #0071e3;
            border: 2px solid #0071e3;
        }

        .btn-outline:hover {
            background: #0071e3;
            color: white;
        }

        /* Features Section */
        .features {
            background: #f5f5f7;
            padding: 80px 20px;
        }

        .features-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }

        .feature-card {
            background: white;
            border-radius: 18px;
            padding: 40px;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .feature-card h3 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }

        .feature-card p {
            font-size: 17px;
            color: #6e6e73;
            line-height: 1.5;
        }

        /* Pricing Section */
        .pricing {
            padding: 80px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .pricing-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .pricing-header h2 {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 16px;
            letter-spacing: -1px;
        }

        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 32px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .pricing-card {
            background: white;
            border: 2px solid #e5e5e7;
            border-radius: 18px;
            padding: 40px;
            text-align: center;
            transition: all 0.3s;
        }

        .pricing-card:hover {
            border-color: #0071e3;
            box-shadow: 0 20px 40px rgba(0, 113, 227, 0.1);
        }

        .pricing-card.featured {
            border-color: #0071e3;
            position: relative;
            transform: scale(1.05);
        }

        .pricing-badge {
            background: #0071e3;
            color: white;
            padding: 6px 16px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 20px;
        }

        .pricing-name {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .pricing-price {
            font-size: 48px;
            font-weight: 700;
            color: #0071e3;
            margin-bottom: 8px;
        }

        .pricing-period {
            color: #6e6e73;
            font-size: 17px;
            margin-bottom: 24px;
        }

        .pricing-features {
            text-align: left;
            margin: 32px 0;
        }

        .pricing-feature {
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f7;
            font-size: 15px;
            color: #1d1d1f;
        }

        .pricing-feature:last-child {
            border-bottom: none;
        }

        .check-icon {
            color: #0071e3;
            margin-right: 8px;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            z-index: 2000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 18px;
            padding: 48px;
            max-width: 440px;
            width: 90%;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            text-align: center;
            margin-bottom: 32px;
        }

        .modal-header h2 {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .modal-header p {
            color: #6e6e73;
            font-size: 15px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            color: #1d1d1f;
        }

        .form-input {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid #d2d2d7;
            border-radius: 12px;
            font-size: 17px;
            transition: border-color 0.3s;
            font-family: 'Inter', sans-serif;
        }

        .form-input:focus {
            outline: none;
            border-color: #0071e3;
        }

        .form-select {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid #d2d2d7;
            border-radius: 12px;
            font-size: 17px;
            background: white;
            font-family: 'Inter', sans-serif;
        }

        .oauth-buttons {
            margin: 24px 0;
        }

        .oauth-btn {
            width: 100%;
            padding: 14px;
            border: 1px solid #d2d2d7;
            border-radius: 12px;
            background: white;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .oauth-btn:hover {
            background: #f5f5f7;
        }

        .divider {
            text-align: center;
            margin: 24px 0;
            color: #6e6e73;
            position: relative;
        }

        .divider::before,
        .divider::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 40%;
            height: 1px;
            background: #d2d2d7;
        }

        .divider::before {
            left: 0;
        }

        .divider::after {
            right: 0;
        }

        .modal-footer {
            text-align: center;
            margin-top: 24px;
            font-size: 14px;
            color: #6e6e73;
        }

        .modal-link {
            color: #0071e3;
            text-decoration: none;
            font-weight: 500;
        }

        .modal-link:hover {
            text-decoration: underline;
        }

        .close-modal {
            position: absolute;
            top: 20px;
            right: 20px;
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6e6e73;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }

        .close-modal:hover {
            background: #f5f5f7;
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 40px;
            }

            .hero p {
                font-size: 19px;
            }

            .nav-links {
                display: none;
            }

            .pricing-card.featured {
                transform: scale(1);
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="nav">
        <div class="nav-content">
            <a href="/" class="logo">SkillSwap</a>
            <div class="nav-links">
                <a href="#features" class="nav-link">Features</a>
                <a href="#pricing" class="nav-link">Pricing</a>
                <button onclick="showLogin()" class="btn-secondary">Sign In</button>
                <button onclick="showRegister()" class="btn-primary">Get Started</button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <h1>Learn. Teach. Connect.</h1>
        <p>Join a global community where knowledge is currency. Exchange skills, earn credits, and grow together.</p>
        <div class="hero-buttons">
            <button onclick="showRegister()" class="btn-large btn-blue">Start Learning Free</button>
            <button onclick="showLogin()" class="btn-large btn-outline">Sign In</button>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">💳</div>
                <h3>Credit Economy</h3>
                <p>Earn credits by teaching. Spend them on learning. No upfront payment required.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎓</div>
                <h3>Expert Teachers</h3>
                <p>Learn from verified experts worldwide. Book 1-on-1 sessions at your convenience.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📚</div>
                <h3>Micro Learning</h3>
                <p>Access bite-sized lessons. Learn at your own pace, anywhere, anytime.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🏆</div>
                <h3>Gamified Progress</h3>
                <p>Earn badges, climb leaderboards, and showcase your achievements.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🌍</div>
                <h3>Global Community</h3>
                <p>Connect with learners and teachers from over 120 countries worldwide.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3>Instant Booking</h3>
                <p>Book sessions instantly. Get matched with the perfect teacher in seconds.</p>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing" id="pricing">
        <div class="pricing-header">
            <h2>Choose Your Plan</h2>
            <p style="font-size: 21px; color: #6e6e73;">Flexible plans for every learner and teacher</p>
        </div>
        <div class="pricing-grid">
            <div class="pricing-card">
                <div class="pricing-name">Free</div>
                <div class="pricing-price">$0</div>
                <div class="pricing-period">forever</div>
                <button onclick="showRegister()" class="btn-large btn-outline" style="width: 100%;">Get Started</button>
                <div class="pricing-features">
                    <div class="pricing-feature"><span class="check-icon">✓</span> 100 welcome credits</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Browse all skills</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Book sessions</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Community access</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Basic support</div>
                </div>
            </div>

            <div class="pricing-card featured">
                <div class="pricing-badge">MOST POPULAR</div>
                <div class="pricing-name">Pro</div>
                <div class="pricing-price">$9.99</div>
                <div class="pricing-period">per month</div>
                <button onclick="handleSubscribe('pro')" class="btn-large btn-blue" style="width: 100%;">Subscribe Now</button>
                <div class="pricing-features">
                    <div class="pricing-feature"><span class="check-icon">✓</span> 500 monthly credits</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Priority booking</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Unlimited sessions</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Exclusive content</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Ad-free experience</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Priority support</div>
                </div>
            </div>

            <div class="pricing-card">
                <div class="pricing-name">Enterprise</div>
                <div class="pricing-price">$49.99</div>
                <div class="pricing-period">per month</div>
                <button onclick="handleSubscribe('enterprise')" class="btn-large btn-outline" style="width: 100%;">Contact Sales</button>
                <div class="pricing-features">
                    <div class="pricing-feature"><span class="check-icon">✓</span> Unlimited credits</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Team accounts</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Custom branding</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> API access</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Dedicated support</div>
                    <div class="pricing-feature"><span class="check-icon">✓</span> Analytics dashboard</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <button class="close-modal" onclick="closeModal('loginModal')">×</button>
            <div class="modal-header">
                <h2>Welcome back</h2>
                <p>Sign in to continue learning</p>
            </div>

            <div class="oauth-buttons">
                <button onclick="handleOAuthLogin('google')" class="oauth-btn">
                    <span>🔵</span> Continue with Google
                </button>
                <button onclick="handleOAuthLogin('microsoft')" class="oauth-btn">
                    <span>🔷</span> Continue with Microsoft
                </button>
                <button onclick="handleOAuthLogin('apple')" class="oauth-btn">
                    <span>🍎</span> Continue with Apple
                </button>
            </div>

            <div class="divider">or</div>

            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" id="loginEmail" class="form-input" placeholder="you@example.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" id="loginPassword" class="form-input" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn-large btn-blue" style="width: 100%;">Sign In</button>
            </form>

            <div class="modal-footer">
                Don't have an account? <a href="#" onclick="switchToRegister()" class="modal-link">Sign up</a>
            </div>
        </div>
    </div>

    <!-- Register Modal -->
    <div id="registerModal" class="modal">
        <div class="modal-content">
            <button class="close-modal" onclick="closeModal('registerModal')">×</button>
            <div class="modal-header">
                <h2>Create account</h2>
                <p>Start your learning journey today</p>
            </div>

            <div class="oauth-buttons">
                <button onclick="handleOAuthLogin('google')" class="oauth-btn">
                    <span>🔵</span> Continue with Google
                </button>
                <button onclick="handleOAuthLogin('microsoft')" class="oauth-btn">
                    <span>🔷</span> Continue with Microsoft
                </button>
                <button onclick="handleOAuthLogin('apple')" class="oauth-btn">
                    <span>🍎</span> Continue with Apple
                </button>
            </div>

            <div class="divider">or</div>

            <form onsubmit="handleRegister(event)">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" id="registerName" class="form-input" placeholder="John Doe" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" id="registerEmail" class="form-input" placeholder="you@example.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" id="registerPassword" class="form-input" placeholder="Minimum 6 characters" required>
                </div>
                <div class="form-group">
                    <label class="form-label">I want to</label>
                    <select id="registerRole" class="form-select">
                        <option value="both">Learn and Teach</option>
                        <option value="learner">Learn Only</option>
                        <option value="teacher">Teach Only</option>
                    </select>
                </div>
                <button type="submit" class="btn-large btn-blue" style="width: 100%;">Create Account</button>
            </form>

            <div class="modal-footer">
                Already have an account? <a href="#" onclick="switchToLogin()" class="modal-link">Sign in</a>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const API_BASE = '/api';

        // Modal Functions
        function showLogin() {
            document.getElementById('loginModal').classList.add('active');
        }

        function showRegister() {
            document.getElementById('registerModal').classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        function switchToRegister() {
            closeModal('loginModal');
            showRegister();
        }

        function switchToLogin() {
            closeModal('registerModal');
            showLogin();
        }

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });

        // Auth Functions
        async function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await axios.post(API_BASE + '/auth/login', { email, password });
                if (response.data.success) {
                    localStorage.setItem('authToken', response.data.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                    window.location.href = '/dashboard';
                }
            } catch (error) {
                alert(error.response?.data?.error || 'Login failed. Please try again.');
            }
        }

        async function handleRegister(event) {
            event.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const role = document.getElementById('registerRole').value;

            try {
                const response = await axios.post(API_BASE + '/auth/register', { name, email, password, role });
                if (response.data.success) {
                    localStorage.setItem('authToken', response.data.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                    window.location.href = '/dashboard';
                }
            } catch (error) {
                alert(error.response?.data?.error || 'Registration failed. Please try again.');
            }
        }

        // OAuth Handlers (redirect to OAuth endpoints)
        function handleOAuthLogin(provider) {
            // Redirect to OAuth endpoint
            window.location.href = \`/api/auth/oauth/\${provider}\`;
        }

        // Subscription Handler
        function handleSubscribe(plan) {
            alert(\`Subscription feature will redirect to payment page for \${plan} plan. Integration with Stripe coming soon!\`);
            showRegister();
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    </script>
</body>
</html>
`

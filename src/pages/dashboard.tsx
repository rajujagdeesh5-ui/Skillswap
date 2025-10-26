// Apple-inspired Dashboard for SkillSwap
export const DashboardPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - SkillSwap</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f7;
            color: #1d1d1f;
            -webkit-font-smoothing: antialiased;
        }

        .topbar {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: saturate(180%) blur(20px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            z-index: 1000;
            padding: 12px 24px;
        }

        .topbar-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 22px;
            font-weight: 600;
            color: #1d1d1f;
        }

        .topbar-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .credit-badge {
            background: linear-gradient(135deg, #0071e3, #00c3ff);
            color: white;
            padding: 8px 20px;
            border-radius: 980px;
            font-weight: 600;
            font-size: 14px;
        }

        .btn-credit {
            background: #0071e3;
            color: white;
            padding: 8px 18px;
            border-radius: 980px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }

        .user-menu {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
        }

        .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
        }

        .main-content {
            max-width: 1400px;
            margin: 80px auto 40px;
            padding: 0 24px;
        }

        .welcome {
            margin-bottom: 40px;
        }

        .welcome h1 {
            font-size: 40px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -1px;
        }

        .welcome p {
            font-size: 19px;
            color: #6e6e73;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: white;
            border-radius: 18px;
            padding: 24px;
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }

        .stat-label {
            font-size: 13px;
            color: #6e6e73;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 36px;
            font-weight: 700;
            color: #0071e3;
        }

        .section {
            background: white;
            border-radius: 18px;
            padding: 32px;
            margin-bottom: 24px;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .section-title {
            font-size: 24px;
            font-weight: 600;
        }

        .btn-link {
            color: #0071e3;
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
        }

        .skill-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
        }

        .skill-card {
            background: #f5f5f7;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }

        .skill-card:hover {
            background: #e8e8ed;
            transform: scale(1.02);
        }

        .skill-icon {
            font-size: 36px;
            margin-bottom: 12px;
        }

        .skill-name {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .skill-category {
            font-size: 13px;
            color: #6e6e73;
        }

        .session-card {
            background: #f5f5f7;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .session-info h4 {
            font-size: 17px;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .session-meta {
            font-size: 14px;
            color: #6e6e73;
        }

        .status-badge {
            padding: 6px 16px;
            border-radius: 980px;
            font-size: 13px;
            font-weight: 600;
        }

        .status-confirmed {
            background: #34c759;
            color: white;
        }

        .status-pending {
            background: #ff9500;
            color: white;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6e6e73;
        }

        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.3;
        }

        .btn-primary {
            background: #0071e3;
            color: white;
            padding: 12px 24px;
            border-radius: 980px;
            border: none;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary:hover {
            background: #0077ed;
            transform: scale(1.02);
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
            padding: 40px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }

        .modal-header {
            text-align: center;
            margin-bottom: 24px;
        }

        .modal-title {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .credit-option {
            background: #f5f5f7;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s;
        }

        .credit-option:hover {
            border-color: #0071e3;
        }

        .credit-amount {
            font-size: 20px;
            font-weight: 600;
        }

        .credit-price {
            font-size: 24px;
            font-weight: 700;
            color: #0071e3;
        }

        @media (max-width: 768px) {
            .welcome h1 {
                font-size: 32px;
            }

            .topbar-right {
                gap: 12px;
            }

            .credit-badge {
                padding: 6px 14px;
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <!-- Top Bar -->
    <div class="topbar">
        <div class="topbar-content">
            <div class="logo">SkillSwap</div>
            <div class="topbar-right">
                <div class="credit-badge" id="creditDisplay">0 credits</div>
                <button class="btn-credit" onclick="showBuyCredits()">+ Add Credits</button>
                <div class="user-menu" onclick="handleLogout()">
                    <img id="userAvatar" src="https://ui-avatars.com/api/?name=User" alt="Avatar" class="avatar">
                    <span id="userName">User</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Welcome Section -->
        <div class="welcome">
            <h1>Welcome back, <span id="welcomeName">User</span></h1>
            <p>Continue your learning journey</p>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Sessions</div>
                <div class="stat-value" id="totalSessions">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Sessions Taught</div>
                <div class="stat-value" id="sessionsTaught">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Sessions Learned</div>
                <div class="stat-value" id="sessionsLearned">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Badges Earned</div>
                <div class="stat-value" id="badgesEarned">0</div>
            </div>
        </div>

        <!-- Upcoming Sessions -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Upcoming Sessions</h2>
                <a href="#" class="btn-link" onclick="exploreSkills()">Book Session</a>
            </div>
            <div id="upcomingSessions"></div>
        </div>

        <!-- Browse Skills -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Explore Skills</h2>
                <a href="#" class="btn-link">View All</a>
            </div>
            <div class="skill-grid" id="skillsGrid"></div>
        </div>
    </div>

    <!-- Buy Credits Modal -->
    <div id="creditsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Add Credits</h2>
                <p style="color: #6e6e73; font-size: 15px;">Choose a credit package</p>
            </div>

            <div class="credit-option" onclick="purchaseCredits(100, 10)">
                <div>
                    <div class="credit-amount">100 Credits</div>
                    <div style="font-size: 14px; color: #6e6e73;">Perfect for trying out</div>
                </div>
                <div class="credit-price">$10</div>
            </div>

            <div class="credit-option" onclick="purchaseCredits(500, 45)">
                <div>
                    <div class="credit-amount">500 Credits</div>
                    <div style="font-size: 14px; color: #6e6e73;">Most popular - Save 10%</div>
                </div>
                <div class="credit-price">$45</div>
            </div>

            <div class="credit-option" onclick="purchaseCredits(1000, 80)">
                <div>
                    <div class="credit-amount">1000 Credits</div>
                    <div style="font-size: 14px; color: #6e6e73;">Best value - Save 20%</div>
                </div>
                <div class="credit-price">$80</div>
            </div>

            <div style="text-align: center; margin-top: 24px;">
                <button onclick="closeModal()" class="btn-primary">Cancel</button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const API_BASE = '/api';
        const authToken = localStorage.getItem('authToken');
        let currentUser = null;

        // Redirect if not logged in
        if (!authToken) {
            window.location.href = '/';
        }

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

        // Load Dashboard Data
        async function loadDashboard() {
            try {
                const response = await axios.get(API_BASE + '/dashboard');
                const data = response.data.data;

                currentUser = data.user;
                document.getElementById('userName').textContent = currentUser.name;
                document.getElementById('welcomeName').textContent = currentUser.name.split(' ')[0];
                document.getElementById('creditDisplay').textContent = currentUser.credit_balance + ' credits';
                document.getElementById('userAvatar').src = currentUser.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name);

                // Stats
                document.getElementById('totalSessions').textContent = data.stats.total_sessions || 0;
                document.getElementById('sessionsTaught').textContent = data.stats.sessions_taught || 0;
                document.getElementById('sessionsLearned').textContent = data.stats.sessions_learned || 0;
                document.getElementById('badgesEarned').textContent = data.stats.badges_earned || 0;

                // Upcoming sessions
                renderUpcomingSessions(data.upcoming_sessions);

                // Load skills
                loadSkills();
            } catch (error) {
                console.error('Dashboard load error:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    window.location.href = '/';
                }
            }
        }

        function renderUpcomingSessions(sessions) {
            const container = document.getElementById('upcomingSessions');
            if (!sessions || sessions.length === 0) {
                container.innerHTML = '<div class="empty-state">' +
                    '<div class="empty-state-icon">📅</div>' +
                    '<p>No upcoming sessions. Ready to book your first one?</p>' +
                    '<button onclick="exploreSkills()" class="btn-primary" style="margin-top: 16px;">Explore Skills</button>' +
                    '</div>';
                return;
            }

            container.innerHTML = sessions.map(function(session) {
                return '<div class="session-card">' +
                    '<div class="session-info">' +
                    '<h4>' + session.title + '</h4>' +
                    '<div class="session-meta">' +
                    session.other_user_name + ' • ' + new Date(session.scheduled_date).toLocaleString() +
                    '</div>' +
                    '</div>' +
                    '<span class="status-badge status-' + session.status + '">' + session.status + '</span>' +
                    '</div>';
            }).join('');
        }

        async function loadSkills() {
            try {
                const response = await axios.get(API_BASE + '/skills');
                const skills = response.data.data;
                const container = document.getElementById('skillsGrid');

                container.innerHTML = skills.slice(0, 8).map(function(skill) {
                    return '<div class="skill-card" onclick="exploreSkill(' + skill.id + ')">' +
                        '<div class="skill-icon">' + (skill.icon || '📚') + '</div>' +
                        '<div class="skill-name">' + skill.name + '</div>' +
                        '<div class="skill-category">' + skill.category + '</div>' +
                        '</div>';
                }).join('');
            } catch (error) {
                console.error('Skills load error:', error);
            }
        }

        function showBuyCredits() {
            document.getElementById('creditsModal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('creditsModal').classList.remove('active');
        }

        async function purchaseCredits(amount, price) {
            try {
                const response = await axios.post(API_BASE + '/credits/purchase', {
                    amount,
                    payment_intent_id: 'demo_' + Date.now()
                });

                if (response.data.success) {
                    alert('Successfully purchased ' + amount + ' credits!');
                    currentUser.credit_balance = response.data.data.new_balance;
                    document.getElementById('creditDisplay').textContent = currentUser.credit_balance + ' credits';
                    closeModal();
                }
            } catch (error) {
                alert('Purchase failed. Please try again.');
            }
        }

        function exploreSkills() {
            alert('Browse Skills feature - Navigate to skills discovery page');
        }

        function exploreSkill(skillId) {
            alert('Viewing skill ' + skillId + ' - Find teachers and book sessions');
        }

        function handleLogout() {
            if (confirm('Are you sure you want to sign out?')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        }

        // Initialize
        loadDashboard();
    </script>
</body>
</html>
`

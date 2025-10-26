#!/bin/bash
# SkillSwap Integration Setup Script
# This script helps you configure OAuth and Stripe integrations

set -e

echo "🎯 SkillSwap Integration Setup"
echo "================================"
echo ""

PROJECT_NAME="skillswap"

# Check if wrangler is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

echo "📋 This script will help you set up:"
echo "  1. Google OAuth"
echo "  2. Microsoft OAuth"
echo "  3. Apple Sign In"
echo "  4. Stripe Payments"
echo ""
echo "You can skip any integration by pressing Enter without input."
echo ""

# Function to set secret
set_secret() {
    local key=$1
    local value=$2
    if [ -n "$value" ]; then
        echo "$value" | npx wrangler pages secret put "$key" --project-name "$PROJECT_NAME"
        echo "✅ $key configured"
    else
        echo "⏭️  Skipping $key"
    fi
}

# Google OAuth
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔵 Google OAuth Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Get credentials from: https://console.cloud.google.com/apis/credentials"
echo ""
read -p "Google Client ID (or press Enter to skip): " GOOGLE_CLIENT_ID
read -p "Google Client Secret (or press Enter to skip): " GOOGLE_CLIENT_SECRET

if [ -n "$GOOGLE_CLIENT_ID" ] && [ -n "$GOOGLE_CLIENT_SECRET" ]; then
    set_secret "GOOGLE_CLIENT_ID" "$GOOGLE_CLIENT_ID"
    set_secret "GOOGLE_CLIENT_SECRET" "$GOOGLE_CLIENT_SECRET"
    echo "✅ Google OAuth configured"
else
    echo "⏭️  Google OAuth skipped"
fi
echo ""

# Microsoft OAuth
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔷 Microsoft OAuth Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Get credentials from: https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps"
echo ""
read -p "Microsoft Client ID (or press Enter to skip): " MICROSOFT_CLIENT_ID
read -p "Microsoft Client Secret (or press Enter to skip): " MICROSOFT_CLIENT_SECRET

if [ -n "$MICROSOFT_CLIENT_ID" ] && [ -n "$MICROSOFT_CLIENT_SECRET" ]; then
    set_secret "MICROSOFT_CLIENT_ID" "$MICROSOFT_CLIENT_ID"
    set_secret "MICROSOFT_CLIENT_SECRET" "$MICROSOFT_CLIENT_SECRET"
    echo "✅ Microsoft OAuth configured"
else
    echo "⏭️  Microsoft OAuth skipped"
fi
echo ""

# Apple Sign In
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🍎 Apple Sign In Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Get credentials from: https://developer.apple.com/account/resources/"
echo ""
read -p "Apple Client ID (or press Enter to skip): " APPLE_CLIENT_ID
read -p "Apple Team ID (or press Enter to skip): " APPLE_TEAM_ID
read -p "Apple Key ID (or press Enter to skip): " APPLE_KEY_ID

if [ -n "$APPLE_CLIENT_ID" ] && [ -n "$APPLE_TEAM_ID" ] && [ -n "$APPLE_KEY_ID" ]; then
    set_secret "APPLE_CLIENT_ID" "$APPLE_CLIENT_ID"
    set_secret "APPLE_TEAM_ID" "$APPLE_TEAM_ID"
    set_secret "APPLE_KEY_ID" "$APPLE_KEY_ID"
    
    echo "Paste your Apple Private Key (ends with -----END PRIVATE KEY-----):"
    APPLE_PRIVATE_KEY=""
    while IFS= read -r line; do
        APPLE_PRIVATE_KEY="${APPLE_PRIVATE_KEY}${line}\n"
        [[ $line == *"END PRIVATE KEY"* ]] && break
    done
    set_secret "APPLE_PRIVATE_KEY" "$APPLE_PRIVATE_KEY"
    echo "✅ Apple Sign In configured"
else
    echo "⏭️  Apple Sign In skipped"
fi
echo ""

# Stripe
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💳 Stripe Payment Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Get credentials from: https://dashboard.stripe.com/apikeys"
echo ""
read -p "Stripe Secret Key (sk_...) (or press Enter to skip): " STRIPE_SECRET_KEY
read -p "Stripe Webhook Secret (whsec_...) (or press Enter to skip): " STRIPE_WEBHOOK_SECRET

if [ -n "$STRIPE_SECRET_KEY" ]; then
    set_secret "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"
    echo "✅ Stripe Secret Key configured"
fi

if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
    set_secret "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
    echo "✅ Stripe Webhook Secret configured"
fi

if [ -z "$STRIPE_SECRET_KEY" ] && [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
    echo "⏭️  Stripe skipped"
fi
echo ""

# Create .dev.vars for local development
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Creating .dev.vars for Local Development"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > .dev.vars << EOF
# OAuth Credentials
${GOOGLE_CLIENT_ID:+GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID}
${GOOGLE_CLIENT_SECRET:+GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET}
${MICROSOFT_CLIENT_ID:+MICROSOFT_CLIENT_ID=$MICROSOFT_CLIENT_ID}
${MICROSOFT_CLIENT_SECRET:+MICROSOFT_CLIENT_SECRET=$MICROSOFT_CLIENT_SECRET}
${APPLE_CLIENT_ID:+APPLE_CLIENT_ID=$APPLE_CLIENT_ID}
${APPLE_TEAM_ID:+APPLE_TEAM_ID=$APPLE_TEAM_ID}
${APPLE_KEY_ID:+APPLE_KEY_ID=$APPLE_KEY_ID}

# Stripe Credentials
${STRIPE_SECRET_KEY:+STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY}
${STRIPE_WEBHOOK_SECRET:+STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET}
EOF

echo "✅ .dev.vars file created"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Review INTEGRATION_GUIDE.md for implementation details"
echo "2. Update src/index.tsx with OAuth and Stripe code"
echo "3. Test locally with: npm run dev:sandbox"
echo "4. Deploy to production: npm run deploy"
echo ""
echo "🔗 Resources:"
echo "  - Integration Guide: ./INTEGRATION_GUIDE.md"
echo "  - GitHub: https://github.com/rajujagdeesh5-ui/Skillswap"
echo "  - Production: https://skillswap-9oj.pages.dev"
echo ""

#!/bin/bash

# GitHub Secrets Setup Script for Advancia PayLedger
# This script helps you add all required secrets to your GitHub repository

echo "🔐 GitHub Secrets Setup for Advancia PayLedger"
echo "=============================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo "Please login to GitHub CLI first:"
    gh auth login
fi

echo "📝 Setting up secrets..."
echo ""

# Cloudflare Secrets
echo "Setting Cloudflare secrets..."
gh secret set CLOUDFLARE_ACCOUNT_ID --body "74ecde4d46d4b399c7295cf599d2886b"
gh secret set CLOUDFLARE_API_TOKEN --body "a4ff4b7afba146f51d9d079bccebb96675a32"
gh secret set CLOUDFLARE_ZONE_ID --body "0bff66558872c58ed5b8b7942acc34d9"

# Supabase Secrets
echo "Setting Supabase secrets..."
gh secret set SUPABASE_URL --body "https://jwabwrcykdtpwdhwhmqq.supabase.co"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "sb_publishable_feavCnnLOlbVTiU0jkQrIg_GpIBiqYd"
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "https://jwabwrcykdtpwdhwhmqq.supabase.co"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3YWJ3cmN5a2R0cHdkaHdobXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTI3NTQsImV4cCI6MjA4NTEyODc1NH0.wk7Ok5i8O4eigd7iYhb-LwR48-B9QpKuRPi5GZfGWwk"

# Database
echo "Setting database secrets..."
gh secret set DATABASE_URL --body "postgresql://postgres.jwabwrcykdtpwdhwhmqq:Good_mother1!?@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"

# DigitalOcean
echo "Setting DigitalOcean secrets..."
gh secret set DO_HOST --body "147.182.193.11"
gh secret set DO_USERNAME --body "root"

# Backend API
echo "Setting backend API URL..."
gh secret set NEXT_PUBLIC_API_URL --body "http://147.182.193.11:3001"

# Vercel
echo "Setting Vercel secrets..."
gh secret set VERCEL_PROJECT_ID --body "prj_UOg8luLXlQkvylq3rK45euuABGUR"

echo ""
echo "⚠️  MANUAL STEPS REQUIRED:"
echo ""
echo "1. Vercel Token:"
echo "   Run: vercel login"
echo "   Get token from: https://vercel.com/account/tokens"
echo "   Then: gh secret set VERCEL_TOKEN"
echo ""
echo "2. Vercel Org ID:"
echo "   Run: cd frontend && vercel link"
echo "   Then: cat .vercel/project.json"
echo "   Copy orgId and run: gh secret set VERCEL_ORG_ID"
echo ""
echo "3. DigitalOcean SSH Key:"
echo "   Run: cat ~/.ssh/id_ed25519"
echo "   Then: gh secret set DO_SSH_KEY"
echo ""
echo "4. GitHub Token (for Olympus):"
echo "   Create at: https://github.com/settings/tokens"
echo "   Scopes: repo (full control)"
echo "   Then: gh secret set GITHUB_TOKEN_SECRET"
echo ""
echo "5. Anthropic API Key:"
echo "   Get from: https://console.anthropic.com/"
echo "   Then: gh secret set ANTHROPIC_API_KEY"
echo ""
echo "6. GitHub Repo:"
echo "   Format: username/repo"
echo "   Then: gh secret set GITHUB_REPO"
echo ""
echo "✅ Automated secrets have been set!"
echo "Complete the manual steps above to finish setup."

# GitHub Secrets Setup Script for Advancia PayLedger (PowerShell)
# This script helps you add all required secrets to your GitHub repository

Write-Host "🔐 GitHub Secrets Setup for Advancia PayLedger" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Check if gh CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed" -ForegroundColor Red
    Write-Host "Install it from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if logged in
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to GitHub CLI first:" -ForegroundColor Yellow
    gh auth login
}

Write-Host "📝 Setting up secrets..." -ForegroundColor Cyan
Write-Host ""

# Cloudflare Secrets
Write-Host "Setting Cloudflare secrets..." -ForegroundColor Yellow
gh secret set CLOUDFLARE_ACCOUNT_ID --body "74ecde4d46d4b399c7295cf599d2886b"
gh secret set CLOUDFLARE_API_TOKEN --body "a4ff4b7afba146f51d9d079bccebb96675a32"
gh secret set CLOUDFLARE_ZONE_ID --body "0bff66558872c58ed5b8b7942acc34d9"

# Supabase Secrets
Write-Host "Setting Supabase secrets..." -ForegroundColor Yellow
gh secret set SUPABASE_URL --body "https://jwabwrcykdtpwdhwhmqq.supabase.co"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "sb_publishable_feavCnnLOlbVTiU0jkQrIg_GpIBiqYd"
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "https://jwabwrcykdtpwdhwhmqq.supabase.co"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3YWJ3cmN5a2R0cHdkaHdobXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTI3NTQsImV4cCI6MjA4NTEyODc1NH0.wk7Ok5i8O4eigd7iYhb-LwR48-B9QpKuRPi5GZfGWwk"

# Database
Write-Host "Setting database secrets..." -ForegroundColor Yellow
gh secret set DATABASE_URL --body "postgresql://postgres.jwabwrcykdtpwdhwhmqq:Good_mother1!?@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"

# DigitalOcean
Write-Host "Setting DigitalOcean secrets..." -ForegroundColor Yellow
gh secret set DO_HOST --body "147.182.193.11"
gh secret set DO_USERNAME --body "root"

# Backend API
Write-Host "Setting backend API URL..." -ForegroundColor Yellow
gh secret set NEXT_PUBLIC_API_URL --body "http://147.182.193.11:3001"

# Vercel
Write-Host "Setting Vercel secrets..." -ForegroundColor Yellow
gh secret set VERCEL_PROJECT_ID --body "prj_UOg8luLXlQkvylq3rK45euuABGUR"

Write-Host ""
Write-Host "⚠️  MANUAL STEPS REQUIRED:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Vercel Token:" -ForegroundColor Cyan
Write-Host "   Run: vercel login" -ForegroundColor Gray
Write-Host "   Get token from: https://vercel.com/account/tokens" -ForegroundColor Gray
Write-Host "   Then: gh secret set VERCEL_TOKEN" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Vercel Org ID:" -ForegroundColor Cyan
Write-Host "   Run: cd frontend; vercel link" -ForegroundColor Gray
Write-Host "   Then: cat .vercel/project.json" -ForegroundColor Gray
Write-Host "   Copy orgId and run: gh secret set VERCEL_ORG_ID" -ForegroundColor Gray
Write-Host ""
Write-Host "3. DigitalOcean SSH Key:" -ForegroundColor Cyan
Write-Host "   Run: cat ~/.ssh/id_ed25519" -ForegroundColor Gray
Write-Host "   Then: gh secret set DO_SSH_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "4. GitHub Token (for Olympus):" -ForegroundColor Cyan
Write-Host "   Create at: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "   Scopes: repo (full control)" -ForegroundColor Gray
Write-Host "   Then: gh secret set GITHUB_TOKEN_SECRET" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Anthropic API Key:" -ForegroundColor Cyan
Write-Host "   Get from: https://console.anthropic.com/" -ForegroundColor Gray
Write-Host "   Then: gh secret set ANTHROPIC_API_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "6. GitHub Repo:" -ForegroundColor Cyan
Write-Host "   Format: username/repo" -ForegroundColor Gray
Write-Host "   Then: gh secret set GITHUB_REPO" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Automated secrets have been set!" -ForegroundColor Green
Write-Host "Complete the manual steps above to finish setup." -ForegroundColor Yellow

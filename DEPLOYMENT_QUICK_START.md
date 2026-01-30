# 🚀 Quick Start Deployment Guide

**Complete deployment in 3 steps!**

---

## ✅ Prerequisites

- [x] GitHub account with repository
- [x] GitHub CLI installed (`gh`)
- [x] Node.js 20+ installed
- [ ] Vercel account
- [x] Cloudflare account (Account ID: `74ecde4d46d4b399c7295cf599d2886b`)
- [x] Supabase project (URL: `jwabwrcykdtpwdhwhmqq.supabase.co`)
- [x] DigitalOcean droplet (IP: `147.182.193.11`)

---

## 🎯 Step 1: Setup GitHub Secrets (5 minutes)

### Automated Setup

```powershell
# Navigate to project
cd c:\Users\mucha.DESKTOP-H7T9NPM\Downloads\productution

# Run setup script
.\.github\setup-secrets.ps1
```

This automatically sets:
- ✅ Cloudflare credentials
- ✅ Supabase credentials
- ✅ Database connection
- ✅ DigitalOcean host
- ✅ Vercel project ID

### Manual Steps (Required)

#### 1. Get Vercel Token
```powershell
vercel login
# Visit: https://vercel.com/account/tokens
# Create token, then:
gh secret set VERCEL_TOKEN
```

#### 2. Get Vercel Org ID
```powershell
cd frontend
vercel link
cat .vercel/project.json
# Copy orgId, then:
gh secret set VERCEL_ORG_ID
```

#### 3. Setup SSH Key for DigitalOcean
```powershell
# If you don't have an SSH key:
ssh-keygen -t ed25519 -C "github-actions"

# Copy private key:
cat ~/.ssh/id_ed25519 | clip

# Add to GitHub:
gh secret set DO_SSH_KEY
# Paste the key when prompted

# Add public key to server:
ssh-copy-id root@147.182.193.11
```

#### 4. Get GitHub Token (for Olympus)
```
1. Visit: https://github.com/settings/tokens
2. Generate new token (classic)
3. Scopes: ✓ repo (full control)
4. Copy token
5. Run: gh secret set GITHUB_TOKEN_SECRET
```

#### 5. Get Anthropic API Key
```
1. Visit: https://console.anthropic.com/
2. Create API key
3. Run: gh secret set ANTHROPIC_API_KEY
```

#### 6. Set GitHub Repo
```powershell
# Format: username/repository
gh secret set GITHUB_REPO --body "yourusername/advancia-payledger"
```

---

## 🎯 Step 2: Deploy Olympus Worker (2 minutes)

```powershell
cd olympus

# Login to Cloudflare (if not already)
npx wrangler login

# Set secrets
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put GITHUB_REPO

# Deploy
npx wrangler deploy

# Verify
curl https://olympus-ai.74ecde4d46d4b399c7295cf599d2886b.workers.dev/health
```

---

## 🎯 Step 3: Push to GitHub (1 minute)

```powershell
# Add CI/CD files
git add .github/

# Commit
git commit -m "Add CI/CD pipeline"

# Push to trigger deployment
git push origin main
```

**That's it!** GitHub Actions will automatically:
1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to DigitalOcean
3. ✅ Run health checks
4. ✅ Notify you of results

---

## 📊 Monitor Deployment

### View in GitHub
```
1. Go to your repository
2. Click "Actions" tab
3. Watch workflows run live
```

### View with CLI
```powershell
# Watch current run
gh run watch

# List recent runs
gh run list

# View specific run
gh run view <run-id>
```

---

## ✅ Verify Deployment

```powershell
# Check frontend
curl https://your-app.vercel.app

# Check backend
curl http://147.182.193.11:3001/health

# Check Olympus
curl https://olympus-ai.74ecde4d46d4b399c7295cf599d2886b.workers.dev/health
```

---

## 🎉 Success Checklist

- [ ] All GitHub secrets added
- [ ] Olympus worker deployed to Cloudflare
- [ ] CI/CD workflows committed to repository
- [ ] First deployment successful
- [ ] Frontend accessible on Vercel
- [ ] Backend responding on DigitalOcean
- [ ] Olympus worker responding

---

## 🔄 Future Deployments

Simply push to main:
```powershell
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions handles everything automatically!

---

## 🆘 Troubleshooting

### Workflow fails with "Secret not found"
```powershell
# List current secrets
gh secret list

# Add missing secret
gh secret set SECRET_NAME
```

### Vercel deployment fails
```powershell
# Test locally
cd frontend
npm run build

# Check Vercel token
vercel whoami
```

### Backend deployment fails
```powershell
# Test SSH connection
ssh root@147.182.193.11

# Check if PM2 is installed
ssh root@147.182.193.11 "pm2 --version"
```

### Olympus deployment fails
```powershell
# Test Wrangler auth
npx wrangler whoami

# Check account ID
npx wrangler whoami
```

---

## 📚 Resources

- **CI/CD Setup Guide:** `.github/CICD_SETUP.md`
- **Architecture:** `CORRECTED_ARCHITECTURE.md`
- **Supabase Setup:** `SUPABASE_SETUP.md`
- **GitHub Actions:** https://docs.github.com/en/actions

---

## 🎯 Your Credentials Summary

```
Cloudflare Account: 74ecde4d46d4b399c7295cf599d2886b
Cloudflare Zone: 0bff66558872c58ed5b8b7942acc34d9
Supabase Project: jwabwrcykdtpwdhwhmqq
DigitalOcean IP: 147.182.193.11
Vercel Project: prj_UOg8luLXlQkvylq3rK45euuABGUR
```

**Everything is configured and ready to deploy!** 🚀

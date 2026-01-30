# CI/CD Setup Guide

This guide explains how to set up the GitHub Actions CI/CD pipeline for Advancia PayLedger.

## 📋 Overview

The CI/CD pipeline automatically deploys your application when you push to the `main` branch:

- **Frontend** → Vercel
- **Backend** → DigitalOcean Droplet
- **Olympus Worker** → Cloudflare Workers

## 🔑 Required GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### Frontend (Vercel)

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=prj_UOg8luLXlQkvylq3rK45euuABGUR
NEXT_PUBLIC_SUPABASE_URL=https://jwabwrcykdtpwdhwhmqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=http://147.182.193.11:3001
```

**How to get Vercel tokens:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login and get token
vercel login
vercel whoami

# Get project details
cd frontend
vercel link
cat .vercel/project.json
```

### Backend (DigitalOcean)

```
DO_HOST=147.182.193.11
DO_USERNAME=root
DO_SSH_KEY=<your-private-ssh-key>
DATABASE_URL=postgresql://postgres.jwabwrcykdtpwdhwhmqq:Good_mother1!?@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

**How to get SSH key:**
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "github-actions@advancia"

# Copy private key (this goes in GitHub secret)
cat ~/.ssh/id_ed25519

# Copy public key to server
ssh-copy-id root@147.182.193.11
```

### Olympus Worker (Cloudflare)

```
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
GITHUB_TOKEN_SECRET=ghp_your-github-token
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GITHUB_REPO=yourusername/yourrepo
```

**How to get Cloudflare tokens:**
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Create Token → Edit Cloudflare Workers template
3. Copy the token
4. Get Account ID from Workers dashboard

### Supabase

```
SUPABASE_URL=https://jwabwrcykdtpwdhwhmqq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_feavCnnLOlbVTiU0jkQrIg_GpIBiqYd
```

---

## 🚀 Workflows Created

### 1. `deploy-frontend.yml`
- **Triggers:** Push to `main` with changes in `frontend/`
- **Actions:** Build and deploy to Vercel
- **Duration:** ~2-3 minutes

### 2. `deploy-backend.yml`
- **Triggers:** Push to `main` with changes in `backend/`
- **Actions:** 
  - Build TypeScript
  - Run Prisma migrations
  - Deploy to DigitalOcean
  - Restart PM2 process
  - Health check
- **Duration:** ~3-5 minutes

### 3. `deploy-olympus.yml`
- **Triggers:** Push to `main` with changes in `olympus/`
- **Actions:** Deploy to Cloudflare Workers
- **Duration:** ~1-2 minutes

### 4. `test-backend.yml`
- **Triggers:** Pull requests, push to `main`/`develop`
- **Actions:** Run tests with PostgreSQL and Redis
- **Duration:** ~2-4 minutes

### 5. `test-frontend.yml`
- **Triggers:** Pull requests, push to `main`/`develop`
- **Actions:** Type check, lint, build
- **Duration:** ~2-3 minutes

### 6. `deploy-all.yml`
- **Triggers:** Manual workflow dispatch
- **Actions:** Deploy all services in sequence
- **Duration:** ~8-12 minutes

---

## 📝 Usage

### Automatic Deployment

Simply push to `main`:

```bash
git add .
git commit -m "Update backend API"
git push origin main
```

The appropriate workflow will automatically run based on which files changed.

### Manual Deployment

Go to: Actions → Deploy All Services → Run workflow

Or use GitHub CLI:
```bash
gh workflow run deploy-all.yml
```

### Deploy Specific Service

```bash
# Deploy only frontend
gh workflow run deploy-frontend.yml

# Deploy only backend
gh workflow run deploy-backend.yml

# Deploy only Olympus
gh workflow run deploy-olympus.yml
```

---

## 🔍 Monitoring Deployments

### View Workflow Status

```bash
# List recent workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch live logs
gh run watch
```

### View Logs in GitHub

1. Go to your repository
2. Click "Actions" tab
3. Click on a workflow run
4. Click on a job to see logs

---

## 🛠️ Troubleshooting

### Backend Deployment Fails

**Issue:** SSH connection fails
```bash
# Test SSH connection locally
ssh root@147.182.193.11

# Verify SSH key is correct
cat ~/.ssh/id_ed25519 | head -n 1
```

**Issue:** PM2 not found
```bash
# SSH to server and install PM2
ssh root@147.182.193.11
npm install -g pm2
```

### Frontend Deployment Fails

**Issue:** Vercel token invalid
```bash
# Regenerate token
vercel login
# Get new token from: https://vercel.com/account/tokens
```

**Issue:** Build fails
```bash
# Test build locally
cd frontend
npm run build
```

### Olympus Deployment Fails

**Issue:** Cloudflare API token invalid
```bash
# Test token locally
cd olympus
npx wrangler whoami
```

**Issue:** Secrets not set
```bash
# Set secrets manually
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put ANTHROPIC_API_KEY
```

---

## 🔒 Security Best Practices

1. **Never commit secrets** to the repository
2. **Rotate tokens** every 90 days
3. **Use separate tokens** for CI/CD (not your personal tokens)
4. **Enable branch protection** on `main` branch
5. **Require PR reviews** before merging
6. **Enable 2FA** on all service accounts

---

## 📊 Deployment Status Badges

Add these to your README.md:

```markdown
![Deploy Frontend](https://github.com/yourusername/yourrepo/actions/workflows/deploy-frontend.yml/badge.svg)
![Deploy Backend](https://github.com/yourusername/yourrepo/actions/workflows/deploy-backend.yml/badge.svg)
![Deploy Olympus](https://github.com/yourusername/yourrepo/actions/workflows/deploy-olympus.yml/badge.svg)
![Test Backend](https://github.com/yourusername/yourrepo/actions/workflows/test-backend.yml/badge.svg)
![Test Frontend](https://github.com/yourusername/yourrepo/actions/workflows/test-frontend.yml/badge.svg)
```

---

## 🎯 Next Steps

1. **Add all secrets** to GitHub repository
2. **Test each workflow** individually
3. **Set up branch protection** rules
4. **Configure notifications** (Slack, Discord, email)
5. **Add deployment rollback** workflow
6. **Set up staging environment**

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

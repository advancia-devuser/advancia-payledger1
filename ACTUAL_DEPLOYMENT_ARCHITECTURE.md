# Advancia PayLedger - Actual Deployment Architecture

**Last Updated:** January 30, 2026

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                     │
│  Deployed on: Vercel                                    │
│  URL: https://your-app.vercel.app                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Olympus AI Worker (Cloudflare Workers)                 │
│  Deployed via: wrangler deploy                          │
│  Handles: GitHub webhooks + AI processing               │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Webhooks
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Backend API (Node.js/Express)                          │
│  Location: DigitalOcean Droplet                         │
│  IP: 147.182.193.11 (Public) / 10.124.0.2 (Private)    │
│  Port: 3001                                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ VPC Connection
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Database Layer (DigitalOcean VPC)                      │
│  - PostgreSQL (Port 5432)                               │
│  - Redis (Port 6379)                                    │
│  Private Network: 10.124.0.0/20                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Deployment Methods

### ✅ What You're Actually Using

1. **Frontend → Vercel**
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Olympus Worker → Cloudflare**
   ```bash
   cd olympus
   wrangler deploy
   ```

3. **Backend → DigitalOcean**
   - Deployed via webhooks (not SSH)
   - Connected through VPC for database access

4. **Database → DigitalOcean VPC**
   - PostgreSQL and Redis in private network
   - Only accessible via VPC (10.124.0.2)

### ❌ What You're NOT Using

- ~~SSH deployment~~
- ~~PM2 process manager~~
- ~~Direct server access~~

---

## 🔧 Cloudflare Wrangler Setup

### Olympus AI Worker

**Location:** `olympus/`

**Configuration:** `wrangler.toml`
```toml
name = "olympus-ai"
main = "worker.js"
compatibility_date = "2024-01-01"
```

**Deployment:**
```bash
cd olympus

# Set secrets (one-time)
wrangler secret put GITHUB_TOKEN
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put GITHUB_REPO

# Deploy
wrangler deploy

# View logs
wrangler tail
```

**Endpoints:**
- Health: `https://olympus-ai.your-subdomain.workers.dev/health`
- Webhook: `https://olympus-ai.your-subdomain.workers.dev/webhook/github`
- Status: `https://olympus-ai.your-subdomain.workers.dev/api/status`

---

## 🔗 Webhook Configuration

### GitHub → Olympus Worker

1. Go to your GitHub repository settings
2. Navigate to: Settings → Webhooks → Add webhook
3. Configure:
   - **Payload URL:** `https://olympus-ai.your-subdomain.workers.dev/webhook/github`
   - **Content type:** `application/json`
   - **Events:** Issues
   - **Active:** ✓

### Olympus Worker → Backend API

The worker processes webhooks and can forward to your backend:
- Backend API: `http://147.182.193.11:3001/api/webhooks`
- Or via private VPC: `http://10.124.0.2:3001/api/webhooks`

---

## 🔒 DigitalOcean VPC Configuration

### Network Setup

**VPC Details:**
- **Network:** `10.124.0.0/20`
- **Private IP:** `10.124.0.2`
- **Public IP:** `147.182.193.11`

**Services in VPC:**
- PostgreSQL: `10.124.0.2:5432`
- Redis: `10.124.0.2:6379`
- Backend API: `10.124.0.2:3001` (internal)

**Security:**
- Database only accessible within VPC
- No direct internet access to database
- Backend connects via private network

---

## 🚀 Complete Deployment Process

### Step 1: Deploy Frontend to Vercel
```bash
cd frontend
vercel --prod
```

### Step 2: Deploy Olympus to Cloudflare
```bash
cd olympus

# First time: Set secrets
wrangler secret put GITHUB_TOKEN
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put GITHUB_REPO

# Deploy
wrangler deploy

# Verify
curl https://olympus-ai.your-subdomain.workers.dev/health
```

### Step 3: Configure Backend Environment

Backend `.env` should use VPC addresses:
```bash
DATABASE_URL="postgresql://user:pass@10.124.0.2:5432/advancia"
REDIS_URL="redis://10.124.0.2:6379"
```

### Step 4: Set Up GitHub Webhook

Point GitHub webhook to your Cloudflare Worker URL.

---

## ✅ Verification Commands

```bash
# Check Cloudflare Worker
curl https://olympus-ai.your-subdomain.workers.dev/health

# Check backend (public)
curl http://147.182.193.11:3001/health

# View Cloudflare logs
cd olympus
wrangler tail

# Check Vercel deployment
vercel ls
```

---

## 📊 Current Status

- ✅ Frontend: Deployed on Vercel
- ⏳ Olympus Worker: Ready to deploy with `wrangler deploy`
- ⏳ Backend: Needs webhook configuration
- ✅ Database: Running in DigitalOcean VPC

---

## 🔑 Key Differences from SSH Approach

| Aspect | SSH Approach | Your Actual Setup |
|--------|--------------|-------------------|
| Deployment | Manual SSH + PM2 | Wrangler CLI |
| Process Management | PM2 | Cloudflare Workers (serverless) |
| Server Access | Direct SSH | Webhook-based |
| Database Access | Public IP | VPC private network |
| Scaling | Manual | Auto-scaling (Cloudflare) |

---

## 📝 Next Steps

1. **Deploy Olympus Worker:**
   ```bash
   cd olympus
   wrangler deploy
   ```

2. **Configure GitHub Webhook:**
   - Use your Cloudflare Worker URL
   - Test with a new issue

3. **Update Frontend Environment:**
   - Point to `147.182.193.11:3001` or Cloudflare Worker
   - Redeploy: `vercel --prod`

4. **Verify VPC Connectivity:**
   - Ensure backend can reach database at `10.124.0.2`

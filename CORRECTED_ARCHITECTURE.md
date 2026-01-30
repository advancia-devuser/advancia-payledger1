# Advancia PayLedger - Corrected Architecture

**Last Updated:** January 30, 2026

## ✅ Actual Production Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js 12 + App Router)                     │
│  Platform: Vercel                                       │
│  Status: ✅ DEPLOYED                                    │
│  URL: https://your-app.vercel.app                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Olympus AI Worker                                      │
│  Platform: Cloudflare Workers                           │
│  Deployment: wrangler deploy                            │
│  Status: ⏳ READY TO DEPLOY                             │
│  Handles: GitHub webhooks + Claude AI analysis          │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Webhooks
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Backend API (Node.js/Express/TypeScript)               │
│  Platform: DigitalOcean Droplet                         │
│  IP: 147.182.193.11 (Public) / 10.124.0.2 (Private)    │
│  Port: 3001                                             │
│  Status: ✅ BUILT & READY                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Connection String
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase PostgreSQL Database                           │
│  URL: jwabwrcykdtpwdhwhmqq.supabase.co                 │
│  Region: EU Central (AWS)                               │
│  Status: ✅ CONFIGURED                                  │
│  Features: Auth + Database + Storage + Realtime         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Redis Cache                                            │
│  Location: DigitalOcean Droplet (10.124.0.2:6379)      │
│  Status: ⏳ NEEDS SETUP                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Configuration

### Supabase (Primary Database)

**Project:** `jwabwrcykdtpwdhwhmqq`  
**Region:** EU Central (AWS)  
**URL:** `https://jwabwrcykdtpwdhwhmqq.supabase.co`

**Connection Strings:**
```bash
# For Prisma migrations (direct)
DATABASE_DIRECT_URL="postgresql://postgres:Good_mother1!?@db.jwabwrcykdtpwdhwhmqq.supabase.co:5432/postgres"

# For application (pooled)
DATABASE_URL="postgresql://postgres.jwabwrcykdtpwdhwhmqq:Good_mother1!?@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
```

**Features Available:**
- ✅ PostgreSQL Database
- ✅ Authentication (built-in)
- ✅ Storage (file uploads)
- ✅ Realtime subscriptions
- ✅ Row Level Security (RLS)
- ✅ Auto-generated REST API
- ✅ Auto-generated GraphQL API

### DigitalOcean Droplet

**Purpose:** Backend API + Redis  
**Public IP:** `147.182.193.11`  
**Private IP:** `10.124.0.2` (VPC)

**NOT used for:**
- ❌ PostgreSQL database (using Supabase instead)
- ❌ SSH-based deployment (using webhooks)

**Used for:**
- ✅ Backend API server
- ✅ Redis cache
- ✅ VPC private networking

### Cloudflare Workers

**Worker Name:** `olympus-ai`  
**Purpose:** GitHub webhook handler + AI analysis  
**Deployment:** `npx wrangler deploy`

---

## 🚀 Correct Deployment Process

### Step 1: Frontend (Vercel) ✅ DONE

```bash
cd frontend
vercel --prod
```

**Environment Variables in Vercel:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://jwabwrcykdtpwdhwhmqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=http://147.182.193.11:3001
```

### Step 2: Olympus Worker (Cloudflare) ⏳ IN PROGRESS

```bash
cd olympus

# Login to Cloudflare
npx wrangler login

# Set secrets
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put GITHUB_REPO

# Deploy
npx wrangler deploy

# Verify
curl https://olympus-ai.your-account.workers.dev/health
```

### Step 3: Backend (DigitalOcean) ⏳ NEEDS DEPLOYMENT

**Backend connects to Supabase, NOT local PostgreSQL**

Backend `.env` should have:
```bash
# Supabase Database
DATABASE_URL="postgresql://postgres.jwabwrcykdtpwdhwhmqq:Good_mother1!?@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"

# Supabase Auth
SUPABASE_URL="https://jwabwrcykdtpwdhwhmqq.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sb_publishable_feavCnnLOlbVTiU0jkQrIg_GpIBiqYd"

# Redis (local on DigitalOcean)
REDIS_URL="redis://10.124.0.2:6379"

# JWT
JWT_SECRET="your-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"

# Server
NODE_ENV="production"
PORT=3001
FRONTEND_URL="https://your-app.vercel.app"
```

**Deployment Method:** Webhook-based (NOT SSH)

---

## 🔧 What's Different from Initial Understanding

| Component | Initially Thought | Actually Is |
|-----------|------------------|-------------|
| **Database** | DigitalOcean VPC PostgreSQL | **Supabase PostgreSQL** |
| **Database Location** | 10.124.0.2:5432 | **AWS EU Central (Supabase)** |
| **Backend Deployment** | SSH + PM2 | **Webhook-based** |
| **Auth System** | Custom JWT only | **Supabase Auth + JWT** |
| **File Storage** | DigitalOcean Spaces | **Supabase Storage** |
| **Realtime** | Custom WebSocket | **Supabase Realtime** |

---

## 📊 Current Status

### ✅ Completed
- Frontend deployed to Vercel
- Backend built successfully (TypeScript compiled)
- Supabase database configured
- Prisma schema ready
- Frontend pages created (landing, login, register, dashboard)

### ⏳ In Progress
- Cloudflare Wrangler login (waiting for OAuth)
- Olympus worker deployment

### 🔜 Next Steps
1. Complete Cloudflare login
2. Deploy Olympus worker
3. Deploy backend to DigitalOcean (webhook method)
4. Run Prisma migrations to Supabase
5. Configure GitHub webhook
6. Test full system integration

---

## 🔗 Connection Flow

### User Login Flow
```
1. User visits Vercel frontend
2. Frontend calls Supabase Auth API
3. Supabase returns JWT token
4. Frontend stores token
5. Frontend calls backend API with token
6. Backend verifies token with Supabase
7. Backend queries Supabase PostgreSQL
8. Backend returns data to frontend
```

### GitHub Webhook Flow
```
1. Issue created on GitHub
2. GitHub sends webhook to Cloudflare Worker
3. Worker analyzes with Claude AI
4. Worker adds labels/comments to GitHub
5. Worker optionally notifies backend API
6. Backend stores in Supabase database
```

---

## 🎯 Deployment Commands Summary

```bash
# 1. Deploy Frontend (DONE)
cd frontend
vercel --prod

# 2. Deploy Olympus Worker (IN PROGRESS)
cd olympus
npx wrangler login
npx wrangler deploy

# 3. Run Database Migrations
cd backend
npx prisma migrate deploy

# 4. Deploy Backend (webhook-based, not SSH)
# Method depends on your webhook setup

# 5. Test Everything
curl https://your-app.vercel.app
curl https://olympus-ai.workers.dev/health
curl http://147.182.193.11:3001/health
```

---

## 🔒 Security Notes

- ✅ Database credentials secured in Supabase
- ✅ No direct database access from internet
- ✅ Supabase handles connection pooling
- ✅ Row Level Security (RLS) available
- ✅ Cloudflare Workers are serverless (no server to maintain)
- ⚠️ Redis on DigitalOcean needs password protection
- ⚠️ Backend API needs rate limiting

---

## 📝 Environment Variables Checklist

### Backend (.env)
- [x] DATABASE_URL (Supabase pooler)
- [x] SUPABASE_URL
- [x] SUPABASE_SERVICE_ROLE_KEY
- [ ] REDIS_URL (needs setup)
- [ ] JWT_SECRET (needs generation)
- [ ] JWT_REFRESH_SECRET (needs generation)
- [ ] ENCRYPTION_KEY (needs generation)

### Frontend (Vercel)
- [x] NEXT_PUBLIC_SUPABASE_URL
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] NEXT_PUBLIC_API_URL (update after backend deployment)

### Olympus Worker (Cloudflare)
- [ ] GITHUB_TOKEN
- [ ] ANTHROPIC_API_KEY
- [ ] GITHUB_REPO

---

This is your **actual architecture**. No SSH, no local PostgreSQL, no PM2 - just Vercel, Cloudflare Workers, Supabase, and DigitalOcean for the backend API + Redis.

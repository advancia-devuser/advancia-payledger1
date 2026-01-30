# ⚡ OLYMPUS - AI-Powered GitHub Webhook Server

<div align="center">

**Production-ready deployment package for Digital Ocean**

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Claude AI](https://img.shields.io/badge/Claude-AI-purple)

</div>

---

## 🎯 What Is This?

Olympus is a **production-ready AI server** that automatically analyzes GitHub issues using Claude AI. Every time someone creates an issue in your repository, Olympus:

✅ **Analyzes** the issue instantly with Claude AI  
✅ **Labels** with priority, category, and effort  
✅ **Comments** with detailed analysis  
✅ **Suggests** appropriate team/assignee  
✅ **Runs 24/7** in a Docker container

## 🚀 One-Command Deployment

```bash
# 1. Configure credentials
cp .env.example .env
nano .env

# 2. Deploy
chmod +x deploy_now.sh
./deploy_now.sh
```

**Done!** Your AI server is live in ~2 minutes.

---

## 📦 What's Included

| File                 | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `deploy_now.sh`      | One-click automated deployment script    |
| `webhook_server.py`  | FastAPI production server with Claude AI |
| `Dockerfile`         | Production-ready Docker container        |
| `docker-compose.yml` | Container orchestration                  |
| `nginx.conf`         | Reverse proxy configuration              |
| `olympus.service`    | Systemd service for auto-start           |
| `requirements.txt`   | Python dependencies                      |
| `.env.example`       | Environment template                     |
| `DEPLOY_GUIDE.md`    | Complete deployment documentation        |

---

## 🎮 Features

### AI-Powered Issue Analysis

- **Priority Detection**: Automatically classifies as critical/high/medium/low
- **Category Classification**: Bug, feature, enhancement, docs, etc.
- **Effort Estimation**: Quick (< 2h), medium (2-8h), large (1-3 days), epic (> 3 days)
- **Risk Assessment**: Analyzes potential impact
- **Team Recommendations**: Suggests best team (backend, frontend, devops, etc.)

### Production Infrastructure

- **Docker Containerization**: Isolated, reproducible environment
- **Nginx Reverse Proxy**: Professional HTTP routing
- **Systemd Service**: Auto-start on server reboot
- **Health Monitoring**: Built-in health check endpoints
- **Logging**: Comprehensive logging to files and stdout
- **Firewall Configuration**: Secure UFW setup

### API Endpoints

- `GET /` - Service info
- `GET /health` - Health check
- `GET /api/status` - Detailed status
- `POST /webhook/github` - GitHub webhook handler

---

## 🔧 Quick Setup

### 1. Prerequisites

- Digital Ocean server (or any Ubuntu/Debian server)
- SSH access with key authentication
- GitHub Personal Access Token ([get one](https://github.com/settings/tokens))
- Anthropic API Key ([get one](https://console.anthropic.com/))

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```bash
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO=owner/repository
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

### 3. Deploy

```bash
chmod +x deploy_now.sh
./deploy_now.sh
```

The script automatically:

- Tests SSH connection
- Installs Docker, Nginx, dependencies
- Uploads all files
- Builds container
- Configures services
- Sets up firewall
- Verifies deployment

### 4. Setup GitHub Webhook

1. Go to your repo → **Settings** → **Webhooks**
2. Click **Add webhook**
3. URL: `http://YOUR_SERVER_IP/webhook/github`
4. Content type: `application/json`
5. Events: **Issues**
6. Save

### 5. Test It

Create a test issue. Watch Olympus:

- Analyze it in seconds
- Add smart labels
- Post detailed analysis
- Suggest assignee

---

## 📊 Example Output

When you create an issue like:

```
Title: Login button not working on mobile Safari
Body: Users report that the login button doesn't respond to taps on iOS Safari...
```

Olympus automatically adds:

**Labels:**

- `priority:high`
- `type:bug`
- `effort:medium`

**AI Analysis Comment:**

```
🤖 Olympus AI Analysis

Priority: HIGH
Category: bug
Estimated Effort: medium
Risk Level: high

Analysis:
This is a critical user-facing bug affecting authentication on a major mobile platform.
Should be prioritized for immediate investigation. Likely requires frontend debugging
and potentially Safari-specific CSS/JS fixes.

Recommendation:
Suggested Team: frontend
```

---

## 🔧 Management

### Service Commands

```bash
# Check status
ssh root@YOUR_SERVER_IP 'systemctl status olympus'

# View logs
ssh root@YOUR_SERVER_IP 'cd /opt/olympus && docker-compose logs -f'

# Restart
ssh root@YOUR_SERVER_IP 'systemctl restart olympus'

# Stop
ssh root@YOUR_SERVER_IP 'systemctl stop olympus'
```

### Quick Health Check

```bash
curl http://YOUR_SERVER_IP/health
```

### View Logs

```bash
ssh root@YOUR_SERVER_IP 'cd /opt/olympus && docker-compose logs --tail=100'
```

---

## 🔐 Security

- ✅ **Firewall enabled** (UFW)
- ✅ **SSH key authentication only**
- ✅ **API keys in environment variables**
- ✅ **Nginx reverse proxy**
- ✅ **Health check monitoring**
- ✅ **Containerized isolation**

**Optional SSL/HTTPS:**

```bash
ssh root@YOUR_SERVER_IP 'apt-get install -y certbot python3-certbot-nginx'
ssh root@YOUR_SERVER_IP 'certbot --nginx -d yourdomain.com'
```

---

## 🚨 Troubleshooting

### Service not starting?

```bash
ssh root@YOUR_SERVER_IP 'cd /opt/olympus && docker-compose logs'
```

### Health check failing?

```bash
curl http://YOUR_SERVER_IP/health
ssh root@YOUR_SERVER_IP 'cd /opt/olympus && docker-compose ps'
```

### Webhook not working?

1. Check GitHub webhook delivery logs
2. Verify URL: `http://YOUR_SERVER_IP/webhook/github`
3. Check firewall: `ssh root@YOUR_SERVER_IP 'ufw status'`

---

## 🔄 Updates

To update the application:

```bash
# 1. Update files locally
# 2. Upload new version
scp webhook_server.py root@YOUR_SERVER_IP:/opt/olympus/

# 3. Rebuild and restart
ssh root@YOUR_SERVER_IP 'cd /opt/olympus && docker-compose up -d --build'
```

---

## 💪 What You Get

A production AI infrastructure that:

✅ **Runs 24/7** in Docker  
✅ **Auto-starts** on reboot  
✅ **Scales easily** with worker configuration  
✅ **Monitors health** automatically  
✅ **Logs everything** for debugging  
✅ **Secure** with firewall & isolation  
✅ **Fast** - analyzes issues in seconds  
✅ **Smart** - uses Claude AI for deep analysis

---

## 📄 License

This deployment package is provided as-is for production use.

---

<div align="center">

**🚀 Ready to deploy? Run `./deploy_now.sh`**

Made with ⚡ for serious developers

</div>

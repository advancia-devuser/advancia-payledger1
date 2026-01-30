# 📘 Olympus AI - Complete Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Configuration](#configuration)
4. [Deployment Methods](#deployment-methods)
5. [GitHub Webhook Setup](#github-webhook-setup)
6. [Verification](#verification)
7. [Management & Monitoring](#management--monitoring)
8. [Troubleshooting](#troubleshooting)
9. [Security Best Practices](#security-best-practices)
10. [Updates & Maintenance](#updates--maintenance)

---

## Prerequisites

### Server Requirements

- **Operating System**: Ubuntu 20.04+ or Debian 11+
- **RAM**: Minimum 1GB (2GB recommended)
- **CPU**: 1 vCPU minimum
- **Storage**: 10GB minimum
- **Network**: Public IP address with ports 80/443 open

### Required Accounts & Tokens

1. **GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Scopes needed: `repo` (full control)
   - Copy and save the token (starts with `ghp_`)

2. **Anthropic API Key**
   - Go to: https://console.anthropic.com/
   - Create account or sign in
   - Navigate to API Keys
   - Create new key (starts with `sk-ant-`)

3. **SSH Access**
   - SSH key pair generated
   - Public key added to server
   - Test: `ssh root@YOUR_SERVER_IP`

---

## Initial Setup

### 1. Prepare Your Local Machine

```bash
# Clone or download Olympus files
cd olympus

# Verify all files are present
ls -la
# Should see: webhook_server.py, Dockerfile, docker-compose.yml, etc.
```

### 2. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit with your credentials
nano .env
```

Add your actual credentials:

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=yourusername/yourrepo
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**: Never commit `.env` to version control!

---

## Configuration

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | `ghp_abc123...` |
| `GITHUB_REPO` | Repository in format owner/repo | `mycompany/myapp` |
| `ANTHROPIC_API_KEY` | Claude AI API key | `sk-ant-xyz789...` |

### Server Configuration

Edit `deploy_now.sh` if your server details differ:

```bash
SERVER_IP="147.182.193.11"  # Change to your server IP
SERVER_USER="root"           # Change if using different user
DEPLOY_PATH="/opt/olympus"   # Change deployment path if needed
```

---

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

```bash
# Make script executable
chmod +x deploy_now.sh

# Run deployment
./deploy_now.sh
```

The script will:
1. ✅ Test SSH connection
2. ✅ Create deployment directory
3. ✅ Upload all files
4. ✅ Install Docker & dependencies
5. ✅ Configure Nginx
6. ✅ Set up systemd service
7. ✅ Build Docker container
8. ✅ Start the service
9. ✅ Configure firewall
10. ✅ Run health check

### Method 2: Manual Deployment

If you prefer manual control:

#### Step 1: Connect to Server

```bash
ssh root@YOUR_SERVER_IP
```

#### Step 2: Install Dependencies

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx
apt-get install -y nginx

# Install UFW (firewall)
apt-get install -y ufw
```

#### Step 3: Upload Files

From your local machine:

```bash
# Create directory on server
ssh root@YOUR_SERVER_IP 'mkdir -p /opt/olympus'

# Upload files
scp -r * root@YOUR_SERVER_IP:/opt/olympus/
```

#### Step 4: Configure Nginx

```bash
ssh root@YOUR_SERVER_IP

# Copy Nginx config
cp /opt/olympus/nginx.conf /etc/nginx/sites-available/olympus
ln -s /etc/nginx/sites-available/olympus /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and reload
nginx -t
systemctl reload nginx
```

#### Step 5: Set Up Systemd Service

```bash
# Copy service file
cp /opt/olympus/olympus.service /etc/systemd/system/

# Enable and start
systemctl daemon-reload
systemctl enable olympus
systemctl start olympus
```

#### Step 6: Configure Firewall

```bash
# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp  # SSH

# Enable firewall
ufw --force enable
```

#### Step 7: Build and Start Container

```bash
cd /opt/olympus

# Build container
docker-compose build

# Start service
docker-compose up -d
```

---

## GitHub Webhook Setup

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Webhooks** in left sidebar
4. Click **Add webhook**

### Step 2: Configure Webhook

Fill in the form:

- **Payload URL**: `http://YOUR_SERVER_IP/webhook/github`
- **Content type**: `application/json`
- **Secret**: Leave empty (or add for extra security)
- **Which events**: Select "Let me select individual events"
  - ✅ Check **Issues**
  - ✅ Uncheck everything else
- **Active**: ✅ Checked

### Step 3: Save and Test

1. Click **Add webhook**
2. GitHub will send a test ping
3. Check "Recent Deliveries" tab
4. Should see green checkmark ✅

---

## Verification

### 1. Check Service Status

```bash
ssh root@YOUR_SERVER_IP 'systemctl status olympus'
```

Expected output:
```
● olympus.service - Olympus AI Webhook Server
   Loaded: loaded
   Active: active (running)
```

### 2. Test Health Endpoint

```bash
curl http://YOUR_SERVER_IP/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-30T14:30:00.000000"
}
```

### 3. Check Detailed Status

```bash
curl http://YOUR_SERVER_IP/api/status
```

Expected response:
```json
{
  "service": "Olympus AI",
  "status": "operational",
  "github_repo": "owner/repo",
  "github_api_connected": true,
  "claude_ai_connected": true,
  "timestamp": "2024-01-30T14:30:00.000000"
}
```

### 4. Test with Real Issue

1. Create a test issue in your repository
2. Watch for:
   - Labels added automatically
   - AI analysis comment posted
3. Check logs: `ssh root@YOUR_SERVER_IP 'cd /opt/olympus && docker-compose logs'`

---

## Management & Monitoring

### Service Management

```bash
# Check status
systemctl status olympus

# Start service
systemctl start olympus

# Stop service
systemctl stop olympus

# Restart service
systemctl restart olympus

# View service logs
journalctl -u olympus -f
```

### Docker Container Management

```bash
cd /opt/olympus

# View running containers
docker-compose ps

# View logs (real-time)
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100

# Restart container
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Stop container
docker-compose down
```

### Log Files

Logs are stored in multiple locations:

```bash
# Application logs
/opt/olympus/logs/olympus.log

# Nginx access logs
/var/log/nginx/olympus-access.log

# Nginx error logs
/var/log/nginx/olympus-error.log

# Docker logs
docker-compose logs
```

### Monitoring Commands

```bash
# Check if container is running
docker ps | grep olympus

# Check resource usage
docker stats olympus-ai

# Check disk space
df -h

# Check memory usage
free -h

# Check system load
uptime
```

---

## Troubleshooting

### Issue: Service Won't Start

**Symptoms**: `systemctl status olympus` shows failed

**Solutions**:

```bash
# Check logs
journalctl -u olympus -n 50

# Check Docker logs
cd /opt/olympus && docker-compose logs

# Verify .env file exists
cat /opt/olympus/.env

# Rebuild container
cd /opt/olympus && docker-compose up -d --build
```

### Issue: Health Check Failing

**Symptoms**: `curl http://YOUR_SERVER_IP/health` returns error

**Solutions**:

```bash
# Check if container is running
docker ps | grep olympus

# Check container logs
docker-compose logs olympus-ai

# Check if port 8000 is listening
netstat -tlnp | grep 8000

# Restart container
docker-compose restart
```

### Issue: Webhook Not Receiving Events

**Symptoms**: No labels/comments on new issues

**Solutions**:

1. **Check GitHub webhook deliveries**:
   - Go to repo → Settings → Webhooks
   - Click on your webhook
   - Check "Recent Deliveries" tab
   - Look for error messages

2. **Verify webhook URL**:
   ```bash
   curl -X POST http://YOUR_SERVER_IP/webhook/github \
     -H "Content-Type: application/json" \
     -d '{"action":"opened","issue":{"number":1,"title":"test","body":"test"}}'
   ```

3. **Check firewall**:
   ```bash
   ufw status
   # Should show port 80 allowed
   ```

4. **Check Nginx**:
   ```bash
   nginx -t
   systemctl status nginx
   ```

### Issue: Claude AI Errors

**Symptoms**: Issues created but no AI analysis

**Solutions**:

```bash
# Verify API key is set
docker-compose exec olympus-ai env | grep ANTHROPIC

# Check logs for API errors
docker-compose logs | grep -i anthropic

# Test API key manually
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":1024,"messages":[{"role":"user","content":"test"}]}'
```

### Issue: Out of Memory

**Symptoms**: Container crashes, system slow

**Solutions**:

```bash
# Check memory usage
free -h

# Restart container
docker-compose restart

# Reduce workers in Dockerfile
# Edit: CMD ["uvicorn", "webhook_server:app", "--workers", "1"]

# Upgrade server RAM
```

---

## Security Best Practices

### 1. Enable HTTPS

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

### 2. Add Webhook Secret

In `.env`:
```bash
GITHUB_WEBHOOK_SECRET=your_random_secret_here
```

Update `webhook_server.py` to verify signature.

### 3. Restrict SSH Access

```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Disable password authentication
PasswordAuthentication no

# Restart SSH
systemctl restart sshd
```

### 4. Regular Updates

```bash
# Update system packages
apt-get update && apt-get upgrade -y

# Update Docker images
cd /opt/olympus
docker-compose pull
docker-compose up -d
```

### 5. Backup Configuration

```bash
# Backup .env file
cp /opt/olympus/.env /root/olympus-env-backup

# Backup entire directory
tar -czf /root/olympus-backup-$(date +%Y%m%d).tar.gz /opt/olympus
```

---

## Updates & Maintenance

### Updating Application Code

```bash
# 1. Update webhook_server.py locally
# 2. Upload to server
scp webhook_server.py root@YOUR_SERVER_IP:/opt/olympus/

# 3. Rebuild and restart
ssh root@YOUR_SERVER_IP 'cd /opt/olympus && docker-compose up -d --build'
```

### Updating Dependencies

```bash
# Update requirements.txt locally
# Upload to server
scp requirements.txt root@YOUR_SERVER_IP:/opt/olympus/

# Rebuild container
ssh root@YOUR_SERVER_IP 'cd /opt/olympus && docker-compose up -d --build'
```

### Scheduled Maintenance

Create a cron job for automatic restarts:

```bash
# Edit crontab
crontab -e

# Add weekly restart (Sunday 3 AM)
0 3 * * 0 cd /opt/olympus && docker-compose restart
```

---

## Support & Resources

### Useful Commands Cheat Sheet

```bash
# Quick health check
curl http://YOUR_SERVER_IP/health

# View live logs
ssh root@YOUR_SERVER_IP 'cd /opt/olympus && docker-compose logs -f'

# Restart everything
ssh root@YOUR_SERVER_IP 'systemctl restart olympus'

# Check what's using port 80
netstat -tlnp | grep :80

# View recent issues processed
docker-compose logs | grep "Processing issue"
```

### API Documentation

Once deployed, visit:
- Service info: `http://YOUR_SERVER_IP/`
- API docs: `http://YOUR_SERVER_IP/docs` (FastAPI auto-generated)
- Health: `http://YOUR_SERVER_IP/health`
- Status: `http://YOUR_SERVER_IP/api/status`

---

## Conclusion

You now have a production-ready AI-powered GitHub webhook server! 🎉

For questions or issues, check the logs first:
```bash
docker-compose logs -f
```

Happy automating! ⚡

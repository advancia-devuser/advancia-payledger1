# 📘 Manual Deployment Steps for Windows

Since the automated scripts are having issues on Windows, follow these manual steps to deploy Olympus to your Digital Ocean server.

## Prerequisites

Ensure you have SSH access to your server. Test it first:

```bash
ssh root@147.182.193.11
```

If that works, proceed with the deployment steps below.

---

## Step 1: Connect to Your Server

Open PowerShell or Git Bash and connect:

```bash
ssh root@147.182.193.11
```

---

## Step 2: Install Dependencies

Once connected to your server, run these commands:

```bash
# Update system
apt-get update

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# Verify installations
docker --version
docker-compose --version
nginx -v
```

---

## Step 3: Create Deployment Directory

```bash
mkdir -p /opt/olympus
cd /opt/olympus
```

---

## Step 4: Upload Files from Your Local Machine

**Open a NEW PowerShell window** on your local machine (keep the SSH session open in another window):

```powershell
cd C:\Users\mucha.DESKTOP-H7T9NPM\Downloads\productution\olympus

# Upload all files
scp Dockerfile root@147.182.193.11:/opt/olympus/
scp webhook_server.py root@147.182.193.11:/opt/olympus/
scp requirements.txt root@147.182.193.11:/opt/olympus/
scp docker-compose.yml root@147.182.193.11:/opt/olympus/
scp .env root@147.182.193.11:/opt/olympus/
scp nginx.conf root@147.182.193.11:/opt/olympus/
scp olympus.service root@147.182.193.11:/opt/olympus/
```

**All files uploaded!**

---

## Step 5: Configure Nginx (Back in SSH Session)

```bash
# Copy Nginx config
cp /opt/olympus/nginx.conf /etc/nginx/sites-available/olympus

# Enable site
ln -sf /etc/nginx/sites-available/olympus /etc/nginx/sites-enabled/olympus

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## Step 6: Build and Start Docker Container

```bash
cd /opt/olympus

# Build the Docker image
docker-compose build

# Start the service
docker-compose up -d

# Create logs directory
mkdir -p logs

# Check status
docker-compose ps
```

---

## Step 7: Configure Systemd Service

```bash
# Copy service file
cp /opt/olympus/olympus.service /etc/systemd/system/

# Reload systemd
systemctl daemon-reload

# Enable service to start on boot
systemctl enable olympus

# Check status
systemctl status olympus
```

---

## Step 8: Configure Firewall

```bash
# Install UFW if not present
apt-get install -y ufw

# Configure firewall rules
ufw --force enable
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# Check status
ufw status
```

---

## Step 9: Verify Deployment

**From your local machine**, test the endpoints:

```bash
# Health check
curl http://147.182.193.11/health

# Should return:
# {"status":"healthy","timestamp":"...","services":{"api":"operational","github_token":"configured","anthropic_api":"configured"}}

# Status check
curl http://147.182.193.11/api/status
```

**If you get a healthy response, deployment is successful!** ✅

---

## Step 10: Setup GitHub Webhook

1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/hooks
2. Click **"Add webhook"**
3. Configure:
   - **Payload URL:** `http://147.182.193.11/webhook/github`
   - **Content type:** `application/json`
   - **Secret:** Leave empty
   - **SSL verification:** Enable SSL verification
   - **Events:** Select "Let me select individual events"
   - Check **Issues**
   - Ensure **Active** is checked
4. Click **"Add webhook"**

---

## Step 11: Test It!

Create a test issue in your repository:

```
Title: Test Olympus AI Integration
Body: This is a test issue to verify that Olympus AI is analyzing issues correctly and adding appropriate labels and comments.
```

**Within 2-3 seconds**, you should see:

- ✅ Labels added (priority, type, effort)
- ✅ AI analysis comment posted
- ✅ Team suggestion provided

---

## 🔧 Useful Management Commands

### View Logs

```bash
ssh root@147.182.193.11 'cd /opt/olympus && docker-compose logs -f'
```

### Restart Service

```bash
ssh root@147.182.193.11 'cd /opt/olympus && docker-compose restart'
```

### Stop Service

```bash
ssh root@147.182.193.11 'cd /opt/olympus && docker-compose down'
```

### Start Service

```bash
ssh root@147.182.193.11 'cd /opt/olympus && docker-compose up -d'
```

### Check Container Status

```bash
ssh root@147.182.193.11 'cd /opt/olympus && docker-compose ps'
```

### View Last 100 Log Lines

```bash
ssh root@147.182.193.11 'cd /opt/olympus && docker-compose logs --tail=100'
```

---

## 🚨 Troubleshooting

### Service Not Starting

```bash
ssh root@147.182.193.11 'cd /opt/olympus && docker-compose logs'
```

Look for error messages in the output.

### Health Check Fails

```bash
# Check if container is running
ssh root@147.182.193.11 'docker ps | grep olympus'

# Check Nginx status
ssh root@147.182.193.11 'systemctl status nginx'

# Check Nginx logs
ssh root@147.182.193.11 'tail -f /var/log/nginx/olympus-error.log'
```

### Webhook Not Working

1. Check GitHub webhook delivery logs
2. Verify URL is correct: `http://147.182.193.11/webhook/github`
3. Check firewall: `ssh root@147.182.193.11 'ufw status'`
4. Test manually:
   ```bash
   curl -X POST http://147.182.193.11/webhook/github \
     -H "Content-Type: application/json" \
     -H "X-GitHub-Event: issues" \
     -d '{"action":"opened","issue":{"number":1,"title":"Test"},"repository":{"full_name":"owner/repo"}}'
   ```

### Missing Environment Variables

If you see errors about missing tokens:

```bash
# Check .env file on server
ssh root@147.182.193.11 'cat /opt/olympus/.env'

# If missing, create it:
ssh root@147.182.193.11 'nano /opt/olympus/.env'

# Add:
# GITHUB_TOKEN=ghp_your_token_here
# GITHUB_REPO=owner/repository
# ANTHROPIC_API_KEY=sk-ant-your_key_here

# Then restart:
ssh root@147.182.193.11 'cd /opt/olympus && docker-compose restart'
```

---

## 📞 Need Help?

Refer to **DEPLOY_GUIDE.md** for complete documentation including:

- Detailed API reference
- Advanced configuration
- Security best practices
- Performance tuning
- Backup and restore procedures

---

## 🔒 Security Recommendations

### 1. Enable HTTPS (Recommended for Production)

```bash
ssh root@147.182.193.11

# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

### 2. Add GitHub Webhook Secret

For additional security, add a webhook secret:

1. Generate a random secret:
   ```bash
   openssl rand -hex 32
   ```

2. Add to `.env` on server:
   ```bash
   GITHUB_WEBHOOK_SECRET=your_generated_secret
   ```

3. Add the same secret to GitHub webhook settings

4. Update `webhook_server.py` to verify the signature

### 3. Restrict SSH Access

```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Set:
PasswordAuthentication no
PermitRootLogin prohibit-password

# Restart SSH
systemctl restart sshd
```

---

## 📊 Monitoring

### Check Resource Usage

```bash
# CPU and Memory
ssh root@147.182.193.11 'docker stats olympus-ai --no-stream'

# Disk space
ssh root@147.182.193.11 'df -h'

# Container health
ssh root@147.182.193.11 'docker inspect olympus-ai | grep -A 10 Health'
```

### Set Up Log Rotation

```bash
ssh root@147.182.193.11

# Create logrotate config
cat > /etc/logrotate.d/olympus << 'EOF'
/opt/olympus/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
EOF
```

---

**🚀 You're all set! Your AI-powered GitHub webhook server is now running on 147.182.193.11**

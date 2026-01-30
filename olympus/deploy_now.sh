#!/bin/bash

# Olympus AI - One-Command Deployment Script
# Deploys to Digital Ocean server at 147.182.193.11

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="147.182.193.11"
SERVER_USER="root"
DEPLOY_PATH="/opt/olympus"

echo -e "${GREEN}🚀 Olympus AI Deployment Script${NC}"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please copy .env.example to .env and configure your credentials:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

# Validate .env has required variables
if ! grep -q "GITHUB_TOKEN=ghp_" .env || ! grep -q "ANTHROPIC_API_KEY=sk-ant-" .env; then
    echo -e "${RED}❌ Error: .env file is not properly configured${NC}"
    echo "Please set GITHUB_TOKEN and ANTHROPIC_API_KEY in .env"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-deployment checks...${NC}"

# Test SSH connection
echo -n "Testing SSH connection... "
if ssh -o ConnectTimeout=5 -o BatchMode=yes ${SERVER_USER}@${SERVER_IP} exit 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Cannot connect to ${SERVER_IP}"
    echo "Make sure your SSH key is added: ssh-copy-id ${SERVER_USER}@${SERVER_IP}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📦 Deploying to ${SERVER_IP}...${NC}"

# Create deployment directory
echo -n "Creating deployment directory... "
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${DEPLOY_PATH}" && echo -e "${GREEN}✓${NC}"

# Upload files
echo "Uploading application files..."
scp -r \
    webhook_server.py \
    requirements.txt \
    Dockerfile \
    docker-compose.yml \
    olympus.service \
    nginx.conf \
    .env \
    ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/

echo -e "${GREEN}✓ Files uploaded${NC}"

# Install dependencies and configure server
echo ""
echo -e "${YELLOW}⚙️  Configuring server...${NC}"

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

# Update system
echo "Updating system packages..."
apt-get update -qq

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt-get install -y nginx
fi

# Create log directory
mkdir -p /opt/olympus/logs
mkdir -p /var/log/olympus

# Configure Nginx
echo "Configuring Nginx..."
cp /opt/olympus/nginx.conf /etc/nginx/sites-available/olympus
ln -sf /etc/nginx/sites-available/olympus /etc/nginx/sites-enabled/olympus
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Configure systemd service
echo "Setting up systemd service..."
cp /opt/olympus/olympus.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable olympus

# Build and start Docker container
echo "Building Docker container..."
cd /opt/olympus
docker-compose down 2>/dev/null || true
docker-compose build
docker-compose up -d

# Configure firewall
echo "Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
fi

echo "✓ Server configuration complete"
ENDSSH

echo -e "${GREEN}✓ Server configured${NC}"

# Wait for service to start
echo ""
echo -n "Waiting for service to start..."
sleep 5
echo -e "${GREEN}✓${NC}"

# Health check
echo -n "Running health check... "
if curl -sf http://${SERVER_IP}/health > /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Service may not be running properly. Check logs:"
    echo "  ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_PATH} && docker-compose logs'"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo "🎯 Your Olympus AI server is now running at:"
echo "   Service: http://${SERVER_IP}"
echo "   Health:  http://${SERVER_IP}/health"
echo "   Status:  http://${SERVER_IP}/api/status"
echo "   Webhook: http://${SERVER_IP}/webhook/github"
echo ""
echo "📝 Next steps:"
echo "   1. Configure GitHub webhook:"
echo "      - Go to your repo → Settings → Webhooks"
echo "      - Add webhook URL: http://${SERVER_IP}/webhook/github"
echo "      - Content type: application/json"
echo "      - Select 'Issues' events"
echo ""
echo "   2. Test by creating an issue in your repository"
echo ""
echo "📊 Management commands:"
echo "   View logs:    ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_PATH} && docker-compose logs -f'"
echo "   Restart:      ssh ${SERVER_USER}@${SERVER_IP} 'systemctl restart olympus'"
echo "   Status:       ssh ${SERVER_USER}@${SERVER_IP} 'systemctl status olympus'"
echo ""
echo -e "${GREEN}🎉 Happy automating!${NC}"

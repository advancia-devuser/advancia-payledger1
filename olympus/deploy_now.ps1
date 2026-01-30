##############################################################################
# OLYMPUS - ONE-COMMAND DEPLOYMENT SCRIPT (PowerShell)
# Deploys AI-powered GitHub webhook server to Digital Ocean
# Server: 147.182.193.11
###############################################################################

$ErrorActionPreference = "Stop"

# Configuration
$SERVER_IP = "147.182.193.11"
$SERVER_USER = "root"
$DEPLOY_DIR = "/opt/olympus"
$SERVICE_NAME = "olympus"

# Colors for output
function Write-Header($message) {
    Write-Host "`n================================================" -ForegroundColor Blue
    Write-Host $message -ForegroundColor Blue
    Write-Host "================================================`n" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "✓ $message" -ForegroundColor Green
}

function Write-Error-Message($message) {
    Write-Host "✗ $message" -ForegroundColor Red
}

function Write-Info($message) {
    Write-Host "➜ $message" -ForegroundColor Yellow
}

# Check prerequisites
function Test-Prerequisites {
    Write-Header "Checking Prerequisites"
    
    # Check for SSH
    $sshPath = Get-Command ssh -ErrorAction SilentlyContinue
    if (-not $sshPath) {
        Write-Error-Message "SSH not found. Please install OpenSSH."
        Write-Info "Run: Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0"
        exit 1
    }
    Write-Success "SSH found"
    
    # Check for SCP
    $scpPath = Get-Command scp -ErrorAction SilentlyContinue
    if (-not $scpPath) {
        Write-Error-Message "SCP not found. Please install OpenSSH."
        exit 1
    }
    Write-Success "SCP found"
    
    # Check for .env file
    if (-not (Test-Path ".env")) {
        Write-Error-Message ".env file not found!"
        Write-Info "Copy .env.example to .env and configure your credentials"
        Write-Info "  cp .env.example .env"
        exit 1
    }
    Write-Success ".env file found"
    
    Write-Host ""
}

# Test SSH connection
function Test-Connection {
    Write-Header "Testing Connection to $SERVER_IP"
    
    try {
        $result = ssh -o BatchMode=yes -o ConnectTimeout=5 "${SERVER_USER}@${SERVER_IP}" "echo 'Connection successful'" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "SSH connection successful"
        } else {
            throw "Connection failed"
        }
    } catch {
        Write-Error-Message "Cannot connect to server. Please check:"
        Write-Info "1. SSH key is configured"
        Write-Info "2. Server IP is correct: ${SERVER_IP}"
        Write-Info "3. User has sudo privileges: ${SERVER_USER}"
        Write-Info "4. Try manually: ssh ${SERVER_USER}@${SERVER_IP}"
        exit 1
    }
    Write-Host ""
}

# Install dependencies on server
function Install-Dependencies {
    Write-Header "Installing Dependencies on Server"
    
    $script = @'
        set -e
        
        # Update system
        echo "Updating system packages..."
        apt-get update -qq
        
        # Install Docker if not present
        if ! command -v docker &> /dev/null; then
            echo "Installing Docker..."
            curl -fsSL https://get.docker.com | sh
            systemctl enable docker
            systemctl start docker
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
            systemctl enable nginx
        fi
        
        echo "All dependencies installed"
'@
    
    $script | ssh "${SERVER_USER}@${SERVER_IP}" "bash -s"
    
    Write-Success "Dependencies installed"
    Write-Host ""
}

# Upload files to server
function Upload-Files {
    Write-Header "Uploading Files to Server"
    
    # Create deployment directory
    ssh "${SERVER_USER}@${SERVER_IP}" "mkdir -p ${DEPLOY_DIR}"
    
    # Upload all files
    Write-Info "Uploading application files..."
    scp -q Dockerfile "${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/"
    scp -q webhook_server.py "${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/"
    scp -q requirements.txt "${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/"
    scp -q docker-compose.yml "${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/"
    scp -q .env "${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/"
    scp -q nginx.conf "${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/"
    scp -q olympus.service "${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/"
    
    Write-Success "Files uploaded"
    Write-Host ""
}

# Configure Nginx
function Configure-Nginx {
    Write-Header "Configuring Nginx"
    
    $script = @"
        set -e
        
        # Copy Nginx config
        cp ${DEPLOY_DIR}/nginx.conf /etc/nginx/sites-available/olympus
        
        # Enable site
        ln -sf /etc/nginx/sites-available/olympus /etc/nginx/sites-enabled/olympus
        
        # Remove default site if exists
        rm -f /etc/nginx/sites-enabled/default
        
        # Test Nginx config
        nginx -t
        
        # Reload Nginx
        systemctl reload nginx
        
        echo "Nginx configured"
"@
    
    $script | ssh "${SERVER_USER}@${SERVER_IP}" "bash -s"
    
    Write-Success "Nginx configured"
    Write-Host ""
}

# Deploy application
function Deploy-Application {
    Write-Header "Deploying Olympus Application"
    
    $script = @"
        set -e
        cd ${DEPLOY_DIR}
        
        # Stop existing containers
        docker-compose down 2>/dev/null || true
        
        # Build and start
        echo "Building Docker image..."
        docker-compose build
        
        echo "Starting services..."
        docker-compose up -d
        
        # Create logs directory
        mkdir -p logs
        
        echo "Application deployed"
"@
    
    $script | ssh "${SERVER_USER}@${SERVER_IP}" "bash -s"
    
    Write-Success "Application deployed"
    Write-Host ""
}

# Configure systemd service
function Configure-Systemd {
    Write-Header "Configuring Systemd Service"
    
    $script = @"
        set -e
        
        # Copy service file
        cp ${DEPLOY_DIR}/olympus.service /etc/systemd/system/
        
        # Reload systemd
        systemctl daemon-reload
        
        # Enable service
        systemctl enable olympus
        
        echo "Systemd service configured"
"@
    
    $script | ssh "${SERVER_USER}@${SERVER_IP}" "bash -s"
    
    Write-Success "Systemd service configured"
    Write-Host ""
}

# Configure firewall
function Configure-Firewall {
    Write-Header "Configuring Firewall"
    
    $script = @'
        set -e
        
        # Install UFW if not present
        if ! command -v ufw &> /dev/null; then
            apt-get install -y ufw
        fi
        
        # Configure firewall rules
        ufw --force enable
        ufw allow ssh
        ufw allow 80/tcp
        ufw allow 443/tcp
        
        echo "Firewall configured"
'@
    
    $script | ssh "${SERVER_USER}@${SERVER_IP}" "bash -s"
    
    Write-Success "Firewall configured"
    Write-Host ""
}

# Verify deployment
function Test-Deployment {
    Write-Header "Verifying Deployment"
    
    Start-Sleep -Seconds 5  # Wait for services to start
    
    # Check if service is running
    Write-Info "Checking service status..."
    try {
        $response = Invoke-WebRequest -Uri "http://${SERVER_IP}/health" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Service is running and healthy"
        } else {
            throw "Unexpected status code"
        }
    } catch {
        Write-Error-Message "Service health check failed"
        Write-Info "Check logs: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_DIR} && docker-compose logs'"
        exit 1
    }
    
    # Get service info
    Write-Info "Service endpoints:"
    Write-Host "  • Main: http://${SERVER_IP}" -ForegroundColor Cyan
    Write-Host "  • Health: http://${SERVER_IP}/health" -ForegroundColor Cyan
    Write-Host "  • Webhook: http://${SERVER_IP}/webhook/github" -ForegroundColor Cyan
    Write-Host "  • Status: http://${SERVER_IP}/api/status" -ForegroundColor Cyan
    
    Write-Host ""
}

# Print completion message
function Show-Completion {
    Write-Header "🚀 DEPLOYMENT COMPLETE!"
    
    Write-Host @"
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║           OLYMPUS IS NOW LIVE ON YOUR SERVER!            ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green
    
    Write-Host "`nNext Steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Test the service:"
    Write-Host "   curl http://${SERVER_IP}/health"
    Write-Host ""
    Write-Host "2. Setup GitHub Webhook:"
    Write-Host "   • Go to your repo → Settings → Webhooks"
    Write-Host "   • URL: http://${SERVER_IP}/webhook/github"
    Write-Host "   • Content type: application/json"
    Write-Host "   • Events: Issues"
    Write-Host ""
    Write-Host "3. Monitor logs:"
    Write-Host "   ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_DIR} && docker-compose logs -f'"
    Write-Host ""
    Write-Host "4. Manage service:"
    Write-Host "   ssh ${SERVER_USER}@${SERVER_IP} 'systemctl status olympus'"
    Write-Host ""
    
    Write-Success "Read DEPLOY_GUIDE.md for more details"
    Write-Host ""
}

# Main execution
function Main {
    Clear-Host
    Write-Host @"
   ___  _   __   ____  __ ____  __  ______
  / _ \| | / /  / /  |/  / __ \/ / / / __/
 / // / |/ /  / / /|_/ / /_/ / /_/ /\ \  
/____/|___/  /_/_/  /_/ .___/\____/___/  
                     /_/                   
     AI-Powered GitHub Webhook Server
"@ -ForegroundColor Blue
    Write-Host ""
    
    Test-Prerequisites
    Test-Connection
    Install-Dependencies
    Upload-Files
    Configure-Nginx
    Deploy-Application
    Configure-Systemd
    Configure-Firewall
    Test-Deployment
    Show-Completion
}

# Run main function
Main

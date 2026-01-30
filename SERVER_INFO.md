# Advancia PayLedger - Server Information

**Last Updated:** January 30, 2026

## Server Details

### DigitalOcean Droplet
- **Public IP:** `147.182.193.11`
- **Private IP:** `10.124.0.2`
- **SSH Access:** `ssh root@147.182.193.11`

### Application Ports
- **Backend API:** Port 3001
- **Frontend:** Deployed on Vercel
- **PostgreSQL:** Port 5432 (internal)
- **Redis:** Port 6379 (internal)

### Backend Endpoints
- **Health Check:** `http://147.182.193.11:3001/health`
- **API Base:** `http://147.182.193.11:3001/api`

### Deployment Paths
- **Application Root:** `/var/www/advancia-payledger`
- **Backend:** `/var/www/advancia-payledger/backend`
- **Logs:** `/var/log/advancia-backend.log`

## Quick Commands

```bash
# Check backend status
ssh root@147.182.193.11 'pm2 status'

# View logs
ssh root@147.182.193.11 'pm2 logs advancia-backend'

# Restart backend
ssh root@147.182.193.11 'pm2 restart advancia-backend'

# Check server resources
ssh root@147.182.193.11 'pm2 monit'

# Test health endpoint
curl http://147.182.193.11:3001/health
```

## Environment Variables

Backend `.env` location: `/var/www/advancia-payledger/backend/.env`

Required variables:
- DATABASE_URL
- REDIS_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- NODE_ENV=production
- PORT=3001
- CORS_ORIGIN (your Vercel URL)

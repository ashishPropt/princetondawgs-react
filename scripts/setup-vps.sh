#!/bin/bash
# Princeton Dawgs — Vultr VPS Bootstrap Script
# Run as root on a fresh Ubuntu 24.04 Vultr instance
# Usage: bash setup-vps.sh <deploy_user> <db_password> <jwt_secret> <jwt_refresh_secret>

set -euo pipefail

DEPLOY_USER="${1:-dawgs}"
DB_PASSWORD="${2:-changeme_db}"
JWT_SECRET="${3:-changeme_jwt}"
JWT_REFRESH="${4:-changeme_jwt_refresh}"
APP_DIR="/home/$DEPLOY_USER/princetondawgs"
REPO="https://github.com/ashishPropt/princetondawgs-react.git"
DOMAIN="${DOMAIN:-princetondawgs.com}"

echo "=== [1/8] System update ==="
apt-get update -qq && apt-get upgrade -y -qq

echo "=== [2/8] Install Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git nginx certbot python3-certbot-nginx ufw

echo "=== [3/8] Install PostgreSQL ==="
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql && systemctl start postgresql

echo "=== [4/8] Create database and user ==="
sudo -u postgres psql <<SQL
CREATE USER dawgs WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE princetondawgs OWNER dawgs;
GRANT ALL PRIVILEGES ON DATABASE princetondawgs TO dawgs;
SQL

echo "=== [5/8] Create deploy user ==="
id -u "$DEPLOY_USER" &>/dev/null || useradd -m -s /bin/bash "$DEPLOY_USER"
usermod -aG sudo "$DEPLOY_USER"

if [ ! -f "/home/$DEPLOY_USER/.ssh/id_ed25519" ]; then
  sudo -u "$DEPLOY_USER" ssh-keygen -t ed25519 -f "/home/$DEPLOY_USER/.ssh/id_ed25519" -N ""
  echo ""
  echo "=== Add this public key to GitHub repo Settings > Deploy Keys ==="
  cat "/home/$DEPLOY_USER/.ssh/id_ed25519.pub"
  echo ""
fi

echo "=== [6/8] Clone repo and configure ==="
sudo -u "$DEPLOY_USER" git clone "$REPO" "$APP_DIR" || (cd "$APP_DIR" && sudo -u "$DEPLOY_USER" git pull)

cat > "$APP_DIR/server/.env" <<ENV
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://dawgs:${DB_PASSWORD}@localhost:5432/princetondawgs
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH}
CLIENT_URL=https://${DOMAIN}
ENV

chown "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR/server/.env"
chmod 600 "$APP_DIR/server/.env"

sudo -u postgres psql -d princetondawgs -f "$APP_DIR/database/schema.sql"
sudo -u "$DEPLOY_USER" bash -c "cd $APP_DIR/server && npm ci --omit=dev"

echo "=== [7/8] PM2 ==="
npm install -g pm2
sudo -u "$DEPLOY_USER" pm2 start "$APP_DIR/server/index.js" --name princetondawgs
sudo -u "$DEPLOY_USER" pm2 save
pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER" | tail -1 | bash

echo "=== [8/8] Nginx ==="
cat > /etc/nginx/sites-available/princetondawgs <<NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        client_max_body_size 10M;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/princetondawgs /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable

VPS_IP=$(curl -s ifconfig.me)
echo ""
echo "================================================"
echo " Princeton Dawgs VPS setup complete!"
echo " App: http://${DOMAIN} (or http://${VPS_IP})"
echo ""
echo " Next steps:"
echo "  1. Point DNS A record for ${DOMAIN} to: ${VPS_IP}"
echo "  2. certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "  3. GitHub Secrets to add:"
echo "     VULTR_HOST = ${VPS_IP}"
echo "     VULTR_USER = ${DEPLOY_USER}"
echo "     VULTR_SSH_KEY = (cat /home/${DEPLOY_USER}/.ssh/id_ed25519)"
echo "================================================"

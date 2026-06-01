# Deploy PetAI On Vultr

This guide deploys the current monorepo to one Ubuntu server with:

- `apps/web` served as static files by `nginx`
- `api` served by `pm2`
- optional local PostgreSQL for demo use

It is optimized for a lightweight portfolio/demo deployment on a small Vultr instance.

## 1. Assumptions

- Server OS: Ubuntu 24.04
- Repo path on server: `/var/www/petai`
- API port: `3000`
- Public domain examples:
  - `petai.example.com` for web
  - `api.petai.example.com` for API

If you only have one domain, you can still serve both with:

- frontend at `https://petai.example.com`
- API proxied under `https://petai.example.com/api`

The provided nginx config uses the simpler split-domain setup.

## 2. Install System Packages

```bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib git curl unzip build-essential
```

Install Node.js 22:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2:

```bash
sudo npm install -g pm2
pm2 startup
```

## 3. Clone Repo

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone <YOUR_GIT_REMOTE> petai
cd petai
```

## 4. Install Dependencies

```bash
npm install
```

## 5. Create PostgreSQL Database

For demo use on the same server:

```bash
sudo -u postgres psql
```

Inside `psql`:

```sql
CREATE USER petai WITH PASSWORD 'change-this-password';
CREATE DATABASE petai OWNER petai;
\q
```

## 6. API Environment

Create `api/.env` on the server:

```bash
cd /var/www/petai
cp api/.env.production.example api/.env
```

Edit it:

```bash
nano api/.env
```

Minimum values:

```env
PORT=3000
DATABASE_URL="postgresql://petai:change-this-password@localhost:5432/petai?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"

ADMIN_EMAIL="admin@petai.io"
ADMIN_PASSWORD="change-this-admin-password"
ADMIN_NAME="PetAI Admin"

OPENAI_API_KEY=""

AWS_REGION=""
AWS_S3_BUCKET=""
AWS_S3_PUBLIC_BASE_URL=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

Notes:

- If you are not using OpenAI or S3 in the demo yet, leave those blank.
- If you want image uploads and chat/voice to work, you must fill them properly.

## 7. Web Environment

Create `apps/web/.env.production`:

```bash
cp apps/web/.env.production.example apps/web/.env.production
nano apps/web/.env.production
```

For split domain setup:

```env
VITE_API_BASE_URL=https://api.petai.example.com/api
```

## 8. Build And Migrate

Generate Prisma client, apply schema, seed admin/demo data, and build:

```bash
cd /var/www/petai
npm run prisma:generate --workspace api
cd api
npx prisma migrate deploy
npm run prisma:seed
cd ..
npm run build --workspace web
npm run build --workspace api
```

## 9. Run API With PM2

From repo root:

```bash
pm2 start deploy/pm2/ecosystem.config.cjs
pm2 save
pm2 status
```

Logs:

```bash
pm2 logs petai-api
```

## 10. Configure Nginx

Copy the sample config:

```bash
sudo cp deploy/nginx/petai.conf /etc/nginx/sites-available/petai
sudo ln -s /etc/nginx/sites-available/petai /etc/nginx/sites-enabled/petai
sudo rm -f /etc/nginx/sites-enabled/default
```

Edit domain names:

```bash
sudo nano /etc/nginx/sites-available/petai
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 11. Add SSL

Point DNS first:

- `A` record: `petai.example.com` -> your server IP
- `A` record: `api.petai.example.com` -> your server IP

Install certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Issue certificates:

```bash
sudo certbot --nginx -d petai.example.com -d api.petai.example.com
```

## 12. Update Deploys

```bash
cd /var/www/petai
git pull
npm install
npm run build --workspace web
npm run build --workspace api
cd api && npx prisma migrate deploy && cd ..
pm2 restart petai-api
sudo systemctl reload nginx
```

## 13. Important Security Note

There is a committed `api/.env` in the local repo that contains real-looking secrets.

Before going live you should:

1. rotate the OpenAI key
2. rotate the AWS access key and secret
3. stop committing real secrets to git
4. keep production secrets only on the server

## 14. Recommended Demo Setup For Your Server

For your current Vultr instance (`2 vCPU / 2 GB RAM`):

- use local PostgreSQL only for small demo data
- do not run the mobile app build pipeline on the server
- keep only one Node API process
- serve frontend statically from nginx
- avoid high concurrent realtime voice usage

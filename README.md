# PetAI

PetAI is a full-stack AI companion platform for connected smart pets.

It combines:

- a marketing and customer-facing web app
- an admin dashboard for devices, pets, voices, products, and orders
- a NestJS API with PostgreSQL and Prisma
- a React Native mobile app scaffold based on the Stitch mobile design language
- per-pet chat memory with text chat and voice chat foundations

## Live Demo

- Web: `https://petai.cloud`
- API health: `https://api.petai.cloud/api/health`

## Why this project stands out

PetAI was built as a portfolio-grade product rather than a single isolated feature demo.

Highlights:

- Role-based auth for `ADMIN` and `USER`
- Pet/device claim flow with product-code validation
- Per-pet conversation threads with long-term memory primitives
- Voice management for admin and voice selection for users
- Product catalog and order flows
- Image upload support via S3-compatible storage
- Web and mobile surfaces designed around a consistent futuristic companion brand
- Production deployment on Vultr with Nginx, PM2, PostgreSQL, HTTPS, and a custom domain

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Mobile

- React Native
- Expo
- TypeScript
- React Navigation
- Zustand

### Backend

- NestJS
- Prisma
- PostgreSQL
- JWT authentication
- AWS S3 SDK
- OpenAI API integration

### Infrastructure

- Vultr Ubuntu server
- Nginx
- PM2
- Let's Encrypt
- Custom domain DNS configuration

## Architecture

This repo is organized as a monorepo:

```text
petai/
├─ api/         NestJS + Prisma backend
├─ apps/
│  ├─ web/      Vite React web app
│  └─ mobile/   Expo React Native mobile app
├─ deploy/      PM2 and Nginx deployment configs
└─ DEPLOY_VULTR.md
```

## Product Features

### Web app

- Landing page and auth flow
- User dashboard
- Pet management
- Device claim flow
- Pet identity settings
- Voice selection and voice preview
- Persistent pet conversation UI
- Shop browse and product detail pages
- Admin dashboard for users, devices, pets, voices, products, and orders

### API

- Register/login
- User profile and password update
- Device claim
- User/admin pet CRUD
- Voice CRUD and public voice listing
- Product and order APIs
- Chat APIs for per-pet conversations
- Voice-session support endpoints
- Health endpoint

### Mobile

- Onboarding
- Login / Register
- Home
- Claim Device
- Pet Identity Setup
- Voice Selection
- Talk / Voice Chat
- Device Settings
- Pet Profile
- Settings
- Shop

## Local Development

### Prerequisites

- Node.js 22+
- npm
- PostgreSQL

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Backend:

```bash
cp api/.env.example api/.env
```

Web:

```bash
cp apps/web/.env.production.example apps/web/.env.production
```

Update the values for your local database, JWT secret, OpenAI key, and storage configuration.

### 3. Generate Prisma client

```bash
npm run api:prisma:generate
```

### 4. Run migrations and seed

```bash
npx prisma migrate deploy --schema api/prisma/schema.prisma
npm run api:prisma:seed
```

### 5. Start backend

```bash
npm run api:dev
```

### 6. Start web app

```bash
npm run dev --workspace apps/web
```

### 7. Start mobile app

```bash
npm run mobile:dev
```

## Useful Scripts

```bash
npm run api:dev
npm run api:build
npm run api:prisma:generate
npm run api:prisma:seed
npm run dev --workspace apps/web
npm run build --workspace apps/web
npm run mobile:dev
npm run mobile:ios
npm run mobile:android
```

## Deployment

Production deployment notes live in:

- [DEPLOY_VULTR.md](./DEPLOY_VULTR.md)

Current deployment setup includes:

- custom domain on `petai.cloud`
- `api.petai.cloud` for the backend
- Nginx reverse proxy
- PM2 process management
- PostgreSQL on server
- HTTPS with Let's Encrypt

## Selected Engineering Decisions

- Global `/api` prefix in NestJS to keep frontend/backend routing clean
- Prisma schema with role enums, device states, product/order models, and pet-memory models
- PM2 used for simple, low-cost production hosting suitable for portfolio deployment
- Nginx used to serve the web build and reverse proxy the API
- Public health endpoint added for deployment verification

## Future Improvements

- Realtime voice chat polish
- better production observability and logging
- automated CI/CD pipeline
- managed database and object storage hardening
- richer long-term memory ranking and summarization

## Author

Nguyen Huynh Minh Toan

If you are reviewing this project for hiring or collaboration, the goal of PetAI is to demonstrate end-to-end product thinking:

- UX and visual systems
- backend architecture
- AI feature integration
- mobile app scaffolding
- production deployment

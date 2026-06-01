# PetAI API

NestJS + Prisma + PostgreSQL backend for PetAI.

## What is included

- JWT auth with register/login
- `ADMIN` and `USER` roles
- Prisma models for `User`, `Device`, `Pet`, and `Voice`
- Device claim flow using `productCode`
- User pet CRUD APIs
- Admin CRUD APIs for users, devices, pets, and voices
- Seed script for an admin account and sample devices/voices
- DTO validation with `class-validator`
- S3-backed pet image uploads

## Setup

1. Copy env file:

```bash
cp api/.env.example api/.env
```

2. Start PostgreSQL and create a database named `petai`.

3. Install dependencies from the repo root:

```bash
npm install
```

4. Generate Prisma client:

```bash
npm run api:prisma:generate
```

5. Run migrations:

```bash
npm run prisma:migrate --workspace api
```

6. Seed data:

```bash
npm run api:prisma:seed
```

7. Start the API:

```bash
npm run api:dev
```

The API runs on `http://localhost:3000` by default and uses the global prefix `/api`.

## S3 pet image uploads

Configure these variables in `api/.env`:

```env
AWS_REGION="ap-southeast-1"
AWS_S3_BUCKET="your-petai-bucket"
AWS_S3_PUBLIC_BASE_URL="https://your-petai-bucket.s3.ap-southeast-1.amazonaws.com"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

Once configured, pet images can be uploaded through:

- `POST /api/pets/:id/image`

This endpoint accepts multipart form data with a `file` field.

## Default seeded admin

- Email: value from `ADMIN_EMAIL`
- Password: value from `ADMIN_PASSWORD`

Default values in `.env.example`:

- Email: `admin@petai.io`
- Password: `Admin123!`

## Main endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### User

- `POST /api/devices/claim`
- `GET /api/pets`
- `POST /api/pets`
- `PATCH /api/pets/:id`
- `POST /api/pets/:id/image`
- `DELETE /api/pets/:id`

### Admin

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/devices`
- `POST /api/admin/devices`
- `PATCH /api/admin/devices/:id`
- `DELETE /api/admin/devices/:id`
- `GET /api/admin/pets`
- `POST /api/admin/pets`
- `PATCH /api/admin/pets/:id`
- `DELETE /api/admin/pets/:id`
- `GET /api/admin/voices`
- `POST /api/admin/voices`
- `PATCH /api/admin/voices/:id`
- `DELETE /api/admin/voices/:id`

## Auth header

Use the JWT access token returned by login/register:

```http
Authorization: Bearer <token>
```

## Notes

- Device claim succeeds only when both `serialNumber` and `productCode` match a provisioned device.
- Regular users can only access and mutate their own pets.
- Admin endpoints are protected by role guards.

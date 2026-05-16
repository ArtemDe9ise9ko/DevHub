# DevHub

A portfolio pet project for analyzing GitHub data.

## Structure

- `backend/`: NestJS + TypeScript + Prisma + PostgreSQL
- `frontend/`: Angular + TypeScript

## Getting Started

1. Start the database: `docker-compose up -d`
2. Install dependencies for backend: `cd backend && npm install`
3. Install dependencies for frontend: `cd frontend && npm install`
4. Run backend: `cd backend && npm run start:dev`
5. Run frontend: `cd frontend && npm start`

## Auth API

- Swagger URL: http://localhost:3000/api
- Required env variables:
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
  - `JWT_ACCESS_EXPIRES_IN`
  - `JWT_REFRESH_EXPIRES_IN`
  - `BCRYPT_SALT_ROUNDS`
- Auth endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
  - `GET /auth/me`
- Protected endpoints require: `Authorization: Bearer <accessToken>`
- Refresh tokens are rotated and stored hashed in database.
- Password hashes and refresh token hashes are never returned by API.

## GitHub API

- Swagger URL: http://localhost:3000/api
- Optional env variable: `GITHUB_TOKEN`
- Endpoints:
  - `GET /github/users/:username`
  - `GET /github/users/:username/repositories`
  - `GET /github/repositories/:owner/:repo`
  - `GET /github/repositories/:owner/:repo/languages`

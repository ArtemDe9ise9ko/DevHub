# DevHub

DevHub is a portfolio project for a GitHub analytics dashboard. The backend is built with NestJS, Prisma, PostgreSQL, and integrates GitHub public API data with user authentication, favorites, search history, and analytics.

## Tech Stack

- NestJS 10
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker Compose for local PostgreSQL
- Jest for unit and e2e tests
- Swagger for API documentation

## Project Structure

- `backend/` — NestJS backend
- `frontend/` — Angular frontend
- `docker-compose.yml` — local PostgreSQL service

## Backend Features

- Auth: email/password registration, JWT access, refresh token rotation
- GitHub integration: user profiles, repositories, repository details, languages
- Favorites: save and manage favorite GitHub repositories per user
- Search history: track user search queries and types
- Analytics: aggregate public GitHub repository stats and language distribution

## Environment Setup

1. Start PostgreSQL:

```bash
docker-compose up -d
```

2. Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Apply database migrations:

```bash
npm run prisma:migrate
```

## Required Backend Environment Variables

Set these values in `backend/.env`:

- `DATABASE_URL`
- `PORT`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`
- `GITHUB_TOKEN` (optional)

### Example Backend Env Values

```env
DATABASE_URL="postgresql://user:password@localhost:5433/dev_hub?schema=public"
PORT=3000
JWT_ACCESS_SECRET="change-me-access-secret"
JWT_REFRESH_SECRET="change-me-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS=10
GITHUB_TOKEN=
```

## Docker / PostgreSQL

The backend uses PostgreSQL running locally at `localhost:5433` via `docker-compose.yml`.

```yaml
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: dev_hub
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5433:5432"
```

## Prisma Commands

From `backend/`:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Backend Commands

From `backend/`:

```bash
npm run start:dev
npm run build
npm run test
npm run test:e2e
npm run test:cov
```

## Swagger

API documentation is available at:

```text
http://localhost:3000/api
```

## API Endpoint Groups

### Auth API

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### GitHub API

- `GET /github/users/:username`
- `GET /github/users/:username/repositories`
- `GET /github/repositories/:owner/:repo`
- `GET /github/repositories/:owner/:repo/languages`

### Favorites API

- `POST /favorites/repositories`
- `GET /favorites/repositories`
- `DELETE /favorites/repositories/:id`

### Search History API

- `POST /search-history`
- `GET /search-history`
- `DELETE /search-history`

### Analytics API

- `GET /analytics/users/:username/summary`
- `GET /analytics/users/:username/languages`

## Curl Examples

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123"}'
```

### Get Current User

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

### Search GitHub User

```bash
curl http://localhost:3000/github/users/octocat
```

### Get User Repositories

```bash
curl http://localhost:3000/github/users/octocat/repositories
```

### Add Favorite Repository

```bash
curl -X POST http://localhost:3000/favorites/repositories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"repositoryId":123,"name":"repo","fullName":"octocat/repo","description":"desc","language":"TypeScript","stars":10,"forks":2,"openIssues":1,"repositoryUrl":"https://github.com/octocat/repo","ownerUsername":"octocat","ownerAvatarUrl":"https://avatars.githubusercontent.com/u/583231?v=4"}'
```

### Get Favorites

```bash
curl http://localhost:3000/favorites/repositories \
  -H "Authorization: Bearer <accessToken>"
```

### Add Search History

```bash
curl -X POST http://localhost:3000/search-history \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"query":"octocat","type":"USER"}'
```

### Get Search History

```bash
curl http://localhost:3000/search-history \
  -H "Authorization: Bearer <accessToken>"
```

### Get Analytics Summary

```bash
curl http://localhost:3000/analytics/users/octocat/summary
```

### Get Analytics Languages

```bash
curl http://localhost:3000/analytics/users/octocat/languages
```

## Protected Endpoints

Certain routes require an access token in the `Authorization` header:

```text
Authorization: Bearer <accessToken>
```

## Testing

From `backend/`:

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Development Workflow

1. Start PostgreSQL locally:

```bash
docker-compose up -d
```

2. Create `backend/.env` from `backend/.env.example`.
3. Install dependencies:

```bash
cd backend
npm install
```

4. Run the backend in development mode:

```bash
npm run start:dev
```

5. Update Prisma schema and apply migrations when needed:

```bash
npm run prisma:migrate
npm run prisma:generate
```

6. Run tests frequently:

```bash
npm run test
```

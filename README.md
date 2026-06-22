# URL Shortener API

A production-style URL Shortener API built with Node.js, Express, MongoDB Atlas, Redis, and Docker.

## Live API

https://url-shortener-puia.onrender.com

## Features

- Create shortened URLs
- Generate unique short codes using NanoID
- Create custom short codes
- Validate URLs before saving
- Redirect short URLs to the original URL
- Track clicks for every shortened URL
- View URL analytics
- List all URLs with pagination
- Add expiry dates for temporary links
- Redis caching for faster redirects
- Rate limiting to prevent API abuse
- MongoDB Atlas cloud database
- Docker and Docker Compose support
- Deployed on Render

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Redis
- Upstash Redis
- Docker
- Docker Compose
- Render
- NanoID
- Validator
- Express Rate Limit

## Project Structure

```text
url-shortener/
│
├── config/
│   ├── db.js
│   └── redis.js
│
├── controllers/
│   └── urlController.js
│
├── middleware/
│   ├── errorHandler.js
│   └── rateLimiter.js
│
├── models/
│   └── url.js
│
├── routes/
│   ├── redirectRoutes.js
│   └── urlRoutes.js
│
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── server.js
```

## API Endpoints

### 1. Create Short URL

```http
POST /api/url/shorten
```

#### Request Body

```json
{
  "originalUrl": "https://github.com",
  "customCode": "my-github",
  "expiresAt": "2026-12-31"
}
```

> `customCode` and `expiresAt` are optional.

#### Example Response

```json
{
  "message": "Short URL created successfully",
  "shortUrl": "https://url-shortener-puia.onrender.com/my-github",
  "originalUrl": "https://github.com",
  "shortCode": "my-github"
}
```

---

### 2. Redirect Short URL

```http
GET /:shortCode
```

#### Example

```text
https://url-shortener-puia.onrender.com/my-github
```

This redirects the user to the original URL and increases the click count.

---

### 3. Get URL Analytics

```http
GET /api/url/analytics/:shortCode
```

#### Example

```http
GET /api/url/analytics/my-github
```

#### Example Response

```json
{
  "originalUrl": "https://github.com",
  "shortCode": "my-github",
  "clicks": 5,
  "expiresAt": "2026-12-31T00:00:00.000Z",
  "createdAt": "2026-06-22T00:00:00.000Z",
  "updatedAt": "2026-06-22T00:00:00.000Z"
}
```

---

### 4. List All URLs with Pagination

```http
GET /api/url?page=1&limit=5
```

#### Example Response

```json
{
  "page": 1,
  "limit": 5,
  "totalUrls": 11,
  "totalPages": 3,
  "count": 5,
  "urls": []
}
```

## Redis Caching Flow

```text
User opens short URL
        ↓
Node.js API
        ↓
Check Redis cache
        ↓
Cache hit → Redirect immediately
        ↓
Cache miss → Fetch URL from MongoDB Atlas
        ↓
Store URL in Redis for 1 hour
        ↓
Redirect user to original URL
```

MongoDB Atlas is the permanent database.

Redis is used as a fast temporary cache for frequently opened URLs.

## Rate Limiting

The URL creation endpoint is rate limited to prevent spam and abuse.

```text
POST /api/url/shorten
Maximum: 20 requests per IP address every 15 minutes
```

If the limit is exceeded, the API returns:

```json
{
  "message": "Too many URL creation requests. Please try again after 15 minutes."
}
```

## URL Expiry

Users can optionally create temporary links.

Example:

```json
{
  "originalUrl": "https://example.com",
  "expiresAt": "2026-12-31"
}
```

When an expired short URL is opened, the API returns:

```json
{
  "message": "This short URL has expired"
}
```

Status code:

```text
410 Gone
```

## Local Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd url-shortener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env`

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
REDIS_URL=redis://127.0.0.1:6379
NODE_ENV=development
```

### 4. Start Redis

If Redis is installed using Homebrew:

```bash
brew services start redis
```

### 5. Run the Application

```bash
npm run dev
```

The API will run on:

```text
http://localhost:3000
```

## Docker Setup

Run the application and Redis using Docker Compose:

```bash
docker compose up --build
```

The API will run on:

```text
http://localhost:3000
```

Stop Docker containers:

```bash
docker compose down
```

## Environment Variables

```env
PORT=
MONGO_URI=
REDIS_URL=
NODE_ENV=
```

## Deployment

The API is deployed on Render.

Production architecture:

```text
Node.js API → Render
MongoDB Database → MongoDB Atlas
Redis Cache → Upstash Redis
```

## Future Improvements

- JWT authentication
- User accounts
- Personal URL dashboard
- Delete and update shortened URLs
- QR code generation
- Detailed analytics by country, device, browser, and referrer
- Automated tests using Jest
- CI/CD using GitHub Actions
- React frontend dashboard
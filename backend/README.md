# Backend API

Production-ready Node.js backend API for user authentication and profile management.

## Tech Stack

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL (NeonTech or local)
- **Authentication**: JWT with bcrypt password hashing
- **Image Processing**: Sharp for compression
- **Storage**: Local filesystem OR AWS S3 with CloudFront CDN
- **Deployment**: Vercel Serverless Functions

## Storage Modes

This backend supports **two storage modes** that are automatically selected based on environment configuration:

### 1. Local Storage (Default)
- Uses local `/uploads` directory
- No AWS account required
- Perfect for development and simple deployments
- Images served directly by Express

### 2. AWS S3 + CloudFront (Production)
- Uses S3 for storage, CloudFront for CDN delivery
- Requires AWS credentials
- Best for production with high traffic
- Images cached globally via CDN

**The storage mode is determined automatically** - if all AWS variables are configured, S3 is used. Otherwise, local storage is used.

## Project Structure

```
backend/
├── src/
│   ├── app.js                   # Express app setup
│   ├── server.js                # Server entry point
│   ├── config/
│   │   ├── db.js                # PostgreSQL connection
│   │   ├── aws.js               # AWS S3 client (lazy loaded)
│   │   └── env.js               # Environment validation
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   └── user.routes.js       # User endpoints
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth logic
│   │   └── user.controller.js   # User logic
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   └── upload.middleware.js # Multer config
│   ├── services/
│   │   ├── storage.service.js   # Storage abstraction (local/S3)
│   │   ├── image.service.js     # Image compression
│   │   └── s3.service.js        # S3 operations
│   └── utils/
│       └── jwt.js               # Token helpers
├── uploads/                     # Local image storage (auto-created)
├── vercel.json                  # Vercel config
├── package.json
└── .env.example                 # Environment template
```

## API Endpoints

| Method | Endpoint              | Auth | Description           |
|--------|-----------------------|------|-----------------------|
| GET    | /api/health           | No   | Health check + storage mode |
| POST   | /api/auth/register    | No   | Register new user     |
| POST   | /api/auth/login       | No   | Login user            |
| GET    | /api/user/me          | Yes  | Get current user      |
| POST   | /api/user/upload-image| Yes  | Upload profile image  |

### Response Format

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "profile_image_key": "pp/johndoe-1234.jpg",
    "profile_image_url": "https://your-backend.vercel.app/uploads/pp/johndoe-1234.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here"
}
```

## Environment Variables

### Quick Start (No AWS)

Create a `.env` file for local development without AWS:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/myapp

# JWT (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters

# Media URL (points to local uploads)
MEDIA_BASE_URL=http://localhost:3001/uploads

# Server
PORT=3001
NODE_ENV=development
```

### Production with AWS S3

For production with S3 + CloudFront, add these variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@your-neon-host/dbname?sslmode=require

# JWT
JWT_SECRET=your-production-secret-key-min-32-chars

# AWS S3 Configuration (all 4 required to enable S3)
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-bucket-name

# CloudFront URL (or S3 URL if not using CloudFront)
MEDIA_BASE_URL=https://your-distribution.cloudfront.net

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Variable Reference

| Variable              | Required | Description                                           |
|-----------------------|----------|-------------------------------------------------------|
| DATABASE_URL          | ✅ Yes   | PostgreSQL connection string                          |
| JWT_SECRET            | ✅ Yes   | Secret for signing JWT tokens (32+ chars recommended) |
| MEDIA_BASE_URL        | ✅ Yes   | Base URL for serving images                           |
| JWT_EXPIRES_IN        | No       | Token expiration (default: 7d)                        |
| AWS_ACCESS_KEY_ID     | No*      | AWS access key for S3                                 |
| AWS_SECRET_ACCESS_KEY | No*      | AWS secret key for S3                                 |
| AWS_REGION            | No*      | AWS region (e.g., ap-south-1)                         |
| AWS_BUCKET_NAME       | No*      | S3 bucket name                                        |
| PORT                  | No       | Server port (default: 3001)                           |
| NODE_ENV              | No       | Environment (development/production)                  |
| FRONTEND_URL          | No       | Frontend URL for CORS                                 |

*AWS variables are optional. If all 4 are provided, S3 storage is used. Otherwise, local storage is used.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Database Setup (NeonTech)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string (includes `?sslmode=require`)
4. Paste as `DATABASE_URL`
5. Table auto-creates on first server start

**Database Schema (auto-created):**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_image_key VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Run Locally

```bash
npm run dev
```

Server runs at `http://localhost:3001`

Test health endpoint:
```bash
curl http://localhost:3001/api/health
# Response: { "status": "ok", "storageMode": "local", ... }
```

## Deploy to Vercel

### 1. Prepare Repository

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin https://github.com/your-username/your-backend-repo.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your repository
4. **Root Directory**: `backend` (if backend is in subfolder)
5. **Framework Preset**: Other
6. Add Environment Variables:
   - `DATABASE_URL` - Your NeonTech connection string
   - `JWT_SECRET` - Your secure secret key
   - `MEDIA_BASE_URL` - `https://your-backend.vercel.app/uploads`
   - `NODE_ENV` - `production`
   - `FRONTEND_URL` - `https://your-frontend.vercel.app`
7. Click Deploy

### 3. Configure Frontend

Update frontend environment:

```env
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

## Migrating to AWS S3

When you're ready to use AWS S3 + CloudFront:

### 1. Set Up AWS Resources

1. **Create S3 Bucket** (private, block all public access)
2. **Create IAM User** with S3 permissions
3. **Create CloudFront Distribution** pointing to S3

### 2. Add AWS Environment Variables

Add to your `.env` or Vercel dashboard:

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-bucket-name
MEDIA_BASE_URL=https://your-cloudfront-distribution.cloudfront.net
```

### 3. No Code Changes Required

The storage service automatically detects AWS configuration and switches to S3.

**No database migration needed** - the `profile_image_key` format remains the same.

## Image Upload Flow

```
Upload: 1.5MB photo.jpg
→ Compress: 8KB (200x200 JPEG)
→ Storage Key: pp/johndoe-4521.jpg
→ DB: profile_image_key = "pp/johndoe-4521.jpg"
→ URL: {MEDIA_BASE_URL}/pp/johndoe-4521.jpg
```

## Security Checklist

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens with expiration
- ✅ Input validation on all endpoints
- ✅ No secrets in code (env vars only)
- ✅ CORS configured for frontend origin
- ✅ SQL injection prevention (parameterized queries)
- ✅ (With AWS) Private S3 bucket + CloudFront OAC

## Testing Endpoints

```bash
# Health check
curl http://localhost:3001/api/health

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get profile (replace TOKEN)
curl http://localhost:3001/api/user/me \
  -H "Authorization: Bearer TOKEN"

# Upload image (replace TOKEN)
curl -X POST http://localhost:3001/api/user/upload-profile \
  -H "Authorization: Bearer TOKEN" \
  -F "profileImage=@/path/to/image.jpg"
```

## Architecture Diagram

### Local Storage Mode
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  PostgreSQL │
│   (Vercel)  │     │   (Vercel)  │     │  (NeonTech) │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   /uploads  │
                    │   (Local)   │
                    └─────────────┘
```

### AWS S3 Mode (Production)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  PostgreSQL │
│   (Vercel)  │     │   (Vercel)  │     │  (NeonTech) │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   AWS S3    │
                    │  (Private)  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ CloudFront  │
                    │   (CDN)     │
                    └─────────────┘
```

## License

MIT

# Backend API - Production Ready

Production-grade Node.js backend with JWT authentication, AWS S3 image uploads, and PostgreSQL.

## Tech Stack

- **Node.js 18+** + **Express.js 4.x**
- **PostgreSQL** (NeonTech - serverless)
- **JWT** Authentication (7-day expiry)
- **bcrypt** password hashing (12 rounds)
- **Sharp** for image compression (<10KB)
- **AWS S3** for private object storage
- **CloudFront** as public CDN

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app setup & middleware
│   ├── server.js           # Entry point (local + Vercel)
│   ├── config/
│   │   ├── db.js           # PostgreSQL pool + table init
│   │   ├── aws.js          # AWS S3 client
│   │   └── env.js          # Environment validation
│   ├── routes/
│   │   ├── auth.routes.js  # /api/auth/*
│   │   └── user.routes.js  # /api/user/*
│   ├── controllers/
│   │   ├── auth.controller.js  # register, login
│   │   └── user.controller.js  # getMe, uploadProfileImage
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── upload.middleware.js # Multer config
│   ├── services/
│   │   ├── s3.service.js       # S3 upload/delete/URL
│   │   └── image.service.js    # Sharp compression
│   └── utils/
│       └── jwt.js              # Token generate/verify
├── .env.example
├── package.json
├── vercel.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/user/me` | ✅ | Get current user profile |
| POST | `/api/user/upload-profile` | ✅ | Upload profile image |
| GET | `/api/health` | ❌ | Health check |

### Response Format

All user responses include:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile_image_key": "pp/johndoe-1234.jpg",
    "profile_image_url": "https://cdn.example.com/pp/johndoe-1234.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (NeonTech PostgreSQL)
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# JWT Authentication
JWT_SECRET=your-very-long-random-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# CloudFront CDN URL (no trailing slash)
MEDIA_BASE_URL=https://d1234567890.cloudfront.net

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. NeonTech Database Setup

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string (includes `?sslmode=require`)
4. Paste as `DATABASE_URL`
5. Table auto-creates on first server start

**Database Schema:**
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

### 4. AWS S3 + CloudFront Setup

#### Step 1: Create S3 Bucket

1. Go to AWS S3 Console
2. Create bucket with unique name
3. **Block all public access** ✓ (bucket must be private)
4. Enable versioning
5. Note the bucket name and region

#### Step 2: Create IAM User

1. Go to IAM Console → Users → Add User
2. Name: `s3-upload-user`
3. Attach policy: `AmazonS3FullAccess` (or custom policy below)
4. Create access key (Application running outside AWS)
5. Save Access Key ID and Secret

**Minimal IAM Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

#### Step 3: Create CloudFront Distribution

1. Go to CloudFront Console → Create Distribution
2. Origin domain: Select your S3 bucket
3. Origin access: **Origin access control settings (recommended)**
4. Create new OAC with default settings
5. Viewer protocol policy: **Redirect HTTP to HTTPS**
6. Cache policy: **CachingOptimized**
7. Create distribution
8. Copy the distribution domain (e.g., `d1234567890.cloudfront.net`)

#### Step 4: Update S3 Bucket Policy

After creating CloudFront, update S3 bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

### 5. Run Locally

```bash
npm run dev
```

Server runs at `http://localhost:3001`

Test health endpoint:
```bash
curl http://localhost:3001/api/health
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
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_BUCKET_NAME`
   - `MEDIA_BASE_URL`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
7. Click Deploy

### 3. Configure Frontend

Update frontend environment:

```env
VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_MEDIA_BASE_URL=https://d1234567890.cloudfront.net
```

## Image Upload Flow

1. **Client** sends image (any size up to 5MB)
2. **Multer** validates file type (jpg/jpeg/png only)
3. **Sharp** resizes to 200x200 and compresses to <10KB
4. **S3 Service** uploads to `pp/{username}-{random}.jpg`
5. **Database** stores only the object key
6. **Response** includes generated CloudFront URL

```
Upload: 1.5MB photo.jpg
→ Compress: 8KB (200x200 JPEG)
→ S3 Key: pp/johndoe-4521.jpg
→ DB: profile_image_key = "pp/johndoe-4521.jpg"
→ URL: https://cdn.example.com/pp/johndoe-4521.jpg
```

## Security Checklist

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens with expiration
- ✅ Input validation on all endpoints
- ✅ No secrets in code (env vars only)
- ✅ Private S3 bucket
- ✅ CloudFront Origin Access Control
- ✅ CORS configured for frontend origin
- ✅ SQL injection prevention (parameterized queries)

## Common Errors & Fixes

### "Missing required environment variables"
→ Ensure all env vars are set in Vercel dashboard

### "ECONNREFUSED" database error
→ Check DATABASE_URL format, ensure `?sslmode=require`

### "Invalid file type" on upload
→ Only jpg, jpeg, png allowed

### "Unable to compress image below 10KB"
→ Image too complex; user should try different image

### "Access Denied" on image load
→ Check CloudFront OAC and S3 bucket policy

### CORS errors
→ Add frontend URL to `FRONTEND_URL` env var

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
                           │
                           ▼
                    ┌─────────────┐
                    │   Client    │
                    │  (Images)   │
                    └─────────────┘
```

## License

MIT

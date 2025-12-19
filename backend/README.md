# Backend API

Production-ready Node.js backend with JWT authentication, AWS S3 image uploads, and PostgreSQL.

## Tech Stack

- **Node.js** + **Express.js**
- **PostgreSQL** (NeonTech)
- **JWT** Authentication
- **bcrypt** for password hashing
- **Sharp** for image compression
- **AWS S3** for storage
- **CloudFront** as CDN

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   ├── config/
│   │   ├── db.js           # PostgreSQL connection
│   │   ├── aws.js          # AWS S3 client
│   │   └── env.js          # Environment variables
│   ├── routes/
│   │   ├── auth.routes.js  # Auth endpoints
│   │   └── user.routes.js  # User endpoints
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── services/
│   │   ├── s3.service.js   # S3 operations
│   │   └── image.service.js # Image compression
│   └── utils/
│       └── jwt.js          # JWT helpers
├── .env.example
├── package.json
├── vercel.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/user/me` | Yes | Get current user |
| POST | `/api/user/upload-profile` | Yes | Upload profile image |
| GET | `/api/health` | No | Health check |

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket
MEDIA_BASE_URL=https://your-cloudfront.cloudfront.net
```

### 3. AWS S3 Setup

1. Create S3 bucket (private)
2. Enable versioning
3. Create CloudFront distribution pointing to S3
4. Configure Origin Access Control (OAC)

**S3 Bucket Policy:**

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

### 4. NeonTech Database

1. Create project at [neon.tech](https://neon.tech)
2. Copy connection string to `DATABASE_URL`
3. Table auto-creates on first run

### 5. Run Locally

```bash
npm run dev
```

Server runs at `http://localhost:3001`

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

### 3. Configure Frontend

Update frontend `.env`:

```env
VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_MEDIA_BASE_URL=https://your-cloudfront.cloudfront.net
```

## Image Handling

- Accepts: JPG, JPEG, PNG (up to 5MB)
- Compresses to: < 10KB using Sharp
- Stores: Only object key in database
- Serves: Via CloudFront CDN

**URL Generation:**

```javascript
// Database stores: "pp/username-6658.jpg"
// URL generated: `${MEDIA_BASE_URL}/${profile_image_key}`
// Result: "https://cdn.example.com/pp/username-6658.jpg"
```

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT for authentication
- Input validation on all endpoints
- No secrets in code
- Private S3 bucket + CloudFront OAC

## Frontend Integration

The React frontend expects these environment variables:

```env
VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_MEDIA_BASE_URL=https://your-cloudfront.cloudfront.net
```

This project is a production-ready full-stack application that allows users to register, log in, and upload a profile image.
Images are securely stored in AWS S3 and served via CloudFront, following industry-standard media handling practices.

🧱 Tech Stack
Frontend

React.js

Styled Components

Axios

React Router

JWT-based authentication

Backend

Node.js

Express.js

PostgreSQL (NeonTech)

JWT Authentication

bcrypt

multer

sharp (image compression)

Cloud & Infrastructure

AWS S3 (private bucket)

AWS CloudFront (CDN)

Vercel (Frontend & Backend deployment)

NeonTech (PostgreSQL database)

✨ Key Features

User Registration & Login

JWT-based authentication

Protected routes

Profile image upload

Image compression to under 10KB

CDN-based image delivery via CloudFront

Production-grade media architecture

Secure environment variable handling

🗄️ Database Schema
users table
Column	Type	Description
id	integer	Primary key
name	text	User name
email	text	Unique email
password	text	Hashed password
profile_image_key	text	S3 object key only
created_at	timestamp	Record creation time

❗ Important:
The database stores only the image object key, never the full S3 or CloudFront URL.

🖼️ Media Handling Architecture (Production Standard)
User → CloudFront (MEDIA_BASE_URL) → S3 Bucket


Images are uploaded to private S3

CloudFront acts as the only public access point

URLs are generated dynamically using configuration

Example:

imageUrl = `${MEDIA_BASE_URL}/${profile_image_key}`


Changing infrastructure does not require database updates.

🔐 Environment Variables

Create a .env file (not committed to GitHub):

DATABASE_URL=your_neon_db_url
JWT_SECRET=your_secure_jwt_secret
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_bucket_name
MEDIA_BASE_URL=https://your-cloudfront-url


For deployment, add the same variables in Vercel → Environment Variables.

🛠️ Backend API Endpoints
Authentication

POST /api/auth/register

POST /api/auth/login

User

GET /api/user/me (protected)

POST /api/user/upload-profile (protected)

📷 Image Upload Rules

Allowed formats: JPG, JPEG, PNG

User may upload images of any size (20KB, 500KB, 1MB)

Backend compresses images using Sharp

Local Development Setup
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev


Ensure backend is running before starting frontend.

☁️ Deployment
Backend

Deploy to Vercel

Add environment variables

Ensure vercel.json is present

Frontend

Deploy to Vercel

Set:

VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_MEDIA_BASE_URL=https://your-cloudfront-url

✅ Final Validation Checklist

User can register & login

JWT persists across refresh

Profile image uploads successfully

Image stored in S3 and served via CloudFront

Database stores only profile_image_key

MEDIA_BASE_URL change does not affect DB
Final stored image must be < 10KB

Requests exceeding this limit are rejected

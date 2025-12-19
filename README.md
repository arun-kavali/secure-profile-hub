Full Stack User Profile Application

This project is a production ready full stack application that allows users to register, log in, and upload a profile image. The images are securely stored in AWS S3 and delivered using CloudFront following industry standard media handling practices.

Technology Stack

Frontend
React.js
Styled Components
Axios
React Router
JWT based authentication

Backend
Node.js
Express.js
PostgreSQL using NeonTech
JWT Authentication
bcrypt for password hashing
multer for file uploads
sharp for image compression

Cloud and Infrastructure
AWS S3 for image storage
AWS CloudFront for CDN
Vercel for frontend and backend deployment
NeonTech for PostgreSQL database

Key Features

User registration and login
JWT based authentication
Protected API routes
Profile image upload
Image compression under 10KB
Secure media delivery via CloudFront
Environment based configuration

Database Schema

Users Table

id Primary key
name User name
email Unique email address
password Hashed password
profile_image_key S3 object key only
created_at Record creation timestamp

The database stores only the image object key. Full S3 or CloudFront URLs are never stored.

Media Handling Architecture

User requests media through CloudFront which fetches content from a private S3 bucket. Image URLs are generated dynamically using a configurable base URL. This allows infrastructure changes without database updates.

Example dynamic URL generation uses MEDIA_BASE_URL combined with the stored object key.

Environment Variables

Create a .env file locally and add the following variables. These values should not be committed to GitHub.

DATABASE_URL NeonTech database connection URL
JWT_SECRET Secret key used for JWT signing
AWS_ACCESS_KEY_ID AWS access key
AWS_SECRET_ACCESS_KEY AWS secret key
AWS_REGION AWS region
AWS_BUCKET_NAME S3 bucket name
MEDIA_BASE_URL CloudFront distribution URL

The same variables must be configured in Vercel for deployment.

Backend API Endpoints

POST /api/auth/register Register a new user
POST /api/auth/login Authenticate user
GET /api/user/me Fetch logged in user details
POST /api/user/upload-profile Upload profile image

Protected routes require a valid JWT token.

Image Upload Rules

Only JPG JPEG and PNG formats are allowed
Users can upload images of any size
Backend compresses images using sharp
Final stored image size must be under 10KB
Requests exceeding the size limit are rejected

Local Development Setup

Backend Setup
Navigate to backend directory
Install dependencies
Start development server

Frontend Setup
Navigate to frontend directory
Install dependencies
Start development server

Ensure backend is running before starting frontend.

Deployment Process

Backend is deployed on Vercel with required environment variables configured.
Frontend is deployed on Vercel with API and media base URLs set.
PostgreSQL database is hosted on NeonTech.
AWS S3 and CloudFront are used for media storage and delivery.

Final Validation Checklist

User registration works correctly
Login and authentication persist across refresh
Profile image upload works
Images are stored in S3 and served via CloudFront
Database stores only object keys
Changing MEDIA_BASE_URL does not affect database records

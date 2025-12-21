require('dotenv').config();

// Core required variables (always needed)
const coreRequiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'MEDIA_BASE_URL'
];

// AWS variables (optional - only required if using S3 storage)
const awsVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_BUCKET_NAME'
];

// Validate core required environment variables
const missingCoreVars = coreRequiredVars.filter(varName => !process.env[varName]);
if (missingCoreVars.length > 0) {
  console.error(`Missing required environment variables: ${missingCoreVars.join(', ')}`);
  process.exit(1);
}

// Check if AWS is configured (all AWS vars must be present to use S3)
const hasAllAwsVars = awsVars.every(varName => !!process.env[varName]);
if (!hasAllAwsVars) {
  const missingAwsVars = awsVars.filter(varName => !process.env[varName]);
  if (missingAwsVars.length > 0 && missingAwsVars.length < awsVars.length) {
    console.warn(`Partial AWS configuration detected. Missing: ${missingAwsVars.join(', ')}`);
    console.warn('AWS S3 storage will be disabled. Using local storage instead.');
  } else {
    console.log('AWS not configured. Using local file storage.');
  }
}

module.exports = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  // AWS config (optional)
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || null,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || null,
  AWS_REGION: process.env.AWS_REGION || null,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || null,
  // Media URL (required)
  MEDIA_BASE_URL: process.env.MEDIA_BASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

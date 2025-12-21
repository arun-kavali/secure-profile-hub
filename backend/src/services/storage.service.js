const fs = require('fs').promises;
const path = require('path');
const env = require('../config/env');

// Check if AWS is configured
const isAwsConfigured = () => {
  return !!(
    env.AWS_ACCESS_KEY_ID &&
    env.AWS_SECRET_ACCESS_KEY &&
    env.AWS_BUCKET_NAME &&
    env.AWS_REGION
  );
};

// Lazy load S3 dependencies only when needed
let s3Service = null;
const getS3Service = () => {
  if (!s3Service && isAwsConfigured()) {
    s3Service = require('./s3.service');
  }
  return s3Service;
};

// Local uploads directory
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

/**
 * Ensure uploads directory exists
 */
const ensureUploadsDir = async () => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
};

/**
 * Upload file to storage (S3 or local)
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} key - Object key / filename
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} - Object key
 */
const uploadFile = async (fileBuffer, key, contentType = 'image/jpeg') => {
  if (isAwsConfigured()) {
    const s3 = getS3Service();
    return s3.uploadToS3(fileBuffer, key, contentType);
  }

  // Local storage fallback
  await ensureUploadsDir();
  
  // Create subdirectories if key contains path (e.g., 'pp/username-123.jpg')
  const filePath = path.join(UPLOADS_DIR, key);
  const fileDir = path.dirname(filePath);
  
  try {
    await fs.access(fileDir);
  } catch {
    await fs.mkdir(fileDir, { recursive: true });
  }
  
  await fs.writeFile(filePath, fileBuffer);
  return key;
};

/**
 * Delete file from storage (S3 or local)
 * @param {string} key - Object key / filename to delete
 * @returns {Promise<void>}
 */
const deleteFile = async (key) => {
  if (!key) return;

  if (isAwsConfigured()) {
    const s3 = getS3Service();
    return s3.deleteFromS3(key);
  }

  // Local storage fallback
  const filePath = path.join(UPLOADS_DIR, key);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // File might not exist, that's okay
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

/**
 * Generate full media URL from object key
 * @param {string} objectKey - Object key / filename
 * @returns {string|null} - Full URL or null
 */
const getMediaUrl = (objectKey) => {
  if (!objectKey) return null;
  return `${env.MEDIA_BASE_URL}/${objectKey}`;
};

/**
 * Generate unique object key for profile image
 * @param {string} username - Username for the key
 * @returns {string} - Unique object key
 */
const generateProfileImageKey = (username) => {
  const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `pp/${sanitizedUsername}-${randomSuffix}.jpg`;
};

/**
 * Get current storage mode
 * @returns {string} - 'aws' or 'local'
 */
const getStorageMode = () => {
  return isAwsConfigured() ? 'aws' : 'local';
};

module.exports = {
  uploadFile,
  deleteFile,
  getMediaUrl,
  generateProfileImageKey,
  getStorageMode,
  isAwsConfigured
};

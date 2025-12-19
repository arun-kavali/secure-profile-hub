const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/aws');
const env = require('../config/env');

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} key - S3 object key
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} - Object key
 */
const uploadToS3 = async (fileBuffer, key, contentType = 'image/jpeg') => {
  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    CacheControl: 'max-age=31536000' // 1 year cache
  });

  await s3Client.send(command);
  return key;
};

/**
 * Delete file from S3
 * @param {string} key - S3 object key to delete
 * @returns {Promise<void>}
 */
const deleteFromS3 = async (key) => {
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key
  });

  await s3Client.send(command);
};

/**
 * Generate full media URL from object key
 * @param {string} objectKey - S3 object key
 * @returns {string|null} - Full CDN URL or null
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

module.exports = {
  uploadToS3,
  deleteFromS3,
  getMediaUrl,
  generateProfileImageKey
};

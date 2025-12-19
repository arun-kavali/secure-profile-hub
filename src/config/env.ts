// Environment configuration
// In production, these should be set via environment variables

export const config = {
  // API base URL for your Node.js backend
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  // Media base URL for CloudFront CDN
  // IMPORTANT: This is dynamically used to construct image URLs
  // Database stores ONLY the object key (e.g., "pp/username-6658.jpg")
  // Full URL is generated as: `${MEDIA_BASE_URL}/${profile_image_key}`
  MEDIA_BASE_URL: import.meta.env.VITE_MEDIA_BASE_URL || 'https://media.example.com',
};

/**
 * Constructs a full media URL from an object key
 * @param objectKey - The S3 object key stored in database (e.g., "pp/username-6658.jpg")
 * @returns Full CDN URL or null if no key provided
 */
export const getMediaUrl = (objectKey: string | null | undefined): string | null => {
  if (!objectKey) return null;
  return `${config.MEDIA_BASE_URL}/${objectKey}`;
};

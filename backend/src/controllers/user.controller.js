const db = require('../config/db');
const { compressImage } = require('../services/image.service');
const { uploadToS3, deleteFromS3, getMediaUrl, generateProfileImageKey } = require('../services/s3.service');

/**
 * Get current user profile
 */
const getMe = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, profile_image_key, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_image_key: user.profile_image_key,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

/**
 * Upload profile image
 */
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    // Get current user to retrieve name and old image key
    const userResult = await db.query(
      'SELECT name, profile_image_key FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = userResult.rows[0];
    const oldImageKey = user.profile_image_key;

    // Compress image
    let compressedBuffer;
    try {
      compressedBuffer = await compressImage(req.file.buffer);
    } catch (compressionError) {
      return res.status(400).json({ 
        error: compressionError.message || 'Failed to compress image to required size.' 
      });
    }

    // Generate unique key and upload to S3
    const newImageKey = generateProfileImageKey(user.name);
    await uploadToS3(compressedBuffer, newImageKey, 'image/jpeg');

    // Update database with new key
    await db.query(
      'UPDATE users SET profile_image_key = $1 WHERE id = $2',
      [newImageKey, req.userId]
    );

    // Delete old image from S3 if exists
    if (oldImageKey) {
      try {
        await deleteFromS3(oldImageKey);
      } catch (deleteError) {
        console.error('Failed to delete old image:', deleteError);
        // Non-critical error, continue
      }
    }

    res.json({
      message: 'Profile image uploaded successfully.',
      profile_image_key: newImageKey
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ error: 'Failed to upload profile image.' });
  }
};

module.exports = {
  getMe,
  uploadProfileImage
};

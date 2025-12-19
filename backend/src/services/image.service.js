const sharp = require('sharp');

const MAX_FILE_SIZE = 10 * 1024; // 10KB max final size

/**
 * Compress and resize image to under 10KB
 * @param {Buffer} imageBuffer - Original image buffer
 * @returns {Promise<Buffer>} - Compressed image buffer
 */
const compressImage = async (imageBuffer) => {
  let quality = 80;
  let width = 200;
  let compressedBuffer;

  // Progressive compression until under 10KB
  while (quality >= 10) {
    compressedBuffer = await sharp(imageBuffer)
      .resize(width, width, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality, progressive: true })
      .toBuffer();

    if (compressedBuffer.length <= MAX_FILE_SIZE) {
      return compressedBuffer;
    }

    // Reduce quality and size progressively
    quality -= 10;
    if (quality < 30 && width > 100) {
      width = 100;
      quality = 60;
    }
  }

  // Final attempt with minimum settings
  compressedBuffer = await sharp(imageBuffer)
    .resize(80, 80, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 10, progressive: true })
    .toBuffer();

  if (compressedBuffer.length > MAX_FILE_SIZE) {
    throw new Error(`Unable to compress image below ${MAX_FILE_SIZE / 1024}KB. Final size: ${(compressedBuffer.length / 1024).toFixed(2)}KB`);
  }

  return compressedBuffer;
};

/**
 * Get image metadata
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<Object>} - Image metadata
 */
const getImageMetadata = async (imageBuffer) => {
  return sharp(imageBuffer).metadata();
};

module.exports = {
  compressImage,
  getImageMetadata,
  MAX_FILE_SIZE
};

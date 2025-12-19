const express = require('express');
const { getMe, uploadProfileImage } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

const router = express.Router();

// GET /api/user/me (protected)
router.get('/me', authMiddleware, getMe);

// POST /api/user/upload-profile (protected)
router.post('/upload-profile', authMiddleware, upload.single('profileImage'), uploadProfileImage);

module.exports = router;

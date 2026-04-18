const express = require('express');
const multer = require('multer');
const {
  register,
  login,
  me,
  updateProfile,
  changePassword,
  uploadAvatar,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadAvatar: avatarMulter } = require('../middleware/avatarUpload');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.patch('/profile', authMiddleware, updateProfile);
router.patch('/password', authMiddleware, changePassword);

/** Multer wrapper so file size / filter errors return JSON */
router.post(
  '/avatar',
  authMiddleware,
  (req, res, next) => {
    avatarMulter.single('avatar')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Image must be 2 MB or smaller.' });
        }
        return res.status(400).json({ message: err.message });
      }
      if (err) return res.status(400).json({ message: err.message || 'Invalid file.' });
      next();
    });
  },
  uploadAvatar
);

module.exports = router;

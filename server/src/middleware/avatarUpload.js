const path = require('path');
const fs = require('fs');
const multer = require('multer');

const avatarDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, avatarDir);
  },
  filename(_req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `avatar-${unique}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const ok = /^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype);
  if (ok) cb(null, true);
  else cb(new Error('Only JPEG, PNG, GIF, or WebP images are allowed.'));
}

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

module.exports = { uploadAvatar, avatarDir };

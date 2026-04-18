const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getProgress, updateProgress } = require('../controllers/progressController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProgress);
router.patch('/', updateProgress);

module.exports = router;

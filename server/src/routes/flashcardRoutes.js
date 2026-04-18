const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  generate,
  listFlashcards,
  updateDifficulty,
  removeFlashcard,
  getDueFlashcards,
  reviewFlashcard,
  exportFlashcards,
} = require('../controllers/flashcardController');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', generate);
router.get('/', listFlashcards);
router.get('/due', getDueFlashcards);
router.get('/export', exportFlashcards);
router.patch('/:id/difficulty', updateDifficulty);
router.post('/:id/review', reviewFlashcard);
router.delete('/:id', removeFlashcard);

module.exports = router;

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { create, list, update, remove } = require('../controllers/studyPlanController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/', list);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;

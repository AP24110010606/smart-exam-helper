const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload');
const {
  createMaterial,
  listMaterials,
  getMaterial,
  deleteMaterial,
} = require('../controllers/materialController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', upload.single('file'), createMaterial);
router.get('/', listMaterials);
router.get('/:id', getMaterial);
router.delete('/:id', deleteMaterial);

module.exports = router;

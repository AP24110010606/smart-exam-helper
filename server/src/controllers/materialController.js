const path = require('path');
const Material = require('../models/Material');

/**
 * POST /api/materials — multipart: subject, title, file (optional)
 */
async function createMaterial(req, res) {
  try {
    const { subject, title } = req.body;
    if (!subject || !title) {
      return res.status(400).json({ message: 'Subject and title are required.' });
    }
    let fileUrl = '';
    let originalName = '';
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      originalName = req.file.originalname;
    }
    const material = await Material.create({
      userId: req.user._id,
      subject,
      title,
      fileUrl,
      originalName,
    });
    res.status(201).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save material.' });
  }
}

async function listMaterials(req, res) {
  const list = await Material.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
}

async function getMaterial(req, res) {
  const m = await Material.findOne({ _id: req.params.id, userId: req.user._id });
  if (!m) return res.status(404).json({ message: 'Material not found.' });
  res.json(m);
}

async function deleteMaterial(req, res) {
  const m = await Material.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!m) return res.status(404).json({ message: 'Material not found.' });
  res.json({ message: 'Deleted.' });
}

module.exports = { createMaterial, listMaterials, getMaterial, deleteMaterial };

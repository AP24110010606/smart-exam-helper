const path = require('path');
const Material = require('../models/Material');
const Flashcard = require('../models/Flashcard');
const { parseTextToPairs, extractTextFromFile } = require('../utils/parseFlashcards');
const { generateFlashcardsWithAI } = require('../utils/aiFlashcardGenerator');
const { uploadDir } = require('../middleware/upload');

async function generateFlashcardsFromMaterial(material, userId) {
  if (!material.fileUrl) return { count: 0, flashcards: [] };
  const diskPath = path.join(uploadDir, path.basename(material.fileUrl));
  const fileContent = await extractTextFromFile(diskPath);
  let pairs = [];

  if (fileContent) {
    // Try AI generation first
    console.log('Auto-generating flashcards with AI for uploaded material...');
    const aiPairs = await generateFlashcardsWithAI(fileContent, 10);
    if (aiPairs && aiPairs.length > 0) {
      pairs = aiPairs;
      console.log(`AI auto-generated ${pairs.length} flashcards from uploaded material.`);
    } else {
      // Fallback to rule-based parsing
      pairs = parseTextToPairs(fileContent);
    }
  }

  if (pairs.length === 0) {
    const fallbackQuestion = `Material: ${material.title}`;
    const fallbackAnswer = material.originalName || material.subject || 'Uploaded material content could not be extracted.';
    pairs = [{ question: fallbackQuestion, answer: fallbackAnswer }];
  }

  const docs = pairs.map((p) => ({
    userId,
    materialId: material._id,
    question: p.question,
    answer: p.answer,
    difficulty: 'unrated',
  }));
  const created = await Flashcard.insertMany(docs);
  return { count: created.length, flashcards: created };
}

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

    let generated = { count: 0, flashcards: [] };
    if (material.fileUrl) {
      generated = await generateFlashcardsFromMaterial(material, req.user._id);
    }

    res.status(201).json({ material, generated });
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

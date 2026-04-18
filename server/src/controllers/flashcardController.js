const path = require('path');
const Material = require('../models/Material');
const Flashcard = require('../models/Flashcard');
const { parseTextToPairs, readTextFileSafe } = require('../utils/parseFlashcards');
const { uploadDir } = require('../middleware/upload');

/**
 * POST /api/flashcards/generate
 * Body: { text?: string, materialId?: string }
 */
async function generate(req, res) {
  try {
    const { text, materialId } = req.body;
    let sourceText = (text || '').trim();
    let material = null;

    if (materialId) {
      material = await Material.findOne({ _id: materialId, userId: req.user._id });
      if (!material) {
        return res.status(404).json({ message: 'Material not found.' });
      }
      if (material.fileUrl) {
        const diskPath = path.join(uploadDir, path.basename(material.fileUrl));
        const fileContent = readTextFileSafe(diskPath);
        if (fileContent) sourceText = sourceText || fileContent;
      }
    }

    if (!sourceText) {
      return res.status(400).json({
        message:
          'No text to parse. Paste study text or upload a .txt material, or provide text in the body.',
      });
    }

    const pairs = parseTextToPairs(sourceText);
    if (pairs.length === 0) {
      return res.status(400).json({
        message:
          'Could not create flashcards. Use paragraphs (first line = question) or Q:/A: pairs.',
      });
    }

    const docs = pairs.map((p) => ({
      userId: req.user._id,
      materialId: material ? material._id : null,
      question: p.question,
      answer: p.answer,
      difficulty: 'unrated',
    }));
    const created = await Flashcard.insertMany(docs);
    res.status(201).json({ count: created.length, flashcards: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Generation failed.' });
  }
}

async function listFlashcards(req, res) {
  const filter = { userId: req.user._id };
  if (req.query.materialId) filter.materialId = req.query.materialId;
  const list = await Flashcard.find(filter).sort({ createdAt: -1 });
  res.json(list);
}

async function updateDifficulty(req, res) {
  const { difficulty } = req.body;
  const allowed = ['unrated', 'easy', 'medium', 'hard'];
  if (!allowed.includes(difficulty)) {
    return res.status(400).json({ message: 'Invalid difficulty.' });
  }
  const card = await Flashcard.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { difficulty },
    { new: true }
  );
  if (!card) return res.status(404).json({ message: 'Flashcard not found.' });
  res.json(card);
}

async function removeFlashcard(req, res) {
  const card = await Flashcard.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!card) return res.status(404).json({ message: 'Flashcard not found.' });
  res.json({ message: 'Deleted.' });
}

/**
 * GET /api/flashcards/due
 * Get flashcards due for review
 */
async function getDueFlashcards(req, res) {
  try {
    const now = new Date();
    const dueCards = await Flashcard.find({
      userId: req.user._id,
      nextReviewDate: { $lte: now }
    }).sort({ nextReviewDate: 1 });
    res.json(dueCards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch due flashcards.' });
  }
}

/**
 * POST /api/flashcards/:id/review
 * Body: { quality: number } // 0-5 (SM-2: 0=wrong, 1=hard, 2=good, 3=good, 4=easy, 5=perfect)
 */
async function reviewFlashcard(req, res) {
  try {
    const { quality } = req.body;
    if (quality < 0 || quality > 5) {
      return res.status(400).json({ message: 'Quality must be between 0 and 5.' });
    }

    const card = await Flashcard.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) return res.status(404).json({ message: 'Flashcard not found.' });

    let { easeFactor, interval, repetitions } = card;

    if (quality >= 3) {
      // Correct response
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      // Incorrect response
      repetitions = 0;
      interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    const updatedCard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        easeFactor,
        interval,
        repetitions,
        nextReviewDate,
        lastReviewed: new Date()
      },
      { new: true }
    );

    res.json(updatedCard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Review failed.' });
  }
}

/**
 * GET /api/flashcards/export
 * Export flashcards as CSV
 */
async function exportFlashcards(req, res) {
  try {
    const flashcards = await Flashcard.find({ userId: req.user._id }).populate('materialId', 'title');
    const csv = [
      'Question,Answer,Difficulty,Material',
      ...flashcards.map(card => 
        `"${card.question.replace(/"/g, '""')}","${card.answer.replace(/"/g, '""')}","${card.difficulty}","${card.materialId ? card.materialId.title : ''}"`
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="flashcards.csv"');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Export failed.' });
  }
}

module.exports = { generate, listFlashcards, updateDifficulty, removeFlashcard, getDueFlashcards, reviewFlashcard, exportFlashcards };

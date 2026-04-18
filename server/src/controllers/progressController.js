const Progress = require('../models/Progress');

/** Ensure a progress document exists for the user */
async function getOrCreate(userId) {
  let doc = await Progress.findOne({ userId });
  if (!doc) {
    doc = await Progress.create({ userId, completedTopics: [], pendingTopics: [] });
  }
  return doc;
}

async function getProgress(req, res) {
  try {
    const doc = await getOrCreate(req.user._id);
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load progress.' });
  }
}

/**
 * PATCH /api/progress
 * Body: { completedTopics?: string[], pendingTopics?: string[] }
 * Replaces arrays when provided (MVP simplicity).
 */
async function updateProgress(req, res) {
  try {
    const { completedTopics, pendingTopics } = req.body;
    const doc = await getOrCreate(req.user._id);
    if (Array.isArray(completedTopics)) doc.completedTopics = completedTopics.map(String);
    if (Array.isArray(pendingTopics)) doc.pendingTopics = pendingTopics.map(String);
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update progress.' });
  }
}

module.exports = { getProgress, updateProgress };

const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', default: null },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    mediaUrl: { type: String, default: null }, // For images/audio/video
    mediaType: { type: String, enum: ['image', 'audio', 'video', null], default: null },
    difficulty: {
      type: String,
      enum: ['unrated', 'easy', 'medium', 'hard'],
      default: 'unrated',
    },
    // Spaced repetition fields
    easeFactor: { type: Number, default: 2.5 }, // SM-2 algorithm
    interval: { type: Number, default: 1 }, // Days
    repetitions: { type: Number, default: 0 },
    nextReviewDate: { type: Date, default: Date.now },
    lastReviewed: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flashcard', flashcardSchema);

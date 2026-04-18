const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    completedTopics: [{ type: String, trim: true }],
    pendingTopics: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);

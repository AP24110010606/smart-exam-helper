const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    examDate: { type: Date, required: true },
    dailyStudyHours: { type: Number, required: true, min: 0.5, max: 24 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyPlan', studyPlanSchema);

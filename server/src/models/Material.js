const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, default: '' },
    originalName: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);

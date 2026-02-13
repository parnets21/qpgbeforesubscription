const mongoose = require('mongoose');

const assessmentTypeSchema = new mongoose.Schema({
  assessmentName: {
    type: String,
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  termId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Term',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create unique index to ensure unique assessment names per user per class per term
assessmentTypeSchema.index({ userId: 1, classId: 1, termId: 1, assessmentName: 1 }, { unique: true });

module.exports = mongoose.model('AssessmentType', assessmentTypeSchema);

const mongoose = require('mongoose');

const resultCalculationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  // Which terms to include in final result
  selectedTerms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Term'
  }],
  // Weightage for each term (percentage)
  termWeightages: {
    type: mongoose.Schema.Types.Mixed, // { termId: percentage }
    default: {}
  },
  // Which examinations to include for each term
  selectedExaminations: {
    type: mongoose.Schema.Types.Mixed, // { termId: [examId1, examId2, ...] }
    default: {}
  },
  // Weightage for each examination within a term (percentage)
  examinationWeightages: {
    type: mongoose.Schema.Types.Mixed, // { termId: { examId: percentage } }
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
resultCalculationSettingsSchema.index({ userId: 1, classId: 1 });

module.exports = mongoose.model('ResultCalculationSettings', resultCalculationSettingsSchema);

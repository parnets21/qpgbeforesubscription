const mongoose = require('mongoose');

const gradingSettingsSchema = new mongoose.Schema({
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
  termId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Term',
    required: true
  },
  examinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentType',
    required: true
  },
  // Array of subject IDs - can be one or multiple subjects
  subjectIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  }],
  grades: [{
    grade: {
      type: String,
      required: true
    },
    minMarks: {
      type: Number,
      required: true,
      min: 0
    },
    maxMarks: {
      type: Number,
      required: true,
      min: 0
    },
    color: {
      type: String,
      default: 'secondary'
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries - unique per user, class, term, examination, and subject combination
gradingSettingsSchema.index({ userId: 1, classId: 1, termId: 1, examinationId: 1 });

module.exports = mongoose.model('GradingSettings', gradingSettingsSchema);

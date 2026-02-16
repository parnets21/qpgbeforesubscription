const mongoose = require('mongoose');

const studentMarksSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
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
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  marks: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for unique constraint and faster queries
studentMarksSchema.index({ 
  userId: 1, 
  studentId: 1, 
  classId: 1, 
  termId: 1, 
  examinationId: 1, 
  subjectId: 1 
}, { unique: true });

module.exports = mongoose.model('StudentMarks', studentMarksSchema);

const mongoose = require('mongoose');

const lbaMarksSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LBAChapter',
    required: true
  },
  term: {
    type: String,
    required: true,
    enum: ['Term 1', 'Term 2']
  },
  subject: {
    type: String,
    required: true
  },
  oralMarks: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  writtenMarks: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    default: ''
  },
  maxOralMarks: {
    type: Number,
    required: true,
    default: 5
  },
  maxWrittenMarks: {
    type: Number,
    required: true
  },
  maxTotalMarks: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to ensure unique marks entry per student/chapter
lbaMarksSchema.index({ studentId: 1, chapterId: 1 }, { unique: true });

module.exports = mongoose.model('LBAMarks', lbaMarksSchema);

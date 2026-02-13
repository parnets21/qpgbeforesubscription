const mongoose = require('mongoose');

const lbaChapterSchema = new mongoose.Schema({
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
  term: {
    type: String,
    required: true,
    enum: ['Term 1', 'Term 2']
  },
  subject: {
    type: String,
    required: true
  },
  chapterName: {
    type: String,
    required: true
  },
  chapterNumber: {
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

// Create compound index to ensure unique chapters per subject/term/class
lbaChapterSchema.index({ classId: 1, term: 1, subject: 1, chapterNumber: 1 }, { unique: true });

module.exports = mongoose.model('LBAChapter', lbaChapterSchema);

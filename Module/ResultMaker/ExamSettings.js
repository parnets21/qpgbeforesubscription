const mongoose = require('mongoose');

const examSettingsSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  
  // Calculation Method
  calculationMethod: {
    type: String,
    enum: ['averageAll', 'bestOfAll', 'averageBest2'],
    default: 'averageAll'
  },
  
  // Main Subjects
  mainSubjects: {
    totalSubjects: { type: Number, default: 0, min: 0, max: 12 },
    subjects: [{ type: String }]
  },
  
  // Additional Subjects
  additionalSubjects: {
    totalSubjects: { type: Number, default: 0, min: 0, max: 8 },
    subjects: [{
      name: { type: String },
      maxMarks: { type: Number }
    }]
  },
  
  // Dynamic Term Settings (new structure)
  // Stores max marks for each assessment type per term
  // Structure: { termId: { assessmentTypeId: maxMarks } }
  termSettings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Dynamic Subject Max Marks (new structure)
  // Stores max marks for each subject
  // Structure: { subjectId: maxMarks }
  subjectMaxMarks: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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

// Create unique index for classId
examSettingsSchema.index({ classId: 1 }, { unique: true });

module.exports = mongoose.model('ExamSettings', examSettingsSchema);

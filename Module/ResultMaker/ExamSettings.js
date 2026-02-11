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
  
  // MA / Multiple Assessment
  maAssessment: {
    enabled: { type: Boolean, default: false },
    marks: { type: Number, default: 5 }
  },
  
  // Notebook Submission
  notebookSubmission: {
    enabled: { type: Boolean, default: false },
    marks: { type: Number, default: 5 }
  },
  
  // Subject Enrichment / Project
  subjectEnrichment: {
    enabled: { type: Boolean, default: false },
    marks: { type: Number, default: 5 }
  },
  
  // PA Weightage
  paWeightage: {
    enabled: { type: Boolean, default: false },
    marks: { type: Number, default: 10 }
  },
  
  // Term 1 - FA/SA Settings
  term1: {
    termId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Term',
      default: null
    },
    termName: { type: String, default: 'Term 1' },
    numberOfPAs: { type: Number, default: 1, min: 1, max: 3 },
    fa1MaxMarks: { type: Number, default: 0 },
    fa2MaxMarks: { type: Number, default: 0 },
    sa1MaxMarks: { type: Number, default: 0 },
    // Assessment types for Term 1
    maAssessment: {
      enabled: { type: Boolean, default: false },
      marks: { type: Number, default: 5 }
    },
    notebookSubmission: {
      enabled: { type: Boolean, default: false },
      marks: { type: Number, default: 5 }
    },
    subjectEnrichment: {
      enabled: { type: Boolean, default: false },
      marks: { type: Number, default: 5 }
    },
    paWeightage: {
      enabled: { type: Boolean, default: false },
      marks: { type: Number, default: 10 }
    }
  },
  
  // Term 2 - FA/SA Settings
  term2: {
    termId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Term',
      default: null
    },
    termName: { type: String, default: 'Term 2' },
    numberOfPAs: { type: Number, default: 1, min: 1, max: 3 },
    fa3MaxMarks: { type: Number, default: 0 },
    fa4MaxMarks: { type: Number, default: 0 },
    sa2MaxMarks: { type: Number, default: 0 },
    // Assessment types for Term 2
    maAssessment: {
      enabled: { type: Boolean, default: false },
      marks: { type: Number, default: 5 }
    },
    notebookSubmission: {
      enabled: { type: Boolean, default: false },
      marks: { type: Number, default: 5 }
    },
    subjectEnrichment: {
      enabled: { type: Boolean, default: false },
      marks: { type: Number, default: 5 }
    },
    paWeightage: {
      enabled: { type: Boolean, default: false },
      marks: { type: Number, default: 10 }
    }
  },
  
  // Calculation Method
  calculationMethod: {
    type: String,
    enum: ['averageAll', 'bestOfAll', 'averageBest2'],
    default: 'averageAll'
  },
  
  // Co-Scholastic Settings
  coScholastic: {
    numberOfAreas: { type: Number, default: 0, min: 0, max: 5 },
    areas: [{ type: String }],
    discipline: { type: Boolean, default: false },
    writtenExamMaxMarks: { type: Number, default: 0 }
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

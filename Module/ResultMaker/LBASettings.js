const mongoose = require('mongoose');

const gradeRangeSchema = new mongoose.Schema({
  minMarks: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  grade: { type: String, required: true }
}, { _id: false });

const lbaSettingsSchema = new mongoose.Schema({
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
  oralMarks: {
    type: Number,
    required: true,
    default: 5,
    min: 0
  },
  writtenMarks: {
    type: Number,
    required: true,
    default: 10,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true
  },
  gradeRanges: {
    type: [gradeRangeSchema],
    default: []
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

// Create unique index to ensure one setting per class
lbaSettingsSchema.index({ classId: 1, userId: 1 }, { unique: true });

// Calculate total and set default grades before saving
lbaSettingsSchema.pre('save', function(next) {
  this.totalMarks = this.oralMarks + this.writtenMarks;
  
  // Set default grade ranges if not provided
  if (!this.gradeRanges || this.gradeRanges.length === 0) {
    const total = this.totalMarks;
    
    if (total === 15) {
      // Default grades for 15 marks
      this.gradeRanges = [
        { minMarks: 14, maxMarks: 15, grade: 'A+' },
        { minMarks: 11, maxMarks: 13, grade: 'A' },
        { minMarks: 8, maxMarks: 10, grade: 'B+' },
        { minMarks: 7, maxMarks: 7, grade: 'B' },
        { minMarks: 0, maxMarks: 6, grade: 'C' }
      ];
    } else if (total === 20) {
      // Default grades for 20 marks
      this.gradeRanges = [
        { minMarks: 19, maxMarks: 20, grade: 'A+' },
        { minMarks: 15, maxMarks: 18, grade: 'A' },
        { minMarks: 11, maxMarks: 14, grade: 'B+' },
        { minMarks: 9, maxMarks: 10, grade: 'B' },
        { minMarks: 0, maxMarks: 8, grade: 'C' }
      ];
    } else {
      // Generic percentage-based grades for other totals
      this.gradeRanges = [
        { minMarks: Math.ceil(total * 0.90), maxMarks: total, grade: 'A+' },
        { minMarks: Math.ceil(total * 0.75), maxMarks: Math.floor(total * 0.89), grade: 'A' },
        { minMarks: Math.ceil(total * 0.60), maxMarks: Math.floor(total * 0.74), grade: 'B+' },
        { minMarks: Math.ceil(total * 0.50), maxMarks: Math.floor(total * 0.59), grade: 'B' },
        { minMarks: 0, maxMarks: Math.floor(total * 0.49), grade: 'C' }
      ];
    }
  }
  
  next();
});

// Method to calculate grade for given marks
lbaSettingsSchema.methods.calculateGrade = function(marks) {
  for (const range of this.gradeRanges) {
    if (marks >= range.minMarks && marks <= range.maxMarks) {
      return range.grade;
    }
  }
  return 'C'; // Default grade if no match
};

module.exports = mongoose.model('LBASettings', lbaSettingsSchema);

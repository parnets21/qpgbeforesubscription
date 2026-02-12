const mongoose = require('mongoose');

const admitCardSchema = new mongoose.Schema({
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
  className: {
    type: String,
    required: true
  },
  term: {
    type: String,
    required: true
  },
  assessment: {
    type: String,
    required: true
  },
  examCenter: {
    type: String,
    required: true
  },
  selectedSubjects: [{
    type: String
  }],
  examSchedule: [{
    subject: {
      type: String,
      required: true
    },
    examDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    venue: {
      type: String,
      required: true
    },
    roomNo: {
      type: String,
      required: true
    }
  }],
  selectedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdmitCard', admitCardSchema);

const ResultCalculationSettings = require('../../Module/ResultMaker/ResultCalculationSettings');
const StudentMarks = require('../../Module/ResultMaker/StudentMarks');
const Student = require('../../Module/ResultMaker/Student');
const Subject = require('../../Module/ResultMaker/Subject');

// Calculate student results
exports.calculateStudentResults = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId, studentId } = req.body;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    // Get result calculation settings
    const settings = await ResultCalculationSettings.findOne({ userId, classId });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'No result calculation settings found for this class. Please configure in Exam Settings first.'
      });
    }

    // Get students
    let students;
    if (studentId) {
      students = await Student.find({ _id: studentId, classId });
    } else {
      students = await Student.find({ classId });
    }

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No students found'
      });
    }

    // Get all subjects for this class
    const subjects = await Subject.find({ classId });

    if (subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No subjects found for this class'
      });
    }

    // Calculate results for each student
    const results = [];

    for (const student of students) {
      const studentResult = {
        studentId: student._id,
        studentName: student.studentName,
        admissionNo: student.admissionNo,
        subjectMarks: [],
        subjectNames: [],
        totalMarks: 0,
        maxMarks: 0,
        percentage: 0
      };

      // Calculate marks for each subject
      for (const subject of subjects) {
        let subjectTotal = 0;
        let subjectWeightedTotal = 0;

        // Calculate for each selected term
        for (const termId of settings.selectedTerms) {
          const termWeightage = settings.termWeightages[termId] || 0;
          const selectedExams = settings.selectedExaminations[termId] || [];
          
          let termTotal = 0;

          // Calculate for each selected examination in this term
          for (const examId of selectedExams) {
            const examWeightage = settings.examinationWeightages[termId]?.[examId] || 0;

            // Get marks for this student, term, exam, and subject
            const marksEntry = await StudentMarks.findOne({
              userId,
              studentId: student._id,
              classId,
              termId,
              examinationId: examId,
              subjectId: subject._id
            });

            const marks = marksEntry ? marksEntry.marks : 0;
            
            // Apply examination weightage
            termTotal += (marks * examWeightage / 100);
          }

          // Apply term weightage
          subjectWeightedTotal += (termTotal * termWeightage / 100);
        }

        studentResult.subjectMarks.push(subjectWeightedTotal);
        studentResult.subjectNames.push(subject.subjectName);
        studentResult.totalMarks += subjectWeightedTotal;
      }

      // Calculate percentage (assuming each subject is out of 100 after weightage)
      studentResult.maxMarks = subjects.length * 100;
      studentResult.percentage = (studentResult.totalMarks / studentResult.maxMarks) * 100;

      results.push(studentResult);
    }

    res.status(200).json({
      success: true,
      data: {
        students: results,
        subjects: subjects.map(s => s.subjectName)
      }
    });
  } catch (error) {
    console.error('Error calculating student results:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating student results',
      error: error.message
    });
  }
};

const StudentMarks = require('../../Module/ResultMaker/StudentMarks');

// Save student marks
exports.saveStudentMarks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { marks } = req.body; // Array of marks objects

    if (!marks || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Marks data is required'
      });
    }

    const savedMarks = [];
    const errors = [];

    // Process each mark entry
    for (const markEntry of marks) {
      try {
        const { studentId, classId, termId, examinationId, subjectId, marks: marksValue } = markEntry;

        // Check if marks already exist
        let existingMarks = await StudentMarks.findOne({
          userId,
          studentId,
          classId,
          termId,
          examinationId,
          subjectId
        });

        if (existingMarks) {
          // Update existing marks
          existingMarks.marks = marksValue;
          await existingMarks.save();
          savedMarks.push(existingMarks);
        } else {
          // Create new marks entry
          const newMarks = new StudentMarks({
            userId,
            studentId,
            classId,
            termId,
            examinationId,
            subjectId,
            marks: marksValue
          });
          await newMarks.save();
          savedMarks.push(newMarks);
        }
      } catch (error) {
        errors.push({
          studentId: markEntry.studentId,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Marks saved successfully. ${savedMarks.length} entries saved${errors.length > 0 ? `, ${errors.length} errors` : ''}`,
      data: {
        saved: savedMarks.length,
        errors: errors
      }
    });
  } catch (error) {
    console.error('Error saving student marks:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving student marks',
      error: error.message
    });
  }
};

// Get student marks
exports.getStudentMarks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId, termId, examinationId, subjectId, studentId } = req.query;

    const query = { userId };

    if (classId) query.classId = classId;
    if (termId) query.termId = termId;
    if (examinationId) query.examinationId = examinationId;
    if (subjectId) query.subjectId = subjectId;
    if (studentId) query.studentId = studentId;

    const marks = await StudentMarks.find(query)
      .populate('studentId')
      .populate('classId')
      .populate('termId')
      .populate('examinationId')
      .populate('subjectId');

    res.status(200).json({
      success: true,
      data: marks
    });
  } catch (error) {
    console.error('Error fetching student marks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student marks',
      error: error.message
    });
  }
};

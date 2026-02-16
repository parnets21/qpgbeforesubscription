const ExamSettings = require('../../Module/ResultMaker/ExamSettings');
const School = require('../../Module/ResultMaker/School');
const Class = require('../../Module/ResultMaker/Class');
 

// Save or Update Exam Settings
exports.saveExamSettings = async (req, res) => {
  try {
    const {
      classId,
      calculationMethod,
      mainSubjects,
      additionalSubjects,
      termSettings,
      subjectMaxMarks
    } = req.body;

    console.log('Received exam settings save request');
    console.log('Term settings received:', termSettings);
    console.log('Subject max marks received:', subjectMaxMarks);

    const userId = req.user._id;

    // Validate classId
    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    // Get school for this user
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    // Verify class belongs to this school
    const classData = await Class.findOne({ _id: classId, schoolId: school._id });
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if settings already exist for this class
    let examSettings = await ExamSettings.findOne({ classId });

    if (examSettings) {
      // Update existing settings
      if (calculationMethod !== undefined) examSettings.calculationMethod = calculationMethod;
      if (mainSubjects !== undefined) examSettings.mainSubjects = mainSubjects;
      if (additionalSubjects !== undefined) examSettings.additionalSubjects = additionalSubjects;
      if (termSettings !== undefined) examSettings.termSettings = termSettings;
      if (subjectMaxMarks !== undefined) examSettings.subjectMaxMarks = subjectMaxMarks;
      examSettings.updatedAt = Date.now();

      await examSettings.save();

      return res.status(200).json({
        success: true,
        message: 'Exam settings updated successfully',
        data: examSettings
      });
    } else {
      // Create new settings
      examSettings = new ExamSettings({
        classId,
        schoolId: school._id,
        userId,
        calculationMethod,
        mainSubjects,
        additionalSubjects,
        termSettings,
        subjectMaxMarks
      });

      await examSettings.save();

      return res.status(201).json({
        success: true,
        message: 'Exam settings created successfully',
        data: examSettings
      });
    }
  } catch (error) {
    console.error('Error saving exam settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error saving exam settings',
      error: error.message
    });
  }
};
// Get Exam Settings by Class ID
exports.getExamSettings = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user._id;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    const examSettings = await ExamSettings.findOne({ classId, userId });

    console.log('Fetched exam settings:', examSettings);

    if (!examSettings) {
      return res.status(404).json({
        success: false,
        message: 'Exam settings not found for this class'
      });
    }

    return res.status(200).json({
      success: true,
      data: examSettings
    });
  } catch (error) {
    console.error('Error fetching exam settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching exam settings',
      error: error.message
    });
  }
};
// Get All Exam Settings for User
exports.getAllExamSettings = async (req, res) => {
  try {
    const userId = req.user._id;

    const examSettings = await ExamSettings.find({ userId })
      .populate('classId', 'className section')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: examSettings
    });
  } catch (error) {
    console.error('Error fetching exam settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching exam settings',
      error: error.message
    });
  }
};
// Delete Exam Settings
exports.deleteExamSettings = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user._id;

    const examSettings = await ExamSettings.findOne({ classId, userId });

    if (!examSettings) {
      return res.status(404).json({
        success: false,
        message: 'Exam settings not found'
      });
    }

    await ExamSettings.findByIdAndDelete(examSettings._id);

    return res.status(200).json({
      success: true,
      message: 'Exam settings deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exam settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting exam settings',
      error: error.message
    });
  }
};

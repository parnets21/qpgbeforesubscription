const AssessmentType = require('../../Module/ResultMaker/AssessmentType');

// Add Assessment Type
exports.addAssessmentType = async (req, res) => {
  try {
    const { assessmentName, classId, termId } = req.body;
    const userId = req.user._id;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    if (!termId) {
      return res.status(400).json({
        success: false,
        message: 'Term ID is required'
      });
    }

    const existing = await AssessmentType.findOne({ assessmentName, classId, termId, userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Assessment type already exists for this class and term'
      });
    }

    const newAssessment = new AssessmentType({ assessmentName, classId, termId, userId });
    await newAssessment.save();

    return res.status(201).json({
      success: true,
      message: 'Assessment type added successfully',
      data: newAssessment
    });
  } catch (error) {
    console.error('Error adding assessment type:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding assessment type',
      error: error.message
    });
  }
};

// Get All Assessment Types (filter by classId and termId)
exports.getAllAssessmentTypes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId, termId } = req.query;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    if (!termId) {
      return res.status(400).json({
        success: false,
        message: 'Term ID is required'
      });
    }

    console.log('Fetching assessment types for userId:', userId, 'classId:', classId, 'termId:', termId);

    const assessmentTypes = await AssessmentType.find({ userId, classId, termId })
      .populate('classId')
      .populate('termId')
      .sort({ createdAt: 1 });

    console.log('Found assessment types:', assessmentTypes.length);

    return res.status(200).json({
      success: true,
      data: assessmentTypes
    });
  } catch (error) {
    console.error('Error fetching assessment types:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching assessment types',
      error: error.message
    });
  }
};

// Delete Assessment Type
exports.deleteAssessmentType = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userId = req.user._id;

    const assessment = await AssessmentType.findOne({ _id: assessmentId, userId });
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment type not found'
      });
    }

    await AssessmentType.findByIdAndDelete(assessmentId);

    return res.status(200).json({
      success: true,
      message: 'Assessment type deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assessment type:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting assessment type',
      error: error.message
    });
  }
};

// Update Assessment Type
exports.updateAssessmentType = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { assessmentName } = req.body;
    const userId = req.user._id;

    const assessment = await AssessmentType.findOne({ _id: assessmentId, userId });
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment type not found'
      });
    }

    // Check for duplicates if name is being changed
    if (assessmentName && assessmentName !== assessment.assessmentName) {
      const existingAssessment = await AssessmentType.findOne({
        userId,
        classId: assessment.classId,
        termId: assessment.termId,
        assessmentName: assessmentName.trim(),
        _id: { $ne: assessmentId }
      });
      if (existingAssessment) {
        return res.status(400).json({
          success: false,
          message: 'Assessment type with this name already exists for this class and term'
        });
      }
      assessment.assessmentName = assessmentName.trim();
    }

    await assessment.save();

    return res.status(200).json({
      success: true,
      message: 'Assessment type updated successfully',
      data: assessment
    });
  } catch (error) {
    console.error('Error updating assessment type:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating assessment type',
      error: error.message
    });
  }
};

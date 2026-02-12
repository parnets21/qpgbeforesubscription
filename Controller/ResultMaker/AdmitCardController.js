const AdmitCard = require('../../Module/ResultMaker/AdmitCard');
const Student = require('../../Module/ResultMaker/Student');
const School = require('../../Module/ResultMaker/School');

// Save Admit Card
exports.saveAdmitCard = async (req, res) => {
  try {
    const {
      classId,
      className,
      term,
      assessment,
      examCenter,
      selectedSubjects,
      examSchedule,
      selectedStudents
    } = req.body;

    const userId = req.user._id;

    // Get school ID
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found. Please create school profile first.'
      });
    }

    // Create new admit card
    const admitCard = new AdmitCard({
      userId,
      schoolId: school._id,
      classId,
      className,
      term,
      assessment,
      examCenter,
      selectedSubjects,
      examSchedule,
      selectedStudents
    });

    await admitCard.save();

    // Populate student details
    const populatedAdmitCard = await AdmitCard.findById(admitCard._id)
      .populate('selectedStudents', 'studentName admissionNo');

    return res.status(201).json({
      success: true,
      message: 'Admit card saved successfully',
      data: populatedAdmitCard
    });
  } catch (error) {
    console.error('Error saving admit card:', error);
    return res.status(500).json({
      success: false,
      message: 'Error saving admit card',
      error: error.message
    });
  }
};

// Get All Admit Cards
exports.getAllAdmitCards = async (req, res) => {
  try {
    const userId = req.user._id;

    const admitCards = await AdmitCard.find({ userId })
      .populate('selectedStudents', 'studentName admissionNo')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: admitCards
    });
  } catch (error) {
    console.error('Error fetching admit cards:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching admit cards',
      error: error.message
    });
  }
};

// Get Admit Card by ID
exports.getAdmitCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const admitCard = await AdmitCard.findOne({ _id: id, userId })
      .populate('selectedStudents', 'studentName admissionNo');

    if (!admitCard) {
      return res.status(404).json({
        success: false,
        message: 'Admit card not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: admitCard
    });
  } catch (error) {
    console.error('Error fetching admit card:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching admit card',
      error: error.message
    });
  }
};

// Update Admit Card
exports.updateAdmitCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const admitCard = await AdmitCard.findOneAndUpdate(
      { _id: id, userId },
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    ).populate('selectedStudents', 'studentName admissionNo');

    if (!admitCard) {
      return res.status(404).json({
        success: false,
        message: 'Admit card not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admit card updated successfully',
      data: admitCard
    });
  } catch (error) {
    console.error('Error updating admit card:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating admit card',
      error: error.message
    });
  }
};

// Delete Admit Card
exports.deleteAdmitCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const admitCard = await AdmitCard.findOneAndDelete({ _id: id, userId });

    if (!admitCard) {
      return res.status(404).json({
        success: false,
        message: 'Admit card not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admit card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admit card:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting admit card',
      error: error.message
    });
  }
};

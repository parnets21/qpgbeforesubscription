const Term = require('../../Module/ResultMaker/Term');
const School = require('../../Module/ResultMaker/School');

// Add Term
exports.addTerm = async (req, res) => {
  try {
    const { termName, classId } = req.body;
    const userId = req.user._id;

    if (!termName || !termName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Term name is required'
      });
    }

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    // Get school ID
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    // Check if term already exists for this class
    const existingTerm = await Term.findOne({ 
      userId, 
      classId,
      termName: termName.trim()
    });

    if (existingTerm) {
      return res.status(400).json({
        success: false,
        message: 'Term with this name already exists for this class'
      });
    }

    const term = new Term({
      userId,
      schoolId: school._id,
      classId,
      termName: termName.trim()
    });

    await term.save();

    return res.status(201).json({
      success: true,
      message: 'Term added successfully',
      data: term
    });
  } catch (error) {
    console.error('Error adding term:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding term',
      error: error.message
    });
  }
};

// Get All Terms
exports.getAllTerms = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    console.log('Fetching terms for userId:', userId, 'classId:', classId);

    const terms = await Term.find({ userId, classId, isActive: true }).sort({ createdAt: 1 });
    console.log('Found terms:', terms.length);

    return res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    console.error('Error fetching terms:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching terms',
      error: error.message
    });
  }
};

// Update Term
exports.updateTerm = async (req, res) => {
  try {
    const { termId } = req.params;
    const { termName } = req.body;
    const userId = req.user._id;

    const term = await Term.findOne({ _id: termId, userId });
    if (!term) {
      return res.status(404).json({
        success: false,
        message: 'Term not found'
      });
    }

    // Check for duplicates if name is being changed
    if (termName && termName !== term.termName) {
      const existingTerm = await Term.findOne({ 
        userId,
        classId: term.classId,
        termName: termName.trim(),
        _id: { $ne: termId }
      });
      if (existingTerm) {
        return res.status(400).json({
          success: false,
          message: 'Term with this name already exists for this class'
        });
      }
      term.termName = termName.trim();
    }

    term.updatedAt = Date.now();
    await term.save();

    return res.status(200).json({
      success: true,
      message: 'Term updated successfully',
      data: term
    });
  } catch (error) {
    console.error('Error updating term:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating term',
      error: error.message
    });
  }
};

// Delete Term
exports.deleteTerm = async (req, res) => {
  try {
    const { termId } = req.params;
    const userId = req.user._id;

    const term = await Term.findOne({ _id: termId, userId });
    if (!term) {
      return res.status(404).json({
        success: false,
        message: 'Term not found'
      });
    }

    // Soft delete
    term.isActive = false;
    term.updatedAt = Date.now();
    await term.save();

    return res.status(200).json({
      success: true,
      message: 'Term deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting term:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting term',
      error: error.message
    });
  }
};

module.exports = exports;

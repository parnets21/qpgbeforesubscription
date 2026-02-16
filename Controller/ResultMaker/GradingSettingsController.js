const GradingSettings = require('../../Module/ResultMaker/GradingSettings');

// Save grading settings
exports.saveGradingSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { _id, classId, termId, examinationId, subjectIds, grades } = req.body;

    console.log('=== GRADING SETTINGS SAVE REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('subjectIds received:', subjectIds);
    console.log('subjectIds type:', typeof subjectIds);
    console.log('subjectIds is array:', Array.isArray(subjectIds));
    console.log('subjectIds length:', subjectIds?.length);

    if (!classId || !termId || !examinationId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID, Term ID, and Examination ID are required'
      });
    }

    if (!subjectIds || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one subject must be selected'
      });
    }

    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one grade must be defined'
      });
    }

    let settings;

    if (_id) {
      // Update existing settings
      console.log('Updating existing grading settings with ID:', _id);
      console.log('Updating with subjectIds:', subjectIds);
      
      settings = await GradingSettings.findOneAndUpdate(
        { _id, userId },
        { subjectIds, grades, updatedAt: Date.now() },
        { new: true }
      );
      
      console.log('Updated settings:', settings);
      
      if (!settings) {
        return res.status(404).json({
          success: false,
          message: 'Grading settings not found'
        });
      }
    } else {
      // Check if grading already exists for any of these subjects in this examination
      // We need to check if ANY of the selected subjects already have grading configured
      const existingSettings = await GradingSettings.find({
        userId,
        classId,
        termId,
        examinationId
      });

      console.log('Existing settings found:', existingSettings.length);

      // Check for subject overlap
      for (const existing of existingSettings) {
        const overlap = existing.subjectIds.some(existingSubjectId => 
          subjectIds.includes(existingSubjectId.toString())
        );
        
        if (overlap) {
          return res.status(400).json({
            success: false,
            message: 'Grading configuration already exists for one or more selected subjects. Please edit the existing one or select different subjects.'
          });
        }
      }

      // Create new settings
      console.log('Creating new grading settings with subjectIds:', subjectIds);
      
      settings = new GradingSettings({
        userId,
        classId,
        termId,
        examinationId,
        subjectIds,
        grades
      });
      
      await settings.save();
      console.log('Saved settings:', settings);
    }

    res.status(200).json({
      success: true,
      message: _id ? 'Grading settings updated successfully' : 'Grading settings saved successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error saving grading settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving grading settings',
      error: error.message
    });
  }
};

// Get grading settings for a class, term, and examination
exports.getGradingSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId, termId, examinationId } = req.query;

    if (!classId || !termId || !examinationId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID, Term ID, and Examination ID are required'
      });
    }

    const settings = await GradingSettings.find({ 
      userId, 
      classId, 
      termId, 
      examinationId 
    });

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching grading settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grading settings',
      error: error.message
    });
  }
};

// Delete grading settings
exports.deleteGradingSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Grading settings ID is required'
      });
    }

    const settings = await GradingSettings.findOneAndDelete({ _id: id, userId });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Grading settings not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Grading settings deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting grading settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting grading settings',
      error: error.message
    });
  }
};

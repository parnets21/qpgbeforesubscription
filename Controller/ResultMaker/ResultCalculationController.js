const ResultCalculationSettings = require('../../Module/ResultMaker/ResultCalculationSettings');

// Save result calculation settings
exports.saveResultCalculationSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId, selectedTerms, termWeightages, selectedExaminations, examinationWeightages } = req.body;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    // Check if settings already exist for this class
    let settings = await ResultCalculationSettings.findOne({ userId, classId });

    if (settings) {
      // Update existing settings
      settings.selectedTerms = selectedTerms;
      settings.termWeightages = termWeightages;
      settings.selectedExaminations = selectedExaminations;
      settings.examinationWeightages = examinationWeightages;
      await settings.save();
    } else {
      // Create new settings
      settings = new ResultCalculationSettings({
        userId,
        classId,
        selectedTerms,
        termWeightages,
        selectedExaminations,
        examinationWeightages
      });
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Result calculation settings saved successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error saving result calculation settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving result calculation settings',
      error: error.message
    });
  }
};

// Get result calculation settings for a class
exports.getResultCalculationSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    const settings = await ResultCalculationSettings.findOne({ userId, classId })
      .populate('selectedTerms')
      .populate('classId');

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'No result calculation settings found for this class'
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching result calculation settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching result calculation settings',
      error: error.message
    });
  }
};

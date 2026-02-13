const LBASettings = require('../../Module/ResultMaker/LBASettings');
const School = require('../../Module/ResultMaker/School');

// Save or Update LBA Settings
exports.saveLBASettings = async (req, res) => {
  try {
    const { classId, oralMarks, writtenMarks, gradeRanges } = req.body;
    const userId = req.user._id;

    // Validate marks
    if (oralMarks < 0 || writtenMarks < 0) {
      return res.status(400).json({
        success: false,
        message: 'Marks cannot be negative'
      });
    }

    // Validate grade ranges if provided
    if (gradeRanges && Array.isArray(gradeRanges)) {
      const totalMarks = oralMarks + writtenMarks;
      for (const range of gradeRanges) {
        if (!range.grade || range.minMarks === undefined || range.maxMarks === undefined) {
          return res.status(400).json({
            success: false,
            message: 'Invalid grade range format'
          });
        }
        if (range.minMarks < 0 || range.maxMarks > totalMarks) {
          return res.status(400).json({
            success: false,
            message: `Invalid grade range for ${range.grade}: marks must be between 0 and ${totalMarks}`
          });
        }
        if (range.minMarks > range.maxMarks) {
          return res.status(400).json({
            success: false,
            message: `Invalid grade range for ${range.grade}: minimum marks cannot be greater than maximum marks`
          });
        }
      }
    }

    // Get school ID
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    // Check if settings already exist
    let settings = await LBASettings.findOne({ classId, userId });

    if (settings) {
      // Update existing settings
      settings.oralMarks = oralMarks;
      settings.writtenMarks = writtenMarks;
      settings.totalMarks = oralMarks + writtenMarks;
      
      // Update grade ranges if provided
      if (gradeRanges && Array.isArray(gradeRanges) && gradeRanges.length > 0) {
        settings.gradeRanges = gradeRanges;
      }
      
      settings.updatedAt = Date.now();
      await settings.save();

      return res.status(200).json({
        success: true,
        message: 'LBA settings updated successfully',
        data: settings
      });
    } else {
      // Create new settings
      const newSettings = {
        userId,
        schoolId: school._id,
        classId,
        oralMarks,
        writtenMarks,
        totalMarks: oralMarks + writtenMarks
      };
      
      // Add grade ranges if provided
      if (gradeRanges && Array.isArray(gradeRanges) && gradeRanges.length > 0) {
        newSettings.gradeRanges = gradeRanges;
      }
      
      settings = new LBASettings(newSettings);
      await settings.save();

      return res.status(201).json({
        success: true,
        message: 'LBA settings created successfully',
        data: settings
      });
    }
  } catch (error) {
    console.error('Error saving LBA settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error saving LBA settings',
      error: error.message
    });
  }
};

// Get LBA Settings for a class
exports.getLBASettings = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user._id;

    const settings = await LBASettings.findOne({ classId, userId });

    if (!settings) {
      // Return default settings if not configured
      const defaultGrades15 = [
        { minMarks: 14, maxMarks: 15, grade: 'A+' },
        { minMarks: 11, maxMarks: 13, grade: 'A' },
        { minMarks: 8, maxMarks: 10, grade: 'B+' },
        { minMarks: 7, maxMarks: 7, grade: 'B' },
        { minMarks: 0, maxMarks: 6, grade: 'C' }
      ];
      
      return res.status(200).json({
        success: true,
        data: {
          oralMarks: 5,
          writtenMarks: 10,
          totalMarks: 15,
          gradeRanges: defaultGrades15,
          isDefault: true
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...settings.toObject(),
        isDefault: false
      }
    });
  } catch (error) {
    console.error('Error fetching LBA settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching LBA settings',
      error: error.message
    });
  }
};

// Get all LBA Settings
exports.getAllLBASettings = async (req, res) => {
  try {
    const userId = req.user._id;

    const settings = await LBASettings.find({ userId }).populate('classId');

    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching LBA settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching LBA settings',
      error: error.message
    });
  }
};

module.exports = exports;

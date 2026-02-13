const Class = require('../../Module/ResultMaker/Class');
const School = require('../../Module/ResultMaker/School');

// Add Class
exports.addClass = async (req, res) => {
  try {
    const { className, section } = req.body;
    const userId = req.user._id;

    // Get school for this user
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found. Please create school profile first.'
      });
    }

    // Check if class already exists
    const existingClass = await Class.findOne({ 
      className, 
      section, 
      schoolId: school._id 
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: 'Class with this section already exists'
      });
    }

    // Create new class
    const newClass = new Class({
      className,
      section,
      schoolId: school._id,
      userId
    });

    await newClass.save();

    return res.status(201).json({
      success: true,
      message: 'Class added successfully',
      data: newClass
    });
  } catch (error) {
    console.error('Error adding class:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding class',
      error: error.message
    });
  }
};

// Get All Classes
exports.getAllClasses = async (req, res) => {
  try {
    const userId = req.user._id;

    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    const classes = await Class.find({ schoolId: school._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching classes',
      error: error.message
    });
  }
};

// Delete Class
exports.deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user._id;

    const classData = await Class.findOne({ _id: classId, userId });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    await Class.findByIdAndDelete(classId);

    return res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting class',
      error: error.message
    });
  }
};

// Update Class
exports.updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { className, section } = req.body;
    const userId = req.user._id;

    const classData = await Class.findOne({ _id: classId, userId });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if another class with same name and section exists
    if (className || section) {
      const existingClass = await Class.findOne({
        _id: { $ne: classId },
        className: className || classData.className,
        section: section || classData.section,
        schoolId: classData.schoolId
      });

      if (existingClass) {
        return res.status(400).json({
          success: false,
          message: 'Class with this name and section already exists'
        });
      }
    }

    // Update class
    if (className) classData.className = className;
    if (section) classData.section = section;

    await classData.save();

    return res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: classData
    });
  } catch (error) {
    console.error('Error updating class:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating class',
      error: error.message
    });
  }
};

const School = require('../../Module/ResultMaker/School');

// Create or Update School Profile
exports.saveSchoolProfile = async (req, res) => {
  try {
    const { 
      schoolId, // Add schoolId to identify which school to update
      schoolLogo,
      principalSignature,
      schoolName,
      schoolCode, // Add schoolCode
      schoolAddress, 
      mobileNumber, 
      affiliationNumber, 
      educationalBoard, 
      schoolWebsite, 
      selectedSession 
    } = req.body;

    console.log('Received school profile data:', req.body);

    const userId = req.user._id; // Assuming auth middleware sets req.user

    let school;

    // If schoolId is provided, update that specific school
    if (schoolId) {
      school = await School.findById(schoolId);
      
      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School profile not found'
        });
      }

      // Update the school
      school.schoolLogo = schoolLogo !== undefined ? schoolLogo : school.schoolLogo;
      school.principalSignature = principalSignature !== undefined ? principalSignature : school.principalSignature;
      school.schoolName = schoolName;
      school.schoolCode = schoolCode !== undefined ? schoolCode : school.schoolCode; // Add schoolCode
      school.schoolAddress = schoolAddress;
      school.mobileNumber = mobileNumber;
      school.affiliationNumber = affiliationNumber;
      school.educationalBoard = educationalBoard;
      school.schoolWebsite = schoolWebsite;
      school.selectedSession = selectedSession;
      school.updatedAt = Date.now();

      await school.save();

      console.log('School profile updated:', school);

      return res.status(200).json({
        success: true,
        message: 'School profile updated successfully',
        data: school
      });
    }

    // If no schoolId, check if school profile already exists for this user
    school = await School.findOne({ userId });

    if (school) {
      // Update existing school
      school.schoolLogo = schoolLogo || school.schoolLogo;
      school.principalSignature = principalSignature !== undefined ? principalSignature : school.principalSignature;
      school.schoolName = schoolName;
      school.schoolCode = schoolCode !== undefined ? schoolCode : school.schoolCode; // Add schoolCode
      school.schoolAddress = schoolAddress;
      school.mobileNumber = mobileNumber;
      school.affiliationNumber = affiliationNumber;
      school.educationalBoard = educationalBoard;
      school.schoolWebsite = schoolWebsite;
      school.selectedSession = selectedSession;
      school.updatedAt = Date.now();

      await school.save();

      return res.status(200).json({
        success: true,
        message: 'School profile updated successfully',
        data: school
      });
    } else {
      // Create new school
      school = new School({
        schoolLogo,
        principalSignature,
        schoolName,
        schoolCode, // Add schoolCode
        schoolAddress,
        mobileNumber,
        affiliationNumber,
        educationalBoard,
        schoolWebsite,
        selectedSession,
        userId
      });

      await school.save();

      return res.status(201).json({
        success: true,
        message: 'School profile created successfully',
        data: school
      });
    }
  } catch (error) {
    console.error('Error saving school profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error saving school profile',
      error: error.message
    });
  }
};

// Get School Profile
exports.getSchoolProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const school = await School.findOne({ userId });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: school
    });
  } catch (error) {
    console.error('Error fetching school profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching school profile',
      error: error.message
    });
  }
};

// Get All School Profiles (Admin view)
exports.getAllSchoolProfiles = async (req, res) => {
  try {
    const schools = await School.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });
  } catch (error) {
    console.error('Error fetching all school profiles:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching school profiles',
      error: error.message
    });
  }
};

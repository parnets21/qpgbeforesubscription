const LBAChapter = require('../../Module/ResultMaker/LBAChapter');
const LBAMarks = require('../../Module/ResultMaker/LBAMarks');
const School = require('../../Module/ResultMaker/School');
const Student = require('../../Module/ResultMaker/Student');

// Add Chapter
exports.addChapter = async (req, res) => {
  try {
    const { classId, term, subject, chapterName, chapterNumber } = req.body;
    const userId = req.user._id;

    // Get school ID
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    // Check if chapter number already exists
    const existingChapter = await LBAChapter.findOne({
      classId,
      term,
      subject,
      chapterNumber
    });

    if (existingChapter) {
      return res.status(400).json({
        success: false,
        message: 'Chapter number already exists for this subject and term'
      });
    }

    const chapter = new LBAChapter({
      userId,
      schoolId: school._id,
      classId,
      term,
      subject,
      chapterName,
      chapterNumber
    });

    await chapter.save();

    return res.status(201).json({
      success: true,
      message: 'Chapter added successfully',
      data: chapter
    });
  } catch (error) {
    console.error('Error adding chapter:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding chapter',
      error: error.message
    });
  }
};

// Get All Chapters
exports.getAllChapters = async (req, res) => {
  try {
    const { classId, term, subject } = req.query;
    const userId = req.user._id;

    const query = { userId };
    if (classId) query.classId = classId;
    if (term) query.term = term;
    if (subject) query.subject = subject;

    const chapters = await LBAChapter.find(query).sort({ chapterNumber: 1 });

    return res.status(200).json({
      success: true,
      data: chapters
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching chapters',
      error: error.message
    });
  }
};

// Update Chapter
exports.updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { chapterName, chapterNumber } = req.body;
    const userId = req.user._id;

    const chapter = await LBAChapter.findOne({ _id: chapterId, userId });
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // If chapter number is being changed, check for duplicates
    if (chapterNumber && chapterNumber !== chapter.chapterNumber) {
      const existingChapter = await LBAChapter.findOne({
        classId: chapter.classId,
        term: chapter.term,
        subject: chapter.subject,
        chapterNumber,
        _id: { $ne: chapterId }
      });

      if (existingChapter) {
        return res.status(400).json({
          success: false,
          message: 'Chapter number already exists'
        });
      }
    }

    if (chapterName) chapter.chapterName = chapterName;
    if (chapterNumber) chapter.chapterNumber = chapterNumber;
    chapter.updatedAt = Date.now();

    await chapter.save();

    return res.status(200).json({
      success: true,
      message: 'Chapter updated successfully',
      data: chapter
    });
  } catch (error) {
    console.error('Error updating chapter:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating chapter',
      error: error.message
    });
  }
};

// Delete Chapter
exports.deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user._id;

    const chapter = await LBAChapter.findOneAndDelete({ _id: chapterId, userId });
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Delete all marks associated with this chapter
    await LBAMarks.deleteMany({ chapterId });

    return res.status(200).json({
      success: true,
      message: 'Chapter and associated marks deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting chapter',
      error: error.message
    });
  }
};

// Save Marks
exports.saveMarks = async (req, res) => {
  try {
    const { classId, studentId, chapterId, term, subject, oralMarks, writtenMarks, classNumber } = req.body;
    const userId = req.user._id;

    // Get school ID
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    // Get LBA settings to determine max marks and calculate grade
    const LBASettings = require('../../Module/ResultMaker/LBASettings');
    let settings = await LBASettings.findOne({ classId, userId });
    
    console.log('LBA Settings found:', settings ? 'Yes' : 'No');
    if (settings) {
      console.log('Settings details:', {
        oralMarks: settings.oralMarks,
        writtenMarks: settings.writtenMarks,
        totalMarks: settings.totalMarks,
        gradeRangesCount: settings.gradeRanges ? settings.gradeRanges.length : 0
      });
    }
    
    let maxOralMarks = 5;
    let maxWrittenMarks = classNumber >= 1 && classNumber <= 4 ? 10 : 15;
    let maxTotalMarks = maxOralMarks + maxWrittenMarks;
    let grade = '';
    
    if (settings) {
      maxOralMarks = settings.oralMarks;
      maxWrittenMarks = settings.writtenMarks;
      maxTotalMarks = settings.totalMarks;
    }

    // Validate marks
    if (oralMarks < 0 || oralMarks > maxOralMarks) {
      return res.status(400).json({
        success: false,
        message: `Oral marks must be between 0 and ${maxOralMarks}`
      });
    }

    if (writtenMarks < 0 || writtenMarks > maxWrittenMarks) {
      return res.status(400).json({
        success: false,
        message: `Written marks must be between 0 and ${maxWrittenMarks}`
      });
    }

    const totalMarks = oralMarks + writtenMarks;
    
    // Calculate grade
    if (settings && settings.gradeRanges && settings.gradeRanges.length > 0) {
      grade = settings.calculateGrade(totalMarks);
      console.log(`Grade calculation: totalMarks=${totalMarks}, grade=${grade}, gradeRanges=`, settings.gradeRanges);
    } else {
      // Default grade calculation if no settings
      const percentage = (totalMarks / maxTotalMarks) * 100;
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 75) grade = 'A';
      else if (percentage >= 60) grade = 'B+';
      else if (percentage >= 50) grade = 'B';
      else grade = 'C';
      console.log(`Grade calculation (default): totalMarks=${totalMarks}, percentage=${percentage}, grade=${grade}`);
    }

    // Check if marks already exist
    let marks = await LBAMarks.findOne({ studentId, chapterId });

    if (marks) {
      // Update existing marks
      marks.oralMarks = oralMarks;
      marks.writtenMarks = writtenMarks;
      marks.totalMarks = totalMarks;
      marks.grade = grade;
      marks.maxOralMarks = maxOralMarks;
      marks.maxWrittenMarks = maxWrittenMarks;
      marks.maxTotalMarks = maxTotalMarks;
      marks.updatedAt = Date.now();
      await marks.save();

      return res.status(200).json({
        success: true,
        message: 'Marks updated successfully',
        data: marks
      });
    } else {
      // Create new marks entry
      marks = new LBAMarks({
        userId,
        schoolId: school._id,
        classId,
        studentId,
        chapterId,
        term,
        subject,
        oralMarks,
        writtenMarks,
        totalMarks,
        grade,
        maxOralMarks,
        maxWrittenMarks,
        maxTotalMarks
      });

      await marks.save();

      return res.status(201).json({
        success: true,
        message: 'Marks saved successfully',
        data: marks
      });
    }
  } catch (error) {
    console.error('Error saving marks:', error);
    return res.status(500).json({
      success: false,
      message: 'Error saving marks',
      error: error.message
    });
  }
};

// Get Marks
exports.getMarks = async (req, res) => {
  try {
    const { classId, chapterId, studentId } = req.query;
    const userId = req.user._id;

    const query = { userId };
    if (classId) query.classId = classId;
    if (chapterId) query.chapterId = chapterId;
    if (studentId) query.studentId = studentId;

    const marks = await LBAMarks.find(query)
      .populate('studentId', 'studentName admissionNo')
      .populate('chapterId', 'chapterName chapterNumber');

    return res.status(200).json({
      success: true,
      data: marks
    });
  } catch (error) {
    console.error('Error fetching marks:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching marks',
      error: error.message
    });
  }
};

// Get Student LBA Report
exports.getStudentReport = async (req, res) => {
  try {
    const { studentId, term } = req.query;
    const userId = req.user._id;

    const query = { userId, studentId };
    if (term) query.term = term;

    const marks = await LBAMarks.find(query)
      .populate('chapterId', 'chapterName chapterNumber subject')
      .sort({ subject: 1, 'chapterId.chapterNumber': 1 });

    // Group by subject
    const reportBySubject = {};
    marks.forEach(mark => {
      const subject = mark.subject;
      if (!reportBySubject[subject]) {
        reportBySubject[subject] = [];
      }
      reportBySubject[subject].push({
        chapterNumber: mark.chapterId.chapterNumber,
        chapterName: mark.chapterId.chapterName,
        oralMarks: mark.oralMarks,
        writtenMarks: mark.writtenMarks,
        totalMarks: mark.totalMarks,
        grade: mark.grade || '',
        maxOralMarks: mark.maxOralMarks,
        maxWrittenMarks: mark.maxWrittenMarks,
        maxTotalMarks: mark.maxTotalMarks
      });
    });

    return res.status(200).json({
      success: true,
      data: reportBySubject
    });
  } catch (error) {
    console.error('Error fetching student report:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching student report',
      error: error.message
    });
  }
};

module.exports = exports;

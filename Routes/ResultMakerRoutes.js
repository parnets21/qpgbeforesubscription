const express = require('express');
const router = express.Router();
const { Authentication } = require('../Authentication/auth');

const SchoolController = require('../Controller/ResultMaker/SchoolController');
const ClassController = require('../Controller/ResultMaker/ClassController');
const StudentController = require('../Controller/ResultMaker/StudentController');
const TermController = require('../Controller/ResultMaker/TermController');
const AssessmentTypeController = require('../Controller/ResultMaker/AssessmentTypeController');
const SubjectController = require('../Controller/ResultMaker/SubjectController');
const MarksController = require('../Controller/ResultMaker/MarksController');
const ExamSettingsController = require('../Controller/ResultMaker/ExamSettingsController');
const AdmitCardController = require('../Controller/ResultMaker/AdmitCardController');
const LBAController = require('../Controller/ResultMaker/LBAController');
const LBASettingsController = require('../Controller/ResultMaker/LBASettingsController');
const ResultCalculationController = require('../Controller/ResultMaker/ResultCalculationController');
const StudentMarksController = require('../Controller/ResultMaker/StudentMarksController');
const ResultGenerationController = require('../Controller/ResultMaker/ResultGenerationController');
const GradingSettingsController = require('../Controller/ResultMaker/GradingSettingsController');

// School Routes
router.post('/school/save', Authentication, SchoolController.saveSchoolProfile);
router.get('/school/profile', Authentication, SchoolController.getSchoolProfile);
router.get('/school/all', Authentication, SchoolController.getAllSchoolProfiles);

// Class Routes
router.post('/class/add', Authentication, ClassController.addClass);
router.get('/class/all', Authentication, ClassController.getAllClasses);
router.put('/class/:classId', Authentication, ClassController.updateClass);
router.delete('/class/:classId', Authentication, ClassController.deleteClass);

// Student Routes
router.post('/student/add', Authentication, StudentController.addStudent);
router.get('/student/all', Authentication, StudentController.getAllStudents);
router.get('/student/class/:classId', Authentication, StudentController.getStudentsByClass);
router.put('/student/:studentId', Authentication, StudentController.updateStudent);
router.delete('/student/:studentId', Authentication, StudentController.deleteStudent);

// Term Routes
router.post('/term/add', Authentication, TermController.addTerm);
router.get('/term/all', Authentication, TermController.getAllTerms);
router.put('/term/:termId', Authentication, TermController.updateTerm);
router.delete('/term/:termId', Authentication, TermController.deleteTerm);

// Assessment Type Routes
router.post('/assessment/add', Authentication, AssessmentTypeController.addAssessmentType);
router.get('/assessment/all', Authentication, AssessmentTypeController.getAllAssessmentTypes);
router.put('/assessment/:assessmentId', Authentication, AssessmentTypeController.updateAssessmentType);
router.delete('/assessment/:assessmentId', Authentication, AssessmentTypeController.deleteAssessmentType);

// Subject Routes
router.post('/subject/add', Authentication, SubjectController.addSubject);
router.get('/subject/all', Authentication, SubjectController.getAllSubjects);
router.put('/subject/:subjectId', Authentication, SubjectController.updateSubject);
router.delete('/subject/:subjectId', Authentication, SubjectController.deleteSubject);

// Marks Routes
router.post('/marks/save', Authentication, MarksController.saveMarks);
router.get('/marks/get', Authentication, MarksController.getMarks);
router.get('/marks/student/:studentId', Authentication, MarksController.getStudentMarks);
router.delete('/marks/:marksId', Authentication, MarksController.deleteMarks);

// Exam Settings Routes
router.post('/exam-settings/save', Authentication, ExamSettingsController.saveExamSettings);
router.get('/exam-settings/:classId', Authentication, ExamSettingsController.getExamSettings);
router.get('/exam-settings/all', Authentication, ExamSettingsController.getAllExamSettings);
router.delete('/exam-settings/:classId', Authentication, ExamSettingsController.deleteExamSettings);

// Admit Card Routes
router.post('/admit-card/save', Authentication, AdmitCardController.saveAdmitCard);
router.get('/admit-card/all', Authentication, AdmitCardController.getAllAdmitCards);
router.get('/admit-card/:id', Authentication, AdmitCardController.getAdmitCardById);
router.put('/admit-card/:id', Authentication, AdmitCardController.updateAdmitCard);
router.delete('/admit-card/:id', Authentication, AdmitCardController.deleteAdmitCard);

// LBA (Lesson Based Assessment) Routes
// Chapter Management
router.post('/lba/chapter/add', Authentication, LBAController.addChapter);
router.get('/lba/chapter/all', Authentication, LBAController.getAllChapters);
router.put('/lba/chapter/:chapterId', Authentication, LBAController.updateChapter);
router.delete('/lba/chapter/:chapterId', Authentication, LBAController.deleteChapter);

// Marks Management
router.post('/lba/marks/save', Authentication, LBAController.saveMarks);
router.get('/lba/marks/get', Authentication, LBAController.getMarks);

// Reports
router.get('/lba/report/student', Authentication, LBAController.getStudentReport);

// LBA Settings
router.post('/lba/settings/save', Authentication, LBASettingsController.saveLBASettings);
router.get('/lba/settings/:classId', Authentication, LBASettingsController.getLBASettings);
router.get('/lba/settings/all', Authentication, LBASettingsController.getAllLBASettings);

// Result Calculation Settings Routes
router.post('/result-settings/save', Authentication, ResultCalculationController.saveResultCalculationSettings);
router.get('/result-settings/:classId', Authentication, ResultCalculationController.getResultCalculationSettings);

// Student Marks Routes (New System) - Different paths to avoid conflict
router.post('/student-marks/save', Authentication, StudentMarksController.saveStudentMarks);
router.get('/student-marks/get', Authentication, StudentMarksController.getStudentMarks);

// Result Generation Routes
router.post('/results/calculate', Authentication, ResultGenerationController.calculateStudentResults);

// Grading Settings Routes
router.post('/grading-settings/save', Authentication, GradingSettingsController.saveGradingSettings);
router.get('/grading-settings/get', Authentication, GradingSettingsController.getGradingSettings);
router.delete('/grading-settings/:id', Authentication, GradingSettingsController.deleteGradingSettings);

module.exports = router;

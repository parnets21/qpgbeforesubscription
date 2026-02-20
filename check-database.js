const mongoose = require("mongoose");
require("dotenv").config();

// Connect to database
mongoose.connect(process.env.DB)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Failed:", err.message));

const QuestionPaperModel = require("./Module/Admin/QuestionPaper");

async function checkDatabase() {
  try {
    console.log("=== Checking Database ===\n");

    // Get total count
    const totalCount = await QuestionPaperModel.countDocuments();
    console.log("Total Questions in Database:", totalCount);

    if (totalCount > 0) {
      // Get unique values for each field
      const boards = await QuestionPaperModel.distinct('Board');
      const mediums = await QuestionPaperModel.distinct('Medium');
      const classes = await QuestionPaperModel.distinct('Class');
      const subClasses = await QuestionPaperModel.distinct('Sub_Class');
      const subjects = await QuestionPaperModel.distinct('Subject');
      const chapters = await QuestionPaperModel.distinct('Chapter_Name');
      const objectives = await QuestionPaperModel.distinct('Objectives');
      const questionTypes = await QuestionPaperModel.distinct('Types_Question');
      const lessons = await QuestionPaperModel.distinct('Lesson');

      console.log("\n=== Available Data ===");
      console.log("Boards:", boards);
      console.log("Mediums:", mediums);
      console.log("Classes:", classes);
      console.log("Sub_Classes:", subClasses);
      console.log("Subjects:", subjects);
      console.log("Chapters:", chapters.slice(0, 10), chapters.length > 10 ? `... (${chapters.length} total)` : '');
      console.log("Objectives:", objectives);
      console.log("Question Types:", questionTypes);
      console.log("Lessons:", lessons.slice(0, 10), lessons.length > 10 ? `... (${lessons.length} total)` : '');

      // Get a sample question
      console.log("\n=== Sample Question ===");
      const sampleQuestion = await QuestionPaperModel.findOne().lean();
      console.log(JSON.stringify({
        Board: sampleQuestion.Board,
        Medium: sampleQuestion.Medium,
        Class: sampleQuestion.Class,
        Sub_Class: sampleQuestion.Sub_Class,
        Subject: sampleQuestion.Subject,
        Chapter_Name: sampleQuestion.Chapter_Name,
        Objectives: sampleQuestion.Objectives,
        Types_Question: sampleQuestion.Types_Question,
        Lesson: sampleQuestion.Lesson
      }, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkDatabase();

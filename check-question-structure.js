const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Failed:", err.message));

const QuestionPaperModel = require("./Module/Admin/QuestionPaper");

async function checkQuestionStructure() {
  try {
    console.log("=== Checking Question Structure ===\n");

    // Get one question from the subject
    const question = await QuestionPaperModel.findOne({
      Board: "ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ",
      Medium: "ಕನ್ನಡ",
      Class: "ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ",
      Sub_Class: "8",
      Subject: "೮ನೆಯ ಸಮಾಜ ವಿಜ್ಞಾನ ಭಾಗ ೨"
    }).lean();

    if (question) {
      console.log("Sample Question Fields:");
      console.log(JSON.stringify({
        _id: question._id,
        Board: question.Board,
        Medium: question.Medium,
        Class: question.Class,
        Sub_Class: question.Sub_Class,
        Subject: question.Subject,
        Chapter_Name: question.Chapter_Name,
        Objectives: question.Objectives,
        Types_Question: question.Types_Question,
        Lesson: question.Lesson,
        Marks: question.Marks,
        Difficulty_level: question.Difficulty_level,
        Question: question.Question?.substring(0, 100),
        // Check if there are any blueprint-related fields
        Blueprintchapter: question.Blueprintchapter,
        Blueprintobjective: question.Blueprintobjective,
        Blueprintnoofquestion: question.Blueprintnoofquestion,
        BluePrintQuestiontype: question.BluePrintQuestiontype,
        BluePrintmarksperquestion: question.BluePrintmarksperquestion
      }, null, 2));
    } else {
      console.log("No question found");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkQuestionStructure();

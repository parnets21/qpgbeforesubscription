const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Failed:", err.message));

const QuestionPaperModel = require("./Module/Admin/QuestionPaper");

async function findQuestions() {
  try {
    console.log("=== Finding Questions ===\n");

    // First, find any question with these basic criteria
    const anyQuestion = await QuestionPaperModel.findOne({
      Board: "ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ",
      Medium: "ಕನ್ನಡ",
      Class: "ಪ್ರೌಢಶಾಲೆ",
      Sub_Class: "10"
    }).lean();

    if (!anyQuestion) {
      console.log("No questions found with these criteria");
      process.exit(0);
    }

    console.log("Found a question! Using its subject:", anyQuestion.Subject);

    // Search for questions with the given criteria
    const questions = await QuestionPaperModel.find({
      Board: anyQuestion.Board,
      Medium: anyQuestion.Medium,
      Class: anyQuestion.Class,
      Sub_Class: anyQuestion.Sub_Class,
      Subject: anyQuestion.Subject
    }).limit(5).lean();

    console.log(`\nFound ${questions.length} questions for this subject`);

    if (questions.length > 0) {
      console.log("\n=== Sample Questions ===");
      questions.forEach((q, index) => {
        console.log(`\nQuestion ${index + 1}:`);
        console.log({
          Chapter_Name: q.Chapter_Name,
          Objectives: q.Objectives,
          Types_Question: q.Types_Question,
          Lesson: q.Lesson,
          Question: q.Question?.substring(0, 100) + '...'
        });
      });

      // Get unique values for this subject
      const chapters = await QuestionPaperModel.distinct('Chapter_Name', {
        Board: anyQuestion.Board,
        Medium: anyQuestion.Medium,
        Class: anyQuestion.Class,
        Sub_Class: anyQuestion.Sub_Class,
        Subject: anyQuestion.Subject
      });

      const objectives = await QuestionPaperModel.distinct('Objectives', {
        Board: anyQuestion.Board,
        Medium: anyQuestion.Medium,
        Class: anyQuestion.Class,
        Sub_Class: anyQuestion.Sub_Class,
        Subject: anyQuestion.Subject
      });

      const questionTypes = await QuestionPaperModel.distinct('Types_Question', {
        Board: anyQuestion.Board,
        Medium: anyQuestion.Medium,
        Class: anyQuestion.Class,
        Sub_Class: anyQuestion.Sub_Class,
        Subject: anyQuestion.Subject
      });

      const lessons = await QuestionPaperModel.distinct('Lesson', {
        Board: anyQuestion.Board,
        Medium: anyQuestion.Medium,
        Class: anyQuestion.Class,
        Sub_Class: anyQuestion.Sub_Class,
        Subject: anyQuestion.Subject
      });

      console.log("\n=== Available Values for this Subject ===");
      console.log("Chapters:", chapters);
      console.log("Objectives:", objectives);
      console.log("Question Types:", questionTypes);
      console.log("Lessons:", lessons);

      // Create test data
      console.log("\n=== Test Data to Use ===");
      console.log(JSON.stringify({
        Board: anyQuestion.Board,
        Medium: anyQuestion.Medium,
        Class: anyQuestion.Class,
        Sub_Class: anyQuestion.Sub_Class,
        Subject: anyQuestion.Subject,
        AllChapter: [
          {
            Blueprintchapter: chapters[0],
            Blueprintobjective: objectives[0],
            Blueprintnoofquestion: 3
          }
        ],
        QusetionType: [
          {
            QAType: questionTypes[0],
            NQA: 5
          }
        ],
        Weightageofthecontent: [
          {
            label: lessons[0]
          }
        ]
      }, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

findQuestions();

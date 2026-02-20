const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Failed:", err.message));

const QuestionPaperModel = require("./Module/Admin/QuestionPaper");

async function findSubjects() {
  try {
    console.log("=== Finding Subjects ===\n");

    // Find subjects for this criteria
    const subjects = await QuestionPaperModel.distinct('Subject', {
      Board: "ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ",
      Medium: "ಕನ್ನಡ",
      Class: "ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ",
      Sub_Class: "8"
    });

    console.log(`Found ${subjects.length} subjects:`);
    subjects.forEach((s, i) => {
      console.log(`${i + 1}. "${s}"`);
    });

    // Pick first subject and get sample questions
    if (subjects.length > 0) {
      const sampleSubject = subjects[0];
      console.log(`\n=== Using Subject: "${sampleSubject}" ===\n`);

      const questions = await QuestionPaperModel.find({
        Board: "ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ",
        Medium: "ಕನ್ನಡ",
        Class: "ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ",
        Sub_Class: "8",
        Subject: sampleSubject
      }).limit(5).lean();

      console.log(`Found ${questions.length} questions\n`);

      if (questions.length > 0) {
        console.log("=== Sample Questions ===");
        questions.forEach((q, i) => {
          console.log(`\nQuestion ${i + 1}:`);
          console.log("Chapter:", q.Chapter_Name);
          console.log("Objective:", q.Objectives);
          console.log("Type:", q.Types_Question);
        });

        // Get unique values
        const chapters = await QuestionPaperModel.distinct('Chapter_Name', {
          Board: "ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ",
          Medium: "ಕನ್ನಡ",
          Class: "ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ",
          Sub_Class: "8",
          Subject: sampleSubject
        });

        const objectives = await QuestionPaperModel.distinct('Objectives', {
          Board: "ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ",
          Medium: "ಕನ್ನಡ",
          Class: "ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ",
          Sub_Class: "8",
          Subject: sampleSubject
        });

        const questionTypes = await QuestionPaperModel.distinct('Types_Question', {
          Board: "ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ",
          Medium: "ಕನ್ನಡ",
          Class: "ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ",
          Sub_Class: "8",
          Subject: sampleSubject
        });

        console.log("\n=== Available Values ===");
        console.log("Chapters:", chapters.slice(0, 5));
        console.log("Objectives:", objectives);
        console.log("Question Types:", questionTypes);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

findSubjects();

const axios = require('axios');

// Test data - using actual data from your database
const testData = {
  Board: "ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ",
  Medium: "ಕನ್ನಡ",
  Class: "ಪ್ರೌಢಶಾಲೆ",
  Sub_Class: "10",
  Subject: "10th Lba Maths Part 1 Real Numbers ",
  ExamName: [],
  AllChapter: [
    {
      Blueprintchapter: "Real Numbers",
      Blueprintobjective: "Knowledge",
      Blueprintnoofquestion: 3
    },
    {
      Blueprintchapter: "Real Numbers",
      Blueprintobjective: "Understanding",
      Blueprintnoofquestion: 5
    }
  ],
  QusetionType: [
    {
      QAType: "Multiple Choice Questions",
      NQA: 10
    },
    {
      QAType: "One Sentence Answer Question",
      NQA: 5
    }
  ],
  Weightageofthecontent: [
    {
      label: "10th Maths Part 1"
    }
  ]
};

async function testAPI() {
  try {
    console.log("=== Testing getQuestionByClasswise API ===\n");
    console.log("Request Data:");
    console.log(JSON.stringify(testData, null, 2));
    console.log("\n=== Calling API ===\n");

    const response = await axios({
      method: 'PUT',
      url: 'http://localhost:8774/api/admin/getQuestionByClasswise/test123',
      data: testData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("\n=== API Response ===");
    console.log("Status:", response.status);
    console.log("Total Questions Returned:", response.data.success?.length || 0);
    console.log("\nResponse Data:");
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error("\n=== ERROR ===");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

testAPI();

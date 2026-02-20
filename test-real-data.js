const axios = require('axios');

// Real data from your logs - COMPLETE BLUEPRINT
const testData = {
  Board: "ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ",
  Medium: "ಕನ್ನಡ",
  Class: "ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ",
  Sub_Class: "8",
  Subject: "೮ನೆಯ ಸಮಾಜ ವಿಜ್ಞಾನ ಭಾಗ ೨",
  ExamName: [],
  AllChapter: [
    {"Blueprintobjective": "ಜ್ಞಾನ","Blueprintchapter": "ಪಾಠ ೧೬ಮೌರ್ಯರು ಮತ್ತು ಕುಶಾನರು ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "O T","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ಜ್ಞಾನ","Blueprintchapter": "ಪಾಠ ೨೧ಚೋಳರು ಮತ್ತು ದ್ವಾರಸಮುದ್ರದ ಹೊಯ್ಸಳರು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "O T","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೨೨ಪ್ರಜಾಪ್ರಭುತ್ವ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "O T","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ಜ್ಞಾನ","Blueprintchapter": "ಪಾಠ ೨೬ಜಲ ಗೋಳ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "O T","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ಜ್ಞಾನ","Blueprintchapter": "ಪಾಠ ೧೭ ಗುಪ್ತರು ಹಾಗೂ ವರ್ಧನರು ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "O T","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೨೩ಸ್ಥಳೀಯ ಸ್ವಯಂ ಸರ್ಕಾರಗಳು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "O T","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೨೫ ಸಮಾಜದ ಪ್ರಕಾರಗಳು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "O T","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೩೦ದೊಡ್ಡ ಪ್ರಮಾಣದ ವ್ಯವಹಾರ ಸಂಘಟನೆಗಳು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "O T","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ಜ್ಞಾನ","Blueprintchapter": "ಪಾಠ ೧೬ಮೌರ್ಯರು ಮತ್ತು ಕುಶಾನರು ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ಅಭಿವ್ಯಕ್ತಿ/ ಅನ್ವಯ","Blueprintchapter": "ಪಾಠ ೧೮ ದಕ್ಷಿಣ ಭಾರತದ ರಾಜವಂಶಗಳ ಶಾತವಾಹನರು ಕದಂಬರು ಗಂಗರು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೧೯ಬಾದಾಮಿಯ ಚಾಲುಕ್ಯರು ಮತ್ತು ಕಂಚಿಯ ಪಲ್ಲವರು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ಅಭಿವ್ಯಕ್ತಿ/ ಅನ್ವಯ","Blueprintchapter": "ಪಾಠ ೨೦ಮಾನ್ಯಖೇಟದ ರಾಷ್ಟ್ರಕೂಟರು ಮತ್ತು ಕಲ್ಯಾಣದ ಚಾಲುಕ್ಯರು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೨೨ಪ್ರಜಾಪ್ರಭುತ್ವ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೨೪ ದಿನನಿತ್ಯದ ಜೀವನದಲ್ಲಿ ಸಮಾಜಶಾಸ್ತ್ರ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ಅಭಿವ್ಯಕ್ತಿ/ ಅನ್ವಯ","Blueprintchapter": "ಪಾಠ ೨೭ಜೀವಗೋಳ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೨೮ ಅರ್ಥಶಾಸ್ತ್ರದ ಮೂಲ ಪರಿಕಲ್ಪನೆಗಳು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "1"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೨೩ಸ್ಥಳೀಯ ಸ್ವಯಂ ಸರ್ಕಾರಗಳು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "2"},
    {"Blueprintobjective": "ತಿಳಿವಳಿಕೆ","Blueprintchapter": "ಪಾಠ ೩೦ದೊಡ್ಡ ಪ್ರಮಾಣದ ವ್ಯವಹಾರ ಸಂಘಟನೆಗಳು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "2"},
    {"Blueprintobjective": "ಜ್ಞಾನ","Blueprintchapter": "ಪಾಠ ೨೭ಜೀವಗೋಳ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "2"},
    {"Blueprintobjective": "ಅಭಿವ್ಯಕ್ತಿ/ ಅನ್ವಯ","Blueprintchapter": "ಪಾಠ ೧೭ ಗುಪ್ತರು ಹಾಗೂ ವರ್ಧನರು ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "3"},
    {"Blueprintobjective": "ಅಭಿವ್ಯಕ್ತಿ/ ಅನ್ವಯ","Blueprintchapter": "ಪಾಠ ೨೪ ದಿನನಿತ್ಯದ ಜೀವನದಲ್ಲಿ ಸಮಾಜಶಾಸ್ತ್ರ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "S.A","BluePrintmarksperquestion": "3"},
    {"Blueprintobjective": "ಪ್ರಶಂಸೆ/ ಕೌಶಲ್ಯ","Blueprintchapter": "ಪಾಠ ೧೬ಮೌರ್ಯರು ಮತ್ತು ಕುಶಾನರು ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "L.A 1","BluePrintmarksperquestion": "4"},
    {"Blueprintobjective": "ಪ್ರಶಂಸೆ/ ಕೌಶಲ್ಯ","Blueprintchapter": "ಪಾಠ ೨೧ಚೋಳರು ಮತ್ತು ದ್ವಾರಸಮುದ್ರದ ಹೊಯ್ಸಳರು","Blueprintnoofquestion": "1","BluePrintQuestiontype": "L.A 1","BluePrintmarksperquestion": "4"},
    {"Blueprintobjective": "ಪ್ರಶಂಸೆ/ ಕೌಶಲ್ಯ","Blueprintchapter": "ಪಾಠ ೨೨ಪ್ರಜಾಪ್ರಭುತ್ವ","Blueprintnoofquestion": "1","BluePrintQuestiontype": "L.A 1","BluePrintmarksperquestion": "4"}
  ],
  QusetionType: [
    {"QAType": "Multiple Choice Questions","QAInstruction": "ಈ ಕೆಳಗೆ  ಪ್ರಶ್ನೆಗಳಿಗೆ ನಾಲ್ಕು ಉತ್ತರ ನೀಡಲಾಗಿದೆ ಅವುಗಳಲ್ಲಿ ಸರಿಯಾದ ಒಂದನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಉತ್ತರ ಬರೆಯಿರಿ ","NQA": 4,"Mask": 1},
    {"QAType": "Fill in the Blanks Questions","QAInstruction": "ಬಿಟ್ಟ ಸ್ಥಳ ತುಂಬರಿ","NQA": 4,"Mask": 1},
    {"QAType": "One Sentence Answer Question","QAInstruction": "ಈ ಕೆಳೆಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ","NQA": 8,"Mask": 1},
    {"QAType": "Two and three Sentence Answer Questions","QAInstruction": "ಈ ಕೆಳೆಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ","NQA": 3,"Mask": 2},
    {"QAType": "Three and Four Sentence Answer Questions","QAInstruction": "ಈ ಕೆಳೆಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ","NQA": 2,"Mask": 3},
    {"QAType": "Five and Six Sentence Answer Questions","QAInstruction": "ಈ ಕೆಳೆಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ","NQA": 3,"Mask": 4}
  ],
  Weightageofthecontent: [
    {"Marks": 14},
    {"Marks": 7},
    {"Marks": 6},
    {"Marks": 4},
    {"Marks": 2},
    {"Marks": 7}
  ]
};

async function testAPI() {
  try {
    console.log("=== Testing getQuestionByClasswise API with Real Data ===\n");
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
    
    if (response.data.success?.length > 0) {
      console.log("\n=== Sample Questions ===");
      response.data.success.slice(0, 3).forEach((q, i) => {
        console.log(`\nQuestion ${i + 1}:`);
        console.log("Chapter:", q.Chapter_Name);
        console.log("Objective:", q.Objectives);
        console.log("Type:", q.Types_Question);
        console.log("Question:", q.Question?.substring(0, 100) + '...');
      });
    }

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

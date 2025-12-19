const UserSubscription = require("../../Module/Admin/UserSubscription");
const Subscription = require("../../Module/Admin/Subscription");

class UserSubscriptionController {
  // Save user subscription after successful payment
  async saveUserSubscription(req, res) {
    try {
      const {
        userId,
        subscriptionId,
        paymentId,
        transactionId,
      } = req.body;

      if (!userId || !subscriptionId) {
        return res.status(400).json({ error: "User ID and Subscription ID are required" });
      }

      // Get subscription details
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      // Check if user already has this subscription active
      const existingSubscription = await UserSubscription.findOne({
        userId,
        subscriptionId,
        isActive: true,
      });

      if (existingSubscription) {
        return res.status(400).json({ error: "You already have this subscription active" });
      }

      // Create user subscription with examination details
      const examinations = subscription.examinations.map((exam) => ({
        examinationId: exam.examinationId,
        examinationName: exam.examinationName,
        subjectId: exam.subjectId,
        subjectName: exam.subjectName,
        totalPapers: exam.questionPapers || 1,
        usedPapers: 0,
      }));

      // Set expiry date to 1 year from now
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      // Generate unique paymentId if empty to avoid duplicate key error
      const uniquePaymentId = paymentId || `SUB_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const userSubscription = await UserSubscription.create({
        userId,
        subscriptionId,
        subscriptionName: subscription.subscriptionName,
        subclassId: subscription.subclassId,
        subclassName: subscription.subclassName,
        examinations,
        price: subscription.price,
        paymentId: uniquePaymentId,
        transactionId: transactionId || uniquePaymentId,
        expiryDate,
      });

      return res.status(200).json({
        success: "Subscription activated successfully",
        data: userSubscription,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  // Get user's active subscriptions
  async getUserSubscriptions(req, res) {
    try {
      const { userId } = req.params;

      const subscriptions = await UserSubscription.find({
        userId,
        isActive: true,
        expiryDate: { $gt: new Date() },
      }).populate("subscriptionId subclassId");

      return res.status(200).json({ success: subscriptions });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  // Check if user has valid subscription for specific exam + subject
  async checkSubscription(req, res) {
    try {
      const { userId, subclassName, examinationName, subjectName } = req.body;

      console.log("=== Subscription Check ===");
      console.log("userId:", userId);
      console.log("subclassName:", subclassName);
      console.log("examinationName:", examinationName);
      console.log("subjectName:", subjectName);

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Find ALL active subscriptions for this user
      const allUserSubs = await UserSubscription.find({
        userId,
        isActive: true,
        expiryDate: { $gt: new Date() },
      });
      
      console.log("All user subscriptions count:", allUserSubs.length);
      allUserSubs.forEach((sub, i) => {
        console.log(`Sub ${i}: subclassName="${sub.subclassName}", exams:`, sub.examinations.map(e => `${e.examinationName}|${e.subjectName}`));
      });

      // Search ALL subscriptions for matching exam + subject (class check is optional)
      let matchedSubscription = null;
      let matchedExamination = null;

      // First try: Match class + exam + subject
      for (const sub of allUserSubs) {
        const classMatch = sub.subclassName === subclassName || 
                          sub.subclassName?.includes(subclassName) || 
                          subclassName?.includes(sub.subclassName);
        
        if (!classMatch) continue;

        const exam = sub.examinations.find((e) => {
          const examMatch = e.examinationName?.toLowerCase().trim() === examinationName?.toLowerCase().trim();
          const subjectMatch = !subjectName || 
                              !e.subjectName || 
                              e.subjectName?.toLowerCase().trim() === subjectName?.toLowerCase().trim();
          
          console.log(`[Class Match] Comparing: "${e.examinationName}" vs "${examinationName}" = ${examMatch}`);
          console.log(`[Class Match] Comparing: "${e.subjectName}" vs "${subjectName}" = ${subjectMatch}`);
          
          return examMatch && subjectMatch;
        });

        if (exam) {
          matchedSubscription = sub;
          matchedExamination = exam;
          break;
        }
      }

      // Second try: If no class match, search ALL subscriptions for just exam match
      if (!matchedSubscription) {
        console.log("No class+exam match found, searching all subscriptions for exam only...");
        for (const sub of allUserSubs) {
          const exam = sub.examinations.find((e) => {
            const examMatch = e.examinationName?.toLowerCase().trim() === examinationName?.toLowerCase().trim();
            const subjectMatch = !subjectName || 
                                !e.subjectName || 
                                e.subjectName?.toLowerCase().trim() === subjectName?.toLowerCase().trim();
            
            console.log(`[Any Sub] Comparing: "${e.examinationName}" vs "${examinationName}" = ${examMatch}`);
            
            return examMatch && subjectMatch;
          });

          if (exam) {
            matchedSubscription = sub;
            matchedExamination = exam;
            console.log(`Found exam in different class subscription: ${sub.subclassName}`);
            break;
          }
        }
      }

      console.log("Found matching subscription:", matchedSubscription ? "Yes" : "No");

      if (!matchedSubscription || !matchedExamination) {
        return res.status(200).json({
          hasSubscription: false,
          message: "This examination is not included in any of your subscriptions",
        });
      }

      // Check if papers are available
      const remainingPapers = matchedExamination.totalPapers - matchedExamination.usedPapers;

      if (remainingPapers <= 0) {
        return res.status(200).json({
          hasSubscription: false,
          message: "You have used all papers for this examination",
          usedPapers: matchedExamination.usedPapers,
          totalPapers: matchedExamination.totalPapers,
        });
      }

      return res.status(200).json({
        hasSubscription: true,
        subscriptionId: matchedSubscription._id,
        subscriptionName: matchedSubscription.subscriptionName,
        examinationName: matchedExamination.examinationName,
        remainingPapers,
        totalPapers: matchedExamination.totalPapers,
        usedPapers: matchedExamination.usedPapers,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  // Use a paper from subscription (call this after generating question paper)
  async usePaper(req, res) {
    try {
      const { userId, subclassName, examinationName, subjectName } = req.body;

      // Find ALL active subscriptions for this user
      const allUserSubs = await UserSubscription.find({
        userId,
        isActive: true,
        expiryDate: { $gt: new Date() },
      });

      if (allUserSubs.length === 0) {
        return res.status(404).json({ error: "No active subscription found" });
      }

      // Search ALL subscriptions for matching exam + subject
      let matchedSubscription = null;
      let matchedExamIndex = -1;

      // First try: Match class + exam + subject
      for (const sub of allUserSubs) {
        const classMatch = sub.subclassName === subclassName || 
                          sub.subclassName?.includes(subclassName) || 
                          subclassName?.includes(sub.subclassName);
        
        if (!classMatch) continue;

        const examIndex = sub.examinations.findIndex((e) => {
          const examMatch = e.examinationName?.toLowerCase().trim() === examinationName?.toLowerCase().trim();
          const subjectMatch = !subjectName || 
                              !e.subjectName || 
                              e.subjectName?.toLowerCase().trim() === subjectName?.toLowerCase().trim();
          return examMatch && subjectMatch;
        });

        if (examIndex !== -1) {
          matchedSubscription = sub;
          matchedExamIndex = examIndex;
          break;
        }
      }

      // Second try: If no class match, search ALL subscriptions for just exam match
      if (!matchedSubscription) {
        for (const sub of allUserSubs) {
          const examIndex = sub.examinations.findIndex((e) => {
            const examMatch = e.examinationName?.toLowerCase().trim() === examinationName?.toLowerCase().trim();
            const subjectMatch = !subjectName || 
                                !e.subjectName || 
                                e.subjectName?.toLowerCase().trim() === subjectName?.toLowerCase().trim();
            return examMatch && subjectMatch;
          });

          if (examIndex !== -1) {
            matchedSubscription = sub;
            matchedExamIndex = examIndex;
            break;
          }
        }
      }

      if (!matchedSubscription || matchedExamIndex === -1) {
        return res.status(404).json({ error: "Examination not found in subscription" });
      }

      const exam = matchedSubscription.examinations[matchedExamIndex];
      if (exam.usedPapers >= exam.totalPapers) {
        return res.status(400).json({ error: "No papers remaining for this examination" });
      }

      // Increment used papers
      matchedSubscription.examinations[matchedExamIndex].usedPapers += 1;
      await matchedSubscription.save();

      return res.status(200).json({
        success: "Paper used successfully",
        remainingPapers: exam.totalPapers - matchedSubscription.examinations[matchedExamIndex].usedPapers,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  // Get all user subscriptions (admin)
  async getAllUserSubscriptions(req, res) {
    try {
      const subscriptions = await UserSubscription.find({})
        .populate("userId subscriptionId subclassId")
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: subscriptions });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }
}

module.exports = new UserSubscriptionController();

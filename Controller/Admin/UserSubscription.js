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
        totalPapers: exam.questionPapers || 1,
        usedPapers: 0,
      }));

      // Set expiry date to 1 year from now
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const userSubscription = await UserSubscription.create({
        userId,
        subscriptionId,
        subscriptionName: subscription.subscriptionName,
        subclassId: subscription.subclassId,
        subclassName: subscription.subclassName,
        examinations,
        price: subscription.price,
        paymentId,
        transactionId,
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

  // Check if user has valid subscription for specific exam
  async checkSubscription(req, res) {
    try {
      const { userId, subclassId, subclassName, examinationName } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Build query - support both subclassId and subclassName
      const query = {
        userId,
        isActive: true,
        expiryDate: { $gt: new Date() },
      };
      
      if (subclassId) {
        query.subclassId = subclassId;
      } else if (subclassName) {
        query.subclassName = subclassName;
      }

      // Find active subscription for this subclass
      const userSubscription = await UserSubscription.findOne(query);

      if (!userSubscription) {
        return res.status(200).json({
          hasSubscription: false,
          message: "No active subscription found for this class",
        });
      }

      // Find the examination in the subscription
      const examination = userSubscription.examinations.find(
        (exam) => exam.examinationName === examinationName
      );

      if (!examination) {
        return res.status(200).json({
          hasSubscription: false,
          message: "This examination is not included in your subscription",
        });
      }

      // Check if papers are available
      const remainingPapers = examination.totalPapers - examination.usedPapers;

      if (remainingPapers <= 0) {
        return res.status(200).json({
          hasSubscription: false,
          message: "You have used all papers for this examination",
          usedPapers: examination.usedPapers,
          totalPapers: examination.totalPapers,
        });
      }

      return res.status(200).json({
        hasSubscription: true,
        subscriptionId: userSubscription._id,
        subscriptionName: userSubscription.subscriptionName,
        examinationName: examination.examinationName,
        remainingPapers,
        totalPapers: examination.totalPapers,
        usedPapers: examination.usedPapers,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  // Use a paper from subscription (call this after generating question paper)
  async usePaper(req, res) {
    try {
      const { userId, subclassId, subclassName, examinationName } = req.body;

      // Build query - support both subclassId and subclassName
      const query = {
        userId,
        isActive: true,
        expiryDate: { $gt: new Date() },
      };
      
      if (subclassId) {
        query.subclassId = subclassId;
      } else if (subclassName) {
        query.subclassName = subclassName;
      }

      const userSubscription = await UserSubscription.findOne(query);

      if (!userSubscription) {
        return res.status(404).json({ error: "No active subscription found" });
      }

      // Find and update the examination
      const examIndex = userSubscription.examinations.findIndex(
        (exam) => exam.examinationName === examinationName
      );

      if (examIndex === -1) {
        return res.status(404).json({ error: "Examination not found in subscription" });
      }

      const exam = userSubscription.examinations[examIndex];
      if (exam.usedPapers >= exam.totalPapers) {
        return res.status(400).json({ error: "No papers remaining for this examination" });
      }

      // Increment used papers
      userSubscription.examinations[examIndex].usedPapers += 1;
      await userSubscription.save();

      return res.status(200).json({
        success: "Paper used successfully",
        remainingPapers: exam.totalPapers - userSubscription.examinations[examIndex].usedPapers,
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

const notificationSchema = require("../../models/userModels/notificationSchema");
const ideaRequestSchema = require("../../models/userModels/productModel");
const { error, success } = require("../../responseCode");
const sendMail = require("../../services/EmailSerices");

//------->  new IdeaRequest Api
exports.ideaRequestList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const list = await ideaRequestSchema
      .find({
        $and: [
          from ? { createdAt: { $gte: new Date(from) } } : {},
          to ? { createdAt: { $lte: new Date(`${to}T23:59:59`) } } : {},
        ],
      })
      .populate(["user_Id", "category_Id", "subCategory_Id"])
      .sort({ createdAt: -1 }).lean()
    res.status(200).json(success(res.statusCode, "Success", { list }));
  } catch {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//------> Approved Idea Request Api
exports.approvedIdea = async (req, res) => {
  try {
    const id = req.params.id;
    var status = "APPROVED";
    const appreovedIdea = await ideaRequestSchema
      .findByIdAndUpdate(id, { verify: status }, { new: true })
      .populate("user_Id");
    await notificationSchema.create({
      user_Id: appreovedIdea.user_Id,
      title: "Your Idea has been approved by admin 🎉🎉",
      url:"https://patenta-sa.com/businessidea"
    });

    await sendMail(
      appreovedIdea.user_Id.Email,
      `Verify Idea`,
      appreovedIdea.user_Id.fullName_en || appreovedIdea.user_Id.companyName_en,
      `<br.
      <br>
      Your Idea has been approved by admin.<br>
      <br>
      <b> We are delighted to welcome you to Patenta, a platform where each and every idea is valued.</b>
      <br>
      Your access to our platform is now hassle-free.<br>
      <br>
      Please Login Your Account https://patenta-sa.com/login
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );

    //

    res
      .status(200)
      .json(success(res.statusCode, "Approved idea", { appreovedIdea }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-------> Decline Request Api
exports.DeclineIdea = async (req, res) => {
  try {
    const id = req.params.id;
    let status = "REJECTED";
    let data = {
      verify: status,
      declineReason: req.body.declineReason,
    };
    const declineData = await ideaRequestSchema.findByIdAndUpdate(id, data, {
      new: true,
    });

    await notificationSchema.create({
      user_Id: declineData.user_Id,
      title: "Your Idea Has Been REJECTED",
      url:"https://patenta-sa.com/businessidea"
    });
    res.status(200).json(success(res.statusCode, "Success", { declineData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-----> view Idea Request Api
exports.viewIdeaRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const detailIdea = await ideaRequestSchema
      .findById(id)
      .populate(["user_Id", "category_Id", "subCategory_Id"])
    res.status(200).json(success(res.statusCode, "Success", { detailIdea }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

///----> search Idea Api

exports.searchIdeaRequest = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please provide search key", res.statusCode));
    }
    const searchIdeas = await ideaRequestSchema.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_Id",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: "$categories" },
      { $unwind: "$users" },
      {
        $match: {
          $or: [
            {
              "users.fullName_en": { $regex: search, $options: "i" },
            },
            {
              "users.companyName_en": { $regex: search, $options: "i" },
            },
            {
              "categories.categoryName": { $regex: search, $options: "i" },
            },
          ],
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { searchIdeas }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

///--->> update Status
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    if (!status) {
      res.status(200).json(error("Please provide status", res.statusCode));
    }
    const updateStatus = await ideaRequestSchema.findById(id)
    updateStatus.status = status;
    if (updateStatus) {
      res
        .status(201)
        .json(success(res.statusCode, "Success", { updateStatus }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

// Delete Bussiness Idea Api
exports.deleteBussinessIdea = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteIdea = await ideaRequestSchema.findByIdAndDelete(id);
    if (deleteIdea) {
      res
        .status(200)
        .json(success(res.statusCode, "Deleted Data", { deleteIdea }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//how to firebase notification implement in node js?

// const admin = require('firebase-admin');

// const serviceAccount = require('./path/to/serviceAccountKey.json');

// admin.initializeApp({
//  credential: admin.credential.cert(serviceAccount),
//  databaseURL: 'https://your-database-name.firebaseio.com'
// });

// async function sendNotification(registrationToken, message) {
//   try {
//      const response = await admin.messaging().sendToDevice(registrationToken, {
//        notification: {
//          title: message.title,
//          body: message.body
//        }
//      });
//      console.log('Successfully sent message:', response);
//   } catch (error) {
//      console.log('Error sending message:', error);
//   }
//  }

//  sendNotification('registration-token-here', {
//   title: 'Test Notification',
//   body: 'This is a test notification.'
//  });

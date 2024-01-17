const chatModel = require("../../models/userModels/chatMessage");
const { error, success } = require("../../responseCode");
const User = require("../../models/userModels/UserRegister");
const chatUser = require("../../models/userModels/user");

exports.getMessages = async (chatId) => {
  try {
    // const messages = await chatMessagesSchema
    //   .find({ chatId: chatId })
    //   .populate("senderId")
    //   .populate("chatId")
    //   .sort({ createdAt: 1 })
    //   .lean();
    const msg = await chatModel.find().populate("chatId").populate("senderId");
    return msg;
  } catch (err) {
    console.log(err);
    return;
  }
};

exports.sendMessage = async (data) => {
  try {
    await chatModel.create(data);
    const messages = await chatModel
      .find({
        chatId: data.chatId,
      })
      .populate("chatId")
      .populate("senderId")
      .sort({ createdAt: 1 })
      .lean();
    return messages;
  } catch (err) {
    console.log(err);
    return;
  }
};

exports.userList = async (req, res) => {
  try {
    const userList = await User.aggregate([
      {
        $match: {
          userVerify: "APPROVED",
        },
      },
      {
        $project: {
          _id: 1,
          fullName_en: 1,
          profile: 1,
        },
      },
    ]);
    res.status(200).json(success("User List", res.statusCode, { userList }));
  } catch (err) {
    res.status(400).json(error("Error In userList", res.statusCode));
  }
};

exports.addUser = async (req, res) => {
  try {
    const { user_Id, creator_Id } = req.body;
    if (!user_Id) {
      return res
        .status(201)
        .json(error("Please Provide user_Id", res.statusCode));
    }
    if (!creator_Id) {
      return res
        .status(201)
        .json(error("Please Provide creator_Id", res.statusCode));
    }
    const user = await chatUser.create({
      user_Id: user_Id,
      creator_Id: creator_Id,
    });
    res.status(200).json(success("Success", res.statusCode, { user }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.chatUserList = async (req, res) => {
  try {
    const userList = await chatUser
      .find({ creator_Id: req.params.id })
      .populate(["user_Id", "creator_Id"]);
    res.status(200).json(success("Success", res.statusCode, { userList }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

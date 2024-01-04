const chatModel = require("../../models/userModels/chatMessage");
const { error, success } = require("../../responseCode");
const User = require("../../models/userModels/UserRegister");

exports.getMessages = async (chatId) => {
  try {
    // const messages = await chatMessagesSchema
    //   .find({ chatId: chatId })
    //   .populate("senderId")
    //   .populate("chatId")
    //   .sort({ createdAt: 1 })
    //   .lean();
    const msg = await chatModel.find().populate("chatId");
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
    res.status(200).json(success("User List", res.statusCode ,{ userList }));
  } catch (err) {
    res.status(400).json(error("Error In userList", res.statusCode));
  }
};

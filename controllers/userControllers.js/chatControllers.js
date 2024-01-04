const chatModel=require("../../models/userModels/chatMessage")

exports.getMessages = async (chatId) => {
    try {
      // const messages = await chatMessagesSchema
      //   .find({ chatId: chatId })
      //   .populate("senderId")
      //   .populate("chatId")
      //   .sort({ createdAt: 1 })
      //   .lean();
      const msg = await chatModel
        .find()
        .populate("chatId");
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
        .lean()
      return messages;
    } catch (err) {
      console.log(err);
      return;
    }
  };
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});
chatSchema.set("timestamps", true);
module.exports = mongoose.model("chatMessage", chatSchema);

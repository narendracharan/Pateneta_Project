const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
  },
  url:{
    type:String,

  },
  isRead: {
    type: Boolean,
    default: false,
  },
});
notificationSchema.set("timestamps", true);
module.exports = mongoose.model("notification", notificationSchema);

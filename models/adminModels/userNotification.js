const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  title: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});
Schema.set("timestamps", true);
module.exports = mongoose.model("userNotification", Schema);

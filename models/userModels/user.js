const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  creator_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
});
schema.set("timestamps", true);
module.exports = mongoose.model("chatUser", schema);

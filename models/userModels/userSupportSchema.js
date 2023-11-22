const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "InProgress", "Solve"],
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
});
schema.set("timestamps", true);
module.exports = mongoose.model("userSupport", schema);

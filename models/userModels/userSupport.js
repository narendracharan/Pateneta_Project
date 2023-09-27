const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  query: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Inprogress", "Solve"],
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
});
schema.set("timestamps", true);
module.exports = mongoose.model("userSupports", schema);

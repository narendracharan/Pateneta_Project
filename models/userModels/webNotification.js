const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  message: {
    type: Array,
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
schema.set("timestamps", true);
module.exports = mongoose.model("notify", schema);

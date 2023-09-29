const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  categoryName: {
    type: String,
    require: true,
  },
  catrgory_Pic: {
    type: String,
    require: true,
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
});
schema.set("timestamps", true);
module.exports = mongoose.model("category", schema);

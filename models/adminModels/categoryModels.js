const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  categoryName: {
    type: String,
    require: true,
  },
  categoryName_ar: {
    type: String,
    require: true,
  },
  category_Pic: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    default: true,
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
});
schema.set("timestamps", true);
module.exports = mongoose.model("category", schema);

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title_en: {
    type: String,
    require: true,
  },
  title_ar: {
    type: String,
    require: true,
  },
  description_en: {
    type: String,
    require: true,
  },
  description_ar: {
    type: String,
    require: true,
  },
  category_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categroy",
    require: true,
  },

  subCategory_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subCategroy",
    require: true,
  },
  subCategory_ar: {
    type: String,
    require: true,
  },
  selectDocument: {
    type: String,
    require: true,
  },
  productPic: {
    type: Array,
    require: true,
  },
  briefDescription_en: {
    type: String,
    require: true,
  },
  briefDescription_ar: {
    type: String,
    require: true,
  },
  Price: {
    type: Number,
    require: true,
  },
  ideaLogo: {
    type: String,
    require: true,
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  baseBid: {
    type: Number,
    require: true,
  },
  bidsVerify: {
    type: String,
    enum: ["PENDING", "Accepted", "Decline"],
    default: "PENDING",
  },
  highestBid: {
    type: Number,
    require: true,
  },
  verify: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  declineReason: {
    type: String,
  },
  status: {
    type: String,
    default: false,
  },
});
schema.set("timestamps", true);
module.exports = mongoose.model("product", schema);

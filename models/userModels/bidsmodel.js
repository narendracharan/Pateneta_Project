const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  baseBid: {
    type: Number,
    require: true,
  },
  bidsVerify: {
    type: String,
    enum: ["PENDING", "Accepted", "Decline"],
    default: "PENDING",
  },
  product_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
schema.set("timestamps", true);
module.exports = mongoose.model("bids", schema);

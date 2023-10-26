const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  baseBid: [
    {
      Price: {
        type: Number,
        require: true,
      },
      user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  product_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  bidsVerify: {
    type: String,
    enum: ["PENDING", "Accepted", "Decline"],
    default: "PENDING",
  },
  type: {
    type: String,
    require: true,
  },
});
schema.set("timestamps", true);
module.exports = mongoose.model("bids", schema);

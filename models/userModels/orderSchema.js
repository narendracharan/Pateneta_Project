const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  products: [
    {
      product_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        require: true,
        Price: Number,
      },
      Price: {
        type: Number,
        require: true,
      },
      bids_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        require: true,
      },
    },
  ],
  paymentStatus: {
    type: String,
    default: "Paid",
    enum: ["Paid", "Process", "Cancelled"],
  },
  paymentIntent: {
    type: String,
    default: "CARD",
   // enum: ["UPI", "Phone Pay", "COD"],
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  mobileNumber: {
    type: Number,
    require: true,
  },
  status: {
    type: String,
    default: "purchased",
    enum: ["purchased", "Recieved"],
  },
  total: {
    type: Number,
  },
  tran_ref: {
    type: String,
  },
});

schema.set("timestamps", true);
module.exports = mongoose.model("order", schema);

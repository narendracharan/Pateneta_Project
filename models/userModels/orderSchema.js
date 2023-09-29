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
      seller_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true,
      },
    },
  ],
  paymentStatus: {
    type: String,
    enum: ["Paid", "Process", "Cancelled"],
  },
  paymentIntent: {
    type: String,
    default: "Card",
    enum: ["UPI", "Phone Pay", "Card"],
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  //   cardNumber:{
  //     type:Number
  //   },
  //   securityCode:{

  //   }
});

schema.set("timestamps", true);
module.exports = mongoose.model("order", schema);

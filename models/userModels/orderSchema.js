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
      bids_Id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        require: true,
      }
    },
  ],
  paymentStatus: {
    type: String,
    default:"Paid",
    enum: ["Paid", "Process", "Cancelled"],
  },
  paymentIntent: {
    type: String,
    default: "COD",
    enum: ["UPI", "Phone Pay", "COD"],
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  total:{
    type:Number,
    require:true
  }
  //   cardNumber:{
  //     type:Number
  //   },
  //   securityCode:{

  //   }
});

schema.set("timestamps", true);
module.exports = mongoose.model("order", schema);

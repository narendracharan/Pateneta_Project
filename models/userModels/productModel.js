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
  documentName: {
    type: String,
    require: true,
  },
  category_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    require: true,
  },
  subCategory_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subCategory",
    require: true,
  },
  documentPic: {
    selectDocument: {
      type: Array,
      require: true,
    },
    typedocument: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "RECEIVED"],
    },
  },
  docSize: {
    type: Array,
    require: true,
  },
  pic: {
    productPic: {
      type: Array,
      require: true,
    },
    typePic: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "RECEIVED"],
    },
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
  present: {
    type: Number,
    require: true,
  },
  baseFare: {
    type: Number,
    require: true,
  },
  logoPic: {
    ideaLogo: {
      type: String,
      require: true,
    },
    typelogo: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "RECEIVED"],
    },
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  baseBid: [
    {
      Price: {
        type: Number,
        require: true,
      },
      user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true,
      },
      createdAt: {
        type: Date,
        require: true,
      },
      bidsVerify: {
        type: String,
        enum: ["PENDING", "Accepted", "Decline"],
        default: "PENDING",
      },
      bidsReject: {
        type: String,
        require: true,
      },
      aceptbid: {
        type: String,
        default: false,
      },
    },
  ],
  urlFile: {
    type: Array,
    require: true,
  },
  ratings: [
    {
      star: Number,
      ratingby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true,
      },
    },
  ],
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
    default: true,
  },
  buyStatus: {
    type: String,
    enum: ["PENDING", "PURCHASED"],
    default: "PENDING",
  },
  buyer_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  purchased: {
    type: String,
    default: "purchased",
    enum: ["purchased", "Recieved"],
  },
  withdrawalRequest:{
    type: Boolean,
    default:false
  },
  tran_ref: {
    type: String,
  },
  adminRequest:{
    type: Boolean,
    default:false
  },
  idea_Id:{
    type: String,
    default:"P00"
  }
});
schema.set("timestamps", true);
module.exports = mongoose.model("product", schema);

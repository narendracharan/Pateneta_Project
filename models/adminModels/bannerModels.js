const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    urlType: {
      type: String,
      required: false,
    },
    url: {
        type: String,
        required: false,
      },
  },
  { timestamps: true },
  { collection: "banner" }
);
const Banner = mongoose.model("banner", bannerSchema);

module.exports = Banner;

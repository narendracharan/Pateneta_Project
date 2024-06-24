const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
  },
  { timestamps: true },
  { collection: "images" }
);
const image = mongoose.model("images", Schema);

module.exports = image;

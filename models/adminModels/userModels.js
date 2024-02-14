const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  userEmail: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
  mobileNumber: {
    type: Number,
    require: true,
  },
  profile: {
    type: String,
    require: true,
  },
  otp: {
    type: Number,
    require: true,
  },
  expireOtp: {
    type: Date,
  },
  bankName: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  IBAN: {
    type: String,
    require: true,
  },
  commission: {
    type: Number,
    require: true,
  },
  walletTotalBalance: {
    type: Number,
    default:0
  },
});
schema.methods.AdminAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "ultra-security", {
    expiresIn: "365d",
  });
  return token;
};
schema.set("timestamps", true);
module.exports = mongoose.model("admin", schema);

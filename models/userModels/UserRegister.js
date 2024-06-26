const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  fullName_en: {
    type: String,
    require: true,
  },
  fullName_ar: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  mobileNumber: {
    type: String,
    require: true,
  },
  profile: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  companyName_en: {
    type: String,
    require: true,
  },
  companyName_ar: {
    type: String,
    require: true,
  },
  docFile: {
    type: String,
    require: true,
  },
  IdNumber: {
    type: Number,
    require: true,
  },
  companyNumber: {
    type: Number,
    require: true,
  },
  otp: {
    type: Number,
    require: true,
  },
  otpExpriTime: {
    type: Date,
  },
  verifyDocument: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  userVerify: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  //    type: {
  //     type: String,
  //     enum: ["Admin","User"],
  //   },
  commission: {
    type: Number,
  },
  coverImage: {
    type: String,
    require: true,
  },
  anotherEmail: {
    type: String,
    require: true,
  },
  DOB: {
    type: Date,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  declineDoc: {
    type: String,
    require: true,
  },
  commission: {
    type: Number,
  },
  userType: {
    type: String,
  },
  deviceId: {
    type: String,
  },
  companyType: {
    type: String,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  withdrawalRequest: {
    type: String,
    default: "PENDING",
    enum: ["PENDING", "APPROVED"],
  },
  bankName: {
    type: String,
    require: true,
  },
  OwnerName: {
    type: String,
    require: true,
  },
  iban: {
    type: String,
    require: true,
  },
  accountNumber: {
    type: Number,
    require: true,
  },
  description:{
    type:String,
    require:true
  },
  fcmToken:{
    type:String,
    require:true
  }
});
schema.methods.checkPassword = async function (plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
schema.methods.generateAdminAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "ultra-security", {
    expiresIn: "365d",
  });
  return token;
};
schema.set("timestamps", true);
module.exports = mongoose.model("user", schema);

const orderSchema = require("../../models/userModels/orderSchema");
const productSchema = require("../../models/userModels/productModel");
const userModels = require("../../models/userModels/UserRegister");
const { error, success } = require("../../responseCode");
const moment = require("moment");
const adminModels = require("../../models/adminModels/userModels");
const withdrawalSchema = require("../../models/adminModels/withdrawal");

//----> Home DashBords api
exports.homeDashboards = async (req, res) => {
  try {
    const admin = await adminModels.findOne();
    const totalSallerCount = await userModels.aggregate([
      {
        $match: {
          userVerify: "APPROVED",
          userType: "Seller",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const totalBuyerCount = await userModels.aggregate([
      {
        $match: {
          userVerify: "APPROVED",
          userType: "Buyer",
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const saleOfMonth = await orderSchema.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(moment(new Date()).startOf("month")) },
          createdAt: { $lte: new Date(moment(new Date()).endOf("month")) },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const pendingRequest = await productSchema.aggregate([
      {
        $match: {
          verify: "PENDING",
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const totalWithdrawalRequest = await withdrawalSchema.find().count();
    // const Commission = await admin.findOne();
    // const totalCommission = Commission.commission;

    const withdrawalAmount = await withdrawalSchema.aggregate([
      {
        $match: {
          status: "Approved",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$Price" },
        },
      },
    ]);

    if (withdrawalAmount.length > 0) {
      const totalAmount = withdrawalAmount[0].totalAmount;
      var totalCommission = totalAmount * (admin.commission / 100);
    }
    res.status(200).json(
      success(res.statusCode, "Success", {
        totalBuyerCount,
        totalSallerCount,
        saleOfMonth,
        pendingRequest,
        totalCommission,
        totalWithdrawalRequest,
      })
    );
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

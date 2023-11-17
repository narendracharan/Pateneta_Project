const orderSchema = require("../../models/userModels/orderSchema");
const productSchema = require("../../models/userModels/productModel");
const userModels = require("../../models/userModels/UserRegister");
const { error, success } = require("../../responseCode");
const moment = require("moment");
const admin = require("../../models/adminModels/userModels");

//----> Home DashBords api
exports.homeDashboards = async (req, res) => {
  try {
    const totalSallerCount = await productSchema.aggregate([
      {
        $match: {
          verify: "APPROVED",
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
    const totalBuyerCount = await orderSchema.aggregate([
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
    const Commission = await admin.findOne();
    const totalCommission = Commission.commission;
    res.status(200).json(
      success(res.statusCode, "Success", {
        totalBuyerCount,
        totalSallerCount,
        saleOfMonth,
        pendingRequest,
        totalCommission,
      })
    );
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

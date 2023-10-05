const orderSchema = require("../../models/userModels/orderSchema");
const productSchema = require("../../models/userModels/productModel");
const userModels=require("../../models/userModels/UserRegister")
const { error, success } = require("../../responseCode");
const moment = require("moment");

exports.homeDashboards = async (req, res) => {
  try {
    const totalSallerCount = await userModels.aggregate([
        {
            $lookup: {
              from: "product",
              foreignField: "user_Id",
              localField: "_id",
              as: "order",
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
    ])
    const totalBuyerCount = await userModels.aggregate([
        {
            $lookup: {
              from: "order",
              foreignField: "user_Id",
              localField: "_id",
              as: "order",
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
      ]);
      console.log(totalBuyerCount);
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
    res
      .status(200)
      .json(
        success(res.statusCode, "Success", {
          totalBuyerCount,
          totalSallerCount,
          saleOfMonth,
          pendingRequest,
        })
      );
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

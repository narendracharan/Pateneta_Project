const { default: mongoose } = require("mongoose");
const orderSchema = require("../../models/userModels/orderSchema");
const { error, success } = require("../../responseCode");

// Sales List Api
exports.salesList = async (req, res) => {
  try {
    const salesList = await orderSchema
      .find({ user_Id: req.params.id })
      .populate(["products.product_Id", "user_Id"]);
    res.status(200).json(success(res.statusCode, "Sucess", { salesList }));
  } catch (err) {
    res.status(400).json(error("Error in SalesList", res.statusCode));
  }
};

// User Sales Details
exports.userSalesDetails = async (req, res) => {
  try {
    const salesDeatils = await orderSchema
      .findById(req.params.id)
      .populate(["products.product_Id", "user_Id"]);
    res.status(200).json(success(res.statusCode, "Success", { salesDeatils }));
  } catch (err) {
    res.status(400).json(error("Error in SalesDetails", re.statusCode));
  }
};

// Sales Search Details Api
exports.salesSearch = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please Provide Search Key", res.statusCode));
    }
    const sales = await orderSchema.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
        },
      },
      { $unwind: "$users" },
      {
        $match: {
          $or: [
            {
              orderId: { $regex: search, $options: "i" },
            },
            {
              "users.fullName_en": { $regex: search, $options: "i" },
            },
            {
              "users.companyName_ar": { $regex: search, $options: "i" },
            },
          ],
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { sales }));
  } catch (err) {
    res.status(400).json(error("Error in Search", res.status));
  }
};

///Sales Search Details Api
exports.mySalesSearch = async (req, res) => {
  try {
    const search = req.body.search;
    const sales = await orderSchema.aggregate([
      {
        $match: {
          user_Id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
          pipeline: [{ $project: { fullName_en: 1, companyName_ar: 1 } }],
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_Id",
          foreignField: "_id",
          as: "products",
          pipeline: [
            {
              $project: {
                title_en: 1,
                user_Id: 1,
                documentPic: 1,
                pic: 1,
                logoPic: 1,
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user_Id",
                foreignField: "_id",
                as: "user_Id",
                pipeline: [{ $project: { fullName_en: 1, companyName_ar: 1 } }],
              },
            },
          ],
        },
      },
      { $unwind: "$users" },
      { $unwind: "$products" },
      {
        $match: {
          $or: [
            {
              orderId: { $regex: search, $options: "i" },
            },
            {
              "products.title_en": { $regex: search, $options: "i" },
            },
            {
              "users.fullName_en": { $regex: search, $options: "i" },
            },
            {
              "users.companyName_ar": { $regex: search, $options: "i" },
            },
          ],
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { sales }));
  } catch (err) {
    res.status(400).json(error("Error in Search", res.status));
  }
};

const UserRegister = require("../../models/userModels/UserRegister");
const orderSchema = require("../../models/userModels/orderSchema");
const productModel = require("../../models/userModels/productModel");
const { error, success } = require("../../responseCode");
const fs = require("fs");
const jsonrawtoxlsx = require("jsonrawtoxlsx");
const moment = require("moment");
const withdrawalSchema = require("../../models/adminModels/withdrawal");
const adminSchema = require("../../models/adminModels/userModels");
const { default: mongoose } = require("mongoose");
const notification=require("../../models/userModels/notificationSchema")

//Seller List Api
exports.sellerList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const list = await productModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $match: {
          $and: [
            from
              ? {
                  createdAt: {
                    $gte: new Date(moment(new Date(from)).startOf("day")),
                  },
                }
              : {},
            to
              ? {
                  createdAt: {
                    $lte: new Date(moment(new Date(to)).endOf("day")),
                  },
                }
              : {},
          ],
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { list }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//Edit Seller Api
exports.editSeller = async (req, res) => {
  try {
    const { fullName_en, companyName_en, Email, commission, createdAt } =
      req.body;
    const updateProfile = await UserRegister.findByIdAndUpdate(
      req.params.id,
      {
        fullName_en: fullName_en,
        companyName_en: companyName_en,
        Email: Email,
        commission: commission,
        createdAt: createdAt,
      },
      { new: true }
    );
    res.status(200).json(success(res.statusCode, "Success", { updateProfile }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//Seller Details Api
exports.sellerDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const details = await UserRegister.findById(id)
    res.status(200).json(success(res.statusCode, "Success", { details }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//Seller Delete Api
exports.sellerDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteSeller = await UserRegister.findByIdAndDelete(id);
    res.status(200).json(success(res.statusCode, "Success", { deleteSeller }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//Selller Search Api
exports.sellerSearch = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please provide search key", res.statusCode));
    }
    const searchIdeas = await productModel.aggregate([
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
              "users.fullName_en": { $regex: search, $options: "i" },
            },
            {
              "users.companyName_en": {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { searchIdeas }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

// Buyer Search api
exports.buyerSearch = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please provide search key", res.statusCode));
    }
    const searchIdeas = await orderSchema.aggregate([
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
              "users.fullName_en": { $regex: search, $options: "i" },
            },
            {
              "users.companyName_en": {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { searchIdeas }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//BUyer List Api
exports.buyerUserList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const buyerList = await orderSchema.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $match: {
          $and: [
            from
              ? {
                  createdAt: {
                    $gte: new Date(moment(new Date(from)).startOf("day")),
                  },
                }
              : {},
            to
              ? {
                  createdAt: {
                    $lte: new Date(moment(new Date(to)).endOf("day")),
                  },
                }
              : {},
          ],
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { buyerList }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error in Buyer Listing", res.statusCode));
  }
};

//Buyer Details Api
exports.buyerDetails = async (req, res) => {
  try {
    const buyerDetails = await UserRegister.findById(req.params.id)

    res.status(200).json(success(res.statusCode, "Success", { buyerDetails }));
  } catch (err) {
    res.status(400).json(error("Error in Buyer Details", res.statusCode));
  }
};

//Delete Buyer Api
exports.deleteBuyer = async (req, res) => {
  try {
    const deleteBuyer = await UserRegister.findByIdAndDelete(req.params.id);
    if (!deleteBuyer) {
      return res.status(201).json(error("User Not Found", res.statusCode));
    }
    res.status(200).json(success(res.statusCode, "Success", { deleteBuyer }));
  } catch (err) {
    res.status(400).json(error("Error in Buyer Delete", res.statusCode));
  }
};

//Buyer chnage Status
exports.buyerStatus = async (req, res) => {
  try {
    const status = req.body.status;
    if (!status) {
      return res
        .status(201)
        .json(error("Please Provide Status Key", res.statusCode));
    }
    const user = await UserRegister.findById(req.params.id)
    if (status) {
      user.status = status;
    }
    await user.save();
    res.status(200).json(success(res.status, "Success", { user }));
  } catch (error) {
    res.status(400).json(error("Error in Status", res.statusCode));
  }
};

//Sales User List Api
exports.salesUserList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const salesList = await orderSchema
      .find({
        $and: [
          from ? { createdAt: { $gte: new Date(from) } } : {},
          to ? { createdAt: { $lte: new Date(`${to}T23:59:59`) } } : {},
        ],
      })
      .populate(["products.product_Id", "user_Id"]);
    res.status(200).json(success(res.status, "Success", { salesList }));
  } catch (err) {
    res.status(400).json(error("Error in Sales Listing", res.statusCode));
  }
};

//Sales User Details Api
exports.salesUserDetails = async (req, res) => {
  try {
    const details = await orderSchema.aggregate([
      {
        $match:{
          _id:new mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "user_Id",
          pipeline: [
            {
              $project: {
                fullName_en: 1,
                companyName_ar: 1,
                createdAt: 1,
              },
            },
          ],

        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_Id",
          foreignField: "_id",
          as: "products",
          pipeline: [
            // {
            //   $project: {
            //     title_en: 1,
            //     user_Id: 1,
            //     documentPic: 1,
            //     pic: 1,
            //     logoPic: 1,
            //     documentName: 1,
            //     ratings: 1,
            //     purchased: 1,
            //     adminRequest: 1,
            //   },
            // },
            {
              $lookup: {
                from: "users",
                localField: "user_Id",
                foreignField: "_id",
                as: "user_Id",
                pipeline: [
                  {
                    $project: {
                      fullName_en: 1,
                      companyName_ar: 1,
                      createdAt: 1,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ])
    res.status(200).json(success(res.statusCode, "Success", { details }));
  } catch (err) {
    res.status(400).json(error("Error in Sales Details", res.statusCode));
  }
};
//Search Sales Api
exports.searchSales = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please Provide Search Key", res.statusCode));
    }
    const saleSearch = await orderSchema.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_Id",
          foreignField: "_id",
          as: "products",
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
              "users.fullName_en": { $regex: search, $options: "i" },
            },
            {
              "users.companyName_ar": { $regex: search, $options: "i" },
            },
            {
              "products.title_en": { $regex: search, $options: "i" },
            },
            {
              "products.title_ar": { $regex: search, $options: "i" },
            },
          ],
        },
      },
    ]);

    res.status(200).json(success(res.statusCode, "Success", { saleSearch }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error in Sales Searching", res.statusCode));
  }
};

//Sales Order Exports Api
exports.salesOrderExports = async (req, res) => {
  try {
    const order = await orderSchema
      .find({})
      .populate(["products.product_Id", "user_Id"]);
    let allOrders = [];
    for (const exportOrder of order) {
      let date = String(exportOrder.createdAt).split(" ");
      const newDate = `${date[2]}/${date[1]}/${date[3]}`;
      let obj = {
        "Order Date": newDate,
        "Order ID": `${exportOrder._id}`,
        "User Name": `${exportOrder.user_Id.fullName_en}`,
        "Payment Method": ` ${exportOrder.paymentIntent}`,
        "Delivery Status": `${exportOrder.paymentStatus}`,
        "Total Amount": `${exportOrder.total}`,
      };
      allOrders.push(obj);
    }
    const filename = Date.now();
    const excel = jsonrawtoxlsx(allOrders);
    const file = fs.writeFileSync(`./public/${filename}.xlsx`, excel, "binary");
    res.status(201).json(
      success(res.statusCode, "Exported Successfully", {
        file: `${process.env.BASE_URL}/${filename}.xlsx`,
      })
    );
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//Set Commission Api
exports.setCommission = async (req, res) => {
  try {
    const Commission = req.body.Commission;
    if (!Commission) {
      return res
        .status(201)
        .json(error("Please provide commission", res.statusCode));
    }
    const user = await UserRegister.updateMany({}, [
      { $set: { commission: Commission } },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { user }));
  } catch (err) {
    res.status(400).json(error("Error in Set Commission", res.statusCode));
  }
};

//withdrawalApproved

exports.withdrawalApproved = async (req, res) => {
  try {
    var status = "APPROVED";
    const user = await UserRegister.findById(req.params.id)
    if (status) {
      user.withdrawalRequest = status;
    }
    await user.save();
    res.status(200).json(success(res.statusCode, "Withdrawn Approved", {}));
  } catch (err) {
    res.status(400).json(error("Error In Approved Request", res.statusCode));
  }
};

////--------> withdrawal Request List

exports.withdrawalRequestList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const salesList = await withdrawalSchema
      .find({
        $and: [
          from ? { createdAt: { $gte: new Date(from) } } : {},
          to ? { createdAt: { $lte: new Date(`${to}T23:59:59`) } } : {},
        ],
      })
      .populate(["product_Id", "user_Id"])
      .lean();
    res.status(200).json(success(res.status, "Success", { salesList }));
  } catch (err) {
    res.status(400).json(error("Error in Sales Listing", res.statusCode));
  }
};

exports.acceptWithdrawalRequest = async (req, res) => {
  try {
    const { adminId, withdrawal_Id } = req.body;
    const withdrawal = await withdrawalSchema.findById(withdrawal_Id)
    const product = await productModel.findById(withdrawal.product_Id)
    withdrawal.status = "Approved";
    await withdrawal.save();
    product.adminRequest = true;
    product.save();
    await notification.create({
      title:"Your Withdrawal Request Has Been Approved By Admin 🎉🎉",
      user_Id:withdrawal.user_Id,
      url:""
    })
    res.status(200).json(success("Approved Request", {}, res.statusCode));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.withdrawalDetails = async (req, res) => {
  try {
    const adminCommission = await adminSchema.findOne();
    const ideasPrice=await withdrawalSchema.findById(req.params.id)
    const Details = await withdrawalSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "user_Id",
          // pipeline: [
          //   { $project: { fullName_en: 1, companyName_ar: 1, createdAt: 1 } },
          // ],
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_Id",
          foreignField: "_id",
          as: "product_Id",
          pipeline: [
            {
              $project: {
                title_en: 1,
                user_Id: 1,
                documentPic: 1,
                pic: 1,
                logoPic: 1,
                documentName: 1,
                ratings: 1,
                purchased: 1,
                adminRequest: 1,
              },
            },
            // {
            //   $lookup: {
            //     from: "users",
            //     localField: "user_Id",
            //     foreignField: "_id",
            //     as: "user_Id",
            //     pipeline: [
            //       {
            //         $project: {
            //           fullName_en: 1,
            //           companyName_ar: 1,
            //           createdAt: 1,
            //         },
            //       },
            //     ],
            //   },
            // },
          ],
        },
      },
    ]);
    const commission = ideasPrice.Price*(adminCommission.commission/ 100)
    res
      .status(200)
      .json(success(res.status, "Success", { Details, commission }));
  } catch (err) {
    res.status(400).json(error("Error in Sales Listing", res.statusCode));
  }
};

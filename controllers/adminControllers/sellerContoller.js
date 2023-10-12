const UserRegister = require("../../models/userModels/UserRegister");
const orderSchema = require("../../models/userModels/orderSchema");
const productModel = require("../../models/userModels/productModel");
const { error, success } = require("../../responseCode");
const fs = require("fs");
const jsonrawtoxlsx = require("jsonrawtoxlsx");
const moment = require("moment");

exports.sellerList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const list = await UserRegister.aggregate([
      {
        $lookup: {
          from: "products",
          foreignField: "user_Id",
          localField: "_id",
          as: "products",
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
    if (list.length > 0) {
      return res.status(200).json(success(res.statusCode, "Success", { list }));
    } else {
      res.status(201).json(error("List are Not Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

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

exports.sellerDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const details = await UserRegister.findById(id);
    res.status(200).json(success(res.statusCode, "Success", { details }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.sellerDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteSeller = await UserRegister.findByIdAndDelete(id);
    res.status(200).json(success(res.statusCode, "Success", { deleteSeller }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.sellerSearch = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please provide search key", res.statusCode));
    }
    const searchIdeas = await UserRegister.find({
      fullName_en: { $regex: search, $options: "i" },
      companyName_en: { $regex: search, $options: "i" },
      // companyName_en: { $regex: search, $options: "i" },
      //     $and: [
      //       { fullName_en: { $regex: new RegExp(search.trim(), "i") } },
      //       { companyName_en: { $regex: new RegExp(search.trim(), "i") } },
      //    ],
    });
    console.log(searchIdeas);
    if (searchIdeas.length > 0) {
      return res
        .status(200)
        .json(success(res.statusCode, "Success", { searchIdeas }));
    } else {
      res.status(201).json(error("User are not Found", res.statusCode));
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.buyerUserList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const buyerList = await UserRegister.aggregate([
      {
        $lookup: {
          from: "order",
          foreignField: "user_Id",
          localField: "_id",
          as: "order",
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

exports.buyerDetails = async (req, res) => {
  try {
    const buyerDetails = await UserRegister.findById(req.params.id);

    res.status(200).json(success(res.statusCode, "Success", { buyerDetails }));
  } catch (err) {
    res.status(400).json(error("Error in Buyer Details", res.statusCode));
  }
};

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

exports.buyerStatus = async (req, res) => {
  try {
    const status = req.body.status;
    if (!status) {
      return res
        .status(201)
        .json(error("Please Provide Status Key", res.statusCode));
    }
    const user = await UserRegister.findById(req.params.id);
    if (status) {
      user.status = status;
    }
    await user.save();
    res.status(200).json(success(res.status, "Success", { user }));
  } catch (error) {
    res.status(400).json(error("Error in Status", res.statusCode));
  }
};

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
    if (salesList.length > 0) {
      return res
        .status(200)
        .json(success(res.status, "Success", { salesList }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }

    res.status(200).json(success(res.statusCode, "Success", { salesList }));
  } catch (err) {
    res.status(400).json(error("Error in Sales Listing", res.statusCode));
  }
};
exports.salesUserDetails = async (req, res) => {
  try {
    const details = await orderSchema
      .findById(req.params.id)
      .populate(["products.product_Id", "user_Id"]);
    res.status(200).json(success(res.statusCode, "Success", { details }));
  } catch (err) {
    res.status(400).json(error("Error in Sales Details", res.statusCode));
  }
};

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

    if (saleSearch.length > 0) {
      return res
        .status(200)
        .json(success(res.statusCode, "Success", { saleSearch }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error in Sales Searching", res.statusCode));
  }
};

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
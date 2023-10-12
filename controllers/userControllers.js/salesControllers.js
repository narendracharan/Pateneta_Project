const orderSchema = require("../../models/userModels/orderSchema");
const { error, success } = require("../../responseCode");

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

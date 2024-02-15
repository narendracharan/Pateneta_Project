const orderSchema = require("../../models/userModels/orderSchema");
const productModel = require("../../models/userModels/productModel");
const { error, success } = require("../../responseCode");
const stripe = require("stripe")(
  "sk_test_51NbHnuSG9WVEqhGVYG0dgDb45pjjeb3V818JYvVfTm1Dsg95fm8EzApsT17EOOL56g7ZifI8QMgDldMFOZ4SY3UV00tRcPT4WY"
);
const fs = require("fs");
const jsonrawtoxlsx = require("jsonrawtoxlsx");
const moment = require("moment");
const notificationSchema = require("../../models/userModels/notificationSchema");
const withdrawalSchema = require("../../models/adminModels/withdrawal");
const { default: mongoose } = require("mongoose");

///-----------> Create Order APi
exports.createOrder = async (req, res) => {
  try {
    const {
      product_Id,
      Price,
      user_Id,
      name,
      email,
      mobileNumber,
      total,
      bids_Id,
      tran_ref,
    } = req.body;
    const product = await productModel.findOne({ _id: product_Id });
    new notificationSchema({
      user_Id: product.user_Id,
      title: "Your Idea Has Been PURCHASED",
    }).save();
    const status = "PURCHASED";
    product.buyStatus = status;
    product.buyer_Id = user_Id;
    await product.save();
    if (product.baseBid == "") {
      const newOrder = new orderSchema({
        products: [
          {
            product_Id: product_Id,
            Price: Price,
          },
        ],
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        user_Id: user_Id,
        total: total,
        tran_ref: tran_ref,
      });
      await newOrder.save();
      res.status(200).json(success(res.statusCode, "Success", { newOrder }));
    } else {
      const newOrder = new orderSchema({
        products: [
          {
            product_Id: product_Id,
            Price: Price,
            bids_Id: bids_Id,
          },
        ],
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        user_Id: user_Id,
        total: total,
        tran_ref: tran_ref,
      });
      await newOrder.save();
      res.status(200).json(success(res.statusCode, "Success", { newOrder }));
    }
    const products = await productModel.findOne({ _id: product_Id });
    product.purchased = "purchased";
    await products.save();
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error in Create Order", res.statusCode));
  }
};

///-------> Create Order Api
exports.orderDetails = async (req, res) => {
  try {
    const orderDetails = await orderSchema
      .findById(req.params.id)
      .populate("user_Id");
    res.status(200).json(success(res.statusCode, "Success", { orderDetails }));
  } catch (err) {
    res.status(400).json(error("Error in Order Details", res.statusCode));
  }
};

// exports.createPayment = async (req, res) => {
//   try {
//     const { carts, currency, CardNumber, cvv, expiryDate, holderName } =
//       req.body;
//     let products = [];
//     for (let i = 0; i < carts.length; i++) {
//       let object = {};
//       object.product_Id = carts[i].product_Id;
//       let getPrice = await productModel
//         .findById(carts[i].product_Id)
//         .select(" Price")
//         .exec();
//       let getBids = await productModel
//         .findById(carts[i].product_Id)
//         .select(" baseBid")
//         .exec();
//       object.Price = getPrice.Price;
//       object.baseBid = getBids.baseBid;
//       products.push(object);
//     }
//     let cartsTotal = 0;
//     for (let i = 0; i < products.length; i++) {
//       cartsTotal = cartsTotal + products[i].Price + products[i].baseBid;
//     }
//     console.log(products);
//     console.log(cartsTotal);
//     const customer = await stripe.customers.create();
//     const ephemeralKey = await stripe.ephemeralKeys.create(
//       { customer: customer.id },
//       { apiVersion: "2022-11-15" }
//     );
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: cartsTotal,
//       currency: currency,
//       customer: customer.id,
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });
//     res.status(200).json(
//       success(res.statusCode, "Success", {
//         paymentIntent: paymentIntent.client_secret,
//         ephemeralKey: ephemeralKey.secret,
//         customer: customer.id,
//         publishableKey:
//           "pk_test_51NbHnuSG9WVEqhGVzuMIANpKAShBwpIeOVUiMB5Ks0MorO5PyHKkutYA9rrOphTjOFCCXVw4d4pRntoyukDb9coV00JcgBrVwz",
//       })
//     );
//   } catch (err) {
//     console.log(err);
//     res.status(400).json(error("Failed", res.statusCode));
//   }
// };

//------> Download User Order
exports.downloadUserOrder = async (req, res) => {
  try {
    const order = await orderSchema
      .find({ _id: req.params.id })
      .populate(["products.product_Id", "user_Id"]);
    let allOrders = [];
    for (const exportOrder of order) {
      let date = String(exportOrder.createdAt).split(" ");
      const newDate = `${date[2]}/${date[1]}/${date[3]}`;
      let obj = {
        "Order Date": newDate,
        "Order ID": `${exportOrder._id}`,
        //  "Saller ID":`${exportOrder.products.length}`,
        "User Name": `${exportOrder.user_Id.fullName_en}``${exportOrder.user_Id.companyName_en}`,
        "User Email": `${exportOrder.user_Id.Email}`,
        "User MobileNumber": `${exportOrder.user_Id.mobileNumber}`,
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
    res
      .status(400)
      .json(error("Error in download Order", res.statusCode, { err }));
  }
};

//---> My Order Api
exports.myOrder = async (req, res) => {
  try {
    const orderDetails = await orderSchema
      .find({ user_Id: req.params.id })
      .populate(["user_Id", "products.product_Id"]);
    res.status(200).json(success(res.statusCode, "Success", { orderDetails }));
  } catch (err) {
    res.status(400).json(error("Error in Order Details", res.statusCode));
  }
};

///---------> Add Ratings Api

exports.addRatings = async (req, res) => {
  try {
    const { star, ratingby, idea_Id } = req.body;
    if (!star) {
      return res.status(201).json(error("Please Provide Star", res.statusCode));
    }
    if (!ratingby) {
      return res
        .status(201)
        .json(error("Please Provide ratingby", res.statusCode));
    }
    const ideas = await productModel.findById(idea_Id);
    let alreadyRated = ideas.ratings.find((user_Id) => user_Id.ratingby);
    if (alreadyRated) {
      const updateRating = await productModel.updateOne(
        { _id: idea_Id, "ratings.ratingby": ratingby },
        { $set: { "ratings.$.star": star } }
      );
      res
        .status(200)
        .json(success(res.statusCode, "Success", { updateRating }));
    } else {
      ideas.ratings.push({
        star: star,
        ratingby: ratingby,
      });
      await ideas.save();
      res
        .status(200)
        .json(success(res.statusCode, "Rating Added Successfully", { ideas }));
    }
  } catch (err) {
    res.status(400).json(error("Error In Add Ratings", res.statusCode));
  }
};

exports.updateRatings = async (req, res) => {
  try {
    const { star, ratingby, idea_Id } = req.body;
    if (!star) {
      return res.status(201).json(error("Please Provide Star", res.statusCode));
    }
    if (!ratingby) {
      return res
        .status(201)
        .json(error("Please Provide ratingby", res.statusCode));
    }

    const updateRating = await productModel.updateOne(
      { _id: idea_Id, "ratings.ratingby": ratingby },
      { $set: { "ratings.$.star": star } }
    );
    res
      .status(200)
      .json(success(res.statusCode, "Rating update Successfully", {}));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error In Add Ratings", res.statusCode));
  }
};

exports.withdrawalRequest = async (req, res) => {
  try {
    const { product_Id, user_Id, Price } = req.body;
    if (!product_Id) {
      return res
        .status(200)
        .json(error("Please Provide Product_Id", res.statusCode));
    }
    if (!user_Id) {
      return res
        .status(200)
        .json(error("Please Provide user_Id", res.statusCode));
    }
    const product = await productModel.findById(product_Id);
    product.withdrawalRequest = true;
    await product.save();
    await withdrawalSchema.create({
      product_Id: product_Id,
      user_Id: user_Id,
      Price: Price,
    });
    res
      .status(201)
      .json(success(res.statusCode, "Withdrawal Request Send", {}));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.userTotalEarning = async (req, res) => {
  try {
    const totalEarning = await withdrawalSchema.aggregate([
      {
        $match: {
          user_Id: new mongoose.Types.ObjectId(req.params.id),
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
    const totalMonthEarning = await withdrawalSchema.aggregate([
      {
        $match: {
          user_Id: new mongoose.Types.ObjectId(req.params.id),
          status: "Approved",
          createdAt: { $gte: new Date(moment(new Date()).startOf("month")) },
          createdAt: { $lte: new Date(moment(new Date()).endOf("month")) },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$Price" },
        },
      },
    ]);

    const totalPendingEarning = await withdrawalSchema.aggregate([
      {
        $match: {
          user_Id: new mongoose.Types.ObjectId(req.params.id),
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$Price" },
        },
      },
    ]);

    res.status(200).json(
      success(res.statusCode, "Success", {
        totalEarning,
        totalMonthEarning,
        totalPendingEarning,
      })
    );
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

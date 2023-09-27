const orderSchema = require("../../models/userModels/orderSchema");
const productModel = require("../../models/userModels/productModel");
const { error, success } = require("../../responseCode");
const stripe = require("stripe")(
  "sk_test_51NbHnuSG9WVEqhGVYG0dgDb45pjjeb3V818JYvVfTm1Dsg95fm8EzApsT17EOOL56g7ZifI8QMgDldMFOZ4SY3UV00tRcPT4WY"
);

exports.createPayment = async (req, res) => {
  try {
    const { carts, currency,CardNumber, cvv, expiryDate, holderName } = req.body;
    let products = [];
    for (let i = 0; i < carts.length; i++) {
      let object = {};
      object.product_Id = carts[i].product_Id;
      let getPrice = await productModel
        .findById(carts[i].product_Id)
        .select(" Price")
        .exec();
      let getBids = await productModel
        .findById(carts[i].product_Id)
        .select(" baseBid")
        .exec();
      object.Price = getPrice.Price;
      object.baseBid = getBids.baseBid;
      products.push(object);
    }
    let cartsTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartsTotal = cartsTotal + products[i].Price + products[i].baseBid
    }
    console.log(products);
    console.log(cartsTotal);
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-11-15" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cartsTotal ,
       currency: currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.status(200).json(
      success(res.statusCode, "Success", {
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey:
          "pk_test_51NbHnuSG9WVEqhGVzuMIANpKAShBwpIeOVUiMB5Ks0MorO5PyHKkutYA9rrOphTjOFCCXVw4d4pRntoyukDb9coV00JcgBrVwz",
      })
    );
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

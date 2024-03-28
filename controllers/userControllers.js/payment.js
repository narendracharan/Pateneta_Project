// const https = require("https");
// const queryString = require("querystring");
const { success } = require("../../responseCode");
const axios = require("axios");
const { error } = require("console");
const paytabs = require("paytabs_pt2");
let profileID = "107560",
  serverKey = "S6JNHJKLL2-JHMT6L29NJ-JJMWHHZWJ6",
  region = "SAU";
paytabs.setConfig(profileID, serverKey, region);
const PAYTABS_API_URL = "https://secure.paytabs.com/payment/request";

exports.initiatePayout = async (req, res) => {
  try {
    const {
      name,
      account,
      bankName,
      totalAmount,
      bank_branch,
      address,
      mobileNumber,
      sellerCommission,
      adminCommission,
      state,
      city,
      country,
    } = req.body;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer SJJNHJKLWM-JHZRDH2NJR-RR2WKL9B9N",
    };

    const response = await axios.post(
      `${PAYTABS_API_URL}`,
      {
        profile_id: 107560,
        tran_type: "sale",
        tran_class: "ecom",
        cart_id: "cart_11123",
        cart_currency: "SAR",
        cart_amount: 158.56,
        paypage_lang: "en",
        customer_details: {
          name: "vijay",
          email: "viay@domain.com",
          phone: "0522222222",
          street1: "address street",
          city: "dubai",
          state: "du",
          country: "AE",
        },
        split_payout: [
          {
            entity_id: 1000,
            entity_name: "Restaurant",
            item_description: "Meal",
            item_total: "133.56",
            beneficiary: {
              name: "ajay",
              account_number: "39238765008",
              country: "SA",
              bank: "SBI",
              bank_branch: "",
              email: "email@domain.com",
              mobile_number: "999000666",
              address_1: "Riyadh",
            },
          },
          {
            entity_id: 1001,
            entity_name: "Agency",
            item_total: "15.00",
            beneficiary: {
              name: "rakesh",
              account_number: "39238765008",
              country: "SA",
              bank: "SBI",
              bank_branch: "",
              email: "rakesh@gmail.com",
              mobile_number: "999777666",
              address_1: "Riyadh",
              address_2: "",
            },
          },
        ],
      },
      { headers: headers }
    );
    return response.data;
  } catch (error) {
    console.log("Error initiating payout:", error.response.data);
    throw new Error("Failed to initiate payout");
  }
};

////---------> Paytabs Payment Api
exports.orderPayment = async (request, respose) => {
  try {
    const {
      payment,
      userName,
      Email,
      mobileNumber,
      City,
      State,
      Country,
      Street,
    } = request.body;
    if (!payment) {
      return respose
        .status(201)
        .json(error("Please Provide Payment", respose.statusCode));
    }
    if (!userName) {
      return respose
        .status(201)
        .json(error("Please Provide userName", respose.statusCode));
    }
    if (!Email) {
      return respose
        .status(201)
        .json(error("Please Provide Email", respose.statusCode));
    }
    const transaction = {
      type: "Sale",
      class: "Ecom",
    };
    const cart = {
      id: "908893",
      currency: "SAR",
      amount: payment,
      description: "test payment",
    };
    const customer = {
      name: userName,
      email: Email,
      phone: mobileNumber,
      city: City,
      state: State,
      country: Country,
      street: Street,
    };
    const url = {
      response: "https://patenta-sa.com/payment-success",
      callback: "https://patenta-sa.com:2053/user/validate",
    };
    let paymentMethods = ["all"];
    let transaction_details = [transaction.type, transaction.class];

    let cart_details = [cart.id, cart.currency, cart.amount, cart.description];

    let customer_details = [
      customer.name,
      customer.email,
      customer.phone,
      customer.street,
      customer.city,
      customer.state,
      customer.country,
      // customer.zip,
      // customer.IP
    ];

    let shipping_address = customer_details;

    let response_URLs = [url.response, url.callback];

    let lang = "en";

    paymentPageCreated = function ($results) {
      respose
        .status(200)
        .json(success(respose.statusCode, "Success", { $results }));
    };

    let frameMode = true;
    paytabs.createPaymentPage(
      paymentMethods,
      transaction_details,
      cart_details,
      customer_details,
      shipping_address,
      response_URLs,
      lang,
      paymentPageCreated,
      frameMode
    );
  } catch (err) {
    respose.status(400).json(error("Error", respose.statusCode));
  }
};

exports.validatePayments = (req, res) => {
  var url = "https://patenta-sa.com/payment-success";
  res.redirect(url);
};

// exports.payment = async (req, res) => {
//   const path = "/v1/checkouts";
//   const data = queryString.stringify({
//     entityId: "8a8294174d0595bb014d05d829cb01cd",
//     amount: "92.00",
//     currency: "SAR",
//     paymentType: "DB",
//   });
//   console.log(data);
//   const options = {
//     port: 443,
//     host: "https://eu-test.oppwa.com/",
//     path: path,
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       "Content-Length": data.length,
//       Authorization:
//         "Bearer OGFjN2E0Yzg4YzQ0MTJkMzAxOGM1ODZmMWI4MjBkMTh8M0h6ZHN0RmdiQlAyOGN5bQ==",
//     },
//   };
//   console.log(options);
//   return new Promise((resolve, reject) => {
//     const postRequest = https.request(options, function (res) {
//       const buf = [];
//       res.on("data", (chunk) => {
//         buf.push(Buffer.from(chunk));
//       });
//       res.on("end", () => {
//         const jsonString = Buffer.concat(buf).toString("utf8");

//         try {
//           resolve(JSON.parse(jsonString));
//         } catch (error) {
//           reject(error);
//         }
//       });
//     });
//     postRequest.on("error", reject);
//     postRequest.write(data);
//     postRequest.end();
//   });
//   request().then(console.log).catch(console.error);
// };

// exports.hyperPayStep1 = async (request, response) => {
//   try {
//     let jsonRes = {};
//     var path = "/v1/checkouts";

//     const data = queryString.stringify({
//       entityId: "8a8294174d0595bb014d05d829cb01cd",
//       amount: request.body.amount,
//       currency: request.body.currency,
//       paymentType: request.body.paymentType,
//       //   user_Id: request.body.user_Id,
//       //   product_Id:request.body.product_Id
//     });
//     console.log(data);
//     var options = {
//       port: 443,
//       // host:'test.oppwa.com',
//       host: "eu-test.oppwa.com",
//       path: path,
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Content-Length": data.length,
//         Authorization:
//           "Bearer OGFjN2E0Yzg4YzQ0MTJkMzAxOGM1ODZmMWI4MjBkMTh8M0h6ZHN0RmdiQlAyOGN5bQ==",
//       },
//     };
//     let x;
//     var postRequest = await https.request(options, function (res) {
//       res.setEncoding("utf8");
//       res.on("data", function (chunk) {
//         console.log("asdadadadasdasda", JSON.parse(chunk));
//         jsonRes = JSON.parse(chunk);
//         x = JSON.parse(chunk);
//         console.log(x);
//         return response.status(200).json(
//           success(res.statusCode, "Success", {
//             data: x,
//           })
//         );
//       });
//     });
//     postRequest.write(data);
//     postRequest.end();
//   } catch (err) {
//     response.status(400).json(error("Failed", res.statusCode));
//   }
// };

// exports.hyperPayStep2 = async (request, response) => {
//   try {
//     var path = `/v1/checkouts/${request.body.checkoutId}/payment`;
//     // path += '?authentication.userId=8ac9a4ca68c1e6640168d9f9c8b65f69';
//     // path += '&authentication.password=Kk8egrf9Fh';
//     path += "&authentication.entityId=8a8294174d0595bb014d05d829cb01cd";
//     var options = {
//       port: 443,
//       host: "oppwa.com",
//       path: path,
//       method: "GET",
//     };
//     var postRequest = https.request(options, function (res) {
//       res.setEncoding("utf8");
//       res.on("data", async function (chunk) {
//         jsonRes = JSON.parse(chunk);

//         return response.status(200).json(
//           success(res.statusCode, "Success", {
//             data: jsonRes,
//           })
//         );
//       });
//     });
//     postRequest.end();
//   } catch (err) {
//     response.status(400).json(error("Failed", res.statusCode));
//   }
// };

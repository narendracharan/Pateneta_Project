const https = require("https");
const queryString = require("querystring");
const { success } = require("../../responseCode");
const { error } = require("console");
const paytabs=require("paytabs_pt2")
let profileID = "105265",
  serverKey = "STJN6W2MZH-JHG2BDB6DG-KLJHRR9ZT2",
  region = "SAU";
paytabs.setConfig(profileID, serverKey, region);

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

exports.hyperPayStep1 = async (request, response) => {
  try {
    let jsonRes = {};
    var path = "/v1/checkouts";

    const data = queryString.stringify({
      entityId: "8a8294174d0595bb014d05d829cb01cd",
      amount: request.body.amount,
      currency: request.body.currency,
      paymentType: request.body.paymentType,
    //   user_Id: request.body.user_Id,
    //   product_Id:request.body.product_Id
    });
    console.log(data);
    var options = {
      port: 443,
      // host:'test.oppwa.com',
      host: "eu-test.oppwa.com",
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": data.length,
        Authorization:
          "Bearer OGFjN2E0Yzg4YzQ0MTJkMzAxOGM1ODZmMWI4MjBkMTh8M0h6ZHN0RmdiQlAyOGN5bQ==",
      },
    };
    let x;
    var postRequest = await https.request(options, function (res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        console.log("asdadadadasdasda", JSON.parse(chunk));
        jsonRes = JSON.parse(chunk);
        x = JSON.parse(chunk);
        console.log(x);
        return response.status(200).json(
          success(res.statusCode, "Success", {
            data: x,
          })
        );
      });
    });
    postRequest.write(data);
    postRequest.end();
  } catch (err) {
    response.status(400).json(error("Failed", res.statusCode));
  }
};

exports.hyperPayStep2 = async (request, response) => {
  try {
    var path = `/v1/checkouts/${request.body.checkoutId}/payment`;
    // path += '?authentication.userId=8ac9a4ca68c1e6640168d9f9c8b65f69';
    // path += '&authentication.password=Kk8egrf9Fh';
    path += "&authentication.entityId=8a8294174d0595bb014d05d829cb01cd";
    var options = {
      port: 443,
      host: "oppwa.com",
      path: path,
      method: "GET",
    };
    var postRequest = https.request(options, function (res) {
      res.setEncoding("utf8");
      res.on("data", async function (chunk) {
        jsonRes = JSON.parse(chunk);

        return response.status(200).json(
          success(res.statusCode, "Success", {
            data: jsonRes,
          })
        );
      });
    });
    postRequest.end();
  } catch (err) {
    response.status(400).json(error("Failed", res.statusCode));
  }
};


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
      callback: "https://patenta-sa.com/payment-success",
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
        .json(success(respose.statusCode, "Suucess", { $results }));
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
    console.log(err);
    respose.status(400).json(error("Error", respose.statusCode));
  }
};
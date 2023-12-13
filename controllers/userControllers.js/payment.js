const https = require("https");
const queryString = require("querystring");
const { success } = require("../../responseCode");
const { error } = require("console");

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
      user_Id: request.body.user_Id,
      product_Id:request.body.product_Id
    });
    console.log(data);
    var options = {
      port: 443,
      // host:'test.oppwa.com',
      host: "oppwa.com",
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

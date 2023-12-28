const contentModels = require("../../models/adminModels/contentModels");
const { error, success } = require("../../responseCode");
// const admin=require("firebase-admin")
// const service=require("../../config/firebase.json")

// admin.initializeApp({
//   credential:admin.credential.cert(service)
// })

// exports.notification=async(deviceId,type,name,data)=>{
//   try{
//     const options = {
//       priority: "high",
//       timeToLive: 60 * 60 * 24,
//     };
//     let title = "";
//     let body = "";
//     if (type === "Signup") {
//       body = `${name}New User has been registered on the Platform`;
//       title = "New User has been registered on the Platform";
//     }
//     const payload = {
//       notification: {
//         title: title,
//         body: body,
//         sound: "default",
//       },
//       data: { ...data },
//     };
//     admin.messaging().sendToDevice(deviceId, payload, options)
//     .then((response) => {
//       console.log(response.results);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   return;
//   }catch(err){
//     console.log(err);
//    return
//   }
// }






















exports.PrivacyUser = async (req, res) => {
  try {
    const listPrivacy = await contentModels.find({});
    res.status(200).json(success(res.statusCode, "Success", { listPrivacy }));
    if (listPrivacy.length > 0) {
      res.status(400).json(error("List are not Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(success("Failed", res.statusCode));
  }
};


const contentModels = require("../../models/adminModels/contentModels");
const notificationSchema = require("../../models/userModels/notificationSchema");
const { error, success } = require("../../responseCode");

//------> notification List APi
exports.notificationList = async (req, res) => {
  try {
    const list = await notificationSchema.find({ user_Id: req.param.id });
    res.status(200).json(success(res.statusCode, "Success", { list }));
  } catch (err) {
    res.status(400).json(error("Error In List", res.statusCode));
  }
};

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
//     admin.messaging().sendToDevice("ekojqcIE3pEPJPYS8lVs6d:APA91bGrtSCYtumjy-hG8VA-_UpBE9qfR-ktwdnlkREgOjIJwfKKboT-3utylFUuF0iXcETr3z35ZT2tY4XNc80Q7f0hAHf0IusfkV2A1peKszFi-p2LagVUiXk6myjTO9MNhRwq5vDG", payload, options)
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

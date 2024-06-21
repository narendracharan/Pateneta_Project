const contentModels = require("../../models/adminModels/contentModels");
const notificationSchema = require("../../models/userModels/notificationSchema");
const { error, success } = require("../../responseCode");
const users = require("../../models/userModels/UserRegister");
const admin = require("firebase-admin");
const serviceAccount = require("../../config/firebase.json");
const notification=require("../../models/userModels/notificationSchema")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendNotificationUser = async (type, data, studentId) => {
  try {
    const devices = await users.find({ _id: studentId });
    for (const device of devices) {
      const count = await notification.find({
        user_Id: device.studentId,
        isRead: false,
      }).countDocuments();
      data.count = String(count);
      let title = "";
      let body = "";
     
      if (type === "EVALUATED") {
        title = "Exam Evaluated";
        body = data.description;
       

      } else if (type === "CUSTOM") {
        title = data.title;
        body = data.message;
       
      }
      if (device.fcmToken) {
        const message = {
          token: device.fcmToken,
          data: { ...data },
          notification: {
            title: title,
            body: body,
           // weburl:weburl
          },
         
          webpush: {
            data: { ...data },
            notification: {
              title: title,
              body: body,
              click_action:"https://patenta-sa.com/",
              // badge: `${process.env.BASEURL}:2053/logo.png`,
              // icon: `${process.env.BASEURL}:2053/logo.png`,
              dir: "ltr",
              data: { ...data },
            },
            fcmOptions: {
              // link: url,
            },
          },
        };
        if (data.image) {
          message.webpush.notification.image = data.image;
        }
        admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log(response);
            return;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    return;
  } catch (err) {
    console.log(err);
    return;
  }
};



//------> notification List APi
exports.notificationList = async (req, res) => {
  try {
    const list = await notificationSchema.find({ user_Id: req.params.id });
    res.status(200).json(success(res.statusCode, "Success", { list }));
  } catch (err) {
    res.status(400).json(error("Error In List", res.statusCode));
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const status = req.body.status;
    const update = await notificationSchema.updateMany(
      {
        user_Id: req.params.id,
      },
      {
        $set: {
          isRead: status,
        },
      }
    );
    res.status(200).json(success(res.statusCode, "Success", { update }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
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

exports.notificationDelete = async (req, res) => {
  try {
    const notification = await notificationSchema.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json(success(res.statusCode, "Notication Deleted", {}));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.allNotificationDelete = async (req, res) => {
  try {
    const notification = await notificationSchema.deleteMany({
      user_Id: req.params.id,
    });
    res.status(200).json(success(res.statusCode, "All Notication Deleted", {}));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

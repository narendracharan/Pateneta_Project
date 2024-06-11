const PushNotification = require("../../models/adminModels/pushNotification");
const Notification = require("../../models/userModels/notificationSchema");
const userSeller = require("../../models/userModels/UserRegister");
const { error, success } = require("../../responseCode");
const moment = require("moment");

exports.addNotification = async (req, res) => {
  try {
    const { message, name, type } = req.body;
    console.log(req.body);
    console.log(req.files);
    if (!name) {
      return res
        .status(201)
        .json(error("Please provide name!", res.statusCode));
    }
    if (!message) {
      return res
        .status(201)
        .json(error("Please provide message!", res.statusCode));
    }
    if (!type) {
      return res
        .status(201)
        .json(error("Please provide type!", res.statusCode));
    }
    let image;
    if (req.files) {
      if (req.files.length)
        image = `${process.env.BASE_URL}/${req.files[i].filename}`;
    }
    const notification = await PushNotification.create({
      name: name,
      message: message,
      type: type,
      image: image,
    });
    const Sellers = await userSeller.aggregate([
      {
        $match: {
          userType: "Seller",
        },
      },
    ]);
    for (const seller of Sellers) {
      await Notification.create({
        user_Id: seller._id,
        //type: "CUSTOM",
        title: notification.message,
        url: notification.image,
      });
      //     if (student.notification) {
      //       sendNotificationStudent(
      //         "CUSTOM",
      //         {
      //           type: "CUSTOM",
      //           title: name,
      //           message,
      //           image,
      //         },
      //         student._id
      //       );
      //     }
      //   }
      const Buyers = await userSeller.aggregate([
        {
          $match: {
            userType: "Buyer",
          },
        },
      ]);
      for (const Buyer of Buyers) {
        await Notification.create({
          user_Id: Buyer._id,
          //  type: "CUSTOM",
          title: notification.message,
          url: notification.image,
        });

        //     if (teacher.notification) {
        //       sendNotificationTeacher(
        //         "CUSTOM",
        //         {
        //           type: "CUSTOM",
        //           title: name,
        //           message,
        //           image,
        //         },
        //         teacher._id
        //       );
      }
    }
    res
      .status(201)
      .json(success("Notification added", { notification }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Error", res.statusCode));
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const { from, to, search } = req.body;
    console.log(req.body);
    const notifications = await PushNotification.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $match: {
          $or: [
            search ? { name: new RegExp(search.trim(), "i") } : {},
            search ? { email: new RegExp(search.trim(), "i") } : {},
          ],
          $and: [
            from
              ? { createdAt: { $gte: new Date(moment(from).startOf("day")) } }
              : {},
            to
              ? { createdAt: { $lte: new Date(moment(to).endOf("day")) } }
              : {},
          ],
        },
      },
    ]);
    res
      .status(201)
      .json(success("Notification", { notifications }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Error", res.statusCode));
  }
};

exports.viewNotifications = async (req, res) => {
  try {
    const notification = await PushNotification.findById(req.params._id);
    res
      .status(201)
      .json(success("Notification", { notification }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Error", res.statusCode));
  }
};

exports.deletePushNotification = async (req, res) => {
  try {
    await PushNotification.findByIdAndDelete(req.params._id);
    res.status(201).json(success("Notification Deleted", {}, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Error", res.statusCode));
  }
};

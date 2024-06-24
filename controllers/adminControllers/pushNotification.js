const PushNotification = require("../../models/adminModels/pushNotification");
const Notification = require("../../models/userModels/notificationSchema");
const userSeller = require("../../models/userModels/UserRegister");
const { error, success } = require("../../responseCode");
const moment = require("moment");
const { sendNotificationUser } = require("../userControllers.js/notification");
const { sendEmail } = require("../userControllers.js/register");
const sendMail = require("../../services/EmailSerices");
const sendNotificationEmail = require("../../services/notificationEmail");

exports.addNotification = async (req, res) => {
  try {
    const { message, name, type, weburl } = req.body;
    console.log(req.body);
    console.log(req.files);
    // let weburl = "https://patenta-sa.com/";
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
        image = `${process.env.BASE_URL}/${req.files[0].filename}`;
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
        type: "CUSTOM",
        title: notification.message,
        image: notification.image,
      });
      if (seller) {
        sendNotificationUser(
          "CUSTOM",
          {
            type: "CUSTOM",
            title: name,
            message,
            image,
          },
          seller._id
        );
      }
      await sendNotificationEmail(
        seller.Email,
        `Notification`,
        notification.name,
        notification.message
      );
    }
    const Buyer = await userSeller.aggregate([
      {
        $match: {
          userType: "Buyer",
        },
      },
    ]);
    for (const buyer of Buyer) {
      await Notification.create({
        user_Id: buyer._id,
        type: "CUSTOM",
        title: notification.message,
        image: notification.image,
      });
      if (buyer) {
        sendNotificationUser(
          "CUSTOM",
          {
            type: "CUSTOM",
            title: name,
            message,
            image,
          },
          buyer._id
        );
        await sendNotificationEmail(
          buyer.Email,
          `Notification`,
          notification.name,
          notification.message
        );
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

exports.sendAgain = async (req, res) => {
  try {
    const notification = await PushNotification.findById(req.params.id);
    const buyer = await userSeller.find({});
    for (const buyers of buyer) {
      await Notification.create({
        user_Id: buyers._id,
        type: "CUSTOM",
        title: notification.message,
        image: notification.image,
      });
      if (buyers) {
        sendNotificationUser(
          "CUSTOM",
          {
            type: "CUSTOM",
            title: notification.name,
            message: notification.message,
            image: notification.image,
          },
          buyers._id
        );
        await sendMail(
          buyers.Email,
          `Notification`,
          buyers.fullName_en || buyers.companyName_en,
          `<br.
          <br>
            ${notification.message} <br>
          <br>
      
  
          <br>
          Patenta<br>
          Customer Service Team<br>
          91164721
          `
        );
      }
    }
    res
      .status(201)
      .json(success("Notification sent again", {}, res.statusCode));
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
    const notification = await PushNotification.findById(req.params.id);
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
    await PushNotification.findByIdAndDelete(req.params.id);
    res.status(201).json(success("Notification Deleted", {}, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Error", res.statusCode));
  }
};

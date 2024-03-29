const userNotify = require("../../models/adminModels/userNotification");
const ideaNotify = require("../../models/adminModels/ideaNotification");
const { error, success } = require("../../responseCode");

exports.userNotificationlist = async (req, res) => {
  try {
    const notification = await userNotify.find({}).lean()
    res.status(200).json(success(res.statusCode, "Success", { notification }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.ideaNotificationlist = async (req, res) => {
  try {
    const notification = await ideaNotify.find({}).lean()
    res.status(200).json(success(res.statusCode, "Success", { notification }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.userUpdateStatus = async (req, res) => {
  try {
    const status=req.body.status
    const update = await userNotify.updateMany({
      $set: {
        isRead: status,
      },
    });
    res.status(200).json(success(res.statusCode, "Success", { update }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.ideaUpdateStatus = async (req, res) => {
  try {
    const status=req.body.status
    const update = await ideaNotify.updateMany({
      $set: {
        isRead: status,
      },
    });
    res.status(200).json(success(res.statusCode, "Success", { update }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

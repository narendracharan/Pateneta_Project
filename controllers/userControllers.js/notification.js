const contentModels = require("../../models/adminModels/contentModels");
const userSupport = require("../../models/userModels/userSupport");
const notifySchema = require("../../models/userModels/webNotification");
const { error, success } = require("../../responseCode");

exports.pushNotification = async (req, res) => {
  try {
    const { message, user_Id } = req.body;
    const newNotification = new notifySchema({
      user_Id: user_Id,
    });
    newNotification.message.push(message);
    await newNotification.save();
    res
      .status(200)
      .json(success(res.statusCode, "Success", { newNotification }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

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

exports.createReports = async (req, res) => {
  try {
    const { name, query, user_Id } = req.body;
    if (!name) {
      res.status(201).json(error("please provide name"));
    }
    if (!query) {
      res.status(201).json(error("please provide query"));
    }
    const newReport = new userSupport({
      name: name,
      query: query,
      user_Id: user_Id,
    });
    await newReport.save();
    res.status(200).json(success(res.statusCodem, "Success", { newReport }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

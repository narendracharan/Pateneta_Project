const supportSchema = require("../../models/userModels/userSupportSchema");
const { error, success } = require("../../responseCode");

exports.createReports = async (req, res) => {
  try {
    const { name, query, user_Id } = req.body;
    if (!name) {
      res.status(201).json(error("please provide name"));
    }
    if (!query) {
      res.status(201).json(error("please provide query"));
    }
    const newReport = new supportSchema({
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


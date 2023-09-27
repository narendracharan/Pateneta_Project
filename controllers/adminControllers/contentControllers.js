const contentSchema = require("../../models/adminModels/contentModels");
const { findByIdAndDelete } = require("../../models/userModels/UserRegister");
const userSupport = require("../../models/userModels/userSupport");
const { error, success } = require("../../responseCode");

exports.createContent = async (req, res) => {
  try {
    const { title_en, Description_en, title_ar, Description_ar } = req.body;
    const newContent = new contentSchema({
      title_en: title_en,
      Description_en: Description_en,
      title_ar: title_ar,
      Description_ar: Description_ar,
    });
    const newData = await newContent.save();
    res.status(200).json(success(res.statusCode, "Success", { newData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.ContentList = async (req, res) => {
  try {
    const listData = await contentSchema.find({});
    res.status(200).json(success(res.statusCode, "Success", { listData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.updateContent = async (req, res) => {
  try {
    const id = req.params.id;
    const { title_en, Description_en, title_ar, Description_ar } = req.body;
    let updateContent = await contentSchema.findByIdAndUpdate(id, {
      title_en: title_en,
      Description_en: Description_en,
      title_ar: title_ar,
      Description_ar: Description_ar,
    });
    res.status(200).json(success(res.statusCode, "Success", { updateContent }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.reportsList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const reportsList = await userSupport.find({
      $and: [
        from ? { createdAt: { $gte: new Date(from) } } : {},
        to ? { createdAt: { $lte: new Date(`${to}T23:59:59`) } } : {},
      ],
    });
    if (reportsList) {
      return res
        .status(201)
        .json(success(res.statusCode, "Success", { reportsList }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.reportsSearch = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      res.status(201).json(error("please provide search key", res.statusCode));
    }
    const searchData = await userSupport.find({
      name: { $regex: search, $options: "i" },
      query: { $regex: search, $options: "i" },
    });
    if (searchData) {
      res.status(200).json(success(res.statusCode, "Success", { searchData }));
    } else {
      res.status(201).json(error("Failed", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.reportsView = async (req, res) => {
  try {
    const id = req.params.id;
    const reportsDetails = await userSupport.findById(id);
    if (reportsDetails) {
      res
        .status(200)
        .json(success(res.statusCode, "Success", { reportsDetails }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.editReports = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, query, status } = req.body;
    if (!status) {
      res.status(201).json(error("please provide status", res.statusCode));
    }
    const updateData = await userSupport.findByIdAndUpdate(
      id,
      { name: name, query: query, status: status },
      { new: true }
    );
    if (updateData) {
      res.status(200).json(success(res.statusCode, "Success", { updateData }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.deleteReports = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteReport = await userSupport.findByIdAndDelete(id);
    if (deleteReport) {
      res
        .status(200)
        .json(success(res.statusCode, "Success", { deleteReport }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

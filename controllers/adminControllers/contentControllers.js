const contentSchema = require("../../models/adminModels/contentModels");
const userSupport = require("../../models/userModels/userSupportSchema");
const { error, success } = require("../../responseCode");

//create Content Api
exports.createContent = async (req, res) => {
  try {
    const { title_en, Description_en, title_ar, Description_ar } = req.body;
    if (!title_en) {
      return res
        .status(201)
        .json(error("please provide title_en", res.statusCode));
    }
    if (!Description_en) {
      return res
        .status(201)
        .json(error("please provide Description_en", res.statusCode));
    }
    if (!Description_ar) {
      return res
        .status(201)
        .json(error("please provide Description_ar", res.statusCode));
    }
    if (!title_ar) {
      return res
        .status(201)
        .json(error("please provide title_ar", res.statusCode));
    }
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

//Content List Api
exports.ContentList = async (req, res) => {
  try {
    const listData = await contentSchema.find({}).lean()
    res.status(200).json(success(res.statusCode, "Success", { listData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

// Update Content Api
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

//Reports List Api
exports.reportsList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const reportsList = await userSupport.find({
      $and: [
        from ? { createdAt: { $gte: new Date(from) } } : {},
        to ? { createdAt: { $lte: new Date(`${to}T23:59:59`) } } : {},
      ],
    }).lean()
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

//Reports Search Api
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

//Reports View Api
exports.reportsView = async (req, res) => {
  try {
    const id = req.params.id;
    const reportsDetails = await userSupport.findById(id)
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

//edits Reports Api
exports.editReports = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, message, status } = req.body;
    if (!status) {
      res.status(201).json(error("please provide status", res.statusCode));
    }
    const updateData = await userSupport.findByIdAndUpdate(
      id,
      { name: name, message: message, status: status },
      { new: true }
    );

    res.status(200).json(success(res.statusCode, "Success", { updateData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//Delete Reports Api
exports.deleteReports = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteReport = await userSupport.findByIdAndDelete(id);

    res.status(200).json(success(res.statusCode, "Success", { deleteReport }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

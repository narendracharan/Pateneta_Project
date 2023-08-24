const UserRegister = require("../../models/userModels/UserRegister");
const productModel = require("../../models/userModels/productModel");
const { error, success } = require("../../responseCode");

exports.sellerList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const list = await productModel
      .find({
        $and: [
          from ? { createdAt: { $gte: new Date(from) } } : {},
          to ? { createdAt: { $lte: new Date(`${to}T23:59:59`) } } : {},
        ],
      })
      .populate("user_Id")
      .sort({ createdAt: -1 });
    if (list.length > 0) {
      return res.status(200).json(success(res.statusCode, "Success", { list }));
    } else {
      res.status(201).json(error("List are Not Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.editSeller = async (req, res) => {
  try {
    const { fullName_en, companyName_en, Email, commission, createdAt } =
      req.body;
    const updateProfile = await UserRegister.findByIdAndUpdate(
      req.params.id,
      {
        fullName_en: fullName_en,
        companyName_en: companyName_en,
        Email: Email,
        commission: commission,
        createdAt: createdAt,
      },
      { new: true }
    );
    res.status(200).json(success(res.statusCode, "Success", { updateProfile }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.sellerDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const details = await UserRegister.findById(id);
    res.status(200).json(success(res.statusCode, "Success", { details }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.sellerDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteSeller = await UserRegister.findByIdAndDelete(id);
    res.status(200).json(success(res.statusCode, "Success", { deleteSeller }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.sellerSearch = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please provide search key", res.statusCode));
    }
    const searchIdeas = await UserRegister.find({
      fullName_en: { $regex: search, $options: "i" },
      // companyName_en: { $regex: search, $options: "i" },
      //     $and: [
      //       { fullName_en: { $regex: new RegExp(search.trim(), "i") } },
      //       { companyName_en: { $regex: new RegExp(search.trim(), "i") } },
      //    ],
    });
    console.log(searchIdeas);
    if (searchIdeas.length > 0) {
      return res.status(200).json(success(res.statusCode, "Success", { searchIdeas }));
    } else {
      res.status(201).json(error("User are not Found", res.statusCode));
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

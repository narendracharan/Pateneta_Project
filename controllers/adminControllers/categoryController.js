const categoryModels = require("../../models/adminModels/categoryModels");
const subCategoryModel = require("../../models/adminModels/subCategoryModel"); //----> create category api
const { error, success } = require("../../responseCode");

exports.createCategory = async (req, res) => {
  try {
    const { categoryName, user_Id } = req.body;
    if (!categoryName) {
      return res
        .status(201)
        .json(error("plz provide categoryName", res.statusCode));
    }
    if (!user_Id) {
      return res.status(201).json(error("plz provide user_Id", res.statusCode));
    }
    const newOne = new categoryModels({
      categoryName: categoryName,
      user_Id: user_Id,
      catrgory_Pic: req.file.filename,
    });
    const categoryData = await newOne.save();
    res.status(200).json(success(res.statusCode, "Success", { categoryData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//------>create subCategory Api
exports.createSubCategory = async (req, res) => {
  try {
    const { subCategoryName, user_Id, category_Id } = req.body;
    if (!subCategoryName) {
      return res
        .status(201)
        .json(error("plz provide subCategoryName", res.statusCode));
    }
    if (!user_Id) {
      return res.status(201).json(error("plz provide user_Id", res.statusCode));
    }
    const newOne = new subCategoryModel({
      subCategoryName: subCategoryName,
      user_Id: user_Id,
      subCategoryPic: req.file.filename,
      category_Id: category_Id,
    });
    const subCategoryData = await newOne.save();
    res
      .status(200)
      .json(success(res.statusCode, "Success", { subCategoryData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-------> category list Api
exports.categoryList = async (req, res) => {
  try {
    const listData = await categoryModels.find({});
    if (listData.length > 0) {
      res.status(200).json(success(res.statusCode, "Success", { listData }));
    } else {
      res.status(201).json(error("List are not found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-------> SubCategory list Api
exports.subCategoryList = async (req, res) => {
  try {
    const listData = await subCategoryModel.find({});
    if (listData.length > 0) {
      res.status(200).json(success(res.statusCode, "Success", { listData }));
    } else {
      res.status(201).json(error("List are not found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//---> upate Category

exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = {
      categoryName: req.body.categoryName,
      categoryPic: req.file.filename,
    };
    if (data) {
      const updateData = await categoryModels.findByIdAndUpdate(id, data, {
        new: true,
      });
      res.status(200).json(success(res.statusCode, "Success", { updateData }));
    } else {
      res.status(201).json(error("All Filed are required", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----> update Sub Category Api
exports.updateSubCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = {
      subCategoryName: req.body.subCategoryName,
      subCategoryPic: req.file.filename,
      category_Id: req.body.category_Id,
    };
    if (data) {
      const updateData = await subCategoryModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      res.status(200).json(success(res.statusCode, "Success", { updateData }));
    } else {
      res.status(201).json(error("All Filed are required", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----> delete category Api
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteData = await categoryModels.findByIdAndDelete(id);
    res
      .status(200)
      .json(success(res.statusCode, "Deleted Data", { deleteData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};
//------> delete subCategory Api
exports.deleteSubCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteData = await subCategoryModel.findByIdAndDelete(id);
    res
      .status(200)
      .json(success(res.statusCode, "Deleted Data", { deleteData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----------> category-Search Api
exports.categorySearch = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please provide search key", res.statusCode));
    }
    const searchIdeas = await categoryModels.find({
      $and: [{ categoryName: { $regex: new RegExp(search.trim(), "i") } }],
    });
    if (searchIdeas.length > 0) {
      return res
        .status(200)
        .json(success(res.statusCode, "Success", { searchIdeas }));
    } else {
      res.status(201).json(error("category are not Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----------> category-Search Api
exports.subCategorySearch = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please provide search key", res.statusCode));
    }
    const searchIdeas = await subCategoryModel.find({
      $and: [{ categoryName: { $regex: new RegExp(search.trim(), "i") } }],
    });
    if (searchIdeas.length > 0) {
      return res
        .status(200)
        .json(success(res.statusCode, "Success", { searchIdeas }));
    } else {
      res.status(201).json(error("subCategory are not Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.categoryStatus = async (req, res) => {
  try {
    const status = req.body.status;
    if (!status) {
      return res
        .status(201)
        .json(error("Please Provide Status Key", res.statusCode));
    }
    const categoryStatus = await categoryModels.findById(req.params.id);
    if (status) {
      categoryStatus.status = status;
    }
    await categoryStatus.save();
    res
      .status(200)
      .json(success(res.statusCode, "Success", { categoryStatus }));
  } catch (err) {
    res.status(400).json(error("Error in Category Status", res.statusCode));
  }
};


exports.subCategoryStatus = async (req, res) => {
  try {
    const status = req.body.status;
    if (!status) {
      return res
        .status(201)
        .json(error("Please Provide Status Key", res.statusCode));
    }
    const subCategoryStatus = await categoryModels.findById(req.params.id);
    if (status) {
      subCategoryStatus.status = status;
    }
    await subCategoryStatus.save();
    res
      .status(200)
      .json(success(res.statusCode, "Success", { subCategoryStatus }));
  } catch (err) {
    res.status(400).json(error("Error in Category Status", res.statusCode));
  }
};
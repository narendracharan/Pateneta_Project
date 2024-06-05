const categoryModels = require("../../models/adminModels/categoryModels");
const subCategoryModel = require("../../models/adminModels/subCategoryModel"); //----> create category api
const { error, success } = require("../../responseCode");

///----- Create Category Api
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
      category_Pic: `${process.env.BASE_URL}/${req.file.filename}`,
    });
    const categoryData = await newOne.save();
    res.status(200).json(success(res.statusCode, "Success", { categoryData }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error In Add Category", res.statusCode));
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
      subCategoryPic: `${process.env.BASE_URL}/${req.file.filename}`,
      category_Id: category_Id,
    });
    const subCategoryData = await newOne.save();
    res
      .status(200)
      .json(success(res.statusCode, "Success", { subCategoryData }));
  } catch (err) {
    res.status(400).json(error("Error In  Add SubCategory ", res.statusCode));
  }
};

//-------> category list Api
exports.categoryList = async (req, res) => {
  try {
    const listData = await categoryModels.find({}).lean();
    if (listData.length > 0) {
      res.status(200).json(success(res.statusCode, "Success", { listData }));
    } else {
      res.status(201).json(error("List are not found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Error In Category List", res.statusCode));
  }
};

//-------> SubCategory list Api
exports.subCategoryList = async (req, res) => {
  try {
    const listData = await subCategoryModel.find({}).lean();
    if (listData.length > 0) {
      res.status(200).json(success(res.statusCode, "Success", { listData }));
    } else {
      res.status(201).json(error("List are not found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Error In SubCategory List", res.statusCode));
  }
};

//---> upate Category

exports.updateCategory = async (req, res) => {
  try {
    const { categoryName, user_Id } = req.body;
    const id = req.params.id;
    const category = await categoryModels.findById(id);
    if (categoryName) {
      category.categoryName = categoryName;
    }
    if (req.file) {
      category.category_Pic = `${process.env.BASE_URL}/${req.file.filename}`;
    }
    await category.save();
    res.status(200).json(success(res.statusCode, "Success", { category }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----> update Sub Category Api
exports.updateSubCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { subCategoryName, category_Id } = req.body;
    const subCategory = await subCategoryModel.findById(id);
    if (subCategoryName) {
      subCategory.subCategoryName = subCategoryName;
    }
    if (category_Id) {
      subCategory.category_Id = category_Id;
    }
    if (req.file) {
      subCategory.subCategoryPic = `${process.env.BASE_URL}/${req.file.filename}`;
    }
    await subCategory.save();
    res.status(200).json(success(res.statusCode, "Success", { subCategory }));
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
    const searchIdeas = await categoryModels
      .find({
        $and: [{ categoryName: { $regex: new RegExp(search.trim(), "i") } }],
      })
      .lean();
    res.status(200).json(success(res.statusCode, "Success", { searchIdeas }));
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
    const searchIdeas = await subCategoryModel
      .find({
        $and: [{ categoryName: { $regex: new RegExp(search.trim(), "i") } }],
      })
      .lean();

    res.status(200).json(success(res.statusCode, "Success", { searchIdeas }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//category status change api
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

//SUbCategory Status Change Api
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

//-------> SubCategory list Api
exports.subCategory = async (req, res) => {
  try {
    const listData = await subCategoryModel.find({
      category_Id: req.params.id,
    });
    if (listData.length > 0) {
      res.status(200).json(success(res.statusCode, "Success", { listData }));
    } else {
      res.status(201).json(error("List are not found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Error In SubCategory List", res.statusCode));
  }
};

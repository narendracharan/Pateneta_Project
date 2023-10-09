const productSchema = require("../../models/userModels/productModel");
const { error, success } = require("../../responseCode");
const userSchema = require("../../models/userModels/UserRegister");
const categoryModels = require("../../models/adminModels/categoryModels");
const subCategoryModel = require("../../models/adminModels/subCategoryModel");
const productModel = require("../../models/userModels/productModel");
const { resetPassword } = require("./register");

//---------> create bussiness idea api
exports.createIdea = async (req, res) => {
  try {
    const idea = new productSchema(req.body);
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == "productPic") {
          idea.productPic.push(req.files[i].filename);
        }
        if (req.files[i].fieldname == "ideaLogo") {
          idea.ideaLogo = req.files[i].filename;
        }
      }
    }
    const saveIdea = await idea.save();
    res.status(201).json(success(res.statusCode, "Success", { saveIdea }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----> update bussiness idea

exports.updateBussinessIdea = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      title_en,
      title_ar,
      description_en,
      description_ar,
      category_Id,
      subCategory_Id,
      briefDescription_en,
      briefDescription_ar,
      Price,
      ideaLogo,
      baseBid,
    } = req.body;
    const product = await productSchema.findById(id);
    if (title_en) {
      product.title_en = title_en;
    }
    if (title_ar) {
      product.title_ar = title_ar;
    }
    if (description_en) {
      product.description_en = description_en;
    }
    if (description_ar) {
      product.description_ar = description_ar;
    }
    if (category_Id) {
      product.category_Id = category_Id;
    }
    if (subCategory_Id) {
      product.subCategory_Id = subCategory_Id;
    }
    if (briefDescription_en) {
      product.briefDescription_en = briefDescription_en;
    }
    if (briefDescription_ar) {
      product.briefDescription_ar = briefDescription_en;
    }
    if (Price) {
      product.Price = Price;
    }
    if (baseBid) {
      product.baseBid = baseBid;
    }
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == "productPic") {
          product.productPic = req.files[i].filename;
        }
        if (req.files[i].fieldname == "ideaLogo") {
          product.ideaLogo = req.files[i].filename;
        }
      }
    }
    await product.save();
    res.status(200).json(success(res.statusCode, "Success", { product }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-----------> list of bussiness ideas Api
exports.listBussinesIdeas = async (req, res) => {
  try {
    const verify = await productSchema.aggregate([
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "user_Id",
      //     foreignField: "_id",
      //     as: "categories",
      //   },
      // },
      {
        $match: {
          verify: "APPROVED",
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { verify }));
  } catch (err) {
    res.status(400).json(error("Error in Listing", res.statusCode));
  }
};

//----> search bussiness idea api
exports.searchBussinessIdea = async (req, res) => {
  try {
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please provide search key", res.statusCode));
    }
    const searchIdeas = await productSchema.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category_Id",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory_Id",
          foreignField: "_id",
          as: "subcategoriess",
        },
      },
       { $unwind: "$categories" },
      { $unwind: "$subcategoriess" },
      {
        $match: {
          $or: [
            {
              title_en: { $regex: search, $options: "i" },
            },
            {
              description_en: { $regex: search, $options: "i" },
            },
            {
              briefDescription_en: { $regex: search, $options: "i" },
            },
            {
              "categories.categoryName": { $regex: search, $options: "i" },
            },
            {
              "subcategoriess.subCategoryName": { $regex: search, $options: "i" },
            },
          ],
        },
      },
    ])
    //find({
    //   $and: [
    //     { title_en: { $regex: new RegExp(search.trim(), "i") } },
    //     { description_en: { $regex: new RegExp(search.trim(), "i") } },
    //     { category_en: { $regex: new RegExp(search.trim(), "i") } },
    //     { subCategory_en: { $regex: new RegExp(search.trim(), "i") } },
    //     { briefDescription_en: { $regex: new RegExp(search.trim(), "i") } },
    //   ],
    // });
    if (searchIdeas.length > 0) {
      return res
        .status(200)
        .json(success(res.statusCode, "Success", { searchIdeas }));
    } else {
      res.status(201).json(error("Ideas are not Found", res.statusCode));
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----------> addbase Bid Api
exports.addBids = async (req, res) => {
  try {
    const id = req.params.id;
    const { Price, user_Id } = req.body;
    if (!Price) {
      res.status(201).json(error("Please provide Price", res.statusCode));
    }
    if (!user_Id) {
      res.status(201).json(error("Please Provide User_Id", res.statusCode));
    }
    const product = await productSchema.findById({ _id: id });
    product.baseBid.push({
      Price: Price,
      user_Id: user_Id,
    });
    const newProduct = await product.save();
    res.status(200).json(success(res.statusCode, "Success", { newProduct }));
  } catch (err) {
    res.status(200).json(error("Failed", res.statusCode));
  }
};

//-----> list of biseBid APi
exports.baseBidList = async (req, res) => {
  try {
    const list = await productSchema
      .find({ user_Id: req.params.id })
      .populate("user_Id");
    const bidsData = list.filter((x) => x.baseBid);
    res.status(200).json(success(res.statusCode, "Success", { bidsData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-----> my bussiness Idea Api
exports.myBussinessIdea = async (req, res) => {
  try {
    const id = req.params.id;
    let Bids = [];

    let myIdeas = await productSchema.find().populate("user_Id");

    for (let i = 0; i < myIdeas.length; i++) {
      var baseBide = myIdeas[i].baseBid.filter(
        (baseBide) => String(baseBide.user_Id) === String(id)
      );
      let obj = {
        baseBide: baseBide,
        title: myIdeas[i].title_en,
        title_ar: myIdeas[i].title_ar,
        bidStatus: myIdeas[i].bidsVerify,
        user: myIdeas[i].user_Id.fullName_en,
        date: myIdeas[i].createdAt,
      };
      Bids.push(obj);
    }
    res.status(200).json(success(res.statusCode, "Success", { Bids }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//--->> bids view

exports.bidsView = async (req, res) => {
  try {
    const bidsView = await productModel.findById(req.params.id);
    res.status(200).json(success(res.statusCode, "Success", { bidsView }));
  } catch (err) {
    res.status(400).json(error("Error in bids View", res.statusCode));
  }
};

///---------> Category Listing Api

exports.CategoryListing = async (req, res) => {
  try {
    const categoryList = await categoryModels.find({});
    res.status(200).json(success(res.statusCode, "Success", { categoryList }));
    if (categoryList.length > 0) {
      res.status(200).json(success(res.statusCode, "Success", { listData }));
    } else {
      res.status(201).json(error("List are not found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};
//-------> subCategory Listing APi
exports.subCategoryListing = async (req, res) => {
  try {
    const id = req.params.id;
    const categoryList = await subCategoryModel.find({ category_Id: id }).populate("category_Id")
    res.status(200).json(success(res.statusCode, "Success", { categoryList }));
    if (categoryList.length > 0) {
      res.status(200).json(success(res.statusCode, "Success", { listData }));
    } else {
      res.status(201).json(error("List are not found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.lowtoHighPrice = async (req, res) => {
  try {
    const productFilter = await productSchema.find({}).sort({ Price: 1 });
    if (productFilter) {
      res
        .status(200)
        .json(success(res.statusCode, "Success", { productFilter }));
    } else {
      res.status(201).json(error("NO Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.highToLowPrice = async (req, res) => {
  try {
    const productFilter = await productSchema.find({}).sort({ Price: -1 });
    if (productFilter) {
      res
        .status(200)
        .json(success(res.statusCode, "Success", { productFilter }));
    } else {
      res.status(201).json(error("Failed", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

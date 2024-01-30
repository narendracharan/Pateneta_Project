const productSchema = require("../../models/userModels/productModel");
const { error, success } = require("../../responseCode");
const userSchema = require("../../models/userModels/UserRegister");
const categoryModels = require("../../models/adminModels/categoryModels");
const subCategoryModel = require("../../models/adminModels/subCategoryModel");
const productModel = require("../../models/userModels/productModel");
const adminSchema = require("../../models/adminModels/userModels");
const sendMail = require("../../services/EmailSerices");
const { default: mongoose } = require("mongoose");
const notification = require("../../models/userModels/notificationSchema");

//---------> create bussiness idea api
exports.createIdea = async (req, res) => {
  try {
    const {
      title_en,
      title_ar,
      description_en,
      description_ar,
      documentName,
      category_Id,
      subCategory_Id,
      briefDescription_en,
      briefDescription_ar,
      Price,
      selectDocument,
      user_Id,
      baseFare,
      urlFile,
      present,
    } = req.body;
    const admin = await adminSchema.findOne();
    const userVerify = await userSchema.findOne({ _id: user_Id });
    const idea = await productSchema.findOne({ title_en: title_en });
    if (idea) {
      return res
        .status(201)
        .json(error("Title Name is already register", res.statusCode));
    }
    if (userVerify.verifyDocument != "APPROVED") {
      return res
        .status(201)
        .json(error("Please Complete Your Kyc", res.statusCode));
    }

    let newIdeas = new productSchema({
      title_en: title_en,
      title_ar: title_ar,
      description_en: description_en,
      description_ar: description_ar,
      category_Id: category_Id,
      subCategory_Id: subCategory_Id,
      briefDescription_ar: briefDescription_ar,
      briefDescription_en: briefDescription_en,
      Price: Price * (1 + admin.commission / 100),
      user_Id: user_Id,
      documentName: documentName,
      // baseFare: baseFare,
      urlFile: urlFile,
      present: present,
      selectDocument: selectDocument,
    });
    //newIdeas.urlFile.push(urlFile)
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == "productPic") {
          newIdeas.pic.productPic.push(
            `${process.env.BASE_URL}/${req.files[i].filename}`
          );
        }
        if (req.files[i].fieldname == "ideaLogo") {
          newIdeas.logoPic.ideaLogo = `${process.env.BASE_URL}/${req.files[i].filename}`;
        }
        if (req.files[i].fieldname == "selectDocument") {
          newIdeas.documentPic.selectDocument.push(
            `${process.env.BASE_URL}/${req.files[i].filename}`
          );
          newIdeas.docSize.push(req.files[i].size);
        }
      }
    }
    const saveIdea = await newIdeas.save();
    console.log(saveIdea);
    await sendMail(
      admin.userEmail,
      `New Idea`,
      admin.userName,
      `<br.
    <br>
    New idea has been added on the Platform<br>
    <br>

    <br>
    Please Login Your Account https://admin.patenta-sa.com/
    <br>
    <br>
    Patenta<br>
    Customer Service Team<br>
    91164721
    `
    );
    res
      .status(201)
      .json(success(res.statusCode, "Idea Uploaded Successfully", {}));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error in Upload Idea", res.statusCode));
  }
};

//---->Create Auction Idea
exports.createAuctionIdea = async (req, res) => {
  try {
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
      documentName,
      selectDocument,
      user_Id,
      baseFare,
      urlFile,
      present,
    } = req.body;
    const admin = await adminSchema.findOne();
    const userVerify = await userSchema.findOne({ _id: user_Id });
    const idea = await productSchema.findOne({ title_en: title_en });
    if (idea) {
      return res
        .status(201)
        .json(error("Title Name is already register", res.statusCode));
    }
    if (userVerify.verifyDocument != "APPROVED") {
      return res
        .status(201)
        .json(error("Please Complete Your Kyc", res.statusCode));
    }

    let newIdeas = new productSchema({
      title_en: title_en,
      title_ar: title_ar,
      description_en: description_en,
      description_ar: description_ar,
      category_Id: category_Id,
      subCategory_Id: subCategory_Id,
      briefDescription_ar: briefDescription_ar,
      briefDescription_en: briefDescription_en,
      //   Price: Price,
      documentName: documentName,
      user_Id: user_Id,
      baseFare: baseFare * (1 + admin.commission / 100),
      urlFile: urlFile,
      present: present,
      selectDocument: selectDocument,
    });
    //newIdeas.urlFile.push(urlFile)
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == "productPic") {
          newIdeas.pic.productPic.push(
            `${process.env.BASE_URL}/${req.files[i].filename}`
          );
        }
        if (req.files[i].fieldname == "ideaLogo") {
          newIdeas.logoPic.ideaLogo = `${process.env.BASE_URL}/${req.files[i].filename}`;
        }
        if (req.files[i].fieldname == "selectDocument") {
          newIdeas.documentPic.selectDocument.push(
            `${process.env.BASE_URL}/${req.files[i].filename}`
          );
          newIdeas.docSize.push(req.files[i].size);
        }
      }
    }
    const saveIdea = await newIdeas.save();
    console.log(saveIdea);
    await sendMail(
      admin.userEmail,
      `New Idea`,
      admin.userName,
      `<br.
    <br>
    New idea has been added on the Platform<br>
    <br>

    <br>
    Please Login Your Account https://admin.patenta-sa.com/
    <br>
    <br>
    Patenta<br>
    Customer Service Team<br>
    91164721
    `
    );
    res
      .status(201)
      .json(success(res.statusCode, "Idea Uploaded Successfully", {}));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error in Upload Idea", res.statusCode));
  }
};

// Bussiness Idea Details Api
exports.bussinessIdeaDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const detailsIdea = await productSchema
      .findById(id)
      .populate([
        "baseBid.user_Id",
        "user_Id",
        "buyer_Id",
        "category_Id",
        "subCategory_Id",
      ]);
    res.status(200).json(success(res.statusCode, "Success", { detailsIdea }));
  } catch (err) {
    res
      .status(400)
      .json(error("Error in Bussiness Idea Details", res.statusCode));
  }
};

// Bussiness Idea Details Api
exports.bussinessIdeaDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const detailsIdea = await productSchema
      .findById(id)
      .populate([
        "baseBid.user_Id",
        "user_Id",
        "buyer_Id",
        "category_Id",
        "subCategory_Id",
      ]);
    res.status(200).json(success(res.statusCode, "Success", { detailsIdea }));
  } catch (err) {
    res
      .status(400)
      .json(error("Error in Bussiness Idea Details", res.statusCode));
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
      baseFare,
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
    if (baseFare) {
      product.baseFare = baseFare;
    }
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == "productPic") {
          product.pic.productPic = `${process.env.BASE_URL}/${req.files[i].filename}`;
        }
        if (req.files[i].fieldname == "ideaLogo") {
          product.logoPic.ideaLogo = `${process.env.BASE_URL}/${req.files[i].filename}`;
        }
        if (req.files[i].fieldname == "selectDocument") {
          product.documentPic.selectDocument = `${process.env.BASE_URL}/${req.files[i].filename}`;
        }
      }
    }
    await product.save();
    res.status(200).json(success(res.statusCode, "Success", { product }));
  } catch (err) {
    res.status(400).json(error("Error In Update Idea", res.statusCode));
  }
};

//-----------> list of bussiness ideas Api
exports.listBussinesIdeas = async (req, res) => {
  try {
    const verify = await productSchema.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
        },
      },
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
      {
        $match: {
          verify: "APPROVED",
          // $or: [
          //   { 'baseBid.bidsVerify':"Accepted" },

          //  ],
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { verify }));
  } catch (err) {
    console.log(err);
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
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
        },
      },
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
          verify: "APPROVED",
        },
      },
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
              "subcategoriess.subCategoryName": {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      },
    ]);
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
    res.status(400).json(error("Error In Searching", res.statusCode));
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
    if (product.baseBid.length) {
      if (product.baseBid[0].Price > Price) {
        return res
          .status(201)
          .json(error("Please Add Bids Up To Current Bid", res.statusCode));
      }
    }
    product.baseBid.push({
      Price: Price,
      user_Id: user_Id,
      createdAt: new Date(),
    });
    const user = await userSchema.findById(user_Id);
    const newProduct = await product.save();
    if (user.fullName_en) {
      await notification.create({
        title: `${user.fullName_en} Bids you ${Price} 💰🔨 for ${product.title_en}.`,
        user_Id: product.user_Id,
      });
    }
    if (user.companyName_en) {
      await notification.create({
        title: `${user.companyName_en} Bids you ${Price} 💰🔨 for ${product.title_en}.`,
        user_Id: product.user_Id,
      });
    }

    res.status(200).json(success(res.statusCode, "Success", { newProduct }));
  } catch (err) {
    res.status(200).json(error("Error In Add Bids", res.statusCode));
  }
};

//-----> list of biseBid APi
exports.baseBidList = async (req, res) => {
  try {
    const id = req.params.id;
    const list = await productSchema.find().populate("user_Id");
    let Bids = [];
    for (let i = 0; i < list.length; i++) {
      var baseBide = list[i].baseBid.filter(
        (baseBide) => String(baseBide.user_Id) === String(id)
      );
      let obj = {
        baseBide: baseBide,
        title: list[i].title_en,
        title_ar: list[i].title_ar,
        bidStatus: list[i].bidsVerify,
        user: list[i].user_Id.fullName_en,
        product_Id: list[i]._id,
        date: list[i].createdAt,
      };
      Bids.push(obj);
    }
    res.status(200).json(success(res.statusCode, "Success", { Bids }));
  } catch (err) {
    res.status(400).json(error("Error In Listing", res.statusCode));
  }
};

//-----> my bussiness Idea Api
exports.myBussinessIdea = async (req, res) => {
  try {
    const id = req.params.id;
    let myIdeas = await productSchema
      .find({ user_Id: id })
      .populate(["user_Id", "category_Id", "subCategory_Id"]);
    res.status(200).json(success(res.statusCode, "Success", { myIdeas }));
  } catch (err) {
    res
      .status(400)
      .json(error("Error In Bussiness Idea Listing", res.statusCode));
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
    // if (categoryList.length > 0) {
    //   res.status(200).json(success(res.statusCode, "Success", { categoryList }));
    // } else {
    //   res.status(201).json(error("List are not found", res.statusCode));
    // }
    // res.status(200).json(success(res.statusCode, "Success", { categoryList }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};
//-------> subCategory Listing APi
exports.subCategoryListing = async (req, res) => {
  try {
    const id = req.params.id;
    const categoryList = await subCategoryModel
      .find({ category_Id: id })
      .populate("category_Id");
    res.status(200).json(success(res.statusCode, "Success", { categoryList }));
    // if (categoryList.length > 0) {
    //   res.status(200).json(success(res.statusCode, "Success", { categoryList }));
    // } else {
    //   res.status(201).json(error("List are not found", res.statusCode));
    // }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//Filter Low Price Api
exports.lowtoHighPrice = async (req, res) => {
  try {
    const productFilter = await productSchema.aggregate([
      { $sort: { Price: 1 } },
      { $sort: { "baseBid.Price": 1 } },
      {
        $match: {
          verify: "APPROVED",
        },
      },
    ]);
    if (productFilter.length > 0) {
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

//Filter High Price Api
exports.highToLowPrice = async (req, res) => {
  try {
    const productFilter = await productSchema.aggregate([
      { $sort: { Price: -1 } },
      { $sort: { "baseBid.Price": -1 } },
      {
        $match: {
          verify: "APPROVED",
        },
      },
    ]);
    if (productFilter.length > 0) {
      res
        .status(200)
        .json(success(res.statusCode, "Success", { productFilter }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

// Recommanded Product Api
exports.recommandedProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const products = await productModel
      .find({ category_Id: id })
      .populate("user_Id");
    const product = products.filter((x) => x.verify == "APPROVED");
    if (products.length > 0) {
      res.status(200).json(success(res.statusCode, "Success", { product }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Error in Recommanded Product", res.statusCode));
  }
};

// Sub Category Idea Api
exports.subCategoryIdeas = async (req, res) => {
  try {
    const id = req.params.id;
    const ideas = await productModel
      .find({ subCategory_Id: id })
      .populate("user_Id");
    const product = ideas.filter((x) => x.verify == "APPROVED");
    res.status(200).json(success(res.statusCode, "Success", { product }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

// Accept Bids Api
exports.acceptBids = async (req, res) => {
  try {
    const approved = "Accepted";
    const { bids_Id, aceptbid } = req.body;
    const ideas = await productModel
      .findById(req.params.id)
      .populate("baseBid.user_Id");
    for (let i = 0; i < ideas.baseBid.length; i++) {
      ideas.baseBid[i].aceptbid = aceptbid;
    }
    var bids = ideas.baseBid.filter(
      (bids) => String(bids._id) === String(bids_Id)
    );
    if (bids.length) {
      bids[0].bidsVerify = approved;
      // bids[0].bids = bids;
      if (bids[0].user_Id.fullName_en) {
        await sendMail(
          bids[0].user_Id.Email,
          `Accepted Bids`,
          bids[0].user_Id.fullName_en,
          `<br.

         <br>
         Your BIds Amount ${parseInt(
           bids[0].Price
         )} has been Accepted on the Platform<br>
         <br>
     
         <br>
         Please Login Your Account https://patenta-sa.com/login
         <br>
         <br>
         Patenta<br>
         Customer Service Team<br>
         91164721
         `
        );
      }
      if (bids[0].user_Id.companyName_en) {
        await sendMail(
          bids[0].user_Id.Email,
          `Accepted Bids`,
          bids[0].user_Id.companyName_en,
          `<br.
         <br>
         Your BIds Amount ${parseInt(
           bids[0].Price
         )} has been Accepted on the Platform<br>
         <br>
     
         <br>
         Please Login Your Account https://patenta-sa.com/login
         <br>
         <br>
         Patenta<br>
         Customer Service Team<br>
         91164721
         `
        );
      }
    }
    await ideas.save();

    res.status(200).json(success(res.statusCode, "Success", { ideas }));
  } catch (err) {
    res.status(400).json(error("Error in Approved Bid", res.statusCode));
  }
};

// Accept Bids Api
exports.RejectBids = async (req, res) => {
  try {
    const approved = "Decline";
    const rejectReasons = req.body.rejectReasons;
    const { bids_Id, aceptbid } = req.body;
    const ideas = await productModel
      .findById(req.params.id)
      .populate("baseBid.user_Id");
    for (let i = 0; i < ideas.baseBid.length; i++) {
      ideas.baseBid[i].aceptbid = aceptbid;
    }
    var bids = ideas.baseBid.filter(
      (bids) => String(bids._id) === String(bids_Id)
    );
    if (bids.length) {
      bids[0].bidsVerify = approved;
      bids[0].bidsReject = rejectReasons;
      if (bids[0].user_Id.fullName_en) {
        await sendMail(
          bids[0].user_Id.Email,
          `Reject Bids`,
          bids[0].user_Id.fullName_en,
          `<br.
         <br>
         Your BIds Amount ${parseInt(
           bids[0].Price
         )} has been Decline on the Platform<br>
         <br>
         Reject Reasons:${bids[0].bidsReject}
         <br>
         <br>
         Please Login Your Account https://patenta-sa.com/login
         <br>
         <br>
         Patenta<br>
         Customer Service Team<br>
         91164721
         `
        );
      }
      if (bids[0].user_Id.companyName_en) {
        await sendMail(
          bids[0].user_Id.Email,
          `Reject Bids`,
          bids[0].user_Id.companyName_en,
          `<br.
         <br>
         Your BIds Amount ${parseInt(
           bids[0].Price
         )} has been Decline on the Platform<br>
         <br>
         Reject Reasons: ${bids[0].bidsReject}
         <br>
         <br>
         Please Login Your Account https://patenta-sa.com/login
         <br>
         <br>
         Patenta<br>
         Customer Service Team<br>
         91164721
         `
        );
      }
    }
    await ideas.save();

    res.status(200).json(success(res.statusCode, "Success", { ideas }));
  } catch (err) {
    res.status(400).json(error("Error in Approved Bid", res.statusCode));
  }
};

//----> Search My Idea Api
exports.searchMyIdea = async (req, res) => {
  try {
    const search = req.body.search;
    const searchIdeas = await productSchema.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "users",
        },
      },
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
          as: "Subcategories",
        },
      },
      {
        $match: {
          user_Id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $match: {
          $or: [
            {
              title_en: { $regex: search, $options: "i" },
            },
          ],
        },
      },
    ]);
    res.status(200).json(success(res.statusCode, "Success", { searchIdeas }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error In Searching", res.statusCode));
  }
};

//----> Search Bids Api
exports.searchBids = async (req, res) => {
  try {
    const id = req.params.id;
    const search = req.body.search;
    if (!search) {
      return res
        .status(201)
        .json(error("Please Provide Search Key", res.statusCode));
    }
    const list = await productSchema
      .find({
        $and: [{ title_en: { $regex: new RegExp(search.trim(), "i") } }],
      })
      .populate("user_Id");
    let Bids = [];
    for (let i = 0; i < list.length; i++) {
      var baseBide = list[i].baseBid.filter(
        (baseBide) => String(baseBide.user_Id) === String(id)
      );
      let obj = {
        baseBide: baseBide,
        title: list[i].title_en,
        title_ar: list[i].title_ar,
        bidStatus: list[i].bidsVerify,
        user: list[i].user_Id.fullName_en,
        date: list[i].createdAt,
      };
      Bids.push(obj);
    }
    res.status(200).json(success(res.statusCode, "Success", { Bids }));
  } catch (err) {
    res.status(400).json(error("Error In Listing", res.statusCode));
  }
};

///-------> Recived Document Api
exports.RecivedDocument = async (req, res) => {
  try {
    const type = req.body.type;
    const product = await productSchema.findById(req.params.id);
    if (type) {
      product.logoPic.typelogo = type;
    }
    if (type) {
      product.pic.typePic = type;
    }
    if (type) {
      product.documentPic.typedocument = type;
    }
    await product.save();
    res
      .status(200)
      .json(success(res.statusCode, "Success Received", { product }));
  } catch (err) {
    res.status(400).json(error("Error In Recieved Document", res.statusCode));
  }
};

//--------> Verify Kyc Api
exports.verifyKyc = async (req, res) => {
  try {
    const userVerify = await userSchema.findById(req.params.id);
    if (userVerify.verifyDocument != "APPROVED") {
      return res
        .status(201)
        .json(error("Please Complete Your Kyc", res.statusCode));
    }
    res.status(200).json(success(res.statusCode, "Approved User", {}));
  } catch (err) {
    res.status(400).json(error("Error In Kyc", res.statusCode));
  }
};

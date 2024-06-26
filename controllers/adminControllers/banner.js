const Banner = require("../../models/adminModels/bannerModels");
const { error, success } = require("../../responseCode");
const user = require("../../models/userModels/UserRegister");
const productModel = require("../../models/userModels/productModel");
exports.createBanner = async (req, res) => {
  try {
    const { category, subCategory, urlType, seller, url } = req.body;

    // if (!category) {
    //     return res
    //         .status(201)
    //         .json(error("Please Provide category", res.statusCode));
    // }
    // if (!subCategory) {
    //     return res
    //         .status(201)
    //         .json(error("Please Provide subCategory", res.statusCode));
    // }
    if (seller) {
      var sellerIdea = await productModel
        .find({ user_Id: seller })
        .select("user_Id");
    }

    const banner = await Banner.create({
      category: category,
      subCategory: subCategory,
      urlType: urlType,
      seller: seller,
      //sellerIdea: sellerIdea[0]._id ||"",
      url: url,
    });
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == "image") {
          banner.image = `${process.env.BASE_URL}/${req.files[i].filename}`;
        }
      }
    }
    await banner.save();
    if (sellerIdea) {
      const banners = await Banner.findById(banner._id)
      banners.sellerIdea = sellerIdea[0]._id
      await banners.save()
    }
    res.status(200).json(success(res.statusCode, "Success", { banner }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.bannerList = async (req, res) => {
  try {
    const bannerList = await Banner.find({}).sort({ createdAt: -1 });
    res.status(200).json(success(res.statusCode, "Success", { bannerList }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.bannerView = async (req, res) => {
  try {
    const bannerView = await Banner.findById(req.params.id);
    res.status(200).json(success(res.statusCode, "Success", { bannerView }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.bannerDelete = async (req, res) => {
  try {
    const bannerDelete = await Banner.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(success(res.statusCode, "Banner Deleted", { bannerDelete }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

exports.allSellerList = async (req, res) => {
  try {
    const list = await user.find({ userType: "Seller" });
    res.status(200).json(success(res.statusCode, "Success", { list }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
  }
};

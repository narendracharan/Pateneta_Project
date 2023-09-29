const express = require("express");
const {
  userRegister,
  userLogin,
  sendOtpPassword,
  companySignup,
  resetPassword,
  userKyc,
  companyKyc,
  addLanguage,
  userEditProfile,
  verifyUser,
  updateLanguage,
  userResetPassword,
} = require("../controllers/userControllers.js/register");
const upload = require("../middleware/multer");
const tokenAuthorisationUser = require("../middleware/userAuthentication");
const {
  createIdea,
  listBussinesIdeas,
  searchBussinessIdea,
  addBids,
  baseBidList,
  myBussinessIdea,
  lowtoHighPrice,
  highToLowPrice,
  updateBussinessIdea,
} = require("../controllers/userControllers.js/product");
const {
  pushNotification,
  PrivacyUser,
  createReports,
} = require("../controllers/userControllers.js/notification");
const {
  categoryList,
  subCategoryList,
} = require("../controllers/adminControllers/categoryController");
const {
  createPayment,
} = require("../controllers/userControllers.js/orderControllers");
const router = express.Router();

///---->user register Routes
router.post("/register-user", userRegister);
router.post("/register-company", companySignup);
router.post("/user-login", userLogin);
router.post("/send-otp", sendOtpPassword);
router.post("/reset-password", resetPassword);
router.post("/create-user_kyc/:id", upload.any(), userKyc);
router.post("/create-compny_kyc/:id", upload.any(), companyKyc);
router.post("/verify-user/:id", verifyUser);
router.post(
  "/updated-profile/:id",
  tokenAuthorisationUser,
  upload.single("profile"),
  userEditProfile
);
router.post("/change-password/:id", userResetPassword);

///--->language routes
router.post("/add-language", addLanguage);
router.post("/update-language/:id", updateLanguage);

///---> carete idea routes
router.post("/create-idea", upload.any(), createIdea);
router.post("/list-bussiness-ideas", listBussinesIdeas);
router.post("/search-bussiness-ideas", searchBussinessIdea);
router.post("/low-to-high", lowtoHighPrice);
router.post("/high-to-low", highToLowPrice);
router.post("/my-bussiness-idea/:id", myBussinessIdea);
router.post("/update-idea/:id", upload.any(), updateBussinessIdea);

//=----> add Bids ROutes
router.post("/bids-add/:id", addBids);
router.post("/list-Bids/:id", baseBidList);

//----category Routes
router.post("/category-list", categoryList);
router.post("/sub-category-list/:id", subCategoryList);

///--> Privacy Routes
router.post("/push-notification", pushNotification);
router.post("/privacy-list", PrivacyUser);
router.post("/create-payment", createPayment);
router.post("/user-report", createReports);
module.exports = router;

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
  bidsView,
  subCategoryListing,
  CategoryListing,
} = require("../controllers/userControllers.js/product");
const {
  pushNotification,
  PrivacyUser,
  createReports,
} = require("../controllers/userControllers.js/notification");
const {
  createPayment, createOrder, orderDetails, downloadUserOrder,
} = require("../controllers/userControllers.js/orderControllers");
const { salesList, userSalesDetails, salesSearch } = require("../controllers/userControllers.js/salesControllers");
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
  upload.any(),
  userEditProfile
);
router.post("/change-password/:id",tokenAuthorisationUser, userResetPassword);

///--->language routes
router.post("/add-language", addLanguage);
router.post("/update-language/:id", updateLanguage);

///---> carete idea routes
router.post("/create-idea", tokenAuthorisationUser,upload.any(), createIdea);
router.post("/list-bussiness-ideas",tokenAuthorisationUser, listBussinesIdeas);
router.post("/search-bussiness-ideas", tokenAuthorisationUser,searchBussinessIdea);
router.post("/low-to-high", tokenAuthorisationUser,lowtoHighPrice);
router.post("/high-to-low",tokenAuthorisationUser, highToLowPrice);
router.post("/my-bussiness-idea/:id",tokenAuthorisationUser, myBussinessIdea);
router.post("/update-idea/:id", tokenAuthorisationUser,upload.any(), updateBussinessIdea);


//----> user Order
router.post("/user-order",createOrder)
router.post("/order-details/:id",orderDetails)
router.post("/order-download/:id",downloadUserOrder)

//---->>selas routes
router.post("/user-sales-list/:id",salesList)
router.post("/sales-details/:id",userSalesDetails)
router.post("/search-sales",salesSearch)

//=----> add Bids ROutes
router.post("/bids-add/:id", tokenAuthorisationUser,addBids);
router.post("/list-Bids/:id", tokenAuthorisationUser,baseBidList);
router.post("/bids-view/:id",bidsView)

//----category Routes
router.post("/category-list", tokenAuthorisationUser,CategoryListing);
router.post("/sub-category-list/:id", tokenAuthorisationUser,subCategoryListing);

///--> Privacy Routes
router.post("/push-notification", pushNotification);
router.post("/privacy-list", PrivacyUser);
//router.post("/create-payment", createPayment);
router.post("/user-report", createReports);
module.exports = router;

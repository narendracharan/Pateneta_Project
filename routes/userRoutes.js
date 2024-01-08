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
  userDetails,
  sellerRegister,
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
  bussinessIdeaDetails,
  recommandedProduct,
  subCategoryIdeas,
  acceptBids,
  searchMyIdea,
  searchBids,
  RejectBids,
  RecivedDocument,
  createAuctionIdea,
  verifyKyc,
} = require("../controllers/userControllers.js/product");
const {
  pushNotification,
  PrivacyUser,
} = require("../controllers/userControllers.js/notification");
const {
  //createPayment,
  createOrder,
  orderDetails,
  downloadUserOrder,
  myOrder,
  addRatings,
} = require("../controllers/userControllers.js/orderControllers");
const {
  salesList,
  userSalesDetails,
  salesSearch,
  mySalesSearch,
} = require("../controllers/userControllers.js/salesControllers");
const {
  createReports,
} = require("../controllers/userControllers.js/supportControllers");
const {
  payment,
  hyperPayStep1,
  hyperPayStep2,
  orderPayment,
} = require("../controllers/userControllers.js/payment");
const { userList } = require("../controllers/userControllers.js/chatControllers");
const router = express.Router();

///---->user register Routes

router.post("/register-user", userRegister);
router.post("/seller-register", sellerRegister);
router.post("/register-company", companySignup);
router.post("/user-login", userLogin);
router.post("/send-otp", sendOtpPassword);
router.post("/reset-password", resetPassword);
router.post("/create-user_kyc/:id", upload.any(), userKyc);
router.post("/user-details/:id", userDetails);
router.post("/create-compny_kyc/:id", upload.any(), companyKyc);
router.post("/verify-user/:id", verifyUser);
router.post("/verify-kyc/:id", verifyKyc);
router.post(
  "/updated-profile/:id",
  tokenAuthorisationUser,
  upload.any(),
  userEditProfile
);
router.post("/change-password/:id", tokenAuthorisationUser, userResetPassword);
router.get("/user-list",tokenAuthorisationUser,userList)


///--->language routes

router.post("/add-language", addLanguage);
router.post("/update-language/:id", updateLanguage);

///---> carete idea routes

router.post("/create-idea", tokenAuthorisationUser, upload.any(), createIdea);
router.post(
  "/create-auction-idea",
  tokenAuthorisationUser,
  upload.any(),
  createAuctionIdea
);
router.post("/list-bussiness-ideas",listBussinesIdeas);
router.post("/search-bussiness-ideas",searchBussinessIdea);
router.post("/low-to-high", tokenAuthorisationUser, lowtoHighPrice);
router.post("/high-to-low", tokenAuthorisationUser, highToLowPrice);
router.post(
  "/bussines-idea-details/:id",
  bussinessIdeaDetails
);
router.post("/my-bussiness-idea/:id", tokenAuthorisationUser, myBussinessIdea);
router.post(
  "/recommanded-ideas/:id",
  tokenAuthorisationUser,
  recommandedProduct
);
router.post(
  "/update-idea/:id",
  tokenAuthorisationUser,
  upload.any(),
  updateBussinessIdea
);
router.post(
  "/sub-category-ideas/:id",
  subCategoryIdeas
);
router.post("/search-my-idea/:id", tokenAuthorisationUser, searchMyIdea);
router.post("/received-idea/:id", tokenAuthorisationUser, RecivedDocument);

//----> user Order

router.post("/user-order", tokenAuthorisationUser, createOrder);
router.post("/order-details/:id", tokenAuthorisationUser, orderDetails);
router.post("/order-download/:id", tokenAuthorisationUser, downloadUserOrder);
router.post("/my-order/:id", tokenAuthorisationUser, myOrder);
router.post("/search-my-order/:id",tokenAuthorisationUser,mySalesSearch)

//---->>selas routes
router.post("/user-sales-list/:id", tokenAuthorisationUser, salesList);
router.post("/sales-details/:id", tokenAuthorisationUser, userSalesDetails);
router.post("/search-sales", tokenAuthorisationUser, salesSearch);

//=----> add Bids ROutes
router.post("/bids-add/:id", tokenAuthorisationUser, addBids);
router.post("/list-Bids/:id", tokenAuthorisationUser, baseBidList);
router.post("/bids-view/:id", tokenAuthorisationUser, bidsView);
router.post("/accept-bids/:id", tokenAuthorisationUser, acceptBids);
router.post("/Decline-bids/:id", tokenAuthorisationUser, RejectBids);
router.post("/search-bids/:id", tokenAuthorisationUser, searchBids);

//----category Routes
router.post("/category-list", CategoryListing);
router.post(
  "/sub-category-list/:id",
  subCategoryListing
);

///--> Privacy Routes
//router.post("/push-notification", pushNotification);
router.post("/privacy-list", tokenAuthorisationUser, PrivacyUser);
router.post("/ratings-added", tokenAuthorisationUser, addRatings);
router.post("/create-payment", hyperPayStep1);
router.post("/create-payment-step2", hyperPayStep2);
router.post("/user-report", tokenAuthorisationUser, createReports);
router.post("/order-payment", orderPayment);

module.exports = router;

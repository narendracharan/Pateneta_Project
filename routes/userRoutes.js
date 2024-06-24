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
  addAccount,
  OtpVerify,
  sendEmail,
  addImage,
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
  searchRequest,
  Banners,
  categoryIdeas,
  categoryView,
  sellerId,
} = require("../controllers/userControllers.js/product");
const {
  pushNotification,
  PrivacyUser,
  notificationList,
  updateStatus,
  notificationDelete,
  allNotificationDelete,
} = require("../controllers/userControllers.js/notification");
const {
  //createPayment,
  createOrder,
  orderDetails,
  downloadUserOrder,
  myOrder,
  addRatings,
  updateRatings,
  withdrawalRequest,
  userTotalEarning,
  myWithdrawalRequestList,
  withdrawalRequestDetails,
} = require("../controllers/userControllers.js/orderControllers");
const {
  salesList,
  userSalesDetails,
  salesSearch,
  mySalesSearch,
  myIdeas,
} = require("../controllers/userControllers.js/salesControllers");
const {
  createReports,
} = require("../controllers/userControllers.js/supportControllers");
const {
  payment,
  hyperPayStep1,
  hyperPayStep2,
  orderPayment,
  validatePayments,
  initiatePayout,
} = require("../controllers/userControllers.js/payment");
const {
  userList,
  addUser,
  chatUserList,
  userOnline,
  userOffilne,
  SeenMessage,
  userSeenMsg,
} = require("../controllers/userControllers.js/chatControllers");
const { validatePayment } = require("paytabs_pt2");
const {
  withdrawalRequestList,
} = require("../controllers/adminControllers/sellerContoller");
const router = express.Router();

///---->user register Routes

router.post("/register-user", userRegister);
router.post("/seller-register", sellerRegister);
router.post("/register-company", companySignup);
router.post("/user-login", userLogin);
router.post("/send-otp", sendOtpPassword);
router.post("/resSend-Otp", sendEmail);
router.post("/otp-verify",OtpVerify)
router.post("/reset-password", resetPassword);
router.post("/create-user_kyc/:id", upload.any(), userKyc);
router.post("/user-details/:id", userDetails);
router.post("/create-compny_kyc/:id", upload.any(), companyKyc);
router.post("/verify-user/:id", verifyUser);
router.post("/verify-kyc/:id", verifyKyc);
router.post("/add-images", addImage);
router.post(
  "/updated-profile/:id",
  tokenAuthorisationUser,
  upload.any(),
  userEditProfile
);
router.post("/change-password/:id", tokenAuthorisationUser, userResetPassword);
router.get("/user-list", tokenAuthorisationUser, userList);
router.post("/add-user-account/:id", addAccount);

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
router.post("/list-bussiness-ideas", listBussinesIdeas);
router.post("/search-bussiness-ideas", searchRequest);
router.post("/low-to-high", tokenAuthorisationUser, lowtoHighPrice);
router.post("/high-to-low", tokenAuthorisationUser, highToLowPrice);
router.post("/bussines-idea-details/:id", bussinessIdeaDetails);
router.post("/my-bussiness-idea/:id", tokenAuthorisationUser, myBussinessIdea);
router.post("/recommanded-ideas/:id", recommandedProduct);
router.post(
  "/update-idea/:id",
  tokenAuthorisationUser,
  upload.any(),
  updateBussinessIdea
);
router.post("/sub-category-ideas/:id", subCategoryIdeas);
router.post("/category-ideas/:id", categoryIdeas);
router.get("/category-view/:id", categoryView);
router.post("/search-my-idea/:id", tokenAuthorisationUser, searchMyIdea);
router.post("/received-idea/:id", tokenAuthorisationUser, RecivedDocument);
router.post("/my-ideas/:id",tokenAuthorisationUser,myIdeas)
router.get("/seller-Id/:id",sellerId)
//----> user Order

router.post("/user-order", tokenAuthorisationUser, createOrder);
router.post("/order-details/:id", tokenAuthorisationUser, orderDetails);
router.post("/order-download/:id", tokenAuthorisationUser, downloadUserOrder);
router.post("/my-order/:id", tokenAuthorisationUser, myOrder);
router.post("/search-my-order/:id", tokenAuthorisationUser, mySalesSearch);
router.post("/withdrawal-request", tokenAuthorisationUser, withdrawalRequest);
router.post(
  "/user-total-earning/:id",
  tokenAuthorisationUser,
  userTotalEarning
);
router.post(
  "/withdrawal-request-list/:id",
  tokenAuthorisationUser,
  myWithdrawalRequestList
);
router.post("/withdrawal-details/:id",tokenAuthorisationUser,withdrawalRequestDetails)
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
router.post("/sub-category-list/:id", subCategoryListing);

///--> Privacy Routes
//router.post("/push-notification", pushNotification);
router.post("/privacy-list", tokenAuthorisationUser, PrivacyUser);
router.get("/notification-list/:id", tokenAuthorisationUser, notificationList);
router.post("/update-isRead/:id", tokenAuthorisationUser, updateStatus);
router.delete(
  "/delete-notification/:id",
  tokenAuthorisationUser,
  notificationDelete
);
router.delete(
  "/all-notification-delete/:id",
  tokenAuthorisationUser,
  allNotificationDelete
);
router.post("/ratings-added", addRatings);
//router.post("/create-payment", hyperPayStep1);
//router.post("/create-payment-step2", hyperPayStep2);
router.post("/user-report", tokenAuthorisationUser, createReports);
router.post("/order-payment", tokenAuthorisationUser, orderPayment);
router.post("/add-chat-user", tokenAuthorisationUser, addUser);
router.get("/chat-user-list/:id", tokenAuthorisationUser, chatUserList);
router.get("/user-online/:id", tokenAuthorisationUser, userOnline);
router.get("/user-offline/:id", tokenAuthorisationUser, userOffilne);
router.post("/seen-message/:id", tokenAuthorisationUser, SeenMessage);
router.post("/user-seen-msg", tokenAuthorisationUser, userSeenMsg);
router.post("/validate", validatePayments);
router.post("/payout-request",initiatePayout)
router.get("/banners",Banners)
module.exports = router;

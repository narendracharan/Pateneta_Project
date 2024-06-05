const express = require("express");
const router = express.Router();
const {
  adminRegister,
  loginAdmin,
  resetPassword,
  updateProfile,
  sendUserResetPassword,
  OtpVerify,
  adminDetails,
  addCommission,
  addBankDeatils,
  updateToken,
} = require("../controllers/adminControllers/register");
const upload = require("../middleware/multer");
const {
  createCategory,
  createSubCategory,
  updateCategory,
  updateSubCategory,
  deleteCategory,
  deleteSubCategory,
  categoryList,
  subCategoryList,
  categorySearch,
  subCategorySearch,
  categoryStatus,
  subCategoryStatus,
  subCategory,
} = require("../controllers/adminControllers/categoryController");
const {
  ideaRequestList,
  approvedIdea,
  DeclineIdea,
  viewIdeaRequest,
  searchIdeaRequest,
  updateStatus,
  deleteBussinessIdea,
} = require("../controllers/adminControllers/newIdeaRequest");
const {
  createContent,
  ContentList,
  updateContent,
  reportsList,
  reportsSearch,
  reportsView,
  editReports,
  deleteReports,
} = require("../controllers/adminControllers/contentControllers");
const {
  sellerList,
  editSeller,
  sellerDetails,
  sellerDelete,
  sellerSearch,
  buyerUserList,
  buyerDetails,
  deleteBuyer,
  buyerStatus,
  salesUserList,
  salesUserDetails,
  searchSales,
  salesOrderExports,
  setCommission,
  buyerSearch,
  withdrawalApproved,
  withdrawalRequestList,
  acceptWithdrawalRequest,
  withdrawalDetails,
} = require("../controllers/adminControllers/sellerContoller");
const {
  userList,
  userDetails,
  userDelete,
  changeStatus,
  approvedDoc,
  declineDoc,
  verifyDocument,
} = require("../controllers/adminControllers/userManagement");
const adminAuthorisationUser = require("../middleware/adminAuthentication");
const {
  homeDashboards,
} = require("../controllers/adminControllers/dashboards");
const {
  userNotificationlist,
  ideaNotificationlist,
  userUpdateStatus,
  ideaUpdateStatus,
} = require("../controllers/adminControllers/notification");
const {
  createBanner,
  bannerView,
  bannerList,
  bannerDelete,
} = require("../controllers/adminControllers/banner");

//-admin register
router.post("/create-admin", adminRegister);
router.post("/admin-login", loginAdmin);
router.post("/admin-resetpassword", resetPassword);
router.post("/send-Email", sendUserResetPassword);
router.post("/verify-otp", OtpVerify);
router.post("/admin-details/:id", adminAuthorisationUser, adminDetails);
router.post(
  "/update-profile/:id",
  adminAuthorisationUser,
  upload.single("profile"),
  updateProfile
);
router.post("/add-Commission/:id", adminAuthorisationUser, addCommission);
router.post("/add-Bank-Details/:id", adminAuthorisationUser, addBankDeatils);
router.post(
  "/approved-request/:id",
  adminAuthorisationUser,
  withdrawalApproved
);

//-----categoryRoutes
router.post(
  "/create-category",
  adminAuthorisationUser,
  upload.single("category_Pic"),
  createCategory
);
router.post(
  "/create-subCategory",
  adminAuthorisationUser,
  upload.single("subCategoryPic"),
  createSubCategory
);
router.post("/category-List", adminAuthorisationUser, categoryList);
router.post("/sub-category-list", adminAuthorisationUser, subCategoryList);
router.post(
  "/update-category/:id",
  adminAuthorisationUser,
  upload.single("category_Pic"),
  updateCategory
);
router.post(
  "/update-subCategory/:id",
  adminAuthorisationUser,
  upload.single("subCategoryPic"),
  updateSubCategory
);
router.post("/delete-category/:id", adminAuthorisationUser, deleteCategory);
router.post(
  "/delete-subCategory/:id",
  adminAuthorisationUser,
  deleteSubCategory
);

///-------> Category Routes
router.post("/category-search", adminAuthorisationUser, categorySearch);
router.post("/subCategory-search", adminAuthorisationUser, subCategorySearch);
router.post("/category-status-change/:id", categoryStatus);
router.post("/subCategory-status-change/:id", subCategoryStatus);

//--idea Request Routes
router.post("/idea-request-list", adminAuthorisationUser, ideaRequestList);
router.post("/approved-idea/:id", adminAuthorisationUser, approvedIdea);
router.post("/decline-idea/:id", adminAuthorisationUser, DeclineIdea);
router.post("/details-idea/:id", adminAuthorisationUser, viewIdeaRequest);
router.post("/search-ideas-request", adminAuthorisationUser, searchIdeaRequest);
router.post("/idea-status-update/:id", adminAuthorisationUser, updateStatus);
router.post("/delete-idea/:id", adminAuthorisationUser, deleteBussinessIdea);

//----->content Routes
router.post("/create-content", createContent);
router.post("/content-list", adminAuthorisationUser, ContentList);
router.post("/update-content/:id", adminAuthorisationUser, updateContent);

//----->seller routes
router.post("/seller-list", adminAuthorisationUser, sellerList);
router.post("/edit-seller/:id", adminAuthorisationUser, editSeller);
router.post("/seller-Details/:id", adminAuthorisationUser, sellerDetails);
router.post("/seller-delete/:id", adminAuthorisationUser, sellerDelete);
router.post("/seller-search", adminAuthorisationUser, sellerSearch);
router.post("/user-sales-list", adminAuthorisationUser, salesUserList);
router.post("/salesUserDetails/:id", adminAuthorisationUser, salesUserDetails);
router.post("/sales-exports", adminAuthorisationUser, salesOrderExports);
router.post("/search-sales", adminAuthorisationUser, searchSales);
router.post("/buyer-list", adminAuthorisationUser, buyerUserList);
router.post("/buyer-search", adminAuthorisationUser, buyerSearch);
router.post("/buyer-delete/:id", adminAuthorisationUser, deleteBuyer);
router.post("/buyer-change-status/:id", adminAuthorisationUser, buyerStatus);
router.post("/buyer-details/:id", adminAuthorisationUser, buyerDetails);
router.post("/home-dashboard", adminAuthorisationUser, homeDashboards);
router.post("/set-commission", adminAuthorisationUser, setCommission);
router.post("/withdrawal-list", withdrawalRequestList);
router.post(
  "/accept-withdrawal",
  adminAuthorisationUser,
  acceptWithdrawalRequest
);
router.post(
  "/withdrawal-Details/:id",
  adminAuthorisationUser,
  withdrawalDetails
);

//reports
router.post("/reports-list", adminAuthorisationUser, reportsList);
router.post("/search-reports", adminAuthorisationUser, reportsSearch);
router.post("/reports-details/:id", adminAuthorisationUser, reportsView);
router.post("/update-reports/:id", adminAuthorisationUser, editReports);
router.post("/delete-reports/:id", adminAuthorisationUser, deleteReports);

//--> user Management
router.post("/user-list", adminAuthorisationUser, userList);
router.post("/user-details/:id", adminAuthorisationUser, userDetails);
router.post("/delete-user/:id", adminAuthorisationUser, userDelete);
router.post("/change-status/:id", adminAuthorisationUser, changeStatus);
router.post("/approved-user/:id", adminAuthorisationUser, approvedDoc);
router.post("/decline-user/:id", adminAuthorisationUser, declineDoc);
router.post("/approved-kyc/:id", adminAuthorisationUser, verifyDocument);

router.post("/update-token/:id", updateToken);

///notification
router.get("/user-notify-list", adminAuthorisationUser, userNotificationlist);
router.get("/idea-notify-list", adminAuthorisationUser, ideaNotificationlist);
router.post("/user-notify-update", adminAuthorisationUser, userUpdateStatus);
router.post("/idea-notify-update", adminAuthorisationUser, ideaUpdateStatus);

router.post("/add-banner", upload.any(), createBanner);
router.get("/banner-view/id", adminAuthorisationUser, bannerView);
router.get("/banner-list", adminAuthorisationUser, bannerList);
router.delete("/banner-delete/:id", adminAuthorisationUser, bannerDelete);
router.get("/banner-subCategory/:id", adminAuthorisationUser, subCategory);
module.exports = router;

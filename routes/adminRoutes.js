const express = require("express");
const router = express.Router();
const {
  adminRegister,
  loginAdmin,
  resetPassword,
  updateProfile,
  sendUserResetPassword,
  OtpVerify,
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
} = require("../controllers/adminControllers/sellerContoller");
const {
  userList,
  userDetails,
  userDelete,
  changeStatus,
  approvedDoc,
  declineDoc,
} = require("../controllers/adminControllers/userManagement");

//-admin register
router.post("/create-admin", adminRegister);
router.post("/admin-login", loginAdmin);
router.post("/admin-resetpassword", resetPassword);
router.post("/send-Email", sendUserResetPassword);
router.post("/verify-otp", OtpVerify);
router.post("/update-profile/:id", upload.single("profile"), updateProfile);

//-----categoryRoutes
router.post("/create-category", upload.single("categoryPic"), createCategory);
router.post(
  "/create-subCategory",
  upload.single("subCategoryPic"),
  createSubCategory
);
router.post("/category-List", categoryList);
router.post("/sub-category-list", subCategoryList);
router.post(
  "/update-category/:id",
  upload.single("categoryPic"),
  updateCategory
);
router.post(
  "/update-subCategory/:id",
  upload.single("subCategoryPic"),
  updateSubCategory
);
router.post("/delete-category/:id", deleteCategory);
router.post("/delete-subCategory/:id", deleteSubCategory);
router.post("/category-search", categorySearch);
router.post("/subCategory-search", subCategorySearch);

//--idea Request Routes
router.post("/idea-request-list", ideaRequestList);
router.post("/approved-idea/:id", approvedIdea);
router.post("/decline-idea/:id", DeclineIdea);
router.post("/details-idea/:id", viewIdeaRequest);
router.post("/search-ideas-request", searchIdeaRequest);
router.post("/idea-status-update/:id", updateStatus);
router.post("/delete-idea/:id", deleteBussinessIdea);

//----->content Routes
router.post("/create-content", createContent);
router.post("/content-list", ContentList);
router.post("/update-content/:id", updateContent);

//----->seller routes
router.post("/seller-list", sellerList);
router.post("/edit-seller/:id", editSeller);
router.post("/seller-Details/:id", sellerDetails);
router.post("/seller-delete/:id", sellerDelete);
router.post("/seller-search", sellerSearch);

//reports
router.post("/reports-list", reportsList);
router.post("/search-reports", reportsSearch);
router.post("/reports-details/:id", reportsView);
router.post("/update-reports/:id", editReports);
router.post("/delete-reports/:id", deleteReports);

//--> user Management
router.post("/user-list", userList);
router.post("/user-details/:id", userDetails);
router.post("/delete-user/:id",userDelete)
router.post("/change-status/:id",changeStatus)
router.post("/approved-user/:id",approvedDoc)
router.post("/decline-user/:id",declineDoc)
module.exports = router;

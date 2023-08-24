const adminSchema = require("../../models/adminModels/userModels");
const bcrypt = require("bcrypt");
const { error, success } = require("../../responseCode");
const validator = require("validator");
const categoryModels = require("../../models/adminModels/categoryModels");
const subCategoryModel = require("../../models/adminModels/subCategoryModel");



///-------> admin Signup Api 
exports.adminRegister = async (req, res) => {
  try {
    const { userName, userEmail, password } = req.body;
    if (!userName) {
      return res.status(201).json(error("Please enter  name", res.statusCode));
    }
    if (!validator.isEmail(userEmail)) {
      return res
        .status(201)
        .json(error("Please enter  userEmail", res.statusCode));
    }
    if (!password) {
      return res
        .status(201)
        .json(error("Please enter password", res.statusCode));
    }
    const checkMail = await adminSchema.findOne({ userEmail: userEmail });
    if (checkMail) {
      return res.status(201).json(error("userEmail are already register"));
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new adminSchema({
      userName: userName,
      userEmail: userEmail,
      password: passwordHash,
    });
    const admin = await newUser.save();
    res.status(200).json(success(res.statusCode, "Success", { admin }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};
//------> admin Login Api
exports.loginAdmin = async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    if (userEmail && password) {
      const verifyUser = await adminSchema.findOne({
        userEmail: userEmail,
      });
      if (verifyUser != null) {
        const isMatch = await bcrypt.compare(password, verifyUser.password);
        if (isMatch) {
          const token = await verifyUser.AdminAuthToken();
          return res
            .header("x-auth-token-user", token)
            .header("access-control-expose-headers", "x-auth-token-admin")
            .status(201)
            .json(
              success(res.statusCode, "login SuccessFully", {
                verifyUser,
                token,
              })
            );
        } else {
          res
            .status(403)
            .json(error("User Password Are Incorrect", res.statusCode));
        }
      } else {
        res
          .status(403)
          .json(error("User userEmail Are Incorrect", res.statusCode));
      }
    } else {
      res
        .status(403)
        .json(error("UserEamil and Password Are empty", res.statusCode));
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//---> admin reset password Api
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, Email } = req.body;
    if (newPassword && confirmPassword && Email) {
      if (newPassword !== confirmPassword) {
        return res
          .status(401)
          .json(error("newPassword Or confirmPassword Could Not Be Same"));
      } else {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const createPassword = await adminSchema.findOneAndUpdate(
          { Email: Email },
          {
            $set: { password: passwordHash },
          }
        );
        res
          .status(200)
          .json(success(res.statusCode, "Success", { createPassword }));
      }
    } else {
      res.status(201).json(error("All Filed are required", res.statusCode));
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//---> admin update api
exports.updateProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const data = {
      userName: req.body.userName,
      profile: req.file.filename,
    };
    const updateData = await adminSchema.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json(success(res.statusCode, "Success", { updateData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};


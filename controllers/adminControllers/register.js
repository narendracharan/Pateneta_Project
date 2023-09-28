const adminSchema = require("../../models/adminModels/userModels");
const bcrypt = require("bcrypt");
const { error, success } = require("../../responseCode");
const validator = require("validator");
const categoryModels = require("../../models/adminModels/categoryModels");
const subCategoryModel = require("../../models/adminModels/subCategoryModel");
const userModels = require("../../models/adminModels/userModels");
const { transporter } = require("../../services/mailServices");

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
    const { userName, password } = req.body;
    if (userName && password) {
      const verifyUser = await adminSchema.findOne({
        userName: userName,
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
    const { newPassword, confirmPassword, userEmail } = req.body;
    if (newPassword && confirmPassword && Email) {
      if (newPassword !== confirmPassword) {
        return res
          .status(401)
          .json(error("newPassword Or confirmPassword Could Not Be Same"));
      } else {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const createPassword = await adminSchema.findOneAndUpdate(
          { userEmail: userEmail },
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

exports.sendUserResetPassword = async (req, res) => {
  try {
    const {userEmail} = req.body;
    const user = await userModels.findOne({userEmail:userEmail})
 
    if (user) {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      let info = {
        from: "s04450647@gmail.com",
        to: userEmail,
        subject: "Email Send For Reset Password",
        text: `This ${otp} Otp Verify To Email`,
      };
     
      await userModels.findOneAndUpdate({ userEmail: userEmail }, { otp: otp });
      await transporter.sendMail(info);
      return res.status(200).json(success(res.statusCode, "Success", {}));
    } else {
      res.status(201).json(error("userEmail are empty", res.statusCode));
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.OtpVerify = async (req, res) => {
  try {
    const { userEmail, otp } = req.body;
    if (!userEmail || !otp) {
      return res
        .status(201)
        .json(error("Empty Otp Details Are Not Allowed", res.statusCode));
    }
    const userOtpVerify = await userModels.findOne({ userEmail: userEmail });
    if (userOtpVerify.otp == otp) {
      return res
        .status(200)
        .json(success(res.statusCode, "Verify Otp Successfully", {}));
    } else {
      return res.status(200).json(error("Invalid Otp", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

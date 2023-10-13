const adminSchema = require("../../models/adminModels/userModels");
const bcrypt = require("bcrypt");
const moment = require("moment");
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
    const checkName = await adminSchema.findOne({ userName: userName });
    if (checkName) {
      return res.status(201).json(error("userName are already register"));
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
    if (!userName) {
      return res
        .status(201)
        .json(error("please provide username", res.statusCode));
    }
    if (!password) {
      return res
        .status(201)
        .json(error("please provide password", res.statusCode));
    }
    const verifyUser = await adminSchema.findOne({
      userName: userName,
    });
    if (!verifyUser) {
      return res
        .status(201)
        .json(error("userName Not Register", res.statusCode));
    }
    const isMatch = await bcrypt.compare(password, verifyUser.password);
    if (!isMatch) {
      return res.status(201).json(error("password is Not Matched", res.statusCode));
    }
    const token = await verifyUser.AdminAuthToken();
    res
      .header("x-auth-token-user", token)
      .header("access-control-expose-headers", "x-auth-token-admin")
      .status(201)
      .json(
        success(res.statusCode, "login SuccessFully", {
          verifyUser,
          token,
        })
      );
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
    const { userName, userEmail, mobileNumber, profile } = req.body;
    const admin = await adminSchema.findById(req.params.id);
    if (userName) {
      admin.userName = userName;
    }
    if (userEmail) {
      admin.userEmail = userEmail;
    }
    if (mobileNumber) {
      admin.mobileNumber = mobileNumber;
    }
      admin.profile = `${process.env.BASE_URL}/${req.file.filename}`;
    
    await admin.save();
    res.status(200).json(success(res.statusCode, "Success", { admin }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.sendUserResetPassword = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const user = await userModels.findOne({ userEmail: userEmail });

    if (user) {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      let info = {
        from: "s04450647@gmail.com",
        to: userEmail,
        subject: "Email Send For Reset Password",
        text: `This ${otp} Otp Verify To Email.
          Your OTP will expire in 10 minutes`,
      };
      const date = new Date(moment(new Date()).add(10, "minute"));
      await userModels.updateMany(
        { userEmail: userEmail },
        { otp: otp, expireOtp: date }
      );

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
    if (userOtpVerify.otp === +otp && new Date() > userOtpVerify.expireOtp) {
      return res.status(201).json(error("OTP Expired", res.statusCode));
    }

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

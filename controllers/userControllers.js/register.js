const userSchema = require("../../models/userModels/UserRegister");
const { error, success } = require("../../responseCode");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const languageModels = require("../../models/userModels/languageModels");
const productModel = require("../../models/userModels/productModel");
//const otpGenerator=require("otp-generator")

// const accountSid = 'AC7898d1cff989f262b5413d25e1038f1b'; // Your Account SID from www.twilio.com/console
// const authToken = '6c4bd2aaebdccf544e7e988730ff6b90'; // Your Auth Token from www.twilio.com/console

// const twilio = require("twilio");
// const client = new twilio(accountSid, authToken);

//---> Register User Api
exports.userRegister = async (req, res) => {
  try {
    const { fullName_en, fullName_ar, Email, mobileNumber, password } =
      req.body;
    if (!fullName_en || fullName_ar) {
      return res.status(201).json(error("Please enter  name", res.statusCode));
    }
    if (!validator.isEmail(Email)) {
      return res.status(201).json(error("Please enter  Email", res.statusCode));
    }
    if (!mobileNumber) {
      return res
        .status(201)
        .json(error("Please enter mobileNumber", res.statusCode));
    }
    if (!password) {
      return res
        .status(201)
        .json(error("Please enter password", res.statusCode));
    }
    const checkNumber = await userSchema.findOne({
      mobileNumber: mobileNumber,
    });
    if (checkNumber) {
      return res.status(201).json(error("mobileNumber are already register"));
    }
    const checkMail = await userSchema.findOne({ Email: Email });
    if (checkMail) {
      return res.status(201).json(error("Email are already register"));
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new userSchema({
      fullName_en: fullName_en,
      fullName_ar: fullName_ar,
      Email: Email,
      mobileNumber: mobileNumber,
      password: passwordHash,
      type: "User",
    });
    const user = await newUser.save();
    res.status(200).json(success(res.statusCode, "Success", { user }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

// -----> Login Api
exports.userLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;
    if (mobileNumber && password) {
      const verifyUser = await userSchema.findOne({
        mobileNumber: mobileNumber,
      });
      if (verifyUser != null) {
        const isMatch = await bcrypt.compare(password, verifyUser.password);
        if (isMatch) {
          const token = await verifyUser.generateAdminAuthToken();
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
          .json(error("User mobileNumber Are Incorrect", res.statusCode));
      }
    } else {
      res
        .status(403)
        .json(
          error("User mobileNumber and Password Are empty", res.statusCode)
        );
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-----> Company Register Api
exports.companySignup = async (req, res) => {
  try {
    const { companyName_en, companyName_ar, Email, mobileNumber, password } =
      req.body;
    if (!companyName_en || companyName_ar) {
      return res.status(201).json(error("Please enter  name", res.statusCode));
    }
    if (!validator.isEmail(Email)) {
      return res.status(201).json(error("Please enter  Email", res.statusCode));
    }
    if (!mobileNumber) {
      return res
        .status(201)
        .json(error("Please enter mobileNumber", res.statusCode));
    }
    if (!password) {
      return res
        .status(201)
        .json(error("Please enter password", res.statusCode));
    }
    const checkNumber = await userSchema.findOne({
      mobileNumber: mobileNumber,
    });
    if (checkNumber) {
      return res.status(201).json(error("mobileNumber are already register"));
    }
    const checkMail = await userSchema.findOne({ Email: Email });
    if (checkMail) {
      return res.status(201).json(error("Email are already register"));
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new userSchema({
      companyName_en: companyName_en,
      companyName_ar: companyName_ar,
      Email: Email,
      mobileNumber: mobileNumber,
      password: passwordHash,
      type: "User",
    });
    const company = await newUser.save();
    res.status(201).json(success(res.statusCode, "Success", { company }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----> Reset Password Api
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
        const createPassword = await userSchema.findOneAndUpdate(
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

//----> User Kyc Api
exports.userKyc = async (req, res) => {
  try {
    const id = req.params.id;
    const { docFile, IdNumber } = req.body;
    if (docFile && IdNumber) {
      return res.status(201).json(error("All Filed are required"));
    }
    if (req.files.length) {
      if (
        !(
          req.files[0].mimetype == "image/jpeg" ||
          req.files[0].mimetype == "image/jpg" ||
          req.files[0].mimetype == "image/png"
        )
      ) {
        return res
          .status(201)
          .json(error("Invalid Image format", res.statusCode));
      } else {
        const data = {
          IdNumber: req.body.IdNumber,
          docFile: req.files[0].filename,
        };
        const createKyc = await userSchema.findByIdAndUpdate(id, data, {
          new: true,
        });
        res.status(200).json(success(res.statusCode, "Success", { createKyc }));
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-----> Company Kyc Api
exports.companyKyc = async (req, res) => {
  try {
    const id = req.params.id;
    const { docFile, companyNumber } = req.body;
    if (docFile && companyNumber) {
      return res.status(201).json(error("All Filed are required"));
    }
    if (req.files.length) {
      if (
        !(
          req.files[0].mimetype == "image/jpeg" ||
          req.files[0].mimetype == "image/jpg" ||
          req.files[0].mimetype == "image/png"
        )
      ) {
        return res
          .status(201)
          .json(error("Invalid Image format", res.statusCode));
      } else {
        const data = {
          IdNumber: req.body.companyNumber,
          docFile: req.files[0].filename,
        };
        const createKyc = await userSchema.findByIdAndUpdate(id, data, {
          new: true,
        });
        res.status(200).json(success(res.statusCode, "Success", { createKyc }));
      }
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----> User Profile Updated
exports.userEditProfile = async (req, res) => {
  try {
    const {
      fullName_en,
      fullName_ar,
      companyName_ar,
      companyName_en,
      password,
      Email,
      profile,
      mobileNumber,
      anotherEmail,
      DOB,
      address,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    var allFiled = {
      fullName_en: fullName_en,
      fullName_ar: fullName_ar,
      companyName_en: companyName_en,
      companyName_ar: companyName_ar,
      password: passwordHash,
      Email: Email,
      mobileNumber: mobileNumber,
      profile: req.file.filename,
      coverImage: req.file.filename,
      anotherEmail: anotherEmail,
      DOB: DOB,
      address: address,
    };
    const updateProfile = await userSchema.findByIdAndUpdate(
      req.params.id,
      allFiled,
      { new: true }
    );
    res
      .status(200)
      .json(success(res.statusCode, "Updated Profile", updateProfile));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//---> create language Api
exports.addLanguage = async (req, res) => {
  try {
    const { language, deviceOs, device_Id } = req.body;
    if ((language, deviceOs, device_Id)) {
      let newlanguage = new languageModels({
        language: language,
        deviceOs: deviceOs,
        device_Id: device_Id,
      });
      const languageData = await newlanguage.save();
      return res
        .status(200)
        .json(success(res.statusCode, "Success", { languageData }));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//--------> update language Api
exports.updateLanguage = async (req, res) => {
  try {
    const updateLanguage = await languageModels.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json(success(res.statusCode, "Success", { updateLanguage }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//----> verify user by admin
exports.verifyUser = async (req, res) => {
  try {
    const userVerify = "APPROVED";
    const verify = await productModel.findByIdAndUpdate(
      req.params.id,
      { verify: userVerify },
      { new: true }
    );
    res.status(200).json(success(res.statusCode, "Success", { verify }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};
//----- user LogOut APi
exports.logOut = async (req, res) => {
  try {
    const authHeader = req.headers["x-auth-token-user"];
    jwt.sign(
      authHeader,
      "ultra-security",
      {
        expiresIn: 1,
      },
      (logout, err) => {
        if (logout) {
          res.status(200).json(success(res.statusCode, "Successfully Logout "));
        } else {
          res.status(400).json(error("Failed", res.statusCode, { err }));
        }
      }
    );
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.userResetPassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { password, newPassword, confirmPassword } = req.body;
    if (!password) {
      res.status(201).json(error("please provide password", res.statusCode));
    }
    if (!newPassword) {
      res.status(201).json(error("please provide newPassword", res.statusCode));
    }
    if (!confirmPassword) {
      res
        .status(201)
        .json(error("please provide confirmPassword", res.statusCode));
    }
    if (newPassword == confirmPassword) {
      const match = await userSchema.findById(id);
      console.log(match);
      if (!(await match.checkPassword(password, match.password))) {
        return res
          .status(201)
          .json(error("Password not matched", res.statusCode));
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      match.password = passwordHash;
      await match.save();
      res.status(200).json(success(res.statusCode, "Success", { match }));
    } else {
      res
        .status(201)
        .json(error("newPassword and confirmPassword connot be same"));
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.sendOtpPassword = async (req, res) => {
  try {
    // const {mobileNumber}=req.body
    // const user=await userSchema.findOne({mobileNumber:mobileNumber})
    // const otp = Math.floor(1000 + Math.random() * 9000);
    // // const add= await client.messages
    // // .create({
    // //   body: `verify ${otp}`,
    // //   to: '9116472181', // Text this number
    // //   from: '+(91)15188726111' // From a valid Twilio number
    // // })
    // // .then((message) => console.log(message.sid));
    // // console.log(add);
    // const otp2 = otpGenerator.generate(6, {
    //     upperCaseAlphabets: false,
    //     specialChars: false,
    // });
    // //await addNewOTP(otp2, 15,);
    // await sendVerificationMessage(
    //     {
    //         mobileNumber,
    //         otp2,
    //     },
    //);
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

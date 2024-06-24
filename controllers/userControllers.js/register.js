const userSchema = require("../../models/userModels/UserRegister");
const { error, success } = require("../../responseCode");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const languageModels = require("../../models/userModels/languageModels");
const productModel = require("../../models/userModels/productModel");
const adminSchema = require("../../models/adminModels/userModels");
const sendMail = require("../../services/EmailSerices");
const { notification } = require("./notification");
const userNotification = require("../../models/adminModels/userNotification");
const moment = require("moment");
const Image=require("../../models/userModels/imageModels")
// const firebase = require("firebase-admin");
// const service = require("../../config/firebase.json");

// firebase.initializeApp({
//   credential: firebase.credential.cert(service),
// });

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
    // if (!fullName_en || !fullName_ar) {
    //   return res.status(201).json(error("Please enter  name", res.statusCode));
    // }
    if (!validator.isEmail(Email)) {
      return res.status(201).json(error("Please enter  Email", res.statusCode));
    }
    // if (!mobileNumber) {
    //   return res
    //     .status(201)
    //     .json(error("Please enter mobileNumber", res.statusCode));
    // }
    if (!password) {
      return res
        .status(201)
        .json(error("Please enter password", res.statusCode));
    }
    const admin = await adminSchema.findOne();
    const checkName = await userSchema.findOne({
      fullName_en: fullName_en,
    });
    if (mobileNumber) {
      const checkNumber = await userSchema.findOne({
        mobileNumber: mobileNumber,
      });
      if (checkNumber) {
        return res
          .status(201)
          .json(error("mobile Number is already register", res.statusCode));
      }
    }

    const checkMail = await userSchema.findOne({ Email: Email });
    if (checkMail) {
      return res
        .status(201)
        .json(error("Email is already register", res.statusCode));
    }
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new userSchema({
      fullName_en: fullName_en,
      fullName_ar: fullName_ar,
      Email: Email,
      mobileNumber: mobileNumber,
      password: passwordHash,
      userType: "Buyer",
    });
    const user = await newUser.save();
    var expire_time = (expire_time = moment(expire_time).add(5, "minutes"));
    await userSchema.findByIdAndUpdate(user._id, {
      otp: +otp,
      otpExpriTime: expire_time,
    });
    await userNotification.create({
      title: "New User has been registered on the Platform",
    });
    await sendMail(
      Email,
      `PATENTA OTP`,
      fullName_en || fullName_ar,
      `<br.
      <br>
      Your otp is ${otp} expire in 5 minute<br>
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );

    await sendMail(
      admin.userEmail,
      `New User`,
      admin.userName,
      `<br.
      <br>
      New User has been registered on the Platform <br>
      <br>
  
      <br>
      Please Login Your Account https://admin.patenta-sa.com/
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );
    res.status(200).json(success(res.statusCode, "Success", { user, otp }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//---> Register User Api
exports.sellerRegister = async (req, res) => {
  try {
    const { fullName_en, fullName_ar, Email, mobileNumber, password } =
      req.body;
    // if (!fullName_en || !fullName_ar) {
    //   return res.status(201).json(error("Please enter  name", res.statusCode));
    // }
    console.log(req.body);
    if (!validator.isEmail(Email)) {
      return res.status(201).json(error("Please enter  Email", res.statusCode));
    }
    // if (!mobileNumber) {
    //   return res
    //     .status(201)
    //     .json(error("Please enter mobileNumber", res.statusCode));
    // }
    if (!password) {
      return res
        .status(201)
        .json(error("Please enter password", res.statusCode));
    }
    const admin = await adminSchema.findOne();
    if (mobileNumber) {
      const checkNumber = await userSchema.findOne({
        mobileNumber: mobileNumber,
      });
      if (checkNumber) {
        return res
          .status(201)
          .json(error("mobile Number is already register", res.statusCode));
      }
    }

    const checkMail = await userSchema.findOne({ Email: Email });
    if (checkMail) {
      return res
        .status(201)
        .json(error("Email is already register", res.statusCode));
    }
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new userSchema({
      fullName_en: fullName_en,
      fullName_ar: fullName_ar,
      Email: Email,
      mobileNumber: mobileNumber,
      password: passwordHash,
      userType: "Seller",
    });
    const user = await newUser.save();
    var expire_time = (expire_time = moment(expire_time).add(5, "minutes"));
    await userSchema.findByIdAndUpdate(user._id, {
      otp: +otp,
      otpExpriTime: expire_time,
    });
    await userNotification.create({
      title: " New User has been registered on the Platform",
    });
    await sendMail(
      Email,
      `PATENTA OTP`,
      fullName_en || fullName_ar,
      `<br.
      <br>
      Your otp is ${otp} expire in 5 minute<br>
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );
    await sendMail(
      admin.userEmail,
      `New User`,
      admin.userName,
      `<br.
      <br>
      New User has been registered on the Platform <br>
      <br>
  
      <br>
      Please Login Your Account https://admin.patenta-sa.com/
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );
    res.status(200).json(success(res.statusCode, "Success", { user, otp }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

// -----> Login Api
exports.userLogin = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;
    if (!email) {
      return res
        .status(201)
        .json(error("Please Provide  Email", res.statusCode));
    }
    if (!password) {
      return res
        .status(201)
        .json(error("Please Provide Passwprd", res.statusCode));
    }

    const verifyUser = await userSchema.findOne({
      Email: email,
    });
    if (fcmToken) {
      verifyUser.fcmToken = fcmToken;
      await verifyUser.save();
    }
    if (!verifyUser) {
      return res
        .status(201)
        .json(error("mobile Number is Not Register", res.statusCode));
    }
    if (verifyUser.userVerify != "APPROVED") {
      res.status(201).json(error("Your Are Not Approved User", res.statusCode));
    }
    if (verifyUser.status != true) {
      res
        .status(201)
        .json(
          error("Admin Has Blocked Your Access to Patenta.", res.statusCode)
        );
    }
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const isMatch = await bcrypt.compare(password, verifyUser.password);
    if (!isMatch) {
      return res
        .status(201)
        .json(error("User Password Are Incorrect", res.statusCode));
    }
    const token = await verifyUser.generateAdminAuthToken();
    return res
      .header("x-auth-token-user", token)
      .header("access-control-expose-headers", "x-auth-token-admin")
      .status(201)
      .json(
        success(res.statusCode, "login SuccessFully", {
          verifyUser,
          token,
          otp,
        })
      );
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
    // if (!companyName_en || companyName_ar) {
    //   return res.status(201).json(error("Please enter  name", res.statusCode));
    // }
    if (!validator.isEmail(Email)) {
      return res.status(201).json(error("Please enter  Email", res.statusCode));
    }
    // if (!mobileNumber) {
    //   return res
    //     .status(201)
    //     .json(error("Please enter mobile Number", res.statusCode));
    // }
    if (!password) {
      return res
        .status(201)
        .json(error("Please enter password", res.statusCode));
    }
    const checkName = await userSchema.findOne({
      companyName_en: companyName_en,
    });
    if (checkName) {
      return res
        .status(201)
        .json(error("companyName is already register", res.statusCode));
    }
    if (mobileNumber) {
      const checkNumber = await userSchema.findOne({
        mobileNumber: mobileNumber,
      });
      if (checkNumber) {
        return res
          .status(201)
          .json(error("mobile Number is already register", res.statusCode));
      }
    }

    const checkMail = await userSchema.findOne({ Email: Email });
    if (checkMail) {
      return res
        .status(201)
        .json(error("Email is already register", res.statusCode));
    }
    const admin = await adminSchema.findOne();
    const passwordHash = await bcrypt.hash(password, 10);
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const newUser = new userSchema({
      companyName_en: companyName_en,
      companyName_ar: companyName_ar,
      Email: Email,
      mobileNumber: mobileNumber,
      password: passwordHash,
      companyType: "Seller",
    });
    const company = await newUser.save();
    await userNotification.create({
      title: "New User has been registered on the Platform",
    });
    var expire_time = (expire_time = moment(expire_time).add(5, "minutes"));
    await userSchema.findByIdAndUpdate(company._id, {
      otp: +otp,
      otpExpriTime: expire_time,
    });
    await userNotification.create({
      title: " New User has been registered on the Platform",
    });
    await sendMail(
      Email,
      `PATENTA OTP`,
      companyName_en || companyName_ar,
      `<br.
      <br>
      Your otp is ${otp} expire in 5 minute<br>
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );
    await sendMail(
      admin.userEmail,
      `New User`,
      admin.userName,
      `<br.
      <br>
      New User has been registered on the Platform <br>
      <br>
  
      <br>
      Please Login Your Account https://admin.patenta-sa.com/
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );
    res.status(201).json(success(res.statusCode, "Success", { company, otp }));
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
          .json(
            error(
              "newPassword Or confirmPassword Could Not Be Same",
              res.statusCode
            )
          );
      } else {
        const user = await userSchema.findOne({
          Email: Email,
        });
        if (!user) {
          return res.status(200).json(error("Invalid Email", res.statusCode));
        }
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
    if (!IdNumber) {
      return res
        .status(201)
        .json(error("Please Provide IdNumber", res.statusCode));
    }
    const createKyc = await userSchema.findById(id);
    const isMatch = await userSchema.findOne({ IdNumber: IdNumber });
    if (isMatch) {
      return res
        .status(200)
        .json(error("IdNumber Aleardy Register", res.statusCode));
    }
    if (IdNumber) {
      createKyc.IdNumber = IdNumber;
    }
    if (req.files.length) {
      createKyc.docFile = `${process.env.BASE_URL}/${req.files[0].filename}`;
    }
    await createKyc.save();
    res.status(200).json(success(res.statusCode, "Success", { createKyc }));
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
    if (!companyNumber) {
      return res
        .status(201)
        .json(error("Please Provide companyNumber", res.statusCode));
    }

    const createKyc = await userSchema.findById(id);
    const isMatch = await userSchema.findOne({ companyNumber: companyNumber });
    if (isMatch) {
      return res
        .status(200)
        .json(error("Company Number Aleardy Register", res.statusCode));
    }
    if (companyNumber) {
      createKyc.companyNumber = companyNumber;
    }
    if (req.files.length) {
      createKyc.docFile = `${process.env.BASE_URL}/${req.files[0].filename}`;
    }
    await createKyc.save();
    res.status(200).json(success(res.statusCode, "Success", { createKyc }));
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
      description,
      Email,
      mobileNumber,
      anotherEmail,
      DOB,
      address,
    } = req.body;
    // const passwordHash = await bcrypt.hash(password, 10);
    const userprofile = await userSchema.findById(req.params.id);
    if (fullName_en) {
      userprofile.fullName_en = fullName_en;
    }
    if (fullName_ar) {
      userprofile.fullName_ar = fullName_ar;
    }
    if (companyName_en) {
      userprofile.companyName_en = companyName_en;
    }
    if (companyName_ar) {
      userprofile.companyName_ar = companyName_ar;
    }
    if (description) {
      userprofile.description = description;
    }
    if (Email) {
      userprofile.Email = Email;
    }
    if (mobileNumber) {
      userprofile.mobileNumber = mobileNumber;
    }
    if (DOB) {
      userprofile.DOB = DOB;
    }
    if (address) {
      userprofile.address = address;
    }
    if (anotherEmail) {
      userprofile.anotherEmail = anotherEmail;
    }
    if (req.files.length) {
      if (req.files[0].fieldname == "profile") {
        userprofile.profile = `${process.env.BASE_URL}/${req.files[0].filename}`;
      }
      if (req.files[0].fieldname == "coverImage") {
        userprofile.coverImage = `${process.env.BASE_URL}/${req.files[0].filename}`;
      }
    }
    await userprofile.save();
    res
      .status(200)
      .json(success(res.statusCode, "Updated Profile", userprofile));
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

//User Reset Password Api
exports.userResetPassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { password, newPassword, confirmPassword } = req.body;
    if (!password) {
      return res
        .status(201)
        .json(error("please provide password", res.statusCode));
    }
    if (!newPassword) {
      return res
        .status(201)
        .json(error("please provide newPassword", res.statusCode));
    }
    if (!confirmPassword) {
      return res
        .status(201)
        .json(error("please provide confirmPassword", res.statusCode));
    }
    if (newPassword == confirmPassword) {
      const match = await userSchema.findById(id);
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

// User Details Api
exports.userDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const userDetails = await userSchema.findById(id);
    res.status(200).json(success(res.statusCode, "Success", { userDetails }));
  } catch (err) {
    res.status(400).json(error("Error in User Details", res.statusCode));
  }
};

//  Add User Bank Account

exports.addAccount = async (req, res) => {
  try {
    const { bankName, accountNumber, iban, OwnerName } = req.body;
    if (!bankName) {
      return res
        .status(201)
        .json(error("Please Provide Bank Name", res.statusCode));
    }
    if (!accountNumber) {
      return res
        .status(201)
        .json(error("Please Provide account Number", res.statusCode));
    }
    if (!iban) {
      return res
        .status(201)
        .json(error("Please Provide Iban Number", res.statusCode));
    }
    if (!OwnerName) {
      return res
        .status(201)
        .json(error("Please Provide Owner Name", res.statusCode));
    }
    const user = await userSchema.findById(req.params.id);
    if (bankName) {
      user.bankName = bankName;
    }
    if (accountNumber) {
      user.accountNumber = accountNumber;
    }
    if (OwnerName) {
      user.OwnerName = OwnerName;
    }
    if (iban) {
      user.iban = iban;
    }
    await user.save();
    res.status(200).json(success(res.statusCode, "Success", { user }));
  } catch (err) {
    res.status(400).json(error("Error", res.statusCode));
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

exports.OtpVerify = async (req, res) => {
  try {
    const { otp, Email } = req.body;
    const userOtpVerify = await userSchema.findOne({ Email: Email });
    if (userOtpVerify.otp === +otp && new Date() > userOtpVerify.otpExpriTime) {
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
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

///-------> Send Email
exports.sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(201)
        .json(error("Please provide email", res.statusCode));
    }
    if (!validator.isEmail(email)) {
      return res.status(201).json(error("Invalid email", res.statusCode));
    }
    const users = await userSchema.findOne({
      Email: email,
    });
    const otp = Math.floor(1000 + Math.random() * 9000);
    var expire_time = (expire_time = moment(expire_time).add(5, "minutes"));
    const user = await userSchema.findByIdAndUpdate(users._id, {
      otp: +otp,
      otpExpriTime: expire_time,
    });
    await sendMail(
      email,
      `PATENTA OTP`,
      users.companyName_en ||
        users.companyName_ar ||
        users.fullName_ar ||
        users.fullName_en,
      `<br.
      <br>
      Your otp is ${otp} expire in 5 minute<br>
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );
    res.status(201).json(success("OTP Sent", { otp, user }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("forget password error", res.statusCode));
  }
};


exports.addImage = async (req, res) => {
  try {
    const image = await Image.create({
      image:`${process.env.BASE_URL}/${req.files[0].filename}`,
    });

    res.status(200).json(success("Success", { image }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("error", res.statusCode));
  }
};
const userModels = require("../../models/userModels/UserRegister");
const { error, success } = require("../../responseCode");
const sendMail = require("../../services/EmailSerices");
const { transporter } = require("../../services/mailServices");

//User List Api
exports.userList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const userList = await userModels.find({
      $and: [
        from ? { createdAt: { $gte: new Date(from) } } : {},
        to ? { createdAt: { $lte: new Date(`${to}T23:59:59`) } } : {},
      ],
    }).sort({createdAt:-1})

    res.status(200).json(success(res.statusCode, "Success", { userList }));

  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//User Details Api
exports.userDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const userDetails = await userModels.findById(id)
    if (userDetails) {
      res.status(200).json(success(res.statusCode, "Success", { userDetails }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//Approved Docs Api
exports.approvedDoc = async (req, res) => {
  try {
    const id = req.params.id;
    const approved = "APPROVED";
    const approvedUser = await userModels.findById(id)
    approvedUser.userVerify = approved;
    await approvedUser.save();

    await sendMail(
      approvedUser.Email,
      `Account Verify`,
      approvedUser.fullName_en || approvedUser.companyName_en,
      `<br.
      <br>
      Your account has been approved by admin.<br>
      <br>
      <b> We are delighted to welcome you to Patenta, a platform where each and every idea is valued.</b>
      <br>
      Your access to our platform is now hassle-free.<br>
      <br>
      Please Login Your Account https://patenta-sa.com/login
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );

    res.status(200).json(success(res.statusCode, "Success", { approvedUser }));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//User Decline Docs Api
exports.declineDoc = async (req, res) => {
  try {
    const id = req.params.id;
    const status = "REJECTED";
    const decline = req.body.decline;
    const declinedUser = await userModels.findById(id)
    declinedUser.userVerify = status;
    declinedUser.declineDoc = decline;
    await declinedUser.save();
    if (declinedUser) {
      res
        .status(200)
        .json(success(res.statusCode, "Success", { declinedUser }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//User Delete Api
exports.userDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUser = await userModels.findByIdAndDelete(id);
    if (deleteUser) {
      res.status(200).json(success(res.statusCode, "Success", { deleteUser }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//Change Status Api
exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    if (!status) {
      res.status(201).json(error("please provide status", res.statusCode));
    }
    const changeStatus = await userModels.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (changeStatus.status == false) {
      await sendMail(
        changeStatus.Email,
        `Block User`,
        changeStatus.fullName_en || changeStatus.companyName_en,
        `<br.
        <br>
        Admin Has Blocked Your Access to Patenta..<br>
        <br>
        <br>
        Patenta<br>
        Customer Service Team<br>
        91164721
        `
      );
    }
    if (changeStatus.status == true) {
      await sendMail(
        changeStatus.Email,
        `UnBlock User`,
        changeStatus.companyName_en || changeStatus.fullName_en,
        `<br.
        <br>
        Admin Has UnBlocked Your Access to Patenta..<br>
        <br>
        <b> We are delighted to welcome you to Patenta, a platform where each and every idea is valued.</b>
        <br>
        Your access to our platform is now hassle-free.<br>
        <br>
        Please Login Your Account https://patenta-sa.com/login
        <br>
        <br>
        Patenta<br>
        Customer Service Team<br>
        91164721
        `
      );
    }
    res.status(200).json(success(res.statusCode, "Success", { changeStatus }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

///-------> Verify Document Api
exports.verifyDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const approved = "APPROVED";
    const approvedUser = await userModels.findById(id)
    approvedUser.verifyDocument = approved;
    approvedUser.companyType = "Seller";
    await approvedUser.save();

    await sendMail(
      approvedUser.Email,
      `Verify Kyc`,
      approvedUser.fullName_en || approvedUser.companyName_en,
      `<br.
      <br>
      Your KYC has been approved by admin.<br>
      <br>
      <b> We are delighted to welcome you to Patenta, a platform where each and every idea is valued.</b>
      <br>
      Your access to our platform is now hassle-free.<br>
      <br>
      Please Login Your Account https://patenta-sa.com/login
      <br>
      <br>
      Patenta<br>
      Customer Service Team<br>
      91164721
      `
    );
    res.status(200).json(success(res.statusCode, "Veirfy Document"));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error In VerifyDocument", res.statusCode));
  }
};

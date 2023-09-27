const userModels = require("../../models/userModels/UserRegister");
const { error, success } = require("../../responseCode");

exports.userList = async (req, res) => {
  try {
    const { from, to } = req.body;
    const userList = await userModels.find({
      $and: [
        from ? { createdAt: { $gte: new Date(from) } } : {},
        to ? { createdAt: { $lte: new Date(`${to}T23:59:59`) } } : {},
      ],
    });
    if (userList) {
      res.status(200).json(success(res.statusCode, "Success", { userList }));
    } else {
      res.status(201).json(error("NO Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.userDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const userDetails = await userModels.findById(id);
    if (userDetails) {
      res.status(200).json(success(res.statusCode, "Success", { userDetails }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.approvedDoc = async (req, res) => {
  try {
    const id = req.params.id;
    const approved = "APPROVED";
    const approvedUser = await userModels.findById(id);
    approvedUser.userVerifyDOc = approved;
    await approvedUser.save();
    if (approvedUser) {
      res
        .status(200)
        .json(success(res.statusCode, "Success", { approvedUser }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

exports.declineDoc = async (req, res) => {
  try {
    const id = req.params.id;
    const status = "REJECTED";
    const decline = req.body.decline;
    const declinedUser = await userModels.findById(id);
    declinedUser.userVerifyDOc = status;
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
    if (changeStatus) {
      res
        .status(200)
        .json(success(res.statusCode, "Success", { changeStatus }));
    } else {
      res.status(201).json(error("No Data Found", res.statusCode));
    }
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

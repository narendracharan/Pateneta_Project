const jwt = require("jsonwebtoken");
const { error } = require("../responseCode");
const User = require("../models/userModels/UserRegister");

async function tokenAuthorisationUser(req, res, next) {
  const token = req.header("x-auth-token-user");
  if (!token)
    return res
      .status(401)
      .json(error("Access Denied. No token provided.", res.statusCode));
  try {
    const decoded = jwt.verify(token, "ultra-security");
    req.user = decoded;
    const user = await User.findById(req.user._id);
    next();
  } catch (ex) {
    return res
      .status(400)
      .json(error("You are not Authenticated Yet", res.statusCode));
  }
}
module.exports = tokenAuthorisationUser;

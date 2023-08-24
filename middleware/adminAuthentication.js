const jwt = require("jsonwebtoken");
const { error } = require("../responseCode");

function adminAuthorisationUser(req, res, next) {
  const token = req.header("x-auth-token-admin");
  if (!token)
    return res
      .status(401)
      .json(error("Access Denied. No token provided.", res.statusCode));
  try {
    const decoded = jwt.verify(token, "ultra-security");
    req.user = decoded;
    next();
  } catch (ex) {
    return res
      .status(400)
      .json(error("You are not Authenticated Yet", res.statusCode));
  }
}
module.exports = adminAuthorisationUser;

const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) {
    // 401 Unauthorized
    res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    // 400 Bad Request
    res.status(400).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;

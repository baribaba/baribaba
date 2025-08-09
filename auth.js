// server/middleware/auth.js
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "dev_jwt_secret";

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

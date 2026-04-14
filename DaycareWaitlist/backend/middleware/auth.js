const jwt = require("jsonwebtoken");

module.exports = (req) => {
  const token = req.headers.authorization || "";

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated",
    });
  }

  try {
    const verifiedData = jwt.verify(token, SECRET_KEY);

    req.user = verifiedData;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or Expired Token.",
    });
  }
};

module.exports = verifyToken;

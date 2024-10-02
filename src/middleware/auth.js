const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req?.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      status: false,
      error: "token is required",
      message: "A token is required for authentication",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.userId = decoded.userId; // Assign userId from the decoded token to req.userId
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "Token is not valid", error: error });
  }
};

module.exports = verifyToken;

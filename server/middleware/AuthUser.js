const jwt = require("jsonwebtoken");
const Blacklist = require("../models/BlacklistModel");

module.exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token not provided" });
    }

    console.log("Received token:", token);

    // Check if token is blacklisted
    const blacklistedToken = await Blacklist.findOne({ where: { token } });
    if (blacklistedToken) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Store decoded token data in req.user for further use
    next();
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ msg: "Invalid token" });
    }
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    // Mengakses role dari req.user
    return res.status(403).json({ msg: "Access Forbidden" });
  }
  next();
};

// const jwt = require("jsonwebtoken");

// module.exports.verifyToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     console.log("Received token:", token);

//     if (!token) {
//       return res.status(401).json({ msg: "Token not provided" });
//     }

//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     req.email = decoded.email;
//     req.role = decoded.role;
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);

//     if (error.name === "JsonWebTokenError") {
//       return res.status(403).json({ msg: "Invalid token" });
//     }
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

// module.exports.adminOnly = (req, res, next) => {
//   if (req.role !== "admin") {
//     return res.status(403).json({ msg: "Access Forbidden" });
//   }
//   next();
// };

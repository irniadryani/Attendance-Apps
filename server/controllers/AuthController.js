const User = require("../models/UserModel");
const Role = require("../models/RolesModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Blacklist = require("../models/BlacklistModel");
const { logMessage } = require("../utils/logger");

const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });

    if (!user) {
      logMessage("warning", "User not found during login attempt", {
        email: req.body.email,
      });
      return res.status(404).json({ msg: "User Not Found" });
    }

    if (!user.status) { // Check if user is inactive
      return res.status(403).json({ msg: "User is inactive" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      logMessage("warning", "Invalid email or password", {
        email: req.body.email,
      });
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const id = user.id;
    const full_name = user.full_name;
    const email = user.email;
    const role = user.role ? user.role.name : "No role assigned";

    const accessToken = jwt.sign(
      { id, full_name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id, full_name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      id,
      full_name,
      email,
      role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logMessage("error", "Error during login attempt", {
      email: req.body.email,
      error: error.message,
    });
    res.status(500).json({ msg: "An error occurred" });
  }
};

const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    // logMessage("warning", "No refresh token provided");
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { id, full_name, email, role } = decoded;

    const accessToken = jwt.sign(
      { id, full_name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    logMessage("error", "Invalid refresh token", { error: error.message });
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: [
        "id",
        "full_name",
        "email",
        "role_id",
        "position",
        "url",
        "photo_profil",
      ],
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });

    if (!user) {
      logMessage("warning", "User not found", { userId: req.user.id });
      return res.status(404).json({ msg: "User Not Found" });
    }

    const id = user.id;
    const full_name = user.full_name;
    const email = user.email;
    const role = user.role ? user.role.name : "No role assigned";
    const position = user.position;
    const url = user.url ? user.url : null;
    const photo_profil = user.photo_profil ? user.photo_profil : null;

    res
      .status(200)
      .json({ id, full_name, email, role, position, photo_profil, url });
  } catch (error) {
    logMessage("error", "Error fetching user profile", {
      userId: req.user.id,
      error: error.message,
    });
    res.status(500).json({ msg: "An error occurred" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      logMessage("warning", "No token provided during logout attempt", {
        userId: req.user.id,
      });
      return res.status(400).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    await Blacklist.create({
      token: token,
      expiry: new Date(decoded.exp * 10000), // JWT exp is in seconds
    });

    res.clearCookie("refreshToken");

    res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    logMessage("error", "Error during logout attempt", {
      userId: req.user.id,
      error: error.message,
    });
    res.status(500).json({ msg: "An error occurred" });
  }
};

module.exports = { login, refresh, me, logout };

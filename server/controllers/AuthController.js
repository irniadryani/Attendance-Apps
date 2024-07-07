const User = require("../models/UserModel");
const Role = require("../models/RolesModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Blacklist = require("../models/BlacklistModel");

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

    if (!user) return res.status(404).json({ msg: "User Not Found" });

    const match = await bcrypt.compare(req.body.password, user.password);

    const id = user.id;
    const full_name = user.full_name;
    const email = user.email;
    const role = user.role ? user.role.name : "No role assigned";

    if (!match)
      return res.status(400).json({ msg: "Invalid email or password" });

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
    console.error(error);
    res.status(500).json({ msg: "An error occurred" });
  }
};

const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ msg: "No token provided" });

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
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "full_name", "email", "role_id"],
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });

    if (!user) return res.status(404).json({ msg: "User Not Found" });

    const id = user.id;
    const full_name = user.full_name;
    const email = user.email;
    const role = user.role ? user.role.name : "No role assigned";

    res.status(200).json({ id, full_name, email, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    await Blacklist.create({
      token: token,
      expiry: new Date(decoded.exp * 1000), // JWT exp is in seconds
    });

    res.clearCookie("refreshToken");

    res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred" });
  }
};

module.exports = { login, refresh, me, logout };

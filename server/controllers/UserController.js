const User = require("../models/UserModel");
const Role = require("../models/RolesModel");
const Setting = require("../models/SettingModel");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const Limit = require("../models/LimitModel");

const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["id", "full_name", "email", "role_id", "photo_profil", "url"],
    });
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: [
        "id",
        "full_name",
        "email",
        "role_id",
        "phone_number",
        "position",
        "photo_profil",
        "url",
      ],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: "User Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

const createUser = async (req, res) => {
  const { full_name, email, password, confPassword, role_name } = req.body;

  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Fetch the role_id based on the role_name
    const role = await Role.findOne({ where: { name: role_name } });
    if (!role) {
      return res.status(400).json({ msg: "Invalid role name" });
    }

    // Fetch default password from settings
    const currentSetting = await Setting.findOne({ where: { id: 1 } });
    const defaultPassword = currentSetting
      ? currentSetting.default_password
      : "defaultpassword";

      console.log("Fetched default password from settings:", defaultPassword);
    
    const isUsingDefaultPassword = !password || password === defaultPassword;
    const hashPassword = await bcrypt.hash(isUsingDefaultPassword ? defaultPassword : password, 10);

    const limit_id = "81eb0cd9-74ec-4b55-bf70-414b2fa591dd"; // Replace with your actual logic

    await User.create({
      full_name,
      email,
      default_password: isUsingDefaultPassword, // Set true if using default password
      password: hashPassword,
      role_id: role.id,
      limit_id: limit_id
    });

    res.status(201).json({ msg: "Register successful" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    const { full_name, email, role_id, phone_number, position, password } =
      req.body;

    let { photo_profil, url } = user; // Existing photo and URL

    if (req.files && req.files.photo_profil) {
      const file = req.files.photo_profil;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Image Type" });
      }

      if (file.size > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5MB" });
      }

      // Check if the participant is using the default profile image
      // const isUsingDefaultImage =
      //   user.url &&
      //   user.url.includes("settings/default-profile-image/") &&
      //   user.photo_profil;

      // if (!isUsingDefaultImage && user.photo_profil) {
      //   const imagePath = path.join(__dirname, "../public/users", user.photo_profil);
      //   if (fs.existsSync(imagePath)) {
      //     fs.unlinkSync(imagePath);
      //   } else {
      //     console.log("Previous image not found:", imagePath);
      //   }
      // }

      const filePath = path.join(__dirname, "../public/users/", fileName);
      await file.mv(filePath);

      photo_profil = fileName; // Update with new file name
      url = `/users/${fileName}`; // Update the URL
    }

    const updateData = {
      full_name,
      email,
      role_id,
      phone_number,
      password,
      position,
      photo_profil,
      url,
    };

    console.log("update data", updateData);

    console.log("user ", User);

    if (password) {
      updateData.password = bcrypt.hashSync(password, 10);
    }

    await User.update(updateData, {
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: "User Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log("User found for deletion:", user);

    if (!user) return res.status(404).json({ msg: "User Not Found" });

    try {
      await User.destroy({
        where: {
          id: user.id,
        },
      });
      console.log("User deleted successfully");
      res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
      console.error("Error in deleting user:", error);
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    console.error("Error in finding user:", error);
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: "User Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

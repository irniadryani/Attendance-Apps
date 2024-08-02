const { Op } = require("sequelize");
const User = require("../models/UserModel");
const Role = require("../models/RolesModel");
const Setting = require("../models/SettingModel");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { logMessage } = require("../utils/logger");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      // paranoid: false,
      attributes: [
        "id",
        "full_name",
        "email",
        "role_id",
        "position",
        "phone_number",
        "photo_profil",
        "url",
        "status",
      ],
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });

    // Format the response to include role_name directly in each user object
    const formattedUsers = users.map((user) => ({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role ? user.role.name : null, // If Role exists, get the name
      position: user.position,
      phone_number: user.phone_number,
      photo_profil: user.photo_profil,
      url: user.url,
      status: user.status,
      deletedAt: user.deleted_at,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    logMessage("error", "Error fetching users", { error: error.message });
    res.status(500).json({ msg: error.message });
  }
};

const filterUsers = async (req, res) => {
  try {
    const { name } = req.query;
    const user = await User.findAll({
      attributes: [
        "id",
        "full_name",
        "email",
        "role_id",
        "photo_profil",
        "url",
      ],
      where: name ? { full_name: { [Op.like]: `%${name}%` } } : {},
    });

    const showUrl = `${user.url}${user.photo_profil}`;

    const response = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id,
      phone_number: user.phone_number,
      position: user.position,
      photo_profil: user.photo_profil,
      url: showUrl,
      status: user.status,
    }


    res.status(200).json(response);
  } catch (error) {
    logMessage("error", "Error filtering users", { error: error.message });
    res.status(500).json({ msg: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: [
        "id",
        "full_name",
        "email",
        "role_id",
        "phone_number",
        "position",
        "photo_profil",
        "url",
        "status",
      ],
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      logMessage("warn", "User not found by ID", { userId: req.params.id });
      return res.status(404).json({ msg: "User Not Found" });
    }

    const showUrl = `${user.url}${user.photo_profil}`;

    const response = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id,
      phone_number: user.phone_number,
      position: user.position,
      photo_profil: user.photo_profil,
      url: showUrl,
      status: user.status,
    }

    res.status(200).json(response);
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      logMessage("warn", "Invalid UUID format for user ID", {
        userId: req.params.id,
        error: error.message,
      });
      res.status(404).json({ msg: "User Not Found" });
    } else {
      logMessage("error", "Error fetching user by ID", {
        userId: req.params.id,
        error: error.message,
      });
      res.status(500).json({ msg: error.message });
    }
  }
};

const createUser = async (req, res) => {
  const { full_name, email, password, confPassword, role_name, status, position } =
    req.body;

  if (password !== confPassword) {
    logMessage("warn", "Password and confirmation password do not match", {
      email,
    });
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logMessage("warn", "Email already exists", { email });
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Fetch the role_id based on the role_name
    const role = await Role.findOne({ where: { name: role_name } });
    if (!role) {
      logMessage("warn", "Invalid role name", { roleName: role_name });
      return res.status(400).json({ msg: "Invalid role name" });
    }

    // Fetch default password from settings
    const currentSetting = await Setting.findOne({ where: { id: 1 } });
    const defaultPassword = currentSetting
      ? currentSetting.default_password
      : "defaultpassword";

    const isUsingDefaultPassword = !password || password === defaultPassword;
    const hashPassword = await bcrypt.hash(
      isUsingDefaultPassword ? defaultPassword : password,
      10
    );

    const limit_id = "81eb0cd9-74ec-4b55-bf70-414b2fa591dd"; // Replace with your actual logic

    let imageFile = req.files ? req.files.image : null;
    let imageUrl;
    let imageFileName;
    let imageExt; // Definisikan variabel imageExt di sini

    if (!imageFile) {
      const dirPath = "./public/defaultImage/";
      const files = fs.readdirSync(dirPath);

      // If there are no files in the directory, set a default file name
      let defaultImageFileName = files[0];

      imageFile = {
        data: fs.readFileSync(`./public/defaultImage/${defaultImageFileName}`),
        name: defaultImageFileName,
        size: fs.statSync(`./public/defaultImage/${defaultImageFileName}`).size,
        md5: null, // Set md5 to null for default image
      };

      console.log("image", imageFile.name);

      imageExt = path.extname(imageFile.name); // Inisialisasi imageExt di sini
      imageFileName = imageFile.name;
      imageUrl = `/defaultImage/`;
    } else {
      imageExt = path.extname(imageFile.name); // Inisialisasi imageExt di sini

      if (![".png", ".jpg", ".jpeg"].includes(imageExt.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Image Type" });
      }

      console.log("image", imageFile);

      if (req.files && imageFile.data) {
        fs.writeFileSync(
          `./public/images/user/`,
          imageFile.data
        );
      }

      imageFileName = imageFile.md5 + imageExt;
      imageUrl = `images/user/`;
    }

    await User.create({
      full_name,
      email,
      default_password: isUsingDefaultPassword, // Set true if using default password
      password: hashPassword,
      role_id: role.id,
      limit_id: limit_id,
      position,
      status: status || true,
      photo_profil: imageFileName,
      url: imageUrl,
    });

    res.status(201).json({ msg: "Register successful" });
  } catch (error) {
    logMessage("error", "Error creating user", { error: error.message });
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
      logMessage("warn", "User not found for update", {
        userId: req.params.id,
      });
      return res.status(404).json({ msg: "User Not Found" });
    }

    const { full_name, email, phone_number, position, password } = req.body;

    let { photo_profil, url } = user; // Existing photo and URL

    if (req.files && req.files.photo_profil) {
      const file = req.files.photo_profil;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        logMessage("warn", "Invalid image type", { fileName });
        return res.status(422).json({ msg: "Invalid Image Type" });
      }

      if (file.size > 5000000) {
        logMessage("warn", "Image size exceeds limit", { fileSize: file.size });
        return res.status(422).json({ msg: "Image must be less than 5MB" });
      }

      const filePath = path.join(
        __dirname,
        "../public/images/users/",
        fileName
      );
      await file.mv(filePath);

      photo_profil = fileName; // Update with new file name
      url = `/images/users/`; // Update the URL
      
    }

    const updateData = {
      full_name,
      email,
      phone_number,
      position,
      photo_profil,
      url: url,
    };

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
      logMessage("warn", "Invalid UUID format for user ID during update", {
        userId: req.params.id,
        error: error.message,
      });
      res.status(404).json({ msg: "User Not Found" });
    } else {
      logMessage("error", "Error updating user", {
        userId: req.params.id,
        error: error.message,
      });
      res.status(500).json({ msg: error.message });
    }
  }
};

const roleUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      logMessage("warn", "User not found for role update", {
        userId: req.params.id,
      });
      return res.status(404).json({ msg: "User not found" });
    }

    const { role_name } = req.body;

    if (!role_name) {
      logMessage("warn", "Role name is required", { userId: req.params.id });
      return res.status(400).json({ msg: "Role name is required" });
    }

    // Find the role by role_name
    const role = await Role.findOne({
      where: {
        name: role_name,
      },
    });

    if (!role) {
      logMessage("warn", "Role not found", { roleName: role_name });
      return res.status(404).json({ msg: "Role not found" });
    }

    await user.update({
      role_id: role.id,
    });

    res.status(200).json({ msg: "Role updated successfully" });
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      logMessage("warn", "Invalid UUID format for user ID during role update", {
        userId: req.params.id,
        error: error.message,
      });
      res.status(404).json({ msg: "User not found" });
    } else {
      logMessage("error", "Error updating user role", {
        userId: req.params.id,
        error: error.message,
      });
      res.status(500).json({ msg: error.message });
    }
  }
};

const changePassword = async (req, res) => {
  const id = req.params.id;
  const { currentPassword, newPassword, confPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      logMessage("warn", "User not found for password change", { userId: id });
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if newPassword and confPassword match
    if (newPassword !== confPassword) {
      logMessage(
        "warn",
        "New password and confirmation password do not match",
        { userId: id }
      );
      return res
        .status(400)
        .json({ msg: "New password and confirmation password do not match" });
    }

    // Check password length
    if (newPassword.length < 8 || newPassword.length > 16) {
      logMessage("warn", "Password length requirement not met", {
        userId: id,
        passwordLength: newPassword.length,
      });
      return res
        .status(400)
        .json({ msg: "Password length must be between 8 and 16 characters" });
    }

    // Verify currentPassword
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      logMessage("warn", "Current password is incorrect", { userId: id });
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash newPassword
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user password in the database
    await User.update({ password: hashedNewPassword }, { where: { id } });

    return res.status(200).json({ msg: "Password changed successfully" });
  } catch (error) {
    logMessage("error", "Error changing password", { error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const changeStatus = async (req, res) => {
  try {
    // Temukan peserta berdasarkan ID
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      logMessage("warning", "User not found for update", { id: req.params.id });
      return res.status(404).json({ msg: "User Not Found" });
    }

    const { status } = req.body;

    const [updated] = await User.update(
      {
        status: status,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    if (updated === 0) {
      logMessage("warning", "User status update failed", { id: req.params.id });
      return res
        .status(400)
        .json({ msg: "Update failed or no changes were made" });
    }

    return res.status(200).json({
      success: true,
      message: "User status changed",
    });
  } catch (error) {
    console.error("Error changing User status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      logMessage("warn", "User not found for deletion", {
        userId: req.params.id,
      });
      return res.status(404).json({ msg: "User Not Found" });
    }

    try {
      // Perform a soft delete by setting the deleted_at field
      await User.update(
        { deleted_at: new Date() }, // Set the deleted_at timestamp
        { where: { id: user.id } }
      );

      res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
      logMessage("error", "Error in soft deleting user", {
        userId: user.id,
        error: error.message,
      });
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    logMessage("error", "Error in finding user for deletion", {
      error: error.message,
    });
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
  filterUsers,
  roleUser,
  changePassword,
  changeStatus,
};

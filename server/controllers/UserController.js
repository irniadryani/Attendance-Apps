const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["id", "full_name", "email", "role_id"],
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
      attributes: ["id", "full_name", "email", "role_id"],
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
  const { full_name, email, password, confPassword, role_id } = req.body;

  if (password === "" || password === null) {
    return res.status(400).json({ msg: "Password tidak boleh kosong" });
  }

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password Tidak Cocok" });

  const hashPassword = await bcrypt.hashSync(password, 10);

  try {
    await User.create({
      full_name: full_name,
      email: email,
      password: hashPassword,
      role_id: role_id,
      
    });
    res.status(201).json({ msg: "Register Berhasi" });
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

    if (!user) return res.status(404).json({ msg: "User Not Found" });

    const {
      full_name,
      email,
      role_id,
      phone_number,
      position,
      photo_profil,
      password,
    } = req.body;

    try {
      await User.update(
        {
          full_name: full_name,
          email: email,
          role_id: role_id,
          phone_number: phone_number,
          position: position,
          photo_profil: photo_profil,
          password: password,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.status(200).json({ msg: "User Updated" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
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

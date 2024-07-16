const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { Op } = require("sequelize");
const Setting = require("../models/SettingModel");

const defaultPassword = async (req, res) => {
  try {
    const { default_password } = req.body;

    if (default_password.length < 8 || default_password.length > 16) {
      return res.status(422).json({
        msg: "Password length must be between 8 and 16 characters",
      });
    }

    // Check if there is already a default password setting
    let currentSetting = await Setting.findOne({ where: { id: 1 } });

    if (currentSetting) {
      // If exists, update the default password
      await currentSetting.update({ default_password });
    } else {
      // If not, create a new setting
      currentSetting = await Setting.create({
        default_password,
      });
    }

    return res.status(201).json({
      msg: "Default Password Set Successfully",
      data: {
        defaultPassword: default_password,
      },
    });
  } catch (error) {
    console.error("Error setting default password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { defaultPassword };

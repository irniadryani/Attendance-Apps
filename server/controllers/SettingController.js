const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { Op } = require("sequelize");
const Setting = require("../models/SettingModel");

const getUserContent = async (req, res) => {
  try {
    const response = await Setting.findAll({
      attributes: [
        "default_photo_profile",
        "default_password",
        "latitude",
        "longitude",
        "limit_leaves",
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

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

const limitLeaves = async (req, res) => {
  try {
    const { limit_leaves } = req.body;

    // Check if there is already a default password setting
    let currentSetting = await Setting.findOne({ where: { id: 1 } });

    if (currentSetting) {
      // If exists, update the default password
      await currentSetting.update({ limit_leaves });
    } else {
      // If not, create a new setting
      currentSetting = await Setting.create({
        limit_leaves,
      });
    }

    return res.status(201).json({
      msg: "Default Limit Leaves Set Successfully",
      data: {
        limit_leaves: limit_leaves,
      },
    });
  } catch (error) {
    console.error("Error setting default password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const latitude = async (req, res) => {
  try {
    const { latitude } = req.body;

    // Check if there is already a default password setting
    let currentSetting = await Setting.findOne({ where: { id: 1 } });

    if (currentSetting) {
      // If exists, update the default password
      await currentSetting.update({ latitude });
    } else {
      // If not, create a new setting
      currentSetting = await Setting.create({
        latitude,
      });
    }

    return res.status(201).json({
      msg: "Default Latitude Set Successfully",
      data: {
        latitude: latitude,
      },
    });
  } catch (error) {
    console.error("Error setting latitude:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const longitude = async (req, res) => {
  try {
    const { longitude } = req.body;

    // Check if there is already a default password setting
    let currentSetting = await Setting.findOne({ where: { id: 1 } });

    if (currentSetting) {
      // If exists, update the default password
      await currentSetting.update({ longitude });
    } else {
      // If not, create a new setting
      currentSetting = await Setting.create({
        longitude,
      });
    }

    return res.status(201).json({
      msg: "Default longitude Set Successfully",
      data: {
        longitude: longitude,
      },
    });
  } catch (error) {
    console.error("Error setting longitude:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getUserContent, defaultPassword, limitLeaves, latitude, longitude };

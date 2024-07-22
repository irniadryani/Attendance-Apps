const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { Op } = require("sequelize");
const Setting = require("../models/SettingModel");
const { logMessage } = require('../utils/logger');

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
    logMessage('info', 'Retrieved user content settings successfully', { response });
    res.status(200).json(response);
  } catch (error) {
    logMessage('error', 'Failed to retrieve user content settings', { error });
    res.status(500).json({ msg: error.message });
  }
};

const defaultPassword = async (req, res) => {
  try {
    const { default_password } = req.body;

    if (default_password.length < 8 || default_password.length > 16) {
      logMessage('warn', 'Password length validation failed', { default_password });
      return res.status(422).json({
        msg: "Password length must be between 8 and 16 characters",
      });
    }

    let currentSetting = await Setting.findOne({ where: { id: 1 } });

    if (currentSetting) {
      await currentSetting.update({ default_password });
      logMessage('info', 'Updated default password', { default_password });
    } else {
      currentSetting = await Setting.create({ default_password });
      logMessage('info', 'Created new default password setting', { default_password });
    }

    return res.status(201).json({
      msg: "Default Password Set Successfully",
      data: { defaultPassword: default_password },
    });
  } catch (error) {
    logMessage('error', 'Error setting default password', { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const limitLeaves = async (req, res) => {
  try {
    const { limit_leaves } = req.body;

    let currentSetting = await Setting.findOne({ where: { id: 1 } });

    if (currentSetting) {
      await currentSetting.update({ limit_leaves });
      logMessage('info', 'Updated limit leaves', { limit_leaves });
    } else {
      currentSetting = await Setting.create({ limit_leaves });
      logMessage('info', 'Created new limit leaves setting', { limit_leaves });
    }

    return res.status(201).json({
      msg: "Default Limit Leaves Set Successfully",
      data: { limit_leaves },
    });
  } catch (error) {
    logMessage('error', 'Error setting limit leaves', { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const latitude = async (req, res) => {
  try {
    const { latitude } = req.body;

    let currentSetting = await Setting.findOne({ where: { id: 1 } });

    if (currentSetting) {
      await currentSetting.update({ latitude });
      logMessage('info', 'Updated latitude', { latitude });
    } else {
      currentSetting = await Setting.create({ latitude });
      logMessage('info', 'Created new latitude setting', { latitude });
    }

    return res.status(201).json({
      msg: "Default Latitude Set Successfully",
      data: { latitude },
    });
  } catch (error) {
    logMessage('error', 'Error setting latitude', { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const longitude = async (req, res) => {
  try {
    const { longitude } = req.body;

    let currentSetting = await Setting.findOne({ where: { id: 1 } });

    if (currentSetting) {
      await currentSetting.update({ longitude });
      logMessage('info', 'Updated longitude', { longitude });
    } else {
      currentSetting = await Setting.create({ longitude });
      logMessage('info', 'Created new longitude setting', { longitude });
    }

    return res.status(201).json({
      msg: "Default longitude Set Successfully",
      data: { longitude },
    });
  } catch (error) {
    logMessage('error', 'Error setting longitude', { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getUserContent, defaultPassword, limitLeaves, latitude, longitude };

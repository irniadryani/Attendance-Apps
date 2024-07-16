const express = require("express");
const router = require("express").Router();
const settingController = require('../controllers/SettingController');
const { verifyToken } = require("../middleware/AuthUser");

router.post('/default-password', verifyToken, settingController.defaultPassword);

module.exports = router;
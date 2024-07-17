const express = require("express");
const router = require("express").Router();
const settingController = require('../controllers/SettingController');
const { verifyToken } = require("../middleware/AuthUser");

router.get('/userContent', verifyToken, settingController.getUserContent);
router.post('/default-password', verifyToken, settingController.defaultPassword);
router.post('/limit-leaves', verifyToken, settingController.limitLeaves);
router.post('/latitude', verifyToken, settingController.latitude);
router.post('/longtitude', verifyToken, settingController.longitude);


module.exports = router;
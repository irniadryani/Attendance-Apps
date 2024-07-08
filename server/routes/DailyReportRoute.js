const express = require("express");
const router = require("express").Router();
const dailyReportController = require('../controllers/DailyReportController');
const { verifyToken } = require("../middleware/AuthUser");


router.get('/daily-reports', verifyToken, dailyReportController.getDailyReport);
router.get('/daily-reports/:id', verifyToken, dailyReportController.getDailyReportById);
router.post('/daily-reports', verifyToken, dailyReportController.createDailyReport);

module.exports = router;
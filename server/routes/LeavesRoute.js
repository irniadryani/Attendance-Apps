const express = require("express");
const router = require("express").Router();
const leavesController = require('../controllers/LeavesController');
const { verifyToken } = require("../middleware/AuthUser");


// router.get('/daily-reports', verifyToken, dailyReportController.getDailyReport);
// router.get('/daily-reports/:id', verifyToken, dailyReportController.getDailyReportById);
router.post('/leaves', verifyToken, leavesController.createLeaves);

module.exports = router;
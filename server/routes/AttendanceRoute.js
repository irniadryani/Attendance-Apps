const express = require("express");
const router = require("express").Router();
const attendanceController = require("../controllers/AttendanceController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser");

router.post("/check-in", verifyToken, attendanceController.checkin);
router.get(
  "/check-today-attendance",
  verifyToken,
  attendanceController.checkTodayAttendance
);

module.exports = router;

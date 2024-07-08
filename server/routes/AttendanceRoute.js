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
router.post("/check-out", verifyToken, attendanceController.checkout);
router.get("/attendances/:id", verifyToken, attendanceController.getAttendanceById);
router.get("/attendances", verifyToken, attendanceController.getAllAttendances);


module.exports = router;

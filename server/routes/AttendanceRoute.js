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
router.post("/check-in-wfh", verifyToken, attendanceController.checkinWfh);
router.post("/check-out-wfh", verifyToken, attendanceController.checkoutWfh);
router.get("/attendances/:id", verifyToken, attendanceController.getAttendanceById);
router.get("/single-attendances/:id", verifyToken, attendanceController.getAllAttendanceById);
router.get("/attendances-monthly", verifyToken, attendanceController.getAllAttendancesMonthly);
router.get("/attendances", verifyToken, attendanceController.getAllAttendancesYearly);
// router.get("/recap-attendances", verifyToken, attendanceController.getAllAttendances);
router.get("/recap-attendances", verifyToken, attendanceController.recapAttendances);


module.exports = router;

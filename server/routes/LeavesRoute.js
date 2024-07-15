const express = require("express");
const router = require("express").Router();
const leavesController = require('../controllers/LeavesController');
const { verifyToken } = require("../middleware/AuthUser");


router.get('/leaves', verifyToken, leavesController.getAllLeaves);
router.get('/leaves/:id', verifyToken, leavesController.getLeavesById);
router.post('/leaves', verifyToken, leavesController.createLeaves);
router.put('/leaves/:id', verifyToken, leavesController.updateLeaves);

module.exports = router;
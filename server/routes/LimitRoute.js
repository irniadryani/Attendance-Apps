const express = require("express");
const router = require("express").Router();
const limitController = require('../controllers/LimitController');
const { verifyToken } = require("../middleware/AuthUser");

router.post('/update-limit-leaves', verifyToken, limitController.limitLeaves);

module.exports = router;
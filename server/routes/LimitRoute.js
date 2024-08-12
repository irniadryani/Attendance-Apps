const express = require("express");
const router = require("express").Router();
const limitController = require('../controllers/LimitController');
const { verifyToken } = require("../middleware/AuthUser");

router.get('/get-limit-leaves', verifyToken, limitController.getLimitLeaves);

module.exports = router;
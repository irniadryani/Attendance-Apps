const express = require("express");
const router = require("express").Router();
const authController = require("../controllers/AuthController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser");

router.get("/me", verifyToken, authController.me);

router.post("/login", authController.login);

router.post("/logout", verifyToken, authController.logout);

router.post("/refresh", authController.refresh);

module.exports = router;

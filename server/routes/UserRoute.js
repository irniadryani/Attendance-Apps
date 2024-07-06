const express = require("express");
const router = require("express").Router();
const userController = require("../controllers/UserController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser");

// Rute untuk mendapatkan pengguna
router.get("/users", verifyToken, userController.getUsers);

router.get("/users/:id", verifyToken, userController.getUserById);

router.post("/users",verifyToken, userController.createUser);

router.patch("/users/:id",verifyToken, userController.updateUser);

router.delete("/users/:id", verifyToken,userController.deleteUser);

module.exports = router;

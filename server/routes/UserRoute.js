const express = require("express");
const router = require("express").Router();
const userController = require("../controllers/UserController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser");

// Rute untuk mendapatkan pengguna
router.get("/users", verifyToken, userController.getUsers);

router.get("/user/:id", verifyToken, userController.getUserById);

router.post("/users",verifyToken, userController.createUser);

router.put("/user/:id",verifyToken, userController.updateUser);

router.delete("/user/:id", verifyToken,userController.deleteUser);

router.get("/users/filter", verifyToken, userController.filterUsers);

router.put("/user/update-role/:id",verifyToken, userController.roleUser);

router.put("/user/update-status/:id",verifyToken, userController.updateUserStatus);

router.put("/user/change-password/:id",verifyToken, userController.changePassword);

module.exports = router;

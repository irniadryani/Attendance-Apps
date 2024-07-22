const express = require("express");
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../middleware/AuthUser");
const permissionController = require("../controllers/PermissionController");

const router = express.Router();

router.get('/permissions', verifyToken, permissionController.getPermission);
router.get('/permission/:id', verifyToken, permissionController.getPermissionById);
router.post('/permission', verifyToken, permissionController.createPermission);
router.put('/permission/:id', verifyToken, permissionController.updatePermission);

module.exports = router;

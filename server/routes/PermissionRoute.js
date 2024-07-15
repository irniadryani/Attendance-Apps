const express = require("express");
const router = require("express").Router();
const permissionController = require('../controllers/PermissionController');
const { verifyToken } = require("../middleware/AuthUser");


router.get('/permissions', verifyToken, permissionController.getPermission);

router.get('/permission/:id', verifyToken, permissionController.getPermissionById);

router.post('/permission', verifyToken, permissionController.createPermission);

router.put('/permission/:id', verifyToken, permissionController.updatePermission);


module.exports = router;
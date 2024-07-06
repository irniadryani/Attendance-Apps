const express = require("express");
const router = require("express").Router();
const permissionController = require('../controllers/PermissionController');

// Rute untuk mendapatkan pengguna
router.get('/permissions', permissionController.getPermission);

router.get('/permission/:id', permissionController.getPermissionById);

router.post('/permission', permissionController.createPermission);

router.patch('/permission/:id', permissionController.updatePermission);

router.delete('/permission:id', permissionController.deletePermission);


module.exports = router;
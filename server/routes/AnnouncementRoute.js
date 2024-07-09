const express = require("express");
const router = require("express").Router();
const announcementController = require('../controllers/AnnouncementController');
const { verifyToken } = require("../middleware/AuthUser");

router.get('/announcements', verifyToken, announcementController.getAllAnnouncement);
router.post('/announcement', verifyToken, announcementController.createAnnouncement);
router.put('/announcement/:id', verifyToken, announcementController.updateAnnouncement);
router.delete("/announcement/:id", verifyToken,announcementController.deleteAnnouncement);

module.exports = router;
const express = require("express");
const router = express.Router();
const Announcement = require("../models/AnnouncementModel");
const { check } = require("express-validator");
const unirest = require("unirest");
const { Op } = require("sequelize");

const createAnnouncement = async (req, res) => {
  const { message } = req.body;
  const { id: admin_id } = req.user;

  try {
    // Create the announcement record
    const newAnnouncement = await Announcement.create({
      admin_id: admin_id,
      message: message,
    });

    // Return a success message with the created announcement record
    res.status(201).json({
      msg: "Announcement successfully created",
      announcement: newAnnouncement,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating announcement:", error);
    res
      .status(400)
      .json({ msg: "Failed to create announcement", error: error.message });
  }
};

const getAllAnnouncement = async (req, res) => {
  try {
    const response = await Announcement.findAll({
      attributes: ["id", "admin_id", "message"],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAnnouncementById = async (req, res) => {
  try {
    const response = await Announcement.findAll({
      attributes: ["id", "admin_id", "message"],
      where: {
        id: req.params.id,
      },
    });

    if (response.length === 0) {
      return res.status(404).json({ msg: "Announcement Not Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: "Announcement Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({
      where: {
        id: req.params.id,
      },
    });

    console.log(req.params.id);

    if (!announcement)
      return res.status(404).json({ msg: "Announcement Not Found" });

    const { message } = req.body;

    console.log(message);

    try {
      await Announcement.update(
        {
          message: message,
        },
        {
          where: {
            id: announcement.id,
          },
        }
      );
      res.status(200).json({ msg: "Announcement Updated" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: " Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log("Announcement found for deletion:", announcement);

    if (!announcement)
      return res.status(404).json({ msg: "Announcement Not Found" });

    try {
      await Announcement.destroy({
        where: {
          id: announcement.id,
        },
      });
      console.log("Announcement deleted successfully");
      res.status(200).json({ msg: "Announcement Deleted" });
    } catch (error) {
      console.error("Error in deleting announcement:", error);
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    console.error("Error in finding announcement:", error);
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: "Announcement Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};

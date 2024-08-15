const express = require("express");
const router = express.Router();
const Announcement = require("../models/AnnouncementModel");
const { check } = require("express-validator");
const unirest = require("unirest");
const { Op } = require("sequelize");
const { logMessage } = require("../utils/logger");

const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

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
    // Log the error
    logMessage("error", "Failed to create announcement", {
      error: error.message,
    });
    res
      .status(400)
      .json({ msg: "Failed to create announcement", error: error.message });
  }
};

const getAllAnnouncement = async (req, res) => {
  try {
    const response = await Announcement.findAll({
      attributes: ["id", "admin_id", "message", "created_at"],
      order: [["created_at", "DESC"]],
    });

    const formattedResponse = response.map((announcement) => ({
      id: announcement.id,
      admin_id: announcement.admin_id,
      user_name: announcement?.user?.full_name,
      message: announcement?.message,
      date: formatDate(announcement.created_at),
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    // Log the error
    logMessage("error", "Failed to retrieve announcements", {
      error: error.message,
    });
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
      order: [["created_at", "DESC"]],
    });

    if (response.length === 0) {
      logMessage("warning", "Announcement not found", { id: req.params.id });
      return res.status(404).json({ msg: "Announcement Not Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      logMessage("warning", "Invalid UUID syntax", {
        id: req.params.id,
        error: error.message,
      });
      res.status(404).json({ msg: "Announcement Not Found" });
    } else {
      logMessage("error", "Failed to retrieve announcement by ID", {
        id: req.params.id,
        error: error.message,
      });
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

    if (!announcement) {
      logMessage("warning", "Announcement not found for update", {
        id: req.params.id,
      });
      return res.status(404).json({ msg: "Announcement Not Found" });
    }

    const { message } = req.body;

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
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      logMessage("warning", "Invalid UUID syntax for update", {
        id: req.params.id,
        error: error.message,
      });
      res.status(404).json({ msg: "Announcement Not Found" });
    } else {
      logMessage("error", "Failed to update announcement", {
        id: req.params.id,
        error: error.message,
      });
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

    if (!announcement) {
      logMessage("warning", "Announcement not found for deletion", {
        id: req.params.id,
      });
      return res.status(404).json({ msg: "Announcement Not Found" });
    }

    await Announcement.destroy({
      where: {
        id: announcement.id,
      },
    });

    res.status(200).json({ msg: "Announcement Deleted" });
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      logMessage("warning", "Invalid UUID syntax for deletion", {
        id: req.params.id,
        error: error.message,
      });
      res.status(404).json({ msg: "Announcement Not Found" });
    } else {
      logMessage("error", "Failed to delete announcement", {
        id: req.params.id,
        error: error.message,
      });
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

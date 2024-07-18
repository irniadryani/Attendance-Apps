const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const DailyReport = require("../models/DailyReportModel");
const User = require("../models/UserModel");

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};


const getDailyReport = async (req, res) => {
  try {
    const response = await DailyReport.findAll({
      attributes: ['id', 'report_date', 'report_message', "user_id"],
      include: [{
        model: User,
        attributes: ['full_name', 'position'], // Include user attributes
      }],
    });

    const formattedResponse = response.map((report) => ({
      id: report.id,
      user_id: report.user_id,
      report_date: formatDate(report.report_date),
      report_message: report.report_message,
      user_name: report.user.full_name, // Access full_name from associated Users model
      user_position: report.user.position, // Access position from associated Users model
    }));

    console.log(formattedResponse);
    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createDailyReport = async (req, res) => {
  const { report_date, report_message } = req.body;
  const { id: user_id } = req.user;

  try {
    // Create the permission record
    const newDailyReport = await DailyReport.create({
      user_id: user_id,
      report_date: report_date,
      report_message: report_message,
    });

    // Format dates in the newly created permission
    const formattedPermission = {
      ...newDailyReport.toJSON(),
      report_date: formatDate(newDailyReport.report_date),
    };

    // Return a success message with the created permission record
    res.status(201).json({
      msg: "Permission successfully created",
      permission: formattedPermission,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating daily report:", error);
    res
      .status(400)
      .json({ msg: "Failed to create daily report", error: error.message });
  }
};

const getDailyReportById = async (req, res) => {
  try {
    const response = await DailyReport.findAll({
      attributes: ["id", "report_date", "report_message"],
      where: {
        user_id: req.params.id,
      },
    });

    if (response.length === 0) {
      return res.status(404).json({ msg: "Daily Report Not Found" });
    }

    const formattedResponse = response.map((report) => ({
      ...report.toJSON(),
      report_date: formatDate(report.report_date),
    }));
    console.log(formattedResponse);
    res.status(200).json(formattedResponse);
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: "User Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = {
  getDailyReport,
  createDailyReport,
  getDailyReportById,
};

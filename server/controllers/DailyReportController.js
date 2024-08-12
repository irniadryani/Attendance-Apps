const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const DailyReport = require("../models/DailyReportModel");
const User = require("../models/UserModel");
const { logMessage } = require("../utils/logger");

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
      attributes: ["id", "report_date", "report_message", "user_id"],
      include: [
        {
          model: User,
          attributes: ["full_name", "position"], // Include user attributes
        },
      ],
    });

    const formattedResponse = response.map((report) => ({
      id: report.id,
      user_id: report.user_id,
      report_date: formatDate(report.report_date),
      report_message: report.report_message,
      user_name: report.user.full_name, // Access full_name from associated Users model
      user_position: report.user.position, // Access position from associated Users model
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    logMessage("error", "Error fetching daily reports", {
      error: error.message,
    });
    res.status(500).json({ msg: error.message });
  }
};

const createDailyReport = async (req, res) => {
  const { report_date, report_message } = req.body;
  const { id: user_id } = req.user;

  try {
    // Check if a daily report already exists for the current day
    const existingReport = await DailyReport.findOne({
      where: {
        user_id: user_id,
        report_date: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)), // Start of the day
          [Op.lt]: new Date(new Date().setHours(24, 0, 0, 0)), // End of the day
        },
      },
    });

    if (existingReport) {
      return res
        .status(400)
        .json({ msg: "Daily report for today already exists" });
    }

    // Create new daily report
    const newDailyReport = await DailyReport.create({
      user_id: user_id,
      report_date: report_date,
      report_message: report_message,
    });

    const formattedPermission = {
      ...newDailyReport.toJSON(),
      report_date: formatDate(newDailyReport.report_date),
    };

    res.status(201).json({
      msg: "Daily report successfully created",
      report: formattedPermission,
    });
  } catch (error) {
    logMessage("error", "Error creating daily report", {
      error: error.message,
    });
    res
      .status(400)
      .json({ msg: "Failed to create daily report", error: error.message });
  }
};

// const createDailyReport = async (req, res) => {
//   const { report_date, report_message } = req.body;
//   const { id: user_id } = req.user;

//   try {
//     const newDailyReport = await DailyReport.create({
//       user_id: user_id,
//       report_date: report_date,
//       report_message: report_message,
//     });

//     const formattedPermission = {
//       ...newDailyReport.toJSON(),
//       report_date: formatDate(newDailyReport.report_date),
//     };

//     res.status(201).json({
//       msg: "Daily report successfully created",
//       report: formattedPermission,
//     });
//   } catch (error) {
//     logMessage("error", "Error creating daily report", {
//       error: error.message,
//     });
//     res
//       .status(400)
//       .json({ msg: "Failed to create daily report", error: error.message });
//   }
// };

const getDailyReportById = async (req, res) => {
  try {
    const currentDate = new Date();

    // Get the first and last date of the current month
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const response = await DailyReport.findAll({
      attributes: ["id", "report_date", "report_message"],
      where: {
        user_id: req.params.id,
        created_at: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    if (response.length === 0) {
      logMessage("warning", "Daily report not found", {
        user_id: req.params.id,
      });
      return res.status(404).json({ msg: "Daily Report Not Found" });
    }

    const formattedResponse = response.map((report) => ({
      ...report.toJSON(),
      report_date: formatDate(report.report_date),
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    logMessage("error", "Error fetching daily report by user ID", {
      user_id: req.params.id,
      error: error.message,
    });

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

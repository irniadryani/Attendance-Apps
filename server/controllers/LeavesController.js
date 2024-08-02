const express = require("express");
const router = express.Router();
const Leaves = require("../models/LeavesModel");
const Limit = require("../models/LimitModel");
const Setting = require("../models/SettingModel");
const User = require("../models/UserModel");
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

const createLeaves = async (req, res) => {
  const { start_date, end_date, status, notes } = req.body;
  const { id: user_id } = req.user;

  try {
    const user = await User.findOne({
      where: { id: user_id },
      include: [{ model: Limit }],
    });

    if (!user) {
      logMessage("warning", "User not found", { user_id });
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.limit) {
      logMessage("warning", "Leave limit not defined for user", { user_id });
      return res.status(400).json({ msg: "Leave limit not defined for user" });
    }

    const userLeavesCount = await Leaves.count({
      where: {
        user_id,
        limit_id: user.limit.id,
      },
    });

    if (userLeavesCount >= user.limit.maximum) {
      logMessage("warning", "Leave limit reached", {
        user_id,
        limit_id: user.limit.id,
      });
      return res.status(400).json({ msg: "Leave limit reached" });
    }

    const newLeaves = await Leaves.create({
      user_id: user_id,
      limit_id: user.limit.id,
      start_date: new Date(start_date), // Ensure start_date is a Date object
      end_date: new Date(end_date), // Ensure end_date is a Date object
      notes: notes,
      status: status || "Submitted",
    });

    const formattedLeaves = {
      ...newLeaves.toJSON(),
      start_date: newLeaves.start_date.toISOString().split("T")[0],
      end_date: newLeaves.end_date.toISOString().split("T")[0],
    };

    res.status(201).json({
      msg: "Leave successfully created",
      leaves: formattedLeaves,
    });
  } catch (error) {
    logMessage("error", "Error creating leave", { error: error.message });
    res
      .status(400)
      .json({ msg: "Failed to create leave", error: error.message });
  }
};


const getAllLeaves = async (req, res) => {
  try {
    const response = await Leaves.findAll({
      attributes: [
        "id",
        "user_id",
        "start_date",
        "end_date",
        "status",
        "notes",
      ],
      include: [
        {
          model: User,
          attributes: ["full_name", "position"], // Include user attributes
        },
      ],
    });

    const formattedResponse = response.map((leaves) => ({
      id: leaves.id,
      user_id: leaves.user_id,
      user_name: leaves.user.full_name,
      start_date: formatDate(leaves.start_date),
      end_date: formatDate(leaves.end_date),
      notes: leaves.notes,
      status: leaves.status,
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    logMessage("error", "Error fetching leaves", { error: error.message });
    res.status(500).json({ msg: error.message });
  }
};

const getLeavesById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      include: [{ model: Limit }],
    });

    if (!user) {
      logMessage("warning", "User not found", { user_id: req.params.id });
      return res.status(404).json({ msg: "User not found" });
    }

    const leaves = await Leaves.findAll({
      attributes: ["id", "start_date", "end_date", "status", "notes"],
      where: {
        user_id: req.params.id,
      },
    });

    const approvedLeaves = leaves.filter(
      (leave) => leave.status === "Approved"
    );
    const totalLeavesTaken = approvedLeaves.length;
    const remainingLeaves = user.limit.maximum - totalLeavesTaken;
    const maximumLeaves = user.limit.maximum;

    const formattedResponse = leaves.map((leave) => ({
      ...leave.toJSON(),
      start_date: formatDate(leave.start_date),
      end_date: formatDate(leave.end_date),
    }));

    res.status(200).json({
      leaves: formattedResponse,
      totalLeavesTaken,
      remainingLeaves,
      maximumLeaves,
    });
  } catch (error) {
    logMessage("error", "Error fetching leaves by user ID", {
      user_id: req.params.id,
      error: error.message,
    });

    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: "Leaves Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

const updateLeaves = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const leave = await Leaves.findByPk(id);

    if (!leave) {
      logMessage("warning", "Leave not found", { leave_id: id });
      return res.status(404).json({ msg: "Leave not found" });
    }

    leave.status = status;
    await leave.save();

    const formattedLeave = {
      ...leave.toJSON(),
      start_date: formatDate(leave.start_date),
      end_date: formatDate(leave.end_date),
    };

    res.status(200).json({
      msg: "Leave status updated successfully",
      leave: formattedLeave,
    });
  } catch (error) {
    logMessage("error", "Error updating leave status", {
      leave_id: id,
      error: error.message,
    });
    res
      .status(400)
      .json({ msg: "Failed to update leave status", error: error.message });
  }
};

module.exports = {
  createLeaves,
  getAllLeaves,
  getLeavesById,
  updateLeaves,
};

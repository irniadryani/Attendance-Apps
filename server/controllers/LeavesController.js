const express = require("express");
const router = express.Router();
const Leaves = require("../models/LeavesModel");
const Limit = require("../models/LimitModel");
const Setting = require("../models/SettingModel");
const User = require("../models/UserModel");
const { Op } = require("sequelize");

const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const createLeaves = async (req, res) => {
  const { start_date, end_date, status, notes } = req.body;
  const { id: user_id } = req.user;

  try {
    // Find user with associated limit
    const user = await User.findOne({
      where: { id: user_id },
      include: [{ model: Limit }],
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if user has a limit defined
    if (!user.limit) {
      return res.status(400).json({ msg: "Leave limit not defined for user" });
    }

    // Check current leaves count for this user's limit_id
    const userLeavesCount = await Leaves.count({
      where: {
        user_id,
        limit_id: user.limit.id, // Ensure we count leaves only for this user's limit
      },
    });

    // Check if user has reached leave limit
    if (userLeavesCount >= user.limit.maximum) {
      return res.status(400).json({ msg: "Leave limit reached" });
    }

    // Create new leave entry
    const newLeaves = await Leaves.create({
      user_id: user_id,
      limit_id: user.limit.id, // Ensure limit_id is properly passed
      start_date: start_date,
      end_date: end_date,
      notes: notes,
      status: status || "Submitted",
    });

    // Format dates for response
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
    console.error("Error creating leave:", error);
    res.status(400).json({ msg: "Failed to create leave", error: error.message });
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
      include: [{
        model: User,
        attributes: ['full_name', 'position'], // Include user attributes
      }],
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

    console.log(formattedResponse);
    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getLeavesById = async (req, res) => {
  try {
    // Fetch the user along with their leave limit
    const user = await User.findOne({
      where: { id: req.params.id },
      include: [{ model: Limit }],
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Fetch the user's leaves
    const leaves = await Leaves.findAll({
      attributes: ["id", "start_date", "end_date", "status", "notes"],
      where: {
        user_id: req.params.id,
      },
    });

    if (leaves.length === 0) {
      return res.status(404).json({ msg: "No leaves found for this user" });
    }

    // Calculate the total leaves taken with status 'Approved'
    const approvedLeaves = leaves.filter(leave => leave.status === "Approved");
    const totalLeavesTaken = approvedLeaves.length;
    const remainingLeaves = user.limit.maximum - totalLeavesTaken;
    const maximumLeaves = user.limit.maximum;

    // Format dates in response
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
    if (error.message === `invalid input syntax for type uuid: \"${req.params.id}\"`) {
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
    // Find the leave entry by ID
    const leave = await Leaves.findByPk(id);

    if (!leave) {
      return res.status(404).json({ msg: "Leave not found" });
    }

    // Update the status
    leave.status = status;
    await leave.save();

    // Format dates for response
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
    console.error("Error updating leave status:", error);
    res.status(400).json({ msg: "Failed to update leave status", error: error.message });
  }
};

module.exports = {
  createLeaves, getAllLeaves, getLeavesById, updateLeaves
};

const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { Op } = require("sequelize");
const permissionModel = require("../models/PermissionModel");
const User = require("../models/UserModel");

// Define the formatDate function
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const getPermission = async (req, res) => {
  try {
    const response = await permissionModel.findAll({
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
        attributes: ['full_name'], // Include user attributes
      }],
    });

    const formattedResponse = response.map((permission) => ({
      id: permission.id,
      user_id: permission.user_id,
      user_name: permission.user.full_name,
      start_date: formatDate(permission.start_date),
      end_date: formatDate(permission.end_date),
      notes: permission.notes,
      status: permission.status,
    }));

    console.log(formattedResponse);
    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getPermissionById = async (req, res) => {
  try {
    const response = await permissionModel.findAll({
      attributes: ["id", "start_date", "end_date", "status", "notes"],
      where: {
        user_id: req.params.id,
      },
    });

    if (response.length === 0) {
      return res.status(404).json({ msg: "Permissions Not Found" });
    }

    // Format dates in response
    const formattedResponse = response.map((perm) => ({
      ...perm.toJSON(),
      start_date: formatDate(perm.start_date),
      end_date: formatDate(perm.end_date),
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: "Permissions Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

const createPermission = async (req, res) => {
  const { start_date, end_date, status, notes } = req.body;
  const { id: user_id } = req.user;

  try {
    // Create the permission record
    const newPermission = await permissionModel.create({
      user_id: user_id,
      start_date: start_date,
      end_date: end_date,
      notes: notes,
      status: status || "Submitted",
    });

    // Format dates in the newly created permission
    const formattedPermission = {
      ...newPermission.toJSON(),
      start_date: formatDate(newPermission.start_date),
      end_date: formatDate(newPermission.end_date),
    };

    // Return a success message with the created permission record
    res.status(201).json({
      msg: "Permission successfully created",
      permission: formattedPermission,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating permission:", error);
    res
      .status(400)
      .json({ msg: "Failed to create permission", error: error.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    const permission = await permissionModel.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!permission) return res.status(404).json({ msg: "Permission Not Found" });

    const { status } = req.body;

    try {
      await permission.update({
        status: status,
      });

      res.status(200).json({ msg: "Permission Updated" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    if (
      error.message ===
      `invalid input syntax for type uuid: \"${req.params.id}\"`
    ) {
      res.status(404).json({ msg: "Permission Not Found" });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = {
  getPermission,
  getPermissionById,
  createPermission,
  updatePermission
};

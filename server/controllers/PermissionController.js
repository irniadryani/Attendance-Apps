const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { Op } = require("sequelize");
const path = require("path");
const permissionModel = require("../models/PermissionModel");
const User = require("../models/UserModel");
const { logMessage } = require('../utils/logger');

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
    logMessage('info', 'Fetching all permissions');
    const response = await permissionModel.findAll({
      attributes: [
        "id",
        "user_id",
        "start_date",
        "end_date",
        "status",
        "notes",
        "file",
        "url"
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
      file: permission.file,
      url: permission.url
    }));

    logMessage('info', 'Permissions fetched successfully', { formattedResponse });
    res.status(200).json(formattedResponse);
  } catch (error) {
    logMessage('error', 'Error fetching permissions', { error: error.message });
    res.status(500).json({ msg: error.message });
  }
};

const getPermissionById = async (req, res) => {
  try {
    logMessage('info', 'Fetching permissions for user', { userId: req.params.id });
    const response = await permissionModel.findAll({
      attributes: ["id", "start_date", "end_date", "status", "notes", "url"],
      where: {
        user_id: req.params.id,
      },
    });

    if (response.length === 0) {
      logMessage('warning', 'No permissions found for user', { userId: req.params.id });
      return res.status(404).json({ msg: "Permissions Not Found" });
    }

    const formattedResponse = response.map((perm) => ({
      ...perm.toJSON(),
      start_date: formatDate(perm.start_date),
      end_date: formatDate(perm.end_date),
    }));

    logMessage('info', 'Permissions fetched for user', { userId: req.params.id, formattedResponse });
    res.status(200).json(formattedResponse);
  } catch (error) {
    logMessage('error', 'Error fetching permissions for user', { userId: req.params.id, error: error.message });
    if (error.message === `invalid input syntax for type uuid: \"${req.params.id}\"`) {
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
    logMessage('info', 'Creating new permission', { userId: user_id });
    let file = null;
    let url = null;

    if (req.files && req.files.file) {
      const uploadedFile = req.files.file;
      const ext = path.extname(uploadedFile.name);
      const fileName = uploadedFile.md5 + ext;
      const allowedTypes = [".png", ".jpg", ".jpeg", ".pdf"];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        logMessage('warning', 'Invalid file type', { fileName, ext });
        return res.status(422).json({ msg: "Invalid File Type" });
      }

      if (uploadedFile.size > 5000000) {
        logMessage('warning', 'File too large', { fileName, size: uploadedFile.size });
        return res.status(422).json({ msg: "File must be less than 5MB" });
      }

      const filePath = path.join(__dirname, "../public/fileUploads/", fileName);
      await uploadedFile.mv(filePath);

      file = fileName; // Update with new file name
      url = `/fileUploads/${fileName}`; // Update the URL
    }

    const newPermission = await permissionModel.create({
      user_id,
      start_date,
      end_date,
      notes,
      status: status || "Submitted",
      file,
      url
    });

    const formattedPermission = {
      ...newPermission.toJSON(),
      start_date: formatDate(newPermission.start_date),
      end_date: formatDate(newPermission.end_date),
    };

    logMessage('info', 'Permission created successfully', { formattedPermission });
    res.status(201).json({
      msg: "Permission successfully created",
      permission: formattedPermission,
    });
  } catch (error) {
    logMessage('error', 'Error creating permission', { error: error.message });
    res.status(400).json({ msg: "Failed to create permission", error: error.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    logMessage('info', 'Updating permission status', { permissionId: req.params.id });
    const permission = await permissionModel.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!permission) {
      logMessage('warning', 'Permission not found', { permissionId: req.params.id });
      return res.status(404).json({ msg: "Permission Not Found" });
    }

    const { status } = req.body;

    try {
      await permission.update({ status });
      logMessage('info', 'Permission status updated successfully', { permissionId: req.params.id, status });

      res.status(200).json({ msg: "Permission Updated" });
    } catch (error) {
      logMessage('error', 'Error updating permission status', { permissionId: req.params.id, error: error.message });
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    logMessage('error', 'Error finding permission', { permissionId: req.params.id, error: error.message });
    if (error.message === `invalid input syntax for type uuid: \"${req.params.id}\"`) {
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

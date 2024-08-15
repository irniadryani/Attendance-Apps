const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { Op } = require("sequelize");
const path = require("path");
const permissionModel = require("../models/PermissionModel");
const User = require("../models/UserModel");
const { logMessage } = require("../utils/logger");

// Define the formatDate function
const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
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
        "file",
        "url",
        "created_at",
      ],
      include: [
        {
          model: User,
          attributes: ["full_name"], // Include user attributes
        },
      ],
      order: [["created_at", "DESC"]],
    });

      const formattedResponse = response.map((permission) => ({
        id: permission.id,
        user_id: permission.user_id,
        user_name: permission?.user?.full_name,
        start_date: formatDate(permission.start_date),
        end_date: formatDate(permission.end_date),
        notes: permission.notes,
        status: permission.status,
        file: permission.file,
        url: `${permission.url}${permission.file}`,
        created_at: permission.created_at,
      }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    logMessage("error", "Error fetching permissions", { error: error.message });
    res.status(500).json({ msg: error.message });
  }
};

const getPermissionById = async (req, res) => {
  try {
    const permission = await permissionModel.findAll({
      attributes: [
        "id",
        "start_date",
        "end_date",
        "notes",
        "url",
        "file",
        "created_at",
      ],
      where: {
        user_id: req.params.id,
      },
    });

    if (permission.length === 0) {
      logMessage("warning", "No permissions found for user", {
        userId: req.params.id,
      });
      return res.status(404).json({ msg: "Permissions Not Found" });
    }

    const formattedResponse = permission.map((permission) => ({
      id: permission.id,
      user_id: permission.user_id,
      start_date: formatDate(permission.start_date),
      end_date: formatDate(permission.end_date),
      notes: permission.notes,
      status: permission.status,
      file: permission.file,
      url: `${permission.url}${permission.file}`,
      created_at: permission.created_at,
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    logMessage("error", "Error fetching permissions by user ID", {
      userId: req.params.id,
      error: error.message,
    });
    res.status(500).json({ msg: error.message });
  }
};


const createPermission = async (req, res) => {
  const { start_date, end_date, status, notes } = req.body;
  const { id: user_id } = req.user;

  try {
    let file = null;
    let url = null;

    if (req.files && req.files.file) {
      const uploadedFile = req.files.file;
      const ext = path.extname(uploadedFile.name);
      const fileName = uploadedFile.md5 + ext;
      const allowedTypes = [".png", ".jpg", ".jpeg", ".pdf"];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        logMessage("warning", "Invalid file type", { fileName, ext });
        return res.status(422).json({ msg: "Invalid File Type" });
      }

      if (uploadedFile.size > 5000000) {
        logMessage("warning", "File too large", {
          fileName,
          size: uploadedFile.size,
        });
        return res.status(422).json({ msg: "File must be less than 5MB" });
      }

      const filePath = path.join(__dirname, "../public/fileUploads/", fileName);
      await uploadedFile.mv(filePath);

      file = fileName; // Update with new file name
      url = `/fileUploads/`; // Update the URL
      
    }

    const newPermission = await permissionModel.create({
      user_id,
      start_date,
      end_date,
      notes,
      status: status || "Submitted",
      file,
      url,
    });

    const formattedPermission = {
      ...newPermission.toJSON(),
      start_date: formatDate(newPermission.start_date),
      end_date: formatDate(newPermission.end_date),
    };

    res.status(201).json({
      msg: "Permission successfully created",
      permission: formattedPermission,
    });
  } catch (error) {
    logMessage("error", "Error creating permission", { error: error.message });
    res
      .status(400)
      .json({ msg: "Failed to create permission", error: error.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    // Find the permission by ID
    const permission = await permissionModel.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!permission) {
      logMessage("warning", "Permission not found", {
        permissionId: req.params.id,
      });
      return res.status(404).json({ msg: "Permission Not Found" });
    }

    // Calculate the time difference between the current time and the created_at
    const currentTime = new Date();
    const createdAt = new Date(permission.created_at);
    const timeDifference = currentTime - createdAt;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (timeDifference > oneDayInMilliseconds) {
      logMessage("warning", "Update attempt after 24 hours", {
        permissionId: req.params.id,
      });
      return res.status(403).json({
        msg: "You can only update your permission within 24 hours of the creation date.",
      });
    }

    // Get data from the request body
    const { start_date, end_date, notes } = req.body;
    console.log("req start date", start_date);
    console.log("req end date", end_date);
    let file = permission.file;
    let url = permission.url;

    // Check for a new file upload
    if (req.files && req.files.file) {
      const uploadedFile = req.files.file;
      const ext = path.extname(uploadedFile.name);
      const fileName = uploadedFile.md5 + ext;
      const allowedTypes = [".png", ".jpg", ".jpeg", ".pdf"];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        logMessage("warning", "Invalid file type", { fileName, ext });
        return res.status(422).json({ msg: "Invalid File Type" });
      }

      if (uploadedFile.size > 5000000) {
        logMessage("warning", "File too large", {
          fileName,
          size: uploadedFile.size,
        });
        return res.status(422).json({ msg: "File must be less than 5MB" });
      }

      // Move the file to the public folder
      const filePath = path.join(__dirname, "../public/fileUploads/", fileName);
      await uploadedFile.mv(filePath);

      // Update the file and URL
      file = fileName;
      url = `/fileUploads/`;
    }

    // Update the permission details in the database
    const updated = await permissionModel.update(
      {
        start_date,
        end_date,
        file,
        url,
        notes,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "Permission Updated" });
  } catch (error) {
    logMessage("error", "Error updating permission", {
      permissionId: req.params.id,
      error: error.message,
    });
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
  updatePermission,
};

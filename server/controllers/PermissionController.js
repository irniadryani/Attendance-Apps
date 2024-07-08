const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { Op } = require("sequelize");
const permissionModel = require("../models/PermissionModel");

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear().toString().slice(-2);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
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
    });

    // Format dates in response
    const formattedResponse = response.map((perm) => ({
      ...perm.toJSON(),
      start_date: formatDate(perm.start_date),
      end_date: formatDate(perm.end_date),
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
          order: [['created_at', 'DESC']], 
          limit: 7,
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
  ;

module.exports = {
  getPermission,
  getPermissionById,
  createPermission,
  updatePermission
};

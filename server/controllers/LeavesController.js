const express = require("express");
const router = express.Router();
const Leaves = require("../models/LeavesModel");
const Limit = require("../models/LimitModel");
const { check } = require("express-validator");
const unirest = require("unirest");
const { Op } = require("sequelize");

const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  

  const createLeaves = async (req, res) => {
    const { start_date, end_date, status, notes } = req.body;
    const { id: user_id } = req.user;
  
    try {
      // Create the leaves record
      const newLeaves = await Leaves.create({
        user_id: user_id,
        start_date: start_date,
        end_date: end_date,
        notes: notes,
        status: status || "Submitted",
      });
  
      // Update the corresponding limit record
      const limitRecord = await Limit.findOne({ where: { user_id: user_id } });
      if (limitRecord) {
        await limitRecord.update({ total: limitRecord.total - 1 });
      }
  
      // Format dates in the newly created leaves
      const formattedLeaves = {
        ...newLeaves.toJSON(),
        start_date: formatDate(newLeaves.start_date),
        end_date: formatDate(newLeaves.end_date),
      };
  
      // Return a success message with the created leaves record
      res.status(201).json({
        msg: "Leaves successfully created",
        leaves: formattedLeaves,
      });
    } catch (error) {
      console.error("Error creating leaves:", error);
      res.status(400).json({ msg: "Failed to create leaves", error: error.message });
    }
  };
  
  
  module.exports = {
    createLeaves
  };
  

module.exports = {
  createLeaves
};

// const createLeaves = async(req,res) => {
//     const { start_date, end_date, status, notes } = req.body;
//     const { id: user_id } = req.user;

//     try {
//          // Create the leaves record
//     const newLeaves = await Leaves.create({
//         user_id: user_id,
//         start_date: start_date,
//         end_date: end_date,
//         notes: notes,
//         status: status || "Submitted",
//       });
  
//       // Format dates in the newly created leaves
//       const formattedLeaves = {
//         ...newLeaves.toJSON(),
//         start_date: formatDate(newLeaves.start_date),
//         end_date: formatDate(newLeaves.end_date),
//       };
  
//       // Return a success message with the created leaves record
//       res.status(201).json({
//         msg: "leaves successfully created",
//         leaves: formattedLeaves,
//       });
//     } catch (error) {
//         console.error("Error creating leaves:", error);
//     res
//       .status(400)
//       .json({ msg: "Failed to create leaves", error: error.message });
//     }
  
// }

module.exports = {
  createLeaves
  };
  
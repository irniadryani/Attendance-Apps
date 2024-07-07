const express = require("express");
const router = express.Router();
const Attendances = require("../models/AttendancesModel");
const { check } = require("express-validator");
const unirest = require("unirest");
const { Op } = require("sequelize");

function secondsToHHMMSS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60); // Truncate milliseconds

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function secondsToFormattedTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let formattedTime = '';
  if (hours > 0) {
    formattedTime += `${hours} hr `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes} min `;
  }
  if (secs > 0 || formattedTime === '') { // Show seconds if it's the only unit or if there's no other time unit
    formattedTime += `${secs} sec`;
  }

  return formattedTime.trim();
}



// Example check-in location (Singapore Marina Bay Sands)
const CHECKIN_LOCATION = {
  latitude: -6.935662,
  longitude: 107.578095,
};

// Function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

const checkin = async (req, res) => {
  try {
    const { latitude, longitude } = req.body; // Assuming latitude and longitude are sent from frontend

    // Calculate distance between user's location and check-in location
    const distance = calculateDistance(
      latitude,
      longitude,
      CHECKIN_LOCATION.latitude,
      CHECKIN_LOCATION.longitude
    );

    // Define your maximum allowable distance (5 km, adjust as needed)
    const MAX_DISTANCE = 5000; // in meters

    console.log("distance", distance);
    console.log("max distance", MAX_DISTANCE);
    console.log("lat", latitude);
    console.log("long", longitude);
    console.log("lat fix", CHECKIN_LOCATION.latitude);
    console.log("long fix", CHECKIN_LOCATION.longitude);

    if (distance <= MAX_DISTANCE) {
      // Proceed with creating attendance record
      const userId = req.user.id;

      const attendance = await Attendances.create({
        user_id: userId,
        check_in: new Date(),
        status: "Present",
        location_lat: latitude,
        location_long: longitude,
      });

      res.status(201).json(attendance);
    } else {
      // Distance check failed
      res
        .status(400)
        .json({ error: "You are not within the allowed check-in radius." });
    }
  } catch (error) {
    console.error("Error checking in", error);
    res.status(500).json({ error: "Failed to check in" });
  }
};

const checkout = async (req, res) => {
  try {
    const { id } = req.user;

    // Get today's date in UTC timezone
    const today = new Date();
    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));

    // Fetch today's attendance record
    const attendance = await Attendances.findOne({
      where: {
        user_id: id,
        check_in: {
          [Op.between]: [startOfDay, endOfDay],
        },
        check_out: null, // Ensure only open attendance records are fetched
      },
    });

    if (!attendance) {
      return res.status(400).json({ error: "No check-in record found for today" });
    }

    // Calculate work hours in seconds
    const checkInTime = new Date(attendance.check_in);
    const checkOutTime = new Date();
    const workHoursInSeconds = (checkOutTime - checkInTime) / 1000; // Convert milliseconds to seconds

    // Convert work_hours to HH:MM:SS format
    const workHoursHHMMSS = secondsToHHMMSS(workHoursInSeconds);

    // Update attendance record with check-out time and work hours in HH:MM:SS format
    attendance.check_out = checkOutTime;
    attendance.work_hours = workHoursHHMMSS;
    await attendance.save();

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error checking out", error);
    res.status(500).json({ error: "Failed to check out" });
  }
};



const checkTodayAttendance = async (req, res) => {
  try {
    const { id } = req.user;

    // Get today's date in UTC timezone
    const today = new Date();
    const startOfDay = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );
    const endOfDay = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() + 1
      )
    );

    // Fetch attendance record for today
    const attendance = await Attendances.findOne({
      where: {
        user_id: id,
        check_in: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    res.json(attendance);
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ error: "Failed to fetch today's attendance" });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.user;

    // Fetch attendance records
    const attendances = await Attendances.findAll({
      where: { user_id: id },
    });

    // Convert work_hours to the formatted time string
    const result = attendances.map(att => {
      const workHours = att.work_hours;
      const [hours, minutes, seconds] = workHours.split(":").map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      const formattedWorkHours = secondsToFormattedTime(totalSeconds);

      return {
        ...att.toJSON(),
        work_hours: formattedWorkHours,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching attendance records", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

module.exports = { checkin, checkTodayAttendance, checkout, getAttendanceById };

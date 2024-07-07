const express = require("express");
const router = express.Router();
const Attendances = require("../models/AttendancesModel");
const { check } = require("express-validator");
const unirest = require("unirest");
const { Op } = require("sequelize");

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

    // Define your maximum allowable distance (1 meter, adjust as needed)
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

module.exports = { checkin, checkTodayAttendance };

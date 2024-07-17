const express = require("express");
const router = express.Router();
const Attendances = require("../models/AttendancesModel");
const User = require("../models/UserModel");
const Setting = require("../models/SettingModel");
const { check } = require("express-validator");
const unirest = require("unirest");
const { Op } = require("sequelize");

function secondsToHHMMSS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60); // Truncate milliseconds

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
}

function secondsToFormattedTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let formattedTime = "";
  if (hours > 0) {
    formattedTime += `${hours} hr `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes} min `;
  }
  if (secs > 0 || formattedTime === "") {
    // Show seconds if it's the only unit or if there's no other time unit
    formattedTime += `${secs} sec`;
  }

  return formattedTime.trim();
}

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

    const currentSetting = await Setting.findOne({ where: { id: 1 } });

    const latitudes = currentSetting.latitude;
    const longitudes = currentSetting.longitude;

    // Example check-in location (Singapore Marina Bay Sands)
    const CHECKIN_LOCATION = {
      latitude: latitudes,
      longitude: longitudes,
    };

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
      return res
        .status(400)
        .json({ error: "No check-in record found for today" });
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
      where: {
        user_id: id,
        [Op.and]: [
          {
            created_at: {
              [Op.gte]: new Date(
                new Date().setHours(0, 0, 0, 0) -
                  (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) *
                    24 *
                    60 *
                    60 *
                    1000
              ),
            },
          },
          {
            created_at: {
              [Op.lte]: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        ],
        // Filter out weekends (Saturday=6, Sunday=0)
        [Op.not]: [
          {
            [Op.or]: [
              {
                created_at: {
                  [Op.eq]: new Date(
                    new Date().setDate(
                      new Date().getDate() - new Date().getDay()
                    )
                  ),
                },
              }, // Sunday
              {
                created_at: {
                  [Op.eq]: new Date(
                    new Date().setDate(
                      new Date().getDate() - new Date().getDay() + 6
                    )
                  ),
                },
              }, // Saturday
            ],
          },
        ],
      },
      order: [["created_at", "DESC"]],
    });

    // Format dates and work hours
    const result = attendances.map((att) => {
      let formattedWorkHours = ""; // Default value if work_hours is null

      if (att.work_hours) {
        const [hours, minutes, seconds] = att.work_hours.split(":").map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        formattedWorkHours = secondsToFormattedTime(totalSeconds);
      }

      // Format check_in to HH:mm:ss
      let formattedCheckIn = "";
      if (att.check_in) {
        const checkInDate = new Date(att.check_in);
        formattedCheckIn = `${checkInDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${checkInDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${checkInDate
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;
      }

      // Format check_out to HH:mm:ss
      let formattedCheckOut = "";
      if (att.check_out) {
        const checkOutDate = new Date(att.check_out);
        formattedCheckOut = `${checkOutDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${checkOutDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${checkOutDate
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;
      }

      // Format created_at to YYYY-MM-DD
      const createdAtDate = new Date(att.created_at);
      const formattedDate = `${createdAtDate.getFullYear()}-${(
        createdAtDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${createdAtDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      return {
        ...att.toJSON(),
        work_hours: formattedWorkHours,
        check_in: formattedCheckIn,
        check_out: formattedCheckOut,
        date: formattedDate, // Add formatted date field
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching attendance records", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

// const getAllAttendances = async (req, res) => {
//   try {
//     // Fetch attendance records
//     const attendances = await Attendances.findAll({
//       order: [['created_at', 'DESC']],
//       include: [
//         {
//           model: User, // Assuming User is the model for users table
//           attributes: ["full_name"],
//         },
//       ],
//     });

//     // Format and transform data as needed
//     const result = attendances.map((att) => {
//       let formattedWorkHours = ""; // Default value if work_hours is null

//       if (att.work_hours) {
//         const [hours, minutes, seconds] = att.work_hours.split(":").map(Number);
//         const totalSeconds = hours * 3600 + minutes * 60 + seconds;
//         formattedWorkHours = secondsToFormattedTime(totalSeconds);
//       }

//       // Format check_in to HH:mm:ss
//       let formattedCheckIn = "";
//       if (att.check_in) {
//         const checkInDate = new Date(att.check_in);
//         formattedCheckIn = `${checkInDate
//           .getHours()
//           .toString()
//           .padStart(2, "0")}:${checkInDate
//           .getMinutes()
//           .toString()
//           .padStart(2, "0")}:${checkInDate
//           .getSeconds()
//           .toString()
//           .padStart(2, "0")}`;
//       }

//       // Format check_out to HH:mm:ss
//       let formattedCheckOut = "";
//       if (att.check_out) {
//         const checkOutDate = new Date(att.check_out);
//         formattedCheckOut = `${checkOutDate
//           .getHours()
//           .toString()
//           .padStart(2, "0")}:${checkOutDate
//           .getMinutes()
//           .toString()
//           .padStart(2, "0")}:${checkOutDate
//           .getSeconds()
//           .toString()
//           .padStart(2, "0")}`;
//       }

//       // Format created_at to YYYY-MM-DD
//       const createdAtDate = new Date(att.created_at);
//       const formattedDate = `${createdAtDate.getFullYear()}-${(createdAtDate.getMonth() + 1).toString().padStart(2, '0')}-${createdAtDate.getDate().toString().padStart(2, '0')}`;

//       return {
//         id: att.id,
//         full_name: att.user ? att.user.full_name : null, // Replace user_id with full_name
//         check_in: formattedCheckIn,
//         check_out: formattedCheckOut,
//         work_hours: formattedWorkHours,
//         status: att.status,
//         location_lat: att.location_lat,
//         location_long: att.location_long,
//         created_at: att.created_at,
//         updated_at: att.updated_at,
//         date: formattedDate, // Add formatted date field
//       };
//     });

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error fetching attendance records", error);
//     res.status(500).json({ error: "Failed to fetch attendance records" });
//   }
// };

const getAllAttendances = async (req, res) => {
  try {
    // Fetch attendance records
    const attendances = await Attendances.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["full_name"],
        },
      ],
    });

    // Calculate total and average working hours
    let totalSeconds = 0;
    let totalAttendances = 0;

    attendances.forEach((att) => {
      if (att.work_hours) {
        const [hours, minutes, seconds] = att.work_hours.split(":").map(Number);
        const workSeconds = hours * 3600 + minutes * 60 + seconds;
        totalSeconds += workSeconds;
        totalAttendances++;
      }
    });

    const averageSeconds =
      totalAttendances > 0 ? totalSeconds / totalAttendances : 0;

    const totalWorkingHours = secondsToFormattedTime(totalSeconds);
    const averageWorkingHours = secondsToFormattedTime(averageSeconds);

    // Format and transform data as needed
    const result = attendances.map((att) => {
      let formattedWorkHours = ""; // Default value if work_hours is null

      if (att.work_hours) {
        const [hours, minutes, seconds] = att.work_hours.split(":").map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        formattedWorkHours = secondsToFormattedTime(totalSeconds);
      }

      let formattedCheckIn = "";
      if (att.check_in) {
        const checkInDate = new Date(att.check_in);
        formattedCheckIn = `${checkInDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${checkInDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${checkInDate
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;
      }

      let formattedCheckOut = "";
      if (att.check_out) {
        const checkOutDate = new Date(att.check_out);
        formattedCheckOut = `${checkOutDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${checkOutDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${checkOutDate
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;
      }

      const createdAtDate = new Date(att.created_at);
      const formattedDate = `${createdAtDate.getFullYear()}-${(
        createdAtDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${createdAtDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      return {
        id: att.id,
        full_name: att.user ? att.user.full_name : null,
        check_in: formattedCheckIn,
        check_out: formattedCheckOut,
        work_hours: formattedWorkHours,
        status: att.status,
        location_lat: att.location_lat,
        location_long: att.location_long,
        created_at: att.created_at,
        updated_at: att.updated_at,
        date: formattedDate,
      };
    });

    // Append total and average working hours to the response
    const response = {
      totalWorkingHours,
      averageWorkingHours,
      attendances: result,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching attendance records", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

module.exports = {
  checkin,
  checkTodayAttendance,
  checkout,
  getAttendanceById,
  getAllAttendances,
};

const express = require("express");
const router = express.Router();
const Attendances = require("../models/AttendancesModel");
const User = require("../models/UserModel");
const Permissions = require("../models/PermissionModel");
const Leaves = require("../models/LeavesModel");
const Setting = require("../models/SettingModel");
const { check } = require("express-validator");
const path = require("path");
const unirest = require("unirest");
const { Op } = require("sequelize");
const { logMessage } = require("../utils/logger");

const timeToSeconds = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

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

const countWeekdays = (startDate, endDate) => {
  let count = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getUTCDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Exclude Sundays (0) and Saturdays (6)
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
};

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
    const MAX_DISTANCE = currentSetting.maximum_distance;
    // const MAX_DISTANCE = 5000; // in meters

    console.log("distance", distance);
    console.log("max distance", MAX_DISTANCE);
    console.log("lat", latitude);
    console.log("long", longitude);
    console.log("lat fix", CHECKIN_LOCATION.latitude);
    console.log("long fix", CHECKIN_LOCATION.longitude);

    if (distance <= MAX_DISTANCE) {
      // Check if user has already checked in today
      const userId = req.user.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to the start of the day

      const alreadyCheckedIn = await Attendances.findOne({
        where: {
          user_id: userId,
          check_in: {
            [Op.gte]: today,
          },
        },
      });

      if (alreadyCheckedIn) {
        return res
          .status(400)
          .json({ error: "You have already checked in today." });
      }

      // Proceed with creating attendance record
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
      logMessage("warn", "You are not within the allowed check-in radius");
      res
        .status(400)
        .json({ error: "You are not within the allowed check-in radius." });
    }
  } catch (error) {
    console.error("Error checking in", error);
    logMessage("error", "Error checking in", { error: error.message });
    res.status(500).json({ error: "Failed to check in" });
  }
};

const checkout = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const { id } = req.user;

    const currentSetting = await Setting.findOne({ where: { id: 1 } });

    const latitudes = currentSetting.latitude;
    const longitudes = currentSetting.longitude;

    // Example check-in location (Singapore Marina Bay Sands)
    const CHECKOUT_LOCATION = {
      latitude: latitudes,
      longitude: longitudes,
    };

    const distance = calculateDistance(
      latitude,
      longitude,
      CHECKOUT_LOCATION.latitude,
      CHECKOUT_LOCATION.longitude
    );

    const MAX_DISTANCE = currentSetting.maximum_distance;

    if (distance > MAX_DISTANCE) {
      return res
        .status(400)
        .json({ error: "You are not within the allowed checkout location." });
    }

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
      logMessage("error", "No check-in record found for today", {
        error: error.message,
      });
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
    logMessage("error", "Error fetching today's attendance", {
      error: error.message,
    });
    res.status(500).json({ error: "Failed to fetch today's attendance" });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("User ID:", id);

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
    logMessage("error", "Error fetching attendance records", {
      error: error.message,
    });
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

const getAllAttendanceById = async (req, res) => {
  try {
    // Fetch attendance records
    const attendances = await Attendances.findAll({
      where: {
        user_id: req.params.id,
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

      const showUrlCheckin = `${att.checkin_url || ""}${
        att.checkin_image || ""
      }`;
      const showUrlCheckout = `${att.checkout_url || ""}${
        att.checkout_image || ""
      }`;

      return {
        ...att.toJSON(),
        work_hours: formattedWorkHours,
        check_in: formattedCheckIn,
        check_out: formattedCheckOut,
        checkin_url: showUrlCheckin,
        checkout_url: showUrlCheckout,
        date: formattedDate, // Add formatted date field
      };
    });

    res.status(200).json(result);
  } catch (error) {
    logMessage("error", "Error fetching attendance records", {
      error: error.message,
    });
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

const getAllAttendancesYearly = async (req, res) => {
  try {
    const currentDate = new Date();

    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);

    // Fetch attendance records
    const attendances = await Attendances.findAll({
      created_at: {
        [Op.between]: [startOfYear, endOfYear],
      },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User, // Assuming User is the model for users table
          attributes: ["full_name"],
        },
      ],
    });

    // Format and transform data as needed
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
        id: att.id,
        full_name: att.user ? att.user.full_name : null, // Replace user_id with full_name
        check_in: formattedCheckIn,
        check_out: formattedCheckOut,
        work_hours: formattedWorkHours,
        status: att.status,
        location_lat: att.location_lat,
        location_long: att.location_long,
        created_at: att.created_at,
        updated_at: att.updated_at,
        date: formattedDate, // Add formatted date field
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching attendance records", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

const getAllAttendancesMonthly = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Get the first and last date of the current month
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Fetch attendance records for the current month
    const attendances = await Attendances.findAll({
      // where: {
      //   created_at: {
      //     [Op.between]: [startOfMonth, endOfMonth],
      //   },
      // },
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
        checkin_image: att.checkin_image,
        checkout: att.checkout,
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
    logMessage("error", "Error fetching attendance records", {
      error: error.message,
    });
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

// const getAllAttendances = async (req, res) => {
//   try {
//     const { full_name, startDate, endDate } = req.query;

//     // Convert startDate and endDate to Date objects
//     let start = startDate ? new Date(startDate) : new Date(0); // Default to epoch start
//     let end = endDate ? new Date(endDate) : new Date(); // Default to current date
//     end.setHours(23, 59, 59, 999); // Set endDate to the end of the day

//     // Fetch all employees
//     const employees = await User.findAll({
//       where: full_name ? { full_name } : undefined, // Filter by full_name if provided
//     });

//     if (!employees.length) {
//       return res.status(404).json({ error: "No employees found" });
//     }

//     // Calculate data for each employee
//     const results = await Promise.all(employees.map(async (user) => {
//       // Fetch attendance records for each user within date range
//       const attendances = await Attendances.findAll({
//         where: {
//           user_id: user.id,
//           [Op.and]: [
//             { check_in: { [Op.not]: null } },
//             { created_at: { [Op.between]: [start, end] } } // Filter by date range
//           ]
//         }
//       });

//       // Fetch permissions within date range
//       const permissions = await Permissions.findAll({
//         where: {
//           user_id: user.id,
//           created_at: { [Op.between]: [start, end] } // Filter by date range
//         }
//       });

//       // Fetch leaves within date range
//       const leaves = await Leaves.findAll({
//         where: {
//           user_id: user.id,
//           created_at: { [Op.between]: [start, end] } // Filter by date range
//         }
//       });

//       // Calculate totals
//       const totalAttendance = attendances.length;
//       const totalPermissions = permissions.length;
//       const totalLeaves = leaves.length;

//       // Calculate total work from home and other metrics
//       const totalWorkFromOffice = attendances.filter(att => att.location_lat).length;
//       const totalWorkFromHome = attendances.filter(att => att.checkin_image).length;

//       // Determine absences
//       const totalDaysInRange = countWeekdays(start, end); // Implement this function if needed
//       const totalAbsences = totalDaysInRange - totalAttendance;

//       return {
//         full_name: user.full_name,
//         total_attendance: totalAttendance,
//         total_absences: 0,
//         total_work_from_home: totalWorkFromHome,
//         total_work_from_office: totalWorkFromOffice,
//         total_permissions: totalPermissions,
//         total_leaves: totalLeaves
//       };
//     }));

//     // Filter out any null results (in case some employees were not found)
//     const filteredResults = results.filter(result => result !== null);

//     res.status(200).json(filteredResults);

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Failed to fetch data" });
//   }
// };

const getAllAttendancess = async (req, res) => {
  //getall map
  try {
    // Fetch all employees
    const employees = await User.findAll();

    if (!employees.length) {
      return res.status(404).json({ error: "No employees found" });
    }

    // Calculate data for each employee
    const results = await Promise.all(
      employees.map(async (user) => {
        // Fetch attendance records for each user
        const attendances = await Attendances.findAll({
          where: {
            [Op.and]: [{ user_id: user.id }, { check_in: { [Op.not]: null } }],
          },
        });

        // Fetch permissions for each user
        const permissions = await Permissions.findAll({
          where: {
            user_id: user.id,
          },
        });

        // Fetch leaves for each user
        const leaves = await Leaves.findAll({
          where: {
            user_id: user.id,
          },
        });

        // Calculate totals
        const totalAttendance = attendances.length;
        const totalPermissions = permissions.length;
        const totalLeaves = leaves.length;

        // Calculate total work from home and other metrics
        const totalWorkFromOffice = attendances.filter(
          (att) => att.location_lat
        ).length;
        const totalWorkFromHome = attendances.filter(
          (att) => att.checkin_image
        ).length;

        // Determine absences
        // Assuming absence calculation is not needed as there is no date range

        return {
          full_name: user.full_name,
          total_attendance: totalAttendance,
          total_absences: 0, // Set to 0 or adjust as needed
          total_work_from_home: totalWorkFromHome,
          total_work_from_office: totalWorkFromOffice,
          total_permissions: totalPermissions,
          total_leaves: totalLeaves,
        };
      })
    );

    // Filter out any null results (in case some employees were not found)
    const filteredResults = results.filter((result) => result !== null);

    res.status(200).json(filteredResults);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

//   const { full_name, startDate, endDate } = req.query;

//   // Validate query parameters
//   if (!startDate || !endDate) {
//     return res.status(400).json({ error: "Missing required query parameters" });
//   }

//   // Convert startDate and endDate to Date objects
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   end.setHours(23, 59, 59, 999); // Set endDate to the end of the day

//   try {
//     // Fetch all employees if no full_name is provided
//     const employees = full_name
//       ? [await User.findOne({ where: { full_name } })]
//       : await User.findAll();

//     if (!employees.length) {
//       return res.status(404).json({ error: "No employees found" });
//     }

//     // Calculate data for each employee
//     const results = await Promise.all(employees.map(async (user) => {
//       if (!user) return null;

//       // Fetch attendance records based on user ID and date range
//       const attendances = await Attendances.findAll({
//         where: {
//           [Op.and]: [
//             { user_id: user.id },
//             { check_in: { [Op.not]: null } },
//             { created_at: { [Op.between]: [start, end] } }
//           ]
//         }
//       });

//       // Fetch permissions and leaves within the date range
//       const permissions = await Permissions.findAll({
//         where: {
//           [Op.and]: [
//             { user_id: user.id },
//             { created_at: { [Op.between]: [start, end] } }
//           ]
//         }
//       });

//       const leaves = await Leaves.findAll({
//         where: {
//           [Op.and]: [
//             { user_id: user.id },
//             { created_at: { [Op.between]: [start, end] } }
//           ]
//         }
//       });

//       // Calculate totals
//       const totalAttendance = attendances.length;
//       const totalPermissions = permissions.length;
//       const totalLeaves = leaves.length;

//       // Calculate total work from home and other metrics
//       const totalWorkFromOffice = attendances.filter(att => att.location_lat).length;
//       const totalWorkFromHome = attendances.filter(att => att.checkin_image).length;

//       // Determine absences
//       const totalDaysInRange = countWeekdays(start, end);
//       const totalAbsences = totalDaysInRange - totalAttendance;

//       return {
//         full_name: user.full_name,
//         total_attendance: totalAttendance,
//         total_absences: totalAbsences,
//         total_work_from_home: totalWorkFromHome,
//         total_work_from_office: totalWorkFromOffice,
//         total_permissions: totalPermissions,
//         total_leaves: totalLeaves
//       };
//     }));

//     // Filter out any null results (in case some employees were not found)
//     const filteredResults = results.filter(result => result !== null);

//     res.status(200).json(filteredResults);

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Failed to fetch data" });
//   }
// };
const getAllAttendancesss = async (req, res) => {
  //first function
  const { full_name, startDate, endDate } = req.query;

  // Validate query parameters
  if (!full_name || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  if (full_name === null) {
  }

  try {
    const user = await User.findOne({
      where: {
        full_name: full_name,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set endDate to the end of the day

    // Fetch attendance records based on full_name and date range
    const attendances = await Attendances.findAll({
      where: {
        [Op.and]: [
          {
            check_in: {
              [Op.not]: null,
            },
          },
          {
            created_at: {
              [Op.between]: [start, end],
            },
          },
        ],
      },
      include: [
        {
          model: User,
          attributes: ["full_name"],
          where: {
            full_name: full_name,
          },
        },
      ],
    });

    // Fetch permissions within the date range
    const permissions = await Permissions.findAll({
      where: {
        [Op.and]: [
          {
            created_at: {
              [Op.between]: [start, end],
            },
          },
        ],
      },
      include: [
        {
          model: User,
          attributes: ["full_name"],
          where: {
            full_name: full_name,
          },
        },
      ],
    });

    // Fetch leaves within the date range
    const leaves = await Leaves.findAll({
      where: {
        [Op.and]: [
          {
            created_at: {
              [Op.between]: [start, end],
            },
          },
        ],
      },
      include: [
        {
          model: User,
          attributes: ["full_name"],
          where: {
            full_name: full_name,
          },
        },
      ],
    });

    // Calculate totals
    const totalAttendance = attendances.length;
    const totalPermissions = permissions.length;
    const totalLeaves = leaves.length;

    // Calculate total work from home and other metrics
    const totalWorkFromOffice = attendances.filter(
      (att) => att.location_lat
    ).length;
    const totalWorkFromHome = attendances.filter(
      (att) => att.checkin_image
    ).length;

    // Determine absences
    const totalDaysInRange = countWeekdays(start, end);
    const totalAbsences = totalDaysInRange - totalAttendance;

    // Format results
    const result = {
      full_name,
      total_attendance: totalAttendance,
      total_absences: totalAbsences,
      total_work_from_home: totalWorkFromHome,
      total_work_from_office: totalWorkFromOffice,
      total_permissions: totalPermissions,
      total_leaves: totalLeaves,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const getAllAttendances = async (req, res) => {
  const { full_name, startDate, endDate } = req.query;

  // Validate query parameters
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  // Convert startDate and endDate to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Set endDate to the end of the day

  try {
    if (full_name) {
      // Fetch specific user data
      const user = await User.findOne({ where: { full_name: full_name } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Fetch attendance records based on full_name and date range
      const attendances = await Attendances.findAll({
        where: {
          [Op.and]: [
            { check_in: { [Op.not]: null } },
            { created_at: { [Op.between]: [start, end] } },
          ],
        },
        include: [
          {
            model: User,
            attributes: ["full_name"],
            where: { full_name: full_name },
          },
        ],
      });

      // Calculate total and average working hours
      let totalSeconds = 0;
      let totalAttendances = 0;

      attendances.forEach((att) => {
        if (att.work_hours) {
          const workSeconds = timeToSeconds(att.work_hours);
          totalSeconds += workSeconds;
          totalAttendances++;
        }
      });

      const averageSeconds =
        totalAttendances > 0 ? totalSeconds / totalAttendances : 0;

      // Format results
      const result = {
        full_name,
        total_attendance: attendances.length,
        total_absences: countWeekdays(start, end) - attendances.length,
        total_work_from_home: attendances.filter((att) => att.checkin_image)
          .length,
        total_work_from_office: attendances.filter((att) => att.location_lat)
          .length,
        total_permissions: await Permissions.count({
          where: { created_at: { [Op.between]: [start, end] } },
        }),
        total_leaves: await Leaves.count({
          where: { created_at: { [Op.between]: [start, end] } },
        }),
        total_work_hours: secondsToFormattedTime(totalSeconds),
        average_work_hours: secondsToFormattedTime(averageSeconds),
      };

      res.status(200).json(result);
    } else {
      // Fetch all users' data
      const users = await User.findAll();

      const results = await Promise.all(
        users.map(async (user) => {
          const attendances = await Attendances.findAll({
            where: {
              [Op.and]: [
                { check_in: { [Op.not]: null } },
                { created_at: { [Op.between]: [start, end] } },
              ],
            },
            include: [
              {
                model: User,
                attributes: ["full_name"],
                where: { id: user.id },
              },
            ],
          });

          // Calculate total and average working hours
          let totalSeconds = 0;
          let totalAttendances = 0;

          attendances.forEach((att) => {
            if (att.work_hours) {
              const workSeconds = timeToSeconds(att.work_hours);
              totalSeconds += workSeconds;
              totalAttendances++;
            }
          });

          const averageSeconds =
            totalAttendances > 0 ? totalSeconds / totalAttendances : 0;

          // Format results
          return {
            full_name: user.full_name,
            total_attendance: attendances.length,
            total_absences: countWeekdays(start, end) - attendances.length,
            total_work_from_home: attendances.filter((att) => att.checkin_image)
              .length,
            total_work_from_office: attendances.filter(
              (att) => att.location_lat
            ).length,
            total_permissions: await Permissions.count({
              where: { created_at: { [Op.between]: [start, end] } },
            }),
            total_leaves: await Leaves.count({
              where: { created_at: { [Op.between]: [start, end] } },
            }),
            total_work_hours: secondsToFormattedTime(totalSeconds),
            average_work_hours: secondsToFormattedTime(averageSeconds),
          };
        })
      );

      res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const checkinWfh = async (req, res) => {
  const { id: user_id } = req.user;
  try {
    const today = new Date();
    const alreadyCheckedIn = await Attendances.findOne({
      where: {
        user_id,
        check_in: {
          [Op.gte]: today,
        },
      },
    });

    if (alreadyCheckedIn) {
      return res
        .status(400)
        .json({ error: "You have already checked in today." });
    }

    let checkin_image = null;
    let checkin_url = null;

    if (req.files && req.files.checkin_image) {
      const uploadedFile = req.files.checkin_image;
      const ext = path.extname(uploadedFile.name);
      const fileName = uploadedFile.md5 + ext;
      const allowedTypes = [".png", ".jpg", ".jpeg"];

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

      const filePath = path.join(
        __dirname,
        "../public/attendance/checkin/",
        fileName
      );
      await uploadedFile.mv(filePath);

      console.log("filepath", filePath);

      checkin_image = fileName;
      checkin_url = `/attendance/checkin/`;
    }

    const attendance = await Attendances.create({
      user_id,
      check_in: new Date(),
      status: "Present",
      checkin_image,
      checkin_url,
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error("Error checking in", error);
    logMessage("error", "Error checking in", { error: error.message });
    res.status(500).json({ error: "Failed to check in" });
  }
};

const checkoutWfh = async (req, res) => {
  const { id: user_id } = req.user;
  try {
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

    const attendance = await Attendances.findOne({
      where: {
        user_id,
        check_in: {
          [Op.between]: [startOfDay, endOfDay],
        },
        check_out: null,
      },
    });

    if (!attendance) {
      logMessage("error", "No check-in record found for today");
      return res
        .status(400)
        .json({ error: "No check-in record found for today" });
    }

    let checkout_image = null;
    let checkout_url = null;

    if (req.files && req.files.checkout_image) {
      const uploadedFile = req.files.checkout_image;
      const ext = path.extname(uploadedFile.name);
      const fileName = uploadedFile.md5 + ext;
      const allowedTypes = [".png", ".jpg", ".jpeg"];

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

      const filePath = path.join(
        __dirname,
        "../public/attendance/checkout/",
        fileName
      );
      await uploadedFile.mv(filePath);

      checkout_image = fileName;
      checkout_url = `/attendance/checkout/`;
    }

    const checkInTime = new Date(attendance.check_in);
    const checkOutTime = new Date();
    const workHoursInSeconds = (checkOutTime - checkInTime) / 1000;
    const workHoursHHMMSS = secondsToHHMMSS(workHoursInSeconds);

    await Attendances.update(
      {
        check_out: checkOutTime,
        work_hours: workHoursHHMMSS,
        status: "Present",
        checkout_image,
        checkout_url,
      },
      {
        where: { id: attendance.id },
      }
    );

    res.status(200).json({ message: "Checked out successfully" });
  } catch (error) {
    console.error("Error checking out", error);
    logMessage("error", "Error checking out", { error: error.message });
    res.status(500).json({ error: "Failed to check out" });
  }
};

module.exports = {
  checkin,
  checkTodayAttendance,
  checkout,
  getAttendanceById,
  getAllAttendanceById,
  getAllAttendancesYearly,
  getAllAttendancesMonthly,
  getAllAttendances,
  checkinWfh,
  checkoutWfh,
};

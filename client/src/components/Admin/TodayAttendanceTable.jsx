import React, { useEffect, useState } from "react";
import { getAllAttendanceFn } from "../../api/attendance/attendance";
import { useQuery } from "@tanstack/react-query";

export default function TodayAttendanceTable({
  dataAttendance,
  loadingAttendance,
  currentPaginationTable,
}) {
 

  const calculateTodayAttendance = () => {
    if (!loadingAttendance && dataAttendance) {
      const today = new Date().toISOString().slice(0, 10); // Today's date in YYYY-MM-DD format

      // Filter attendance records for today
      return dataAttendance.attendances.filter((entry) => entry.date === today);
    }

    return []; // Return an empty array if data is not loaded or there are no records for today
  };

  const todayAttendance = calculateTodayAttendance();


  return (
    <div>
      <div className="overflow-x-auto flex justify-center">
        <table className="table table-zebra w-full max-w-4xl">
          <thead>
            <tr className="text-sm text-black">
              <th>No</th>
              <th>Name</th>
              <th>Checkin</th>
              <th>Checkout</th>
              <th>Work Hours</th>
            </tr>
          </thead>
          <tbody>
            {todayAttendance.map((attendance, index) => (
              <tr
                className="hover font-base text-sm text-black"
                key={attendance.id}
              >
                <td>{index + 1}</td>
                <td>{attendance.full_name}</td>{" "}
                {/* Assuming user.full_name is available */}
                <td>{attendance.check_in}</td>
                <td>{attendance.check_out}</td>
                <td>{attendance.work_hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}

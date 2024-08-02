import React, { useEffect, useState } from "react";
import { getAllAttendanceFn } from "../../api/attendance/attendance";
import { useQuery } from "@tanstack/react-query";
import { hourglass } from "ldrs";


export default function TodayAttendanceTable({
  dataAttendance,
  loadingAttendance,
  currentPaginationTable,
}) {
  const [currentPage, setCurrentPage] = useState(currentPaginationTable || 1);

  hourglass.register();

  const calculateTodayAttendance = () => {
    if (!loadingAttendance && dataAttendance) {
      const today = new Date().toISOString().slice(0, 10); // Today's date in YYYY-MM-DD format

      // Filter attendance records for today
      return dataAttendance.filter((entry) => entry.date === today);
    }

    return []; // Return an empty array if data is not loaded or there are no records for today
  };

  const todayAttendance = calculateTodayAttendance();

  useEffect(() => {
    if (
      currentPaginationTable === undefined ||
      currentPaginationTable === null
    ) {
      setCurrentPage(1);
    }
  }, [currentPaginationTable]);

  // Calculate employees to display based on currentPage and search
  const recordsPerPage = 10;
  const npage = Math.ceil((todayAttendance?.length || 0) / recordsPerPage);
  const numbers = Array.from({ length: npage }, (_, index) => index + 1);

  // Pagination handlers
  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCPage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage < npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter employees based on search and pagination
  const filteredEmployees = todayAttendance
    ? todayAttendance.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
      )
    : [];

  // Show loading or empty state when todayAttendance is undefined or null
  if (!todayAttendance) {
    return (
      <div className="flex justify-center items-center h-full">
        <l-hourglass
          size="40"
          bg-opacity="0.1"
          speed="1.75"
          color="black"
        ></l-hourglass>
      </div>
    );
  }

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
      <nav className="flex justify-center mt-5">
        <div className="flex items-center gap-4 mt-2 justify-center lg:justify-end">
          <button
            disabled={currentPage === 1}
            onClick={prePage}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Prev
          </button>
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => changeCPage(num)}
              className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase ${
                currentPage === num
                  ? "bg-[#000000] text-white"
                  : "text-gray-900"
              } transition-all hover:bg-[#000000] hover:text-white active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
            >
              {num}
            </button>
          ))}
          <button
            disabled={currentPage === npage}
            onClick={nextPage}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
}

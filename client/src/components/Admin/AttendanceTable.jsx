import React, { useEffect, useState } from "react";
import { getAllAttendanceFn } from "../../api/attendance/attendance";
import { useQuery } from "@tanstack/react-query";
import { hourglass } from "ldrs";

export default function AttendanceTable({
  dataAttendance,
  currentPaginationTable,
}) {
  const [currentPage, setCurrentPage] = useState(currentPaginationTable || 1);

  
  hourglass.register();

  // Update currentPage when currentPaginationTable changes
  useEffect(() => {
    if (
      currentPaginationTable === undefined ||
      currentPaginationTable === null
    ) {
      setCurrentPage(1);
    }
  }, [currentPaginationTable]);

  // Calculate employees to display based on currentPage and search
  const recordsPerPage = 20;
  const npage = Math.ceil((dataAttendance?.length || 0) / recordsPerPage);
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
  const filteredAttendances = dataAttendance
    ? dataAttendance.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
      )
    : [];

  // Show loading or empty state when dataAttendance is undefined or null
  if (!dataAttendance) {
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

  const getWorkLocation = (attendance) => {
    if (attendance.checkin_image !== null && attendance.location_lat === null) {
      return "Work From Home";
    } else if (
      attendance.checkin_image === null &&
      attendance.location_lat !== null
    ) {
      return "Work From Office";
    }
    return "Unknown";
  };

  return (
    <div>
      <div className="overflow-x-auto flex justify-center">
        <table className="table table-zebra w-full max-w-4xl">
          <thead>
            <tr className=" text-sm text-white bg-black ">
              <th>No</th>
              <th>Name</th>
              <th>Checkin</th>
              <th>Checkout</th>
              <th>Work Hours</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendances?.map((attendance, index) => (
              <tr className="hover font-base text-sm text-black " key={index}>
                <th>{(currentPage - 1) * recordsPerPage + index + 1}</th>
                <td>{attendance.full_name}</td>
                <td>{attendance.check_in}</td>
                <td>{attendance.check_out}</td>
                <td>{attendance.work_hours}</td>
                <td>{getWorkLocation(attendance)}</td>
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

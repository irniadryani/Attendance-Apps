import React, { useEffect, useState } from "react";
import { getAllAttendanceByIdFn } from "../../api/attendance/attendance";
import { hourglass } from "ldrs";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import EmptyPng from "../../assets/empty.png";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import { useLocation } from "react-router-dom";

export default function DetailAttendanceEmployee({ employeeId }) {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [isDateRangeCleared, setIsDateRangeCleared] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPageAttendance, setCurrentPageAttendance] = useState(1);
  const recordsPerPage = 5;

  const {
    data: attendanceDetail,
    refetch: refetchAttendanceDetail,
    isLoading: loadingAttendanceDetail,
    error: attendanceError,
  } = useQuery({
    queryKey: ["singleAttendance", employeeId],
    queryFn: () => getAllAttendanceByIdFn(employeeId),
    enabled: !!employeeId,
  });

  hourglass.register();

  const toggleDateRangePicker = () => {
    setShowDateRange(!showDateRange);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id],
    }));
  };

  const location = useLocation();
  const currentPaginationTable = location.state?.currentPaginationTable || 1;

  useEffect(() => {
    if (currentPaginationTable === undefined || currentPaginationTable === null) {
      setCurrentPageAttendance(1);
    } else {
      setCurrentPageAttendance(currentPaginationTable);
    }
  }, [currentPaginationTable]);

  useEffect(() => {
    if (employeeId) {
      refetchAttendanceDetail();
    }
  }, [employeeId, refetchAttendanceDetail]);

  const handleClear = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setIsDateRangeCleared(true);
    refetchAttendanceDetail(); // Clear and fetch again
  };

  const filteredAttendanceDetail = isDateRangeCleared
    ? attendanceDetail
    : attendanceDetail?.filter((attendance) => {
        const attendanceDate = new Date(attendance.date);
        return (
          attendanceDate >= dateRange[0].startDate &&
          attendanceDate <= dateRange[0].endDate
        );
      }) || [];

  const attendancePageCount = Math.ceil(filteredAttendanceDetail.length / recordsPerPage);

  const prePageAttendance = () => {
    if (currentPageAttendance > 1) {
      setCurrentPageAttendance(currentPageAttendance - 1);
    }
  };

  const changeCPageAttendance = (page) => {
    setCurrentPageAttendance(page);
  };

  const nextPageAttendance = () => {
    if (currentPageAttendance < attendancePageCount) {
      setCurrentPageAttendance(currentPageAttendance + 1);
    }
  };

  const currentAttendance =
    filteredAttendanceDetail.slice(
      (currentPageAttendance - 1) * recordsPerPage,
      currentPageAttendance * recordsPerPage
    );

  if (loadingAttendanceDetail) {
    return (
      <div className="flex justify-center items-center h-full">
        <l-hourglass size="40" bg-opacity="0.1" speed="1.75" color="black"></l-hourglass>
      </div>
    );
  }

  if (attendanceError) {
    toast.error(`Error fetching attendance for employee with id ${employeeId}`);
    return null;
  }

  if (!filteredAttendanceDetail || filteredAttendanceDetail.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div>
          <img src={EmptyPng} className="w-full max-w-48" />
        </div>
        <div>
          <p className="text-center font-semibold text-lg my-5">
            No attendance records found
          </p>
        </div>
      </div>
    );
  }

  const getWorkLocation = (attendance) => {
    if (attendance.checkin_image && !attendance.location_lat) {
      return "Work From Home";
    } else if (!attendance.checkin_image && attendance.location_lat) {
      return "Work From Office";
    }
    return "Unknown";
  };

  return (
    <div>
      <div>
        {showDateRange && (
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              setDateRange([item.selection]);
              setIsDateRangeCleared(false);
            }}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
          />
        )}
      </div>
      <div className="flex justify-between my-4">
        <button
          onClick={toggleDateRangePicker}
          className="btn bg-black text-white"
        >
          {showDateRange ? "Hide Date Range" : "Show Date Range"}
        </button>
        <button onClick={handleClear} className="btn bg-red-500 text-white">
          Clear
        </button>
      </div>
      <div className="overflow-x-auto flex justify-center">
        <table className="table table-zebra w-full max-w-4xl">
          <thead>
            <tr className="text-sm text-white bg-black">
              <th>No</th>
              <th>Date</th>
              <th>Checkin</th>
              <th>Checkout</th>
              <th>Checkin Image</th>
              <th>Checkout Image</th>
              <th>Work Hours</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {currentAttendance.map((attendance, index) => (
              <tr className="hover font-base text-sm text-black" key={index}>
                <th>{index + 1 + (currentPageAttendance - 1) * recordsPerPage}</th>
                <td>{attendance.date}</td>
                <td>{attendance.check_in}</td>
                <td>{attendance.check_out}</td>
                <td>
                  {attendance.checkin_url ? (
                    <img
                      src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                        /\/$/,
                        ""
                      )}${attendance.checkin_url}`}
                      alt="checkin"
                      className="w-36"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {attendance.checkout_image ? (
                    <img
                      src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                        /\/$/,
                        ""
                      )}${attendance.checkout_url}`}
                      alt="checkout"
                      className="w-36"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
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
            disabled={currentPageAttendance === 1}
            onClick={prePageAttendance}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Prev
          </button>
          {Array.from({ length: attendancePageCount }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => changeCPageAttendance(index + 1)}
              className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase ${
                currentPageAttendance === index + 1
                  ? "bg-[#000000] text-white"
                  : "text-gray-900"
              } transition-all hover:bg-[#000000] hover:text-white active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPageAttendance === attendancePageCount}
            onClick={nextPageAttendance}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
}

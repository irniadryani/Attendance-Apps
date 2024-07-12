import React from "react";
import { getAllAttendanceFn } from "../../api/attendance/attendance";
import { useQuery } from "@tanstack/react-query";

export default function AttendanceTable() {
  const {
    data: dataAttendance,
    refetch: refetchAttendance,
    isLoading: loadingAttendance,
  } = useQuery({
    queryKey: ["attendance"],
    queryFn: getAllAttendanceFn,
  });

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
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {dataAttendance?.attendances.map((attendance, index) => (
              <tr className="hover font-base text-sm text-black " key={index}>
                <th>{index + 1}</th>
                <td>{attendance.full_name}</td>
                <td>{attendance.check_in}</td>
                <td>{attendance.check_out}</td>
                <td>{attendance.work_hours}</td>
                <td>{attendance.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

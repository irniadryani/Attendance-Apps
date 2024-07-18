import React, { useMemo, useState } from "react";
import Layout from "../Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import AttendanceTable from "../../components/Admin/AttendanceTable";
import { getAllAttendanceFn } from "../../api/attendance/attendance";
import { getAllPermissionFn } from "../../api/permission/permission";
import Chart from "../../components/Admin/Chart";
import { getAllLeavesFn } from "../../api/leaves/leaves";
import { IoMdSearch } from "react-icons/io";
import { useLocation } from "react-router-dom";

const Attendance = () => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(null);

  const location = useLocation();

  const {
    data: dataAttendance,
    refetch: refetchAttendance,
    isLoading: loadingAttendance,
  } = useQuery({
    queryKey: ["attendance"],
    queryFn: getAllAttendanceFn,
  });

  const { data: dataPermission, isLoading: loadingPermission } = useQuery({
    queryKey: ["permission"],
    queryFn: getAllPermissionFn,
  });

  const { data: dataLeaves, isLoading: loadingLeaves } = useQuery({
    queryKey: ["Leaves"],
    queryFn: getAllLeavesFn,
  });

  const filteredEmployee = dataAttendance?.attendances?.filter((employee) => {
    const matchingName =
      search === "" ||
      employee?.full_name?.toLowerCase().includes(search.toLowerCase());
    
    const matchingDate =
      !date || new Date(employee?.date).toDateString() === date.toDateString();

    return matchingName && matchingDate;
  });

  return (
    <Layout>
      <div className="flex flex-row justify-between my-5">
        <div className="card bg-black text-neutral-content w-56 h-24">
          <div className="flex flex-col items-center text-center justify-between">
            <h2 className="font-bold text-6xl items-end">
              {!loadingPermission && dataPermission?.length !== undefined
                ? dataPermission?.length
                : ""}
            </h2>
            <p className="font-bold text-lg items-end">Total Permission</p>
          </div>
        </div>
        <div className="card bg-black text-neutral-content w-56 h-24">
          <div className="flex flex-col items-center text-center justify-between">
            <h2 className="font-bold text-6xl items-end">
              {!loadingLeaves && dataLeaves?.length !== undefined
                ? dataLeaves?.length
                : ""}
            </h2>
            <p className="font-bold text-lg items-end">Total Leaves </p>
          </div>
        </div>
        <div className="card bg-black text-neutral-content w-56 h-24">
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="font-bold text-xl items-end mt-5">
              {dataAttendance?.totalWorkingHours}
            </h2>
            <p className="font-bold text-lg items-end">Total Working Hours</p>
          </div>
        </div>
        <div className="card bg-black text-neutral-content w-56 h-24">
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="font-bold text-xl items-end mt-5">
              {dataAttendance?.averageWorkingHours}
            </h2>
            <p className="font-bold text-lg items-end">Average Working Hours</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row mt-10">
        <div className="w-2/3">
          <div className="flex flex-row justify-between">
            <div className="card bg-base-100 w-72 shadow-xl my-5">
              <div className="flex flex-row p-3">
                <div>
                  <p className="font-semibold text-sm items-center mr-2">
                    Sort By Date:
                  </p>
                </div>

                <div className="w-36">
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    isClearable
                    placeholderText="Select a date"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-4 max-w-[200px] my-10  rounded-lg bg-white border border-black hover:border-black focus:border-black  border-solid border-2 shadow-xl">
              <IoMdSearch fontSize="1.125 rem" color="#000000" />
              <input
                type="text"
                className="flex h-10 pe-4 pb-1 w-full rounded-lg outline-none text-sm"
                placeholder="Search Employee"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <AttendanceTable
              dataAttendance={filteredEmployee}
              loadingAttendance={loadingAttendance}
              currentPaginationTable={
                location.state === null || location.state === undefined
                  ? null
                  : location.state.currentPaginationTable
              }
            />
          </div>
        </div>
        <div className="flex card bg-base-100 w-1/3 mx-5 h-full shadow-xl">
          <div className="flex items-center justify-center p-3">
            <div className="w-64 justify-center">
              <Chart />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;

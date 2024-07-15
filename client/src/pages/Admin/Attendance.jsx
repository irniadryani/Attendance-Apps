import React, { useMemo } from "react";
import Layout from "../Layout";
import { useQuery } from "@tanstack/react-query";
import AttendanceTable from "../../components/Admin/AttendanceTable";
import { getAllAttendanceFn } from "../../api/attendance/attendance";
import { getAllPermissionFn } from "../../api/permission/permission";
import Chart from "../../components/Admin/Chart";


const Attendance = () => {
  const {
    data: dataAttendance,
    refetch: refetchAttendance,
    isLoading: loadingAttendance,
  } = useQuery({
    queryKey: ["attendance"],
    queryFn: getAllAttendanceFn,
  });

  const {
    data: dataPermission,
    isLoading: loadingPermission,
  } = useQuery({
    queryKey: ["permission"],
    queryFn: getAllPermissionFn,
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
            <h2 className="font-bold text-6xl items-end">8</h2>
            <p className="font-bold text-lg items-end">Total Leaves</p>
          </div>
        </div>
        <div className="card bg-black text-neutral-content w-56 h-24">
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="font-bold text-xl items-end mt-5">{dataAttendance?.totalWorkingHours}</h2>
            <p className="font-bold text-lg items-end">Total Working Hours</p>
          </div>
        </div>
        <div className="card bg-black text-neutral-content w-56 h-24">
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="font-bold text-xl items-end mt-5">{dataAttendance?.averageWorkingHours}</h2>
            <p className="font-bold text-lg items-end">Average Working Hours</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row mt-10">
        <div className="w-2/3">
          <AttendanceTable />
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

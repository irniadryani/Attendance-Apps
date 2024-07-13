import React from "react";
import Layout from "../Layout";
import { getAllAttendanceFn } from "../../api/attendance/attendance";
import { getAllPermissionFn } from "../../api/permission/permission";
// import { get } from "../../api//leaves/leaves";
import { useQuery } from "@tanstack/react-query";
import TodayAttendanceTable from "../../components/Admin/TodayAttendanceTable";
import Admin from "../../assets/admin.png";

export default function Dashboard() {
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
    refetch: refetchPermission,
    isLoading: loadingPermission,
  } = useQuery({
    queryKey: ["permission"],
    queryFn: getAllPermissionFn,
  });

  const calculateTodayAbsences = () => {
    let todayAbsences = 0;

    if (!loadingAttendance && dataAttendance) {
      const today = new Date().toISOString().slice(0, 10); // Today's date in YYYY-MM-DD format

      // Calculate attendance lengths for today
      todayAbsences = dataAttendance.attendances.filter(
        (entry) => entry.date === today
      ).length;
    }

    return todayAbsences; // Return the calculated value
  };

  const todayAbsences = calculateTodayAbsences(); // Call the function to get the actual count

  const calculateTodayPermission = () => {
    let todayPermission = 0;

    if (!loadingPermission && dataPermission) {
      const today = new Date().toISOString().slice(0, 10); // Today's date in YYYY-MM-DD format

      // Calculate attendance lengths for today
      todayPermission = dataPermission.filter(
        (entry) => entry.date === today
      ).length;
    }

    return todayPermission; // Return the calculated value
  };

  const todayPermission = calculateTodayPermission();

  return (
    <Layout>
      <div>
        <div className="card bg-black shadow-xl mb-5">
          <div className="card-body flex flex-row justify-between">
            <div>
              <h2 className="card-title font-bold text-white">Welcome</h2>
              <p className="font-semibold text-white">You Are Login As Admin</p>
              
            </div>
            <div className="flex justify-right">
              <img src={Admin} className="justify-end w-48" alt="Employee" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-row gap-20 justify-center">
          <div className="card bg-black text-neutral-content w-56 h-24">
            <div className="flex flex-col items-center text-center justify-between">
              {!loadingAttendance && (
                <h2 className="font-bold text-6xl items-end">
                  {todayAbsences}
                </h2>
              )}
              <p className="font-bold text-lg items-end">Today Absences</p>
            </div>
          </div>
          <div className="card bg-black text-neutral-content w-56 h-24">
            <div className="flex flex-col items-center text-center justify-between">
              <h2 className="font-bold text-6xl items-end">
                {todayPermission}
              </h2>
              <p className="font-bold text-lg items-end">Today's Permission</p>
            </div>
          </div>
          <div className="card bg-black text-neutral-content w-56 h-24">
            <div className="flex flex-col items-center text-center justify-between">
              <h2 className="font-bold text-6xl items-end">8</h2>{" "}
              <p className="font-bold text-lg items-end">Today Leaves</p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-10">
        <TodayAttendanceTable />
      </div>
    </Layout>
  );
}

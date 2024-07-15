import React from "react";
import Layout from "../Layout";
import { getAllAttendanceFn } from "../../api/attendance/attendance";
import { getAllPermissionFn } from "../../api/permission/permission";
import { getAllLeavesFn } from "../../api/leaves/leaves";
import { useQuery } from "@tanstack/react-query";
import TodayAttendanceTable from "../../components/Admin/TodayAttendanceTable";
import Admin from "../../assets/admin.png";

export default function Dashboard() {
  const {
    data: dataAttendance,
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

  const {
    data: dataLeaves,
    isLoading: loadingLeaves,
  } = useQuery({
    queryKey: ["leaves"],
    queryFn: getAllLeavesFn,
  });

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const today = formatDate(new Date());

  const calculateTodayAbsences = () => {
    let todayAbsences = 0;

    if (!loadingAttendance && dataAttendance) {
      // Calculate attendance lengths for today
      todayAbsences = dataAttendance?.attendances.filter(
        (entry) => formatDate(entry.date) === today
      ).length;
    }

    return todayAbsences;
  };

  const calculateTodayPermission = () => {
    let todayPermission = 0;

    if (!loadingPermission && dataPermission) {
      // Calculate permission lengths for today
      todayPermission = dataPermission.filter(
        (entry) => formatDate(entry.start_date) === today 
      ).length;
    }

    return todayPermission;
  };

  const calculateTodayLeaves = () => {
    let todayLeaves = 0;

    if (!loadingLeaves && dataLeaves) {
      // Calculate leaves lengths for today
      todayLeaves = dataLeaves.filter(
        (entry) => formatDate(entry.start_date) === today
      ).length;
    }

    return todayLeaves;
  };

  const todayAbsences = calculateTodayAbsences();
  const todayPermission = calculateTodayPermission();
  const todayLeaves = calculateTodayLeaves();

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
              <h2 className="font-bold text-6xl items-end">{todayLeaves}</h2>{" "}
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

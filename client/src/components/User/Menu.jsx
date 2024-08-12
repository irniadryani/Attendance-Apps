import React from "react";
import Attendance from "../../assets/clock.png";
import Daily from "../../assets/daily.png";
import Approvall from "../../assets/approval.png";
import Permissionn from "../../assets/permission.png";
import WFH from "../../assets/wfh.png";
import Leavess from "../../assets/vacation.png";
import Attendances from "./Attendance";
import Permission from "./Permission";
import Leaves from "./Leaves";
import DailyReport from "./DailyReport";
import Approval from "./Approval";
import WorkFromHome from "./WorkFromHome";

export default function Menu() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-5">
        <button
          className="bg-black rounded-3xl w-full md-h-18 lg-h-18 flex flex-col justify-center items-center p-5"
          onClick={() =>
            document.getElementById("attendance_modal").showModal()
          }
        >
          <div className="md-w-12 lg-w-12">
            <img
              src={Attendance}
              className="w-full items-center justify-center"
              alt="Attendance"
            />
          </div>

          <p className="text-white font-semibold text-center justify-center text-sm mt-3">
            Attendance
          </p>
        </button>
        <button
          className="bg-black rounded-3xl w-full md-h-18 lg-h-18 flex flex-col justify-center items-center p-5"
          onClick={() => document.getElementById("wfh_modal").showModal()}
        >
          <div className="md-w-12 lg-w-12">
            <img
              src={WFH}
              className="w-full items-center justify-center"
              alt="Attendance"
            />
          </div>
          <p className="text-white font-semibold text-center justify-center text-sm mt-3">
            Work From Home
          </p>
        </button>
        <button
          className="bg-black rounded-3xl w-full md-h-18 lg-h-18 flex flex-col justify-center items-center p-5"
          onClick={() =>
            document.getElementById("permission_modal").showModal()
          }
        >
          <div className="md-w-12 lg-w-12">
            <img
              src={Permissionn}
              className="w-full items-center justify-center"
              alt="Permission"
            />
          </div>

          <p className="text-white font-semibold text-center justify-center text-sm mt-3">
            Permission
          </p>
        </button>
        <button
          className="bg-black rounded-3xl w-full md-h-18 lg-h-18 flex flex-col justify-center items-center p-5"
          onClick={() => document.getElementById("leaves_modal").showModal()}
        >
          <div className="md-w-12 lg-w-12">
            <img
              src={Leavess}
              className="w-full items-center justify-center"
              alt="Leaves"
            />
          </div>

          <p className="text-white font-semibold text-center justify-center text-sm mt-3">
            Leaves
          </p>
        </button>
        <button
          className="bg-black rounded-3xl w-full md-h-18 lg-h-18 flex flex-col justify-center items-center p-5"
          onClick={() =>
            document.getElementById("daily_report_modal").showModal()
          }
        >
          <div className="md-w-12 lg-w-12">
            <img
              src={Daily}
              className="w-full items-center justify-center"
              alt="Daily Report"
            />
          </div>

          <p className="text-white font-semibold text-center justify-center text-sm mt-3">
            Daily Report
          </p>
        </button>
        <button
          className="bg-black rounded-3xl w-full md-h-18 lg-h-18 flex flex-col justify-center items-center p-5"
          onClick={() => document.getElementById("approval_modal").showModal()}
        >
          <div className="md-w-12 lg-w-12">
            <img
              src={Approvall}
              className="w-full items-center justify-center"
              alt="Approval"
            />
          </div>

          <p className="text-white font-semibold text-center justify-center text-sm mt-3">
            Approval
          </p>
        </button>
      </div>
      <Attendances />
      <WorkFromHome />
      <Permission />
      <Leaves />
      <DailyReport />
      <Approval />
    </div>
  );
}

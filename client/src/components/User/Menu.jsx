import React from "react";
import Attendance from "../../assets/clock.png";
import Leavess from "../../assets/leaves.png";
import Attendances from "./Attendance";
import Permission from "./Permission";
import Leaves from "./Leaves";
import DailyReport from "./DailyReport";

export default function Menu() {
  return (
    <div>
      {" "}
      <div className="flex flex-row items-center justify-center gap-7 my-5">
        <btn className="bg-black rounded-3xl w-36 h-36" onClick={() => document.getElementById("attendance_modal").showModal()}>
          <img
            src={Attendance}
            className="w-24 items-center justify-center"
            alt="Attendance"
          />
          <p className="text-white font-semibold text-center justify-center text-sm mt-5">
            Attendance
          </p>
        </btn>
        <btn className="bg-black rounded-3xl w-36 h-36" onClick={() => document.getElementById("permission_modal").showModal()}>
          <img
            src={Attendance}
            className="w-24 items-center justify-center"
            alt="Permission"
          />
          <p className="text-white font-semibold text-center justify-center text-sm mt-5">
            Permission
          </p>
        </btn>
        <btn className="bg-black rounded-3xl w-36 h-36" onClick={() => document.getElementById("leaves_modal").showModal()}>
          <img
            src={Leavess}
            className="w-24 items-center justify-center"
            alt="Leaves"
          />
          <p className="text-white font-semibold text-center justify-center text-sm mt-5">
            Leaves
          </p>
        </btn>
        <btn className="bg-black rounded-3xl w-36 h-36" onClick={() => document.getElementById("daily_report_modal").showModal()}>
          <img
            src={Attendance}
            className="w-24 items-center justify-center"
            alt="Daily Report"
          />
          <p className="text-white font-semibold text-center justify-center text-sm mt-5">
            Daily Report
          </p>
        </btn>
        <div className="bg-black rounded-3xl w-36 h-36">
          <img
            src={Attendance}
            className="w-24 items-center justify-center"
            alt="Approval"
          />
          <p className="text-white font-semibold text-center justify-center text-sm mt-5">
            Approval
          </p>
        </div>
      </div>
      <Attendances/>
      <Permission/>
      <Leaves/>
      <DailyReport/>
    </div>
  );
}

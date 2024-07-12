import React from "react";
import Layout from "../Layout";
import { getAllDailyReportFn } from "../../api/dailyReport/dailyReport";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function DailyReport() {
  const {
    data: dataDailyReport,
    isLoading: loadingDailyReport,
  } = useQuery({
    queryKey: ["dailyReport"],
    queryFn: getAllDailyReportFn,
  });

  // Group daily reports by user_id to show unique employees
  const uniqueEmployees = Array.from(
    new Map(dataDailyReport?.map((item) => [item.user_id, item])).values()
  );

  return (
    <Layout>
      <div>
        <div>
          <p className="text-2xl font-bold mb-5">Employee's Daily Reports</p>
        </div>
        {uniqueEmployees.map((employee) => (
          <div key={employee.user_id} className="card bg-neutral text-neutral-content w-full mb-3 h-lg">
            <div className="card-body items-start text-start">
              <h2 className="card-title text-start">{employee.user_name}</h2>
              <p className="font-semibold">{employee.user_position}</p>
              <Link
                to={`/daily-report/${btoa(employee.user_id)}`}
                state={{
                  employeeName: employee.user_name,
                  employeePosition: employee.user_position,
                }}
              >
                <div className="flex justify-end">
                  <button className="btn btn-active bg-white text-black btn-4/12 justify-end">
                    Detail
                  </button>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

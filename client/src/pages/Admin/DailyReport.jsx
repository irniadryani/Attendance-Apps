import React, { useState } from "react";
import Layout from "../Layout";
import { getAllDailyReportFn } from "../../api/dailyReport/dailyReport";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";

export default function DailyReport() {
  const [search, setSearch] = useState("");


  const { data: dataDailyReport, isLoading: loadingDailyReport, refetch: refetchDailyReport } = useQuery({
    queryKey: ["dailyReport"],
    queryFn: getAllDailyReportFn,
  });

  // Group daily reports by user_id to show unique employees
  const uniqueEmployees = Array.from(
    new Map(dataDailyReport?.map((item) => [item.user_id, item])).values()
  );

  const filteredEmployee = uniqueEmployees?.filter((employee) => {
    const matchingName =
      search === "" ||
      employee?.user_name?.toLowerCase().includes(search.toLowerCase());
    return matchingName;
  });

  return (
    <Layout>
      <div>
        <div>
          <p className="text-3xl font-bold my-5">Employee's <br/> Daily Reports</p>
        </div>
        <div>
          <div className="flex justify-end">
            <div className="flex items-center gap-2 pl-4 max-w-[200px] my-10 mx-10 rounded-lg bg-white border border-black hover:border-black focus:border-black  border-solid border-2 shadow-xl">
              <IoMdSearch fontSize="1.125rem" color="#000000" />
              <input
                type="text"
                className="flex h-10 pe-4 pb-1 w-full rounded-lg outline-none text-sm"
                placeholder="Search Employee"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEmployee.map((employee) => (
            <div
              key={employee.user_id}
              className="card bg-black text-white w-50 mb-3 h-lg"
            >
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
                    <button className="btn btn-active btn-md mt-2 bg-white text-black btn-4/12 justify-end shadow-lg">
                      Detail
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

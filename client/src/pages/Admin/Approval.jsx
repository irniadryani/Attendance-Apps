import React from "react";
import Layout from "../Layout";
import { getAllLeavesFn } from "../../api/leaves/leaves";
import { getAllPermissionFn } from "../../api/permission/permission";
import TodayApprovalTable from "../../components/Admin/TodayApprovalTable";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function Approval() {
  const {
    data: dataPermission,
    refetch: refetchPermission,
    isLoading: loadingPermission,
  } = useQuery({
    queryKey: ["permission"],
    queryFn: getAllPermissionFn,
  });

  const {
    data: dataLeaves,
    refetch: refetchLeaves,
    isLoading: loadingLeaves,
  } = useQuery({
    queryKey: ["leaves"],
    queryFn: getAllLeavesFn,
  });

  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const today = formatDate(new Date());

  const calculateTodayPermission = () => {
    if (!loadingPermission && dataPermission) {
      return dataPermission.filter(
        (entry) =>
          formatDate(entry.start_date) === today && entry.status === "Submitted"
      );
    }
    return [];
  };

  const calculateTodayLeaves = () => {
    if (!loadingLeaves && dataLeaves) {
      return dataLeaves.filter(
        (entry) =>
          formatDate(entry.start_date) === today && entry.status === "Submitted"
      );
    }
    return [];
  };

  const todayPermission = calculateTodayPermission();
  const todayLeaves = calculateTodayLeaves();

  return (
    <Layout>
      <div>
        <div>
          <div className="flex flex-row gap-10 my-5">
            <div className="card bg-base shadow-xl text-gray-700 w-56 h-ful">
              <div className="flex flex-col items-start text-start ml-5 justify-between">
                <p className="font-bold text-lg">Permission Queue</p>
                <h2 className="font-bold text-black text-6xl">
                  {todayPermission.length}
                </h2>
                <p className="font-medium text-xs py-2 items-end">Permission</p>
              </div>
            </div>
            <div className="card bg-base shadow-xl text-gray-700 w-56 h-ful">
              <div className="flex flex-col items-start text-start ml-5 justify-between">
                <p className="font-bold text-lg">Leaves Queue</p>
                <h2 className="font-bold text-black text-6xl">
                  {todayLeaves.length}
                </h2>
                <p className="font-medium text-xs py-2 items-end">Leave</p>
              </div>
            </div>
          </div>
        </div>
        <Link to="/history-approval">
          <div className="flex justify-end my-5 mx-12">
            <button className="btn btn-active bg-black text-white">
              History
            </button>
          </div>
        </Link>
        <div>
          <TodayApprovalTable />
        </div>
      </div>
    </Layout>
  );
}

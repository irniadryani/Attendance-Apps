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
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const today = formatDate(new Date());

  const calculateTodayPermission = () => {
    if (!loadingPermission && dataPermission) {
      return dataPermission.filter(
        (entry) => formatDate(entry.start_date) === today && entry.status === "Submitted"
      );
    }
    return [];
  };

  const calculateTodayLeaves = () => {
    if (!loadingLeaves && dataLeaves) {
      return dataLeaves.filter(
        (entry) => formatDate(entry.start_date) === today  && entry.status === "Submitted"
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
            <div className="card bg-black text-neutral-content w-56 h-24">
              <div className="flex flex-col items-center text-center justify-between">
                <h2 className="font-bold text-6xl">{todayPermission.length}</h2>
                <p className="font-bold text-lg">Permission Queue</p>
              </div>
            </div>
            <div className="card bg-black text-neutral-content w-56 h-24">
              <div className="flex flex-col items-center text-center justify-between">
                <h2 className="font-bold text-6xl">{todayLeaves.length}</h2>
                <p className="font-bold text-lg">Leaves Queue</p>
              </div>
            </div>
          </div>
        </div>
        <Link to="/history-approval">
          <div className="flex justify-end my-5">
            <button className="btn btn-active btn-neutral">History</button>
          </div>
        </Link>
        <div>
          <TodayApprovalTable />
        </div>
      </div>
    </Layout>
  );
}

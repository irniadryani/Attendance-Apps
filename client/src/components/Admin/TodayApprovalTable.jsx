import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLeavesFn } from "../../api/leaves/leaves";
import { getAllPermissionFn } from "../../api/permission/permission";
import StatusApproval from "./StatusApproval";

export default function TodayApprovalTable() {
  const [expandedRows, setExpandedRows] = useState({});

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
        (entry) => formatDate(entry.start_date) === today
      );
    }
    return [];
  };

  const calculateTodayLeaves = () => {
    if (!loadingLeaves && dataLeaves) {
      return dataLeaves.filter((entry) => entry.status === "Submitted");
    }
    return [];
  };

  const todayPermission = calculateTodayPermission();
  const todayLeaves = calculateTodayLeaves();

  const toggleRowExpansion = (id) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id],
    }));
  };

  return (
    <div>
      <p className="font-bold text-lg mx-12 my-5">Leaves Approval</p>
      <div className="overflow-x-auto flex justify-center">
        <table className="table table-zebra w-full max-w-4xl">
          <thead>
            <tr className="text-sm text-white bg-black">
              <th>No</th>
              <th>Name</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {todayLeaves.map((leave, index) => (
              <tr className="hover font-base text-sm text-black" key={leave.id}>
                <td>{index + 1}</td>
                <td>{leave.user_name}</td>
                <td>
                  <StatusApproval
                    type="leave"
                    refetch={refetchLeaves}
                    status={leave.status}
                    id={leave.id}
                  />
                </td>
                <td>{leave.start_date}</td>
                <td>{leave.end_date}</td>
                <td>
                  {expandedRows[leave.id]
                    ? leave.notes
                    : `${leave.notes.substring(0, 20)}`}
                  {leave.notes.length > 20 && (
                    <button
                      className="btn btn-xs bg-black text-white ml-3"
                      onClick={() => toggleRowExpansion(leave.id)}
                    >
                      {expandedRows[leave.id] ? "Show less" : "Show more"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-20">
        <p className="font-bold text-lg mx-12 my-5">Today Permission</p>
        <div className="overflow-x-auto flex justify-center">
          <table className="table table-zebra w-full max-w-4xl">
            <thead>
              <tr className="text-sm text-white bg-black">
                <th>No</th>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Proof</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {todayPermission.map((permission, index) => (
                <tr
                  className="hover font-base text-sm text-black"
                  key={permission.id}
                >
                  <td>{index + 1}</td>
                  <td>{permission.user_name}</td>
                  <td>{permission.start_date}</td>
                  <td>{permission.end_date}</td>
                  <td>
                    {permission?.file?.endsWith(".pdf") ? (
                      <iframe
                        src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                          /\/$/,
                          ""
                        )}${permission?.url}`}
                        title="PDF Viewer"
                        width="100%"
                        height="200px"
                      />
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                          /\/$/,
                          ""
                        )}${permission?.url}`}
                        alt="proof"
                        className="h-auto w-60 object-cover object-center"
                      />
                    )}
                  </td>

                  <td>
                    {expandedRows[permission.id]
                      ? permission.notes
                      : `${permission.notes.substring(0, 20)}`}
                    {permission.notes.length > 20 && (
                      <button
                        className="btn btn-xs bg-black text-white ml-3"
                        onClick={() => toggleRowExpansion(permission.id)}
                      >
                        {expandedRows[permission.id]
                          ? "Show less"
                          : "Show more"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

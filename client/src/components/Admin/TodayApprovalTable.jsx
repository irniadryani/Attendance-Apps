import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLeavesFn } from "../../api/leaves/leaves";
import { getAllPermissionFn } from "../../api/permission/permission";
import StatusApproval from "./StatusApproval";

export default function TodayApprovalTable() {
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
        (entry) => formatDate(entry.start_date) === today
      );
    }
    return [];
  };

  const calculateTodayLeaves = () => {
    if (!loadingLeaves && dataLeaves) {
      return dataLeaves.filter(
        (entry) => formatDate(entry.start_date) === today
      );
    }
    return [];
  };

  const todayPermission = calculateTodayPermission();
  const todayLeaves = calculateTodayLeaves();

  return (
    <div>
      <div className="overflow-x-auto flex justify-center">
        <table className="table table-zebra w-full max-w-4xl">
          <thead>
            <tr className="text-sm text-white bg-black">
              <th>No</th>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th className="w-56">Notes</th>
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
                <td>Permission</td>
                <td>
                  <StatusApproval
                    type="permission"
                    refetch={refetchPermission}
                    status={permission.status}
                    id={permission.id}
                  />
                </td>
                <td>{permission.start_date}</td>
                <td>{permission.end_date}</td>
                <td>{permission.notes}</td>
              </tr>
            ))}
            {todayLeaves.map((leave, index) => (
              <tr className="hover font-base text-sm text-black" key={leave.id}>
                <td>{index + 1}</td>
                <td>{leave.user_name}</td>
                <td>Leave</td>
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
                <td>{leave.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

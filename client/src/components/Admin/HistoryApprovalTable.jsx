import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllLeavesFn } from "../../api/leaves/leaves";
import { getAllPermissionFn } from "../../api/permission/permission";

export default function HistoryApprovalTable() {
  const {
    data: dataPermission,
    refetch: refetchPermission,
    isLoading: loadingPermission,
  } = useQuery({
    queryKey: ["allPermission"],
    queryFn: getAllPermissionFn,
  });

  const {
    data: dataLeaves,
    refetch: refetchLeaves,
    isLoading: loadingLeaves,
  } = useQuery({
    queryKey: ["allLeaves"],
    queryFn: getAllLeavesFn,
  });
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
            {dataPermission?.map((permission, index) => (
              <tr
                className="hover font-base text-sm text-black"
                key={permission.id}
              >
                <td>{index + 1}</td>
                <td>{permission.user_name}</td>
                <td>Permission</td>
                <td>{permission.status}</td>
                <td>{permission.start_date}</td>
                <td>{permission.end_date}</td>
                <td>{permission.notes}</td>
              </tr>
            ))}
            {dataLeaves?.map((leave, index) => (
              <tr className="hover font-base text-sm text-black" key={leave.id}>
                <td>{index + 1}</td>
                <td>{leave.user_name}</td>
                <td>Leave</td>
                <td>{leave.status}</td>
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

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getAllLeavesFn } from "../../api/leaves/leaves";
import { getAllPermissionFn } from "../../api/permission/permission";
import { IoMdSearch } from "react-icons/io";

export default function HistoryApprovalTable() {
  const [expandedRows, setExpandedRows] = useState({});
  const [search, setSearch] = useState("");

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

  const filteredLeaves = dataLeaves?.filter((leave) => {
    const matchingName =
      search === "" ||
      leave?.user_name?.toLowerCase().includes(search.toLowerCase());

    return matchingName;
  });

  const filteredPermission = dataPermission?.filter((permission) => {
    const matchingName =
      search === "" ||
      permission?.user_name?.toLowerCase().includes(search.toLowerCase());

    return matchingName;
  });

  const toggleRowExpansion = (id) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id],
    }));
  };

  return (
    <div>
      <div className="flex justify-end">
        <div className="flex items-center gap-2 pl-4 max-w-[200px] my-10 mx-10 rounded-lg bg-white border border-black hover:border-black focus:border-black border-solid border-2 shadow-xl">
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
      <p className="font-bold text-lg mx-12 my-5">History Employee Leaves</p>
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
            {filteredLeaves?.map((leave, index) => (
              <tr className="hover font-base text-sm text-black" key={leave.id}>
                <td>{index + 1}</td>
                <td>{leave.user_name}</td>
                <td>{leave.status}</td>
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
        <p className="font-bold text-lg mx-12 my-5">
          History Employee Permissions
        </p>
        <div className="overflow-x-auto flex justify-center">
          <table className="table table-zebra w-full max-w-4xl">
            <thead>
              <tr className="text-sm text-white bg-black">
                <th>No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Proof</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermission?.map((permission, index) => (
                <tr
                  className="hover font-base text-sm text-black"
                  key={permission.id}
                >
                  <td>{index + 1}</td>
                  <td>{permission.user_name}</td>
                  <td>{permission.status}</td>
                  <td>{permission.start_date}</td>
                  <td>{permission.end_date}</td>
                  <td>
                    {" "}
                    <img
                      src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                        /\/$/,
                        ""
                      )}${permission?.url}`}
                      alt="proof"
                      className="h-auto w-60 object-cover object-center"
                    />
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

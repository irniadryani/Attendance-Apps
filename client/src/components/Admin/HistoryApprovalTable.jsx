import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLeavesFn } from "../../api/leaves/leaves";
import { getAllPermissionFn } from "../../api/permission/permission";
import { IoMdSearch } from "react-icons/io";
import { useLocation } from "react-router-dom";

export default function HistoryApprovalTable() {
  const [expandedRows, setExpandedRows] = useState({});
  const [search, setSearch] = useState("");
  const [currentPageLeaves, setCurrentPageLeaves] = useState(1);
  const [currentPagePermission, setCurrentPagePermission] = useState(1);
  const recordsPerPage = 5;

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

  const location = useLocation();
  const currentPaginationTable = location.state?.currentPaginationTable || 1;

  useEffect(() => {
    if (
      currentPaginationTable === undefined ||
      currentPaginationTable === null
    ) {
      setCurrentPageLeaves(1);
    } else {
      setCurrentPageLeaves(currentPaginationTable);
    }
  }, [currentPaginationTable]);

  useEffect(() => {
    if (
      currentPaginationTable === undefined ||
      currentPaginationTable === null
    ) {
      setCurrentPagePermission(1);
    } else {
      setCurrentPagePermission(currentPaginationTable);
    }
  }, [currentPaginationTable]);
  // Calculate total pages for leaves and permissions
  const leavesPageCount = Math.ceil(
    (filteredLeaves?.length || 0) / recordsPerPage
  );
  const permissionsPageCount = Math.ceil(
    (filteredPermission?.length || 0) / recordsPerPage
  );

  // Pagination handlers
  const prePageLeaves = () => {
    if (currentPageLeaves > 1) {
      setCurrentPageLeaves(currentPageLeaves - 1);
    }
  };

  const prePagePermission = () => {
    if (currentPagePermission > 1) {
      setCurrentPagePermission(currentPagePermission - 1);
    }
  };

  const changeCPageLeaves = (page) => {
    setCurrentPageLeaves(page);
  };

  const changeCPagePermission = (page) => {
    setCurrentPagePermission(page);
  };

  const nextPageLeaves = () => {
    if (currentPageLeaves < leavesPageCount) {
      setCurrentPageLeaves(currentPageLeaves + 1);
    }
  };

  const nextPagePermission = () => {
    if (currentPagePermission < permissionsPageCount) {
      setCurrentPagePermission(currentPagePermission + 1);
    }
  };

  // Filter records based on current page and search
  const currentLeaves =
    filteredLeaves?.slice(
      (currentPageLeaves - 1) * recordsPerPage,
      currentPageLeaves * recordsPerPage
    ) || [];

  const currentPermissions =
    filteredPermission?.slice(
      (currentPagePermission - 1) * recordsPerPage,
      currentPagePermission * recordsPerPage
    ) || [];

  if (dataPermission?.file === null) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>No proof</p>
      </div>
    );
  }

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
            {currentLeaves.map((leave, index) => (
              <tr className="hover font-base text-sm text-black" key={leave.id}>
                <td>{(currentPageLeaves - 1) * recordsPerPage + index + 1}</td>
                <td>{leave.user_name}</td>
                <td>
                  <p
                    className={`font-semibold text-sm ${
                      leave.status === "Approved"
                        ? "text-green-600"
                        : leave.status === "Rejected"
                        ? "text-red-600"
                        : leave.status === "Submitted"
                        ? "text-yellow-600"
                        : leave.status === "Canceled"
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    {leave.status}
                  </p>
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

      <nav className="flex justify-center mt-5">
        <div className="flex items-center gap-4 mt-2 justify-center lg:justify-end">
          <button
            disabled={currentPageLeaves === 1}
            onClick={prePageLeaves}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Prev
          </button>
          {Array.from({ length: leavesPageCount }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => changeCPageLeaves(index + 1)}
              className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase ${
                currentPageLeaves === index + 1
                  ? "bg-[#000000] text-white"
                  : "text-gray-900"
              } transition-all hover:bg-[#000000] hover:text-white active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPageLeaves === leavesPageCount}
            onClick={nextPageLeaves}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Next
          </button>
        </div>
      </nav>

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
                <th>Start Date</th>
                <th>End Date</th>
                <th>Proof</th>
                <th style={{ maxWidth: "20px" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {currentPermissions.map((permission, index) => (
                <tr
                  className="hover font-base text-sm text-black"
                  key={permission.id}
                >
                  <td>
                    {(currentPagePermission - 1) * recordsPerPage + index + 1}
                  </td>
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
        <nav className="flex justify-center mt-5">
          <div className="flex items-center gap-4 mt-2 justify-center lg:justify-end">
            <button
              disabled={currentPagePermission === 1}
              onClick={prePagePermission}
              className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Prev
            </button>
            {Array.from({ length: permissionsPageCount }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => changeCPagePermission(index + 1)}
                className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase ${
                  currentPagePermission === index + 1
                    ? "bg-[#000000] text-white"
                    : "text-gray-900"
                } transition-all hover:bg-[#000000] hover:text-white active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPagePermission === permissionsPageCount}
              onClick={nextPagePermission}
              className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

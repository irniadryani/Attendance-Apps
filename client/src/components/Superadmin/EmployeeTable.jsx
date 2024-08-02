import React, { useEffect, useState } from "react";
import { RiInformation2Fill } from "react-icons/ri";
import RoleUser from "./RoleUser";
import StatusEmployee from "../Admin/StatusEmployee";

export default function EmployeeTable({
  dataUser,
  refetch,
  currentPaginationTable,
}) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(currentPaginationTable || 1);

  // Update currentPage when currentPaginationTable changes
  useEffect(() => {
    if (
      currentPaginationTable === undefined ||
      currentPaginationTable === null
    ) {
      setCurrentPage(1);
    }
  }, [currentPaginationTable]);

  // Calculate employees to display based on currentPage and search
  const recordsPerPage = 10;
  const npage = Math.ceil((dataUser?.length || 0) / recordsPerPage);
  const numbers = Array.from({ length: npage }, (_, index) => index + 1);

  // Pagination handlers
  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCPage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage < npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter employees based on search and pagination
  const filteredEmployees = dataUser
    ? dataUser.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
      )
    : [];

  // Show loading or empty state when dataUser is undefined or null
  if (!dataUser) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto flex justify-center">
        <table className="table table-zebra w-full max-w-4xl rounded-xl">
          <thead>
            <tr className="text-sm rounded-lg bg-black text-white">
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr
                className="hover font-base text-sm text-black"
                key={employee.id}
              >
                <td>{index + 1 + (currentPage - 1) * recordsPerPage}</td>
                <td>{employee.full_name}</td>
                <td>{employee.email}</td>
                <td>
                  <RoleUser
                    userId={employee.id}
                    currentRole={employee.role_name}
                    refetch={refetch}
                  />
                </td>
                <td>
                  <StatusEmployee
                    userId={employee.id}
                    currentStatus={
                     employee.status === false ? 'Inactive' : 'Active'
                    }
                    refetch={refetch}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="flex justify-center mt-5">
        <div className="flex items-center gap-4 mt-2 justify-center lg:justify-end">
          <button
            disabled={currentPage === 1}
            onClick={prePage}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Prev
          </button>
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => changeCPage(num)}
              className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase ${
                currentPage === num
                  ? "bg-[#000000] text-white"
                  : "text-gray-900"
              } transition-all hover:bg-[#000000] hover:text-white active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
            >
              {num}
            </button>
          ))}
          <button
            disabled={currentPage === npage}
            onClick={nextPage}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Next
          </button>
        </div>
      </nav>
      <RoleUser />
    </div>
  );
}

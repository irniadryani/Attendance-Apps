import React, { useState } from "react";
import { getAllUserFn } from "../../api/user/user";
import { useQuery } from "@tanstack/react-query";
import { RiInformation2Fill } from "react-icons/ri";
import DetailEmployee from "./DetailEmployee";

export default function EmployeeTable() {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const {
    data: dataUser,
    refetch: refetchUser,
    isLoading: loadingUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getAllUserFn,
  });

  console.log("data", dataUser);

  return (
    <div>
      <div className="overflow-x-auto flex justify-center">
        <table className="table table-zebra w-full max-w-4xl rounded-xl">
          <thead>
            <tr className=" text-sm rounded-lg bg-black text-white ">
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {dataUser?.map((user, index) => (
              <tr className="hover font-base text-sm text-black " key={index}>
                <th>{index + 1}</th>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => {
                        setSelectedEmployeeId(user?.id);
                        document?.getElementById("detail_employee_modal")?.showModal();
                      }}
                  >
                    <RiInformation2Fill fontSize="1.125rem" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DetailEmployee employeeId={selectedEmployeeId} />
    </div>
  );
}

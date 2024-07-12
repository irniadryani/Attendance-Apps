import React from "react";
import EmployeeTable from "../../components/Admin/EmployeeTable";
import Layout from "../Layout";
import { getAllUserFn } from "../../api/user/user";
import { useQuery } from "@tanstack/react-query";

export default function Employee() {
  const {
    data: dataUser,
    refetch: refetchUser,
    isLoading: loadingUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getAllUserFn,
  });

  return (
    <Layout>
      <div>
        <div className="card bg-black text-neutral-content w-56 h-24 mb-10">
          <div className="flex flex-col items-center text-center justify-between">
            {!loadingUser && dataUser.length !== undefined && (
              <h2 className="font-bold text-6xl items-end">{dataUser.length}</h2>
            )}
            <p className="font-bold text-lg items-end">Total Employee</p>
          </div>
        </div>
      </div>
      <div>
        <EmployeeTable />
      </div>
    </Layout>
  );
}

// {!loadingParticipants &&
//     dataParticipants.length !== undefined && (
//       <h1 className="font-bold text-8xl text-white flex justify-start mb-3">
//         {dataParticipants.length}
//       </h1>
//     )}

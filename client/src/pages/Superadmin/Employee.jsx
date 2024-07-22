import React, { useState } from "react";
import Layout from "../Layout";
import EmployeeTable from "../../components/Superadmin/EmployeeTable";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllUserFn, updateRoleUserFn } from "../../api/user/user";
import { IoMdSearch } from "react-icons/io";

export default function Employee() {
  const [search, setSearch] = useState("");

  const location = useLocation();

  const {
    data: dataUser,
    refetch: refetchUser,
    isLoading: loadingUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getAllUserFn,
  });

  const filteredEmployee = dataUser?.filter((employee) => {
    const matchingName =
      search === "" ||
      employee?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      employee?.email?.toLowerCase().includes(search.toLowerCase());

    return matchingName;
  });

  return (
    <Layout>
      <div className="flex items-center gap-2 pl-4 max-w-[200px] my-10 mx-10 rounded-lg bg-white border border-black hover:border-black focus:border-black  border-solid border-2 shadow-xl">
        <IoMdSearch fontSize="1.125rem" color="#000000" />
        <input
          type="text"
          className="flex h-10 pe-4 pb-1 w-full rounded-lg outline-none text-sm"
          placeholder="Search Employee"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <EmployeeTable
        refetch={refetchUser}
        dataUser={filteredEmployee}
        currentPaginationTable={
          location.state === null || location.state === undefined
            ? null
            : location.state.currentPaginationTable
        }
      />
    </Layout>
  );
}

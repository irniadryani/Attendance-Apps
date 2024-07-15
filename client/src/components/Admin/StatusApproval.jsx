import React, { useState } from "react";
import { updateLeavesFn } from "../../api/leaves/leaves";
import { updatePermissionFn } from "../../api/permission/permission";
import Swal from "sweetalert2";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";

export default function StatusApproval({ type, status, id, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setKey((prevKey) => prevKey + 1);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const updateStatusFn = type === "leave" ? updateLeavesFn : updatePermissionFn;

  const handleStatusResponse = useMutation({
    mutationFn: ({ id, status }) => updateStatusFn(id, status),
    onSuccess: (res) => {
      console.log(res);
      refetch();
      closeDropdown();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleConfirmStatus = async (newStatus) => {
    try {
      const result = await Swal.fire({
        title: `Update status to ${newStatus}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });
  
      if (result.isConfirmed) {
        await handleStatusResponse.mutateAsync({ id, status: newStatus });
        Swal.fire({
          title: "Status Updated!",
          text: "The status has been updated.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
      });
    }
  };
  

  return (
    <details
      className="dropdown"
      key={key}
      open={isOpen}
      onClick={toggleDropdown}
    >
      <summary className="m-1 btn">
        <div className="flex gap-2 items-center">
          <div className="flex gap-2 items-center">
            <div className="rounded-full w-2 h-2" style={{ backgroundColor: status === "Approved" ? 'green' : 'red' }}></div>
            <p className={`font-semibold text-sm ${status === "Approved" ? 'text-green-600' : 'text-red-600'}`}>{status}</p>
          </div>
          <MdOutlineKeyboardArrowDown />
        </div>
      </summary>
      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 mt-2">
        {["Submitted", "Approved", "Rejected", "Canceled"].map((statusOption) => (
          <li onClick={() => handleConfirmStatus(statusOption)} key={statusOption}>
            <div className="flex gap-2 items-center">
              <p className={`font-semibold text-sm ${statusOption === "Approved" ? 'text-green-600' : 'text-red-600'}`}>{statusOption}</p>
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}

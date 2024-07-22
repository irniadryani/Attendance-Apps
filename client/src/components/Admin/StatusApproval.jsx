import React, { useState } from "react";
import { updateLeavesFn } from "../../api/leaves/leaves";
import { updatePermissionFn } from "../../api/permission/permission";
import Swal from "sweetalert2";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function StatusApproval({ type, status, id, refetch }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleStatusResponse = useMutation({
    mutationFn: (data) => updateLeavesFn(id, data),
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
        const data = {
          status: newStatus,
        };
        await handleStatusResponse.mutateAsync(data);
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
    <Menu>
      <MenuButton className="m-1 flex flex-row gap-2 items-center bg-base-100 p-2 rounded-md">
        <div className="flex gap-2 items-center">
          <div
            className="rounded-full w-2 h-2"
            style={{
              backgroundColor: status === "Approved" ? "green" : "red",
            }}
          ></div>
          <p
            className={`font-semibold text-sm ${
              status === "Approved" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        </div>
        <MdOutlineKeyboardArrowDown />
      </MenuButton>
      <MenuItems
        anchor="bottom"
        as="div"
        className="p-2 w-40 shadow bg-base-100 mt-2 rounded-md"
      >
        {[
          { name: "Submitted", color: "yellow" },
          { name: "Approved", color: "green" },
          { name: "Rejected", color: "red" },
          { name: "Canceled", color: "blue" },
        ].map((statusOption) => (
          <MenuItem
            onClick={() => handleConfirmStatus(statusOption.name)}
            key={statusOption}
          >
            <div className="p-2 flex gap-2 items-center">
              <p
                className={`font-semibold text-sm ${
                  statusOption.color === "yellow" && "text-yellow-600"
                } ${statusOption.color === "green" && "text-green-600"} ${
                  statusOption.color === "red" && "text-red-600"
                } ${statusOption.color === "blue" && "text-blue-600"}`}
              >
                {statusOption.name}
              </p>
            </div>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}

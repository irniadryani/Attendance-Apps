import React from "react";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { changeStatusUserFn } from "../../api/user/user";

export default function StatusEmployee({ userId, currentStatus, refetch }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleStatusResponse = useMutation({
    mutationFn: (data) => changeStatusUserFn(userId, data),
    onSuccess: (res) => {
      console.log(res);
      refetch();
      closeDropdown();
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
      });
    },
  });
  const handleConfirmStatus = async (newStatus) => {
    try {
      const result = await Swal.fire({
        title: `Change status to ${newStatus}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });
  
      if (result.isConfirmed) {
        const data = {
          status: newStatus, // Include the updated status here
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
  
  
  const statusOptions = ["Active", "Inactive"];

  return (
    <Menu>
    <MenuButton className="m-1 flex flex-row gap-2 items-center bg-base-100 p-2 rounded-md">
      <div className="flex gap-2 items-center">
        <p className="font-semibold text-sm">
          {currentStatus}
        </p>
      </div>
      <MdOutlineKeyboardArrowDown />
    </MenuButton>
    <MenuItems
      as="div"
      className="p-2 w-40 shadow bg-base-100 mt-2 rounded-md"
    >
      <MenuItem
        onClick={() => handleConfirmStatus(true)}
        disabled={currentStatus === true}
      >
        <div className="p-2 flex gap-2 items-center">
          <p className={`font-semibold text-sm ${currentStatus === true ? "text-gray-400" : "text-green-600"}`}>
            Active
          </p>
        </div>
      </MenuItem>
      <MenuItem
        onClick={() => handleConfirmStatus(false)}
        disabled={currentStatus === false}
      >
        <div className="p-2 flex gap-2 items-center">
          <p className={`font-semibold text-sm ${currentStatus === false ? "text-gray-400" : "text-red-600"}`}>
            Inactive
          </p>
        </div>
      </MenuItem>
    </MenuItems>
  </Menu>

    // <Menu>
    //   <MenuButton className="m-1 flex flex-row gap-2 items-center bg-base-100 p-2 rounded-md">
    //     <div className="flex gap-2 items-center">
    //       <p className="font-semibold text-sm">{currentStatus}</p>
    //     </div>
    //     <MdOutlineKeyboardArrowDown />
    //   </MenuButton>
    //   <MenuItems
    //     anchor="bottom"
    //     as="div"
    //     className="p-2 w-40 shadow bg-base-100 mt-2 rounded-md"
    //   >
    //     {statusOptions.map((status) => (
    //       <MenuItem onClick={() => handleConfirmStatus(status)} key={status}>
    //         <div className="p-2 flex gap-2 items-center">
    //           <p className="font-semibold text-sm">{status}</p>
    //         </div>
    //       </MenuItem>
    //     ))}
    //   </MenuItems>
    // </Menu>
  );
}

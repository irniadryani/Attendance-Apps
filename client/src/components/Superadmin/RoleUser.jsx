import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateRoleUserFn } from '../../api/user/user';
import Swal from 'sweetalert2';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

export default function RoleUser({ userId, currentRole, refetch }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleStatusResponse = useMutation({
    mutationFn: (data) => updateRoleUserFn(userId, data),
    onSuccess: (res) => {
      console.log(res);
      refetch();
      closeDropdown();
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update role',
        icon: 'error',
      });
    },
  });

  const handleConfirmStatus = async (newRole) => {
    try {
      const result = await Swal.fire({
        title: `Update role to ${newRole}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
      });

      if (result.isConfirmed) {
        const data = {
          role_name: newRole,
        };
        await handleStatusResponse.mutateAsync(data);
        Swal.fire({
          title: 'Role Updated!',
          text: 'The role has been updated.',
          icon: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update role',
        icon: 'error',
      });
    }
  };

  const roles = ['User', 'Admin', 'Superadmin'];

  return (
    <Menu>
      <MenuButton className="m-1 flex flex-row gap-2 items-center bg-base-100 p-2 rounded-md">
        <div className="flex gap-2 items-center">
          <p className="font-semibold text-sm">{currentRole}</p>
        </div>
        <MdOutlineKeyboardArrowDown />
      </MenuButton>
      <MenuItems
        anchor="bottom"
        as="div"
        className="p-2 w-40 shadow bg-base-100 mt-2 rounded-md"
      >
        {roles.map((role) => (
          <MenuItem onClick={() => handleConfirmStatus(role)} key={role}>
            <div className="p-2 flex gap-2 items-center">
              <p className="font-semibold text-sm">{role}</p>
            </div>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}

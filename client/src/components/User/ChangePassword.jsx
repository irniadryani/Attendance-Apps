import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { changePasswordUserFn, getUserByIdFn } from "../../api/user/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function ChangePassword() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: dataSingleUser,
    refetch: refetchSingleUser,
    isLoading: loadingSingleUser,
  } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserByIdFn(user?.id),
    enabled: user !== null

  });

  const [showCurPassword, setShowCurPassword] = useState();
  const toggleCurPassword = () => setShowCurPassword((prev) => !prev);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const [showConfPassword, setShowConfPassword] = useState(false);
  const toggleConfPassword = () => setShowConfPassword((prev) => !prev);

  const {
    register,
    handleSubmit: submitChangePassword,
    formState: { errors },
    reset: resetChangePassword,
    getValues,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confPassword: "",
    },
  });

  useEffect(() => {
    if (user?.id !== null || user?.id !== undefined) {
      refetchSingleUser();
    }
  }, [user?.id, refetchSingleUser]);

  useEffect(() => {
    if (!loadingSingleUser && dataSingleUser) {
      resetChangePassword({
        newPassword: dataSingleUser.newPassword,
        confPassword: dataSingleUser.confPassword,
      });
    }
  }, [loadingSingleUser, dataSingleUser, resetChangePassword]);

  const handleChangePassword = useMutation({
    mutationFn: (data) => changePasswordUserFn(user?.id, data),

    onMutate() {},
    onSuccess: async (res) => {
      console.log(res);
      await document?.getElementById("change_password_modal").close();
      await refetchSingleUser();
      resetChangePassword();
      await Swal.fire({
        icon: "success",
        title: "Password Changed!",
        text: "The password has been successfully changed.",
      });
    },
    onError: async (error) => {
      console.log(error);
      await document?.getElementById("change_password_modal").close();
      resetChangePassword();
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to change password.",
      });
    },
  });

  const updatePassword = (data) => {
    const userData = new FormData();
    userData.append("currentPassword", data.currentPassword);
    userData.append("newPassword", data.newPassword);
    userData.append("confPassword", data.confPassword);

    handleChangePassword.mutateAsync(userData);
  };

  return (
    <div>
      <dialog id="change_password_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Create New Password</h3>
          <p className="mt-2">
            Your new password must be different from previous used password
          </p>

          <FormProvider {...useForm}>
            <form
              onSubmit={submitChangePassword(updatePassword)}
              className="flex flex-col gap-2 mt-2"
            >
              <div className="w-full max-w-2xl ">
                <div className="form-control relative flex">
                  <label className="label">
                    <span className="label-text">Current Password</span>
                  </label>
                  <div>
                    <input
                      type={showCurPassword ? "text" : "password"}
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-2xl rounded-lg pr-10"
                      {...register("currentPassword", {
                        required: "Current Password must be provided!",
                        minLength: {
                          value: 8,
                          message:
                            "Current Password must contain min 8 characters!",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCurPassword();
                      }}
                      className="focus:ring-primary-500 absolute top-1/2 -translate-y-1/2 right-3 flex items-center rounded-lg p-1 focus:outline-none focus:ring mt-5"
                    >
                      {showCurPassword ? (
                        <HiEyeOff className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                      ) : (
                        <HiEye className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm mt-3 text-red-600">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <div className="form-control w-full max-w-2xl relative">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-2xl rounded-lg pr-10"
                      {...register("newPassword", {
                        required: "New Password must be provided!",
                        minLength: {
                          value: 8,
                          message:
                            "New Password must contain min 8 characters!",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        togglePassword();
                      }}
                      className="focus:ring-primary-500 absolute top-1/2 -translate-y-1/2 right-3 flex items-center rounded-lg p-1 focus:outline-none focus:ring mt-5"
                    >
                      {showPassword ? (
                        <HiEyeOff className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                      ) : (
                        <HiEye className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.newPassword && (
                  <p className="text-sm mt-3 text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <div className="form-control w-full max-w-2xl relative">
                  <label className="label">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <input
                    type={showConfPassword ? "text" : "password"}
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-2xl rounded-lg pr-10"
                    {...register("confPassword", {
                      required: "Confirm Password must be provided!",
                      minLength: {
                        value: 8,
                        message:
                          "Confirm Password must contain min 8 characters!",
                      },
                      validate: {
                        matchesPreviousPassword: (value) => {
                          const { newPassword } = getValues();
                          return (
                            newPassword === value || "Passwords should match!"
                          );
                        },
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleConfPassword();
                    }}
                    className="focus:ring-primary-500 absolute top-1/2 -translate-y-1/2 right-3 flex items-center rounded-lg p-1 focus:outline-none focus:ring mt-5"
                  >
                    {showConfPassword ? (
                      <HiEyeOff className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                    ) : (
                      <HiEye className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confPassword && (
                  <p className="text-sm mt-3 text-red-600">
                    {errors.confPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                // onClick={() => {
                //   document.getElementById("change_password_modal").close();
                // }}
                className="btn btn-l bg-black mt-5 rounded-lg hover:bg-white hover:text-black text-white items-center w-42"
              >
                Change Password
              </button>
            </form>
          </FormProvider>
        </div>
      </dialog>
    </div>
  );
}

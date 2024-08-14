import React, { useState } from "react";
import { getUserByIdFn, resetPasswordFn } from "../../api/user/user";
import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import DetailAttendanceEmployee from "./DetailAttendanceEmployee";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

export default function DetailEmployee({ employeeId }) {
  const [employeeDetail, setEmployeeDetail] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch user details
  const {
    data: dataSingleUser,
    refetch: refetchSingleUser,
    isLoading: loadingSingleUser,
  } = useQuery({
    queryKey: ["user", employeeId],
    queryFn: async () => {
      const data = await getUserByIdFn(employeeId);
      setEmployeeDetail(data);
      return data;
    },
    enabled: employeeId !== null,
  });

  // Handle password reset
  const handleResetPasswordFn = useMutation({
    mutationFn: () => resetPasswordFn(employeeId),
    onMutate: async () => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reset it!",
      });

      if (!result.isConfirmed) {
        throw new Error("Reset password action cancelled");
      }
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Password Reset!",
        text: "The password has been reset to default.",
      });
      refetchSingleUser();
    },
    onError: (error) => {
      let errorMessage;

      if (error.response && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = error.message || "An unexpected error occurred";
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    },
  });

  if (!employeeDetail) {
    return null;
  }

  return (
    <div>
      <dialog id="detail_employee_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="card lg bg-base-100 m-2">
            <div className="card-body">
              <div className="tabs tabs-boxed">
                <button
                  className={`tab ${activeTab === 0 ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(0)}
                >
                  Personal Info
                </button>
                <button
                  className={`tab ${activeTab === 1 ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(1)}
                >
                  Attendance
                </button>
              </div>
              <div className="mt-5">
                {activeTab === 0 && (
                  <div className="flex flex-row gap-20">
                    <div>
                      <figure>
                        <img
                          src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                            /\/$/,
                            ""
                          )}${employeeDetail?.url}`}
                          alt="Album"
                          className="h-auto w-60 object-cover object-center"
                        />
                      </figure>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-row">
                        <p className="w-24 font-semibold">Name</p>
                        <p className="w-36 font-medium text-start">
                          {employeeDetail.full_name}
                        </p>
                      </div>
                      <div className="flex flex-row">
                        <p className="w-24 font-semibold">Email</p>
                        <div className="text-start flex justify-start">
                          <a
                            href={`mailto:${employeeDetail.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-36 font-medium text-start"
                          >
                            {employeeDetail.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <p className="w-24 font-semibold">Phone Number</p>
                        <div className="text-start flex justify-start">
                          <Link
                            target="_blank"
                            to={`https://wa.me/${employeeDetail.phone_number}`}
                            style={{ color: "#03346E" }}
                          >
                            <p className="w-36 font-medium text-start no-underline hover:underline">
                              {employeeDetail.phone_number}
                            </p>
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <p className="w-24 font-semibold">Position</p>
                        <p className="w-36 font-medium text-start">
                          {employeeDetail.position}
                        </p>
                      </div>
                      <div>
                        <button
                          className="btn bg-black text-white hover:bg-white hover:text-black my-5"
                          onClick={() => handleResetPasswordFn.mutate()}
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 1 && (
                  <div>
                    <DetailAttendanceEmployee employeeId={employeeId} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

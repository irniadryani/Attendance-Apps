import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPermissionFn } from "../../api/permission/permission";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import DetailPemission from "./DetailPemission";
import { Button } from "@nextui-org/react";

export default function Permission() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handlePermissionResponse = useMutation({
    mutationFn: (data) => createPermissionFn(data),
    onMutate() {},
    onSuccess: (res) => {
      console.log(res);
      reset();
      Swal.fire({
        icon: "success",
        title: "Permission Created!",
        text: "The permission has been successfully created.",
      });
      document.getElementById("permission_modal").close();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const formatNotes = (notes) => {
    const maxLength = 50;
    const regex = new RegExp(`.{1,${maxLength}}`, "g");
    return notes.match(regex).join("\n");
  };

  const addPermission = (data) => {
    const formattedNotes = formatNotes(data.notes);
    const permissionData = new FormData();

    permissionData.append("start_date", new Date(startDate).toISOString());
    permissionData.append("end_date", new Date(endDate).toISOString());
    permissionData.append("notes", formattedNotes);
    if (data.file) {
      permissionData.append("file", data.file[0]);
    }

    handlePermissionResponse.mutateAsync(permissionData);
  };

  return (
    <div className="">
      <dialog id="permission_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Permission Request</h3>
          <div className="flex flex-row gap-5 justify-end">
            <div>
              <button
                className="btn my-5 bg-black text-white rounded-lg"
                onClick={() =>
                  document.getElementById("detail_permission_modal").showModal()
                }
              >
                History Permission
              </button>
            </div>
          </div>

          <div className="card bg-base-100 w-full shadow-2xl my-5 mr-10">
            <form onSubmit={handleSubmit(addPermission)} className="p-5">
              <p className="font-bold text-lg my-5 text-center">
                Form Request Permission
              </p>
              <div className="flex flex-row justify-between">
                <label htmlFor="start_date" className="text-sm font-medium">
                  Start Date
                </label>
                <div>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MMMM d, yyyy"
                    className="flex justify-center mr-24"
                  />
                  <input
                    type="hidden"
                    {...register("start_date", { required: true })}
                    value={startDate.toISOString()}
                  />
                </div>
              </div>
              <div className="flex flex-row mt-5 justify-between">
                <label htmlFor="end_date" className="text-sm font-medium">
                  End Date
                </label>
                <div>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="MMMM d, yyyy"
                    className="flex justify-center ml-10 mr-24"
                  />
                  <input
                    type="hidden"
                    {...register("end_date", { required: true })}
                    value={endDate.toISOString()}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="file">
                  <div className="label mt-3 justify-start">
                    <span className="label-text text-sm font-medium">
                      Input File or Document
                    </span>
                  </div>
                </label>
                <input
                  type="file"
                  accept=".png, .jpeg, .jpg, .pdf"
                  className="file-input file-input-bordered w-full max-w-xs"
                  {...register("file")}
                />
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="form-control w-full max-w-4xl"
                >
                  <div className="label mt-3 w-full justify-start">
                    <span className="label-text text-sm font-medium">
                      Notes
                    </span>
                  </div>
                </label>
                <textarea
                  placeholder=""
                  className="textarea textarea-bordered textarea-lg w-full max-w-4xl text-sm"
                  {...register("notes", { required: true })}
                ></textarea>
              </div>
              <div className="flex justify-end m-5">
                <Button color="primary" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <DetailPemission />
    </div>
  );
}

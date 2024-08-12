import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createLeavesFn, getLeavesByIdFn } from "../../api/leaves/leaves";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "@tanstack/react-query";
import DetailLeaves from "./DetailLeaves";
import { useSelector } from "react-redux";
import { Button } from "@nextui-org/react";

export default function Leaves() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { user } = useSelector((state) => state.auth);

  const {
    data: dataSingleLeaves,
    refetch: refetchSingleLeaves,
    isLoading: loadingSingleLeaves,
  } = useQuery({
    queryKey: ["leaves", user?.id],
    queryFn: () => getLeavesByIdFn(user?.id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleLeavesResponse = useMutation({
    mutationFn: (data) => createLeavesFn(data),

    onMutate() {},
    onSuccess: (res) => {
      console.log(res);
      reset();
      Swal.fire({
        icon: "success",
        title: "Leave Created!",
        text: "The leave request has been successfully created.",
      });
      document.getElementById("leaves_modal").close();
    },
    onError: (error) => {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.msg || "Failed to create leave",
      });
    },
  });

  const formatNotes = (notes) => {
    const maxLength = 50;
    const regex = new RegExp(`.{1,${maxLength}}`, "g");
    return notes.match(regex).join("\n");
  };

  const addLeaves = (data) => {
    const formattedNotes = formatNotes(data.notes);
    const leavesData = {
      ...data,
      start_date: startDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      end_date: endDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      notes: formattedNotes,
    };
    console.log("leaves data", leavesData); // Log to check the values
    handleLeavesResponse.mutateAsync(leavesData);
  };
  

  return (
    <div>
      <dialog id="leaves_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Leave Request</h3>
          <button
            className="my-5"
            onClick={() =>
              document.getElementById("detail_leaves_modal").showModal()
            }
          >
            <p className="font-thin text-xs mb-1 text-start">
              *Tap to see detail
            </p>
            <div className="card bg-neutral text-neutral-content w-56 h-24">
              <div className="flex flex-col items-center text-center justify-between">
                <h2 className="font-bold text-6xl items-end">
                  {dataSingleLeaves?.remainingLeaves ||
                    dataSingleLeaves?.maximumLeaves}
                </h2>
                <p className="font-bold text-lg items-end">Leaves Left</p>
              </div>
            </div>
          </button>
          <div className="card bg-base-100 w-full shadow-2xl my-5 mr-10">
            <form onSubmit={handleSubmit(addLeaves)} className="p-5">
              <p className="font-bold text-lg my-5 text-center">
                Form Leave Request
              </p>
              <div className="flex flex-row justify-between">
                <label htmlFor="start_date" className="text-sm font-medium">
                  Start Date
                </label>
                <div>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MMMM d, yyyy h:mmaa"
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
                    dateFormat="MMMM d, yyyy h:mmaa"
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
                  {...register("notes")}
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
      <DetailLeaves />
    </div>
  );
}

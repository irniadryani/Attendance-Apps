import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createDailyReportFn } from "../../api/dailyReport/dailyReport";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

export default function DailyReport() {
  const [dateReport, setDateReport] = useState(new Date());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleDailyReportResponse = useMutation({
    mutationFn: (data) => createDailyReportFn(data),

    onMutate() {},
    onSuccess: (res) => {
      console.log(res);
      reset();
      Swal.fire({
        icon: "success",
        title: "Daily Report Created!",
        text: "The Daily Report has been successfully created.",
      });
      document.getElementById("daily_report_modal").close();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const addDailyReport = (data) => {
    const dailyReportData = {
      ...data,
      report_date: dateReport.toISOString(), // Correct the property name
    };
    console.log("daily report data", dailyReportData); // Log to check the values
    handleDailyReportResponse.mutateAsync(dailyReportData);
  };

  return (
    <div>
      <dialog id="daily_report_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Daily Report</h3>
          <div className="card bg-base-100 w-full shadow-2xl my-5 mr-10">
            <form onSubmit={handleSubmit(addDailyReport)} className="p-5">
              <div className="flex flex-row justify-between">
                <label htmlFor="dateReport" className="text-sm font-medium">
                  Date
                </label>
                <div>
                  <DatePicker
                    selected={dateReport} // Pass the selected date
                    dateFormat="MMMM d, yyyy h:mmaa"
                    onChange={(date) => setDateReport(date)} // Update dateReport state on change
                    className="flex justify-center mr-24"
                  />
                  <input
                    type="hidden"
                    {...register("report_date", { required: true })} // Ensure this is registered
                    value={dateReport.toISOString()}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="report_message"
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
                  className="textarea textarea-bordered textarea-lg w-full max-w-4xl"
                  {...register("report_message", { required: true })}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button className="btn bg-black text-white my-3" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

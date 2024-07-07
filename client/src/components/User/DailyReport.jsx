import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

export default function DailyReport() {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };
  return (
    <div>
      <dialog id="daily_report_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Daily Report</h3>
          <div className=" my-5">
            <form>
              <div>
                <p className="text-sm font-medium">Select Date</p>
                <div>
                  <Datepicker value={value} onChange={handleValueChange} />
                </div>
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="form-control w-full max-w-4xl"
                >
                  <div className="label mt-3 w-full justify-start">
                    <span className="label-text text-sm font-medium">Notes</span>
                  </div>
                </label>
                <textarea
                  placeholder=""
                  className="textarea textarea-bordered textarea-lg w-full max-w-4xl"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-success text-white my-3">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

import React, { useState } from "react";


export default function Leaves() {
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  // } = useForm();

  // const handlePermissionResponse = useMutation({
  //   mutationFn: (data) => createPermissionFn(data),

  //   onMutate() {},
  //   onSuccess: (res) => {
  //     console.log(res);
  //     reset();
  //     Swal.fire({
  //       icon: "success",
  //       title: "Permission Created!",
  //       text: "The permission has been successfully created.",
  //     });
  //     document.getElementById("permission_modal").close();
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   },
  // });

  // const addPermission = (data) => {
  //   const permissionData = {
  //     ...data,
  //     start_date: startDate.toISOString(),
  //     end_date: endDate.toISOString(),
  //   };
  //   console.log(permissionData); // Log to check the values
  //   handlePermissionResponse.mutateAsync(permissionData);
  // };

  return (
    <div>
      <dialog id="leaves_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Leaves Request</h3>
          {/* <button className="my-5" onClick={() =>
            document.getElementById("detail_leaves_modal").showModal()
          }>
            <p className="font-thin text-xs mb-1 text-start">*Tap to see detail</p>
            <div className="card bg-neutral text-neutral-content w-56 h-24">
              <div className="flex flex-col items-center text-center justify-between">
                <h2 className="font-bold text-6xl items-end">8</h2>
                <p className="font-bold text-lg items-end">Leaves Left</p>
              </div>
            </div>
          </button>
          <div className="card bg-base-100 w-full shadow-2xl my-5 mr-10">
            <form onSubmit={handleSubmit(addPermission)} className="p-5">
              <p className="font-bold text-lg my-5 text-center">Form Leaves Permission</p>
              <div className="flex flex-row justify-between">
                <label htmlFor="start_date" className="text-sm font-medium">
                  Start Date
                </label>
                <div>
                  <DatePicker
                    showTimeSelect
                    minTime={new Date(0, 0, 0, 12, 30)}
                    maxTime={new Date(0, 0, 0, 19, 0)}
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
                    showTimeSelect
                    minTime={new Date(0, 0, 0, 12, 30)}
                    maxTime={new Date(0, 0, 0, 19, 0)}
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
                  className="textarea textarea-bordered textarea-lg w-full max-w-4xl"
                  {...register("notes")}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  className="btn bg-black text-white my-3"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div> */}
        </div>
      </dialog>
    </div>
  );
}

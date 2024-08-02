import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updatePermissionFn } from "../../api/permission/permission";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@nextui-org/react";

export default function UpdatePermission({ permission, refetch, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const {
    register,
    handleSubmit: submitEditPermission,
    formState: { errors },
    reset: resetEditPermission,
    setValue,
  } = useForm({
    defaultValues: {
      start_date: "",
      end_date: "",
      notes: "",
      file: "",
    },
  });

  useEffect(() => {
    if (!loading && permission) {
      resetEditPermission({
        start_date: permission.start_date || "",
        end_date: permission.end_date || "",
        notes: permission.notes || "",
      });

      setEndDate(permission.end_date);
      setStartDate(permission.start_date);
      setValue("file", permission.file);
    }
  }, [loading, permission, resetEditPermission, setValue]);

  const handleUpdatePermission = useMutation({
    mutationFn: (data) => updatePermissionFn(permission.id, data),
    onSuccess: async () => {
      await refetch();
      Swal.fire({
        icon: "success",
        title: "Permission Updated!",
        text: "The Permission has been successfully updated.",
      });
      document.getElementById("update_permission_modal").close();
    },
    onError: async (error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error updating Permission!",
        text: "An error occurred while updating the Permission.",
      });
    },
  });

  const updatePermission = (data) => {
    const permissionData = new FormData();

    if (data.start_date) {
      permissionData.append("start_date", new Date(startDate).toISOString());
    }
    if (data.end_date) {
      permissionData.append("end_date", new Date(endDate).toISOString());
    }
    if (data.notes) {
      permissionData.append("notes", data.notes);
    }
    if (selectedFile) {
      permissionData.append("file", selectedFile);
    }

    console.log("Updating permission with data:", {
      start_date: data.start_date,
      end_date: data.end_date,
      notes: data.notes,
    });

    console.log(endDate);

    handleUpdatePermission.mutateAsync(permissionData);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div>
      <dialog id="update_permission_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Update Permission</h3>
          <div className="card bg-base-100 w-full shadow-2xl my-5 mr-10">
            <form
              onSubmit={submitEditPermission(updatePermission)}
              className="p-5"
            >
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
                    dateFormat="MMMM d, yyyy h:mmaa"
                    className="flex justify-center mr-24"
                  />
                  <input
                    type="hidden"
                    {...register("start_date", { required: true })}
                    value={startDate}
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
                    value={endDate}
                  />
                </div>
              </div>
              <div>
                <img
                  className="h-full w-100 object-cover object-center rounded-xl"
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : `${process.env.REACT_APP_BACKEND_HOST?.replace(
                          /\/$/,
                          ""
                        )}${permission?.url}`
                  }
                  alt="file"
                  {...register("file")}
                ></img>
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
                  onChange={handleFileChange}
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
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { updatePermissionFn } from "../../api/permission/permission";
// import { useForm } from "react-hook-form";
// import Swal from "sweetalert2";
// import { useMutation } from "@tanstack/react-query";
// import { Button } from "@nextui-org/react";

// export default function UpdatePermission({ permission, refetch, loading }) {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());

//   const {
//     register,
//     handleSubmit: submitEditPermission,
//     formState: { errors },
//     reset: resetEditPermission,
//     setValue,
//   } = useForm({
//     defaultValues: {
//       start_date: "",
//       end_date: "",
//       notes: "",
//       file: "",
//     },
//   });

//   useEffect(() => {
//     if (!loading && permission) {
//       resetEditPermission({
//         start_date: permission.start_date || "",
//         end_date: permission.end_date || "",
//         notes: permission.notes || "",
//       });

//       setValue("file", permission.file);
//     }
//   }, [loading, permission, resetEditPermission]);

//   const handleUpdatePermission = useMutation({
//     mutationFn: (data) => updatePermissionFn(permission.id, data),
//     onSuccess: async () => {
//       await refetch();
//       Swal.fire({
//         icon: "success",
//         title: "Permission Updated!",
//         text: "The Permission has been successfully updated.",
//       });
//       document.getElementById("update_permission_modal").close();
//     },
//     onError: async (error) => {
//       console.error(error);
//       Swal.fire({
//         icon: "error",
//         title: "Error updating Permission!",
//         text: "An error occurred while updating the Permission.",
//       });
//     },
//   });
//   const updatePermission = (data) => {
//     const permissionData = new FormData();
  
//     if (data.start_date !== null) {
//       permissionData.append("start_date", data.start_date);
//     }
//     if (data.end_date !== null) {
//       permissionData.append("end_date", data.end_date);
//     }
//     if (data.notes !== null) {
//       permissionData.append("notes", data.notes);
//     }
//     if (selectedFile) {
//       permissionData.append("file", selectedFile);
//     }
  
//     console.log("Updating permission with data:", data); // Add logging here to check data being sent
  
//     handleUpdatePermission.mutateAsync(permissionData);
//   };
  

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   return (
//     <div>
//       <dialog id="update_permission_modal" className="modal">
//         <div className="modal-box w-11/12 max-w-5xl">
//           <form method="dialog">
//             <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
//               ✕
//             </button>
//           </form>
//           <h3 className="font-bold text-lg">Update Permission</h3>
//           <div className="card bg-base-100 w-full shadow-2xl my-5 mr-10">
//             <form
//               onSubmit={submitEditPermission(updatePermission)}
//               className="p-5"
//             >
//               <p className="font-bold text-lg my-5 text-center">
//                 Form Request Permission
//               </p>
//               <div className="flex flex-row justify-between">
//                 <label htmlFor="start_date" className="text-sm font-medium">
//                   Start Date
//                 </label>
//                 <div>
//                   <DatePicker
//                     selected={startDate}
//                     onChange={(date) => setStartDate(date)}
//                     dateFormat="MMMM d, yyyy h:mmaa"
//                     className="flex justify-center mr-24"
//                   />
//                   <input
//                     type="hidden"
//                     {...register("start_date", { required: true })}
//                     value={startDate.toISOString()}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-row mt-5 justify-between">
//                 <label htmlFor="end_date" className="text-sm font-medium">
//                   End Date
//                 </label>
//                 <div>
//                   <DatePicker
//                     selected={endDate}
//                     onChange={(date) => setEndDate(date)}
//                     dateFormat="MMMM d, yyyy h:mmaa"
//                     className="flex justify-center ml-10 mr-24"
//                   />
//                   <input
//                     type="hidden"
//                     {...register("end_date", { required: true })}
//                     value={endDate.toISOString()}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <img
//                   className="h-full w-100 object-cover object-center rounded-xl"
//                   src={
//                     selectedFile
//                       ? URL.createObjectURL(selectedFile)
//                       : `${process.env.REACT_APP_BACKEND_HOST?.replace(
//                           /\/$/,
//                           ""
//                         )}${permission?.url}`
//                   }
//                   alt="file"
//                   {...register("file")}
//                 ></img>
//               </div>
//               <div>
//                 <label htmlFor="file">
//                   <div className="label mt-3 justify-start">
//                     <span className="label-text text-sm font-medium">
//                       Input File or Document
//                     </span>
//                   </div>
//                 </label>
//                 <input
//                   type="file"
//                   accept=".png, .jpeg, .jpg, .pdf"
//                   className="file-input file-input-bordered w-full max-w-xs"
//                   onChange={handleFileChange}
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="notes"
//                   className="form-control w-full max-w-4xl"
//                 >
//                   <div className="label mt-3 w-full justify-start">
//                     <span className="label-text text-sm font-medium">
//                       Notes
//                     </span>
//                   </div>
//                 </label>
//                 <textarea
//                   placeholder=""
//                   className="textarea textarea-bordered textarea-lg w-full max-w-4xl text-sm"
//                   {...register("notes", { required: true })}
//                 ></textarea>
//               </div>
//               <div className="flex justify-end m-5">
//                 <Button color="primary" type="submit">
//                   Submit
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// }

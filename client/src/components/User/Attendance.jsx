import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTodayAttendanceByUserId,
  setAttendance,
} from "../../features/attendanceSlice";
import { checkinFn, checkoutFn } from "../../api/attendance/attendance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DoneWorking from "../../assets/done-working.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createDailyReportFn } from "../../api/dailyReport/dailyReport";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";

export default function Attendance() {
  const [clock, setClock] = useState(new Date());
  const dispatch = useDispatch();
  const { attendance } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getTodayAttendanceByUserId());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const checkinUser = useMutation({
    mutationFn: async (checkinData) => checkinFn(checkinData),
    onSuccess: (res) => {
      console.log(res);
      toast.success("Successfully checked in, happy working!");
      dispatch(setAttendance(res));
      document.getElementById("attendance_modal").close();
    },
    onError: (error) => {
      console.error("Error checking in:", error);
      toast.error(error.response.data.error, { position: "top-right" });
    },
  });

  const checkoutUser = useMutation({
    mutationFn: async (checkinData) => checkoutFn(checkinData),
    onSuccess: (res) => {
      console.log(res);
      toast.success("Successfully checked out, go back safely!");
      dispatch(setAttendance(res));
      document.getElementById("attendance_modal").close();
    },
    onError: (error) => {
      console.error("Error checking out:", error);
      toast.error(error.response.data.error, { position: "top-right" });
    },
  });

  const [dateReport, setDateReport] = useState(new Date());
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleDailyReportAndCheckout = async (data) => {
    const dailyReportData = {
      ...data,
      report_date: dateReport.toISOString(),
    };

    try {
      // Create daily report
      await createDailyReportFn(dailyReportData);

      // Proceed to checkout
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            checkoutUser.mutate({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            toast.error("Failed to get your location.");
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        console.error("Geolocation is not supported.");
        toast.error("Geolocation is not supported.");
      }
    } catch (error) {
      console.error("Error creating daily report:", error);
      toast.error("Failed to create daily report.");
    }
  };

  const handleCheckIn = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          checkinUser.mutate({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          toast.error("Failed to get your location.");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported.");
      toast.error("Geolocation is not supported.");
    }
  };

  return (
    <div>
      <dialog id="attendance_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() =>
                document.getElementById("attendance_modal").close()
              }
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Attendance!</h3>
          {!attendance?.check_in && !attendance?.check_out && (
            <div className="flex justify-center">
              <h2 className="text-xl font-bold my-5">
                {clock.toLocaleTimeString()}
              </h2>
            </div>
          )}
          <div className="flex flex-col gap-5 w-full my-5">
            {attendance?.check_in && !attendance?.check_out && (
              <p className="flex justify-center items-center text-center font-medium text-base">
                Please Fill The Daily Report First Before Checkout
              </p>
            )}
            {attendance?.check_in && !attendance?.check_out && (
              <div className="w-full">
                <div className=" w-full  mr-10">
                  <form onSubmit={handleSubmit(handleDailyReportAndCheckout)} className="p-5">
                    <div className="flex flex-row justify-between">
                      <label
                        htmlFor="dateReport"
                        className="text-sm font-medium"
                      >
                        Date
                      </label>
                      <div>
                        <DatePicker
                          selected={dateReport}
                          dateFormat="MMMM d, yyyy h:mmaa"
                          onChange={(date) => setDateReport(date)}
                          className="flex justify-center"
                          readOnly 
                        />
                        <input
                          type="hidden"
                          {...register("report_date", { required: true })}
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
                    <div className="flex justify-end m-5">
                      <button className="btn w-full btn-warning my-5" type="submit">
                        Check Out
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {attendance?.check_in && attendance?.check_out && (
              <div className="w-full text-center">
                <p className="font-bold text-lg">
                  You have been working today.
                </p>
                <div className="flex justify-center mt-3">
                  <img src={DoneWorking} className="w-36" />
                </div>
              </div>
            )}
            {!attendance?.check_in && (
              <div className="w-full">
                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="btn w-full btn-info"
                >
                  Check In
                </button>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getTodayAttendanceByUserId,
//   setAttendance,
// } from "../../features/attendanceSlice";
// import { checkinFn, checkoutFn } from "../../api/attendance/attendance";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import DoneWorking from "../../assets/done-working.png";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { createDailyReportFn } from "../../api/dailyReport/dailyReport";
// import Swal from "sweetalert2";
// import { useForm } from "react-hook-form";
// import { Button } from "@nextui-org/react";

// export default function Attendance() {
//   const [clock, setClock] = useState(new Date());
//   const [isDailyReportSubmitted, setIsDailyReportSubmitted] = useState(false); // Add state to track daily report submission
//   const dispatch = useDispatch();
//   const { attendance } = useSelector((state) => state.attendance);

//   useEffect(() => {
//     dispatch(getTodayAttendanceByUserId());
//   }, [dispatch]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setClock(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const checkinUser = useMutation({
//     mutationFn: async (checkinData) => checkinFn(checkinData),
//     onSuccess: (res) => {
//       console.log(res);
//       toast.success("Successfully checked in, happy working!");
//       dispatch(setAttendance(res));
//       document.getElementById("attendance_modal").close();
//     },
//     onError: (error) => {
//       console.error("Error checking in:", error);
//       toast.error(error.response.data.error, { position: "top-right" });
//     },
//   });

//   const checkoutUser = useMutation({
//     mutationFn: async (checkinData) => checkoutFn(checkinData),
//     onSuccess: (res) => {
//       console.log(res);
//       toast.success("Successfully checked out, go back safely!");
//       dispatch(setAttendance(res));
//       document.getElementById("attendance_modal").close();
//     },
//     onError: (error) => {
//       console.error("Error checking out:", error);
//       toast.error(error.response.data.error, { position: "top-right" });
//     },
//   });

//   const [dateReport, setDateReport] = useState(new Date());
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const handleDailyReportResponse = useMutation({
//     mutationFn: (data) => createDailyReportFn(data),
//     onMutate() {},
//     onSuccess: (res) => {
//       console.log(res);
//       reset();
//       setIsDailyReportSubmitted(true); // Update state upon successful daily report submission
//       Swal.fire({
//         icon: "success",
//         title: "Daily Report Created!",
//         text: "The Daily Report has been successfully created.",
//       });
//       document.getElementById("daily_report_modal").close();
//     },
//     onError: (error) => {
//       console.log(error);
//     },
//   });

//   const addDailyReport = (data) => {
//     const dailyReportData = {
//       ...data,
//       report_date: dateReport.toISOString(),
//     };
//     console.log("daily report data", dailyReportData);
//     handleDailyReportResponse.mutateAsync(dailyReportData);
//   };

//   const handleCheckIn = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           checkinUser.mutate({ latitude, longitude });
//         },
//         (error) => {
//           console.error("Error getting geolocation:", error);
//           toast.error("Failed to get your location.");
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0,
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported.");
//       toast.error("Geolocation is not supported.");
//     }
//   };

//   const handleCheckOut = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           checkoutUser.mutate({ latitude, longitude });
//         },
//         (error) => {
//           console.error("Error getting geolocation:", error);
//           toast.error("Failed to get your location.");
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0,
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported.");
//       toast.error("Geolocation is not supported.");
//     }
//   };

//   return (
//     <div>
//       <dialog id="attendance_modal" className="modal">
//         <div className="modal-box w-11/12 max-w-5xl">
//           <form method="dialog">
//             <button
//               className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
//               onClick={() =>
//                 document.getElementById("attendance_modal").close()
//               }
//             >
//               ✕
//             </button>
//           </form>
//           <h3 className="font-bold text-lg">Attendance!</h3>
//           {!attendance?.check_in && !attendance?.check_out && (
//             <div className="flex justify-center">
//               <h2 className="text-xl font-bold my-5">
//                 {clock.toLocaleTimeString()}
//               </h2>
//             </div>
//           )}
//           <div className="flex flex-col gap-5 w-full my-5">
//             {attendance?.check_in && !attendance?.check_out && (
//               <p className="flex justify-center items-center text-center font-medium text-base">
//                 Please Fill The Daily Report First Before Checkout
//               </p>
//             )}
//             {attendance?.check_in && !attendance?.check_out && (
//               <div className="w-full">
//                 <div className="card bg-base-100 w-full shadow-2xl mr-10">
//                   <form onSubmit={handleSubmit(addDailyReport)} className="p-5">
//                     <div className="flex flex-row justify-between">
//                       <label
//                         htmlFor="dateReport"
//                         className="text-sm font-medium"
//                       >
//                         Date
//                       </label>
//                       <div>
//                         <DatePicker
//                           selected={dateReport}
//                           dateFormat="MMMM d, yyyy h:mmaa"
//                           onChange={(date) => setDateReport(date)}
//                           className="flex justify-center"
//                         />
//                         <input
//                           type="hidden"
//                           {...register("report_date", { required: true })}
//                           value={dateReport.toISOString()}
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="report_message"
//                         className="form-control w-full max-w-4xl"
//                       >
//                         <div className="label mt-3 w-full justify-start">
//                           <span className="label-text text-sm font-medium">
//                             Notes
//                           </span>
//                         </div>
//                       </label>
//                       <textarea
//                         placeholder=""
//                         className="textarea textarea-bordered textarea-lg w-full max-w-4xl"
//                         {...register("report_message", { required: true })}
//                       ></textarea>
//                     </div>
//                     <div className="flex justify-end m-5">
//                       <Button color="primary" type="submit">
//                         Send
//                       </Button>
//                     </div>
//                   </form>
//                 </div>
//                 <button
//                   className="btn w-full btn-warning my-5"
//                   onClick={handleCheckOut}
//                   disabled={!isDailyReportSubmitted} // Disable button if daily report is not submitted
//                 >
//                   Check Out
//                 </button>
//               </div>
//             )}
//             {attendance?.check_in && attendance?.check_out && (
//               <div className="w-full text-center">
//                 <p className="font-bold text-lg">
//                   You have been working today.
//                 </p>
//                 <div className="flex justify-center mt-3">
//                   <img src={DoneWorking} className="w-36" />
//                 </div>
//               </div>
//             )}
//             {!attendance?.check_in && (
//               <div className="w-full">
//                 <button
//                   type="button"
//                   onClick={handleCheckIn}
//                   className="btn w-full btn-info"
//                 >
//                   Check In
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// }

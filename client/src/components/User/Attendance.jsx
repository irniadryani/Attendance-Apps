import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTodayAttendanceByUserId,
  setAttendance,
} from "../../features/attendanceSlice";
import { checkinFn, checkoutFn } from "../../api/attendance/attendance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DoneWorking from "../../assets/done-working.png"

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
      // Optionally update Redux state here if needed
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
      // Optionally update Redux state here if needed
      dispatch(setAttendance(res));
      document.getElementById("attendance_modal").close();
    },
    onError: (error) => {
      console.error("Error checking out:", error);
      toast.error(error.response.data.error, { position: "top-right" });
    },
  });

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
          timeout: 5000, // timeout to get position
          maximumAge: 0, // no cache, always get the current position
        }
      );
    } else {
      console.error("Geolocation is not supported.");
      toast.error("Geolocation is not supported.");
    }
  };

  const handleCheckOut = () => {
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
          timeout: 5000, // timeout to get position
          maximumAge: 0, // no cache, always get the current position
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
        <div className="modal-box">
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
          {!attendance?.check_in && !attendance?.check_out &&  (
          <div className="flex justify-center">
            <h2 className="text-xl font-bold my-5">
              {clock.toLocaleTimeString()}
            </h2>
          </div>
          )}
          <div className="flex flex-row gap-10 w-full my-5">
            {attendance?.check_in && !attendance?.check_out && (
              <div className="w-full">
                <button
                  className="btn w-full btn-warning"
                  onClick={handleCheckOut}
                >
                  Check Out
                </button>
              </div>
            )}
            {attendance?.check_in && attendance?.check_out && (
              <div className="w-full text-center">
                <p className="font-bold text-lg">You have been working today.</p>
                <div className="flex justify-center mt-3"> <img src={DoneWorking} className="w-36"/></div>
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

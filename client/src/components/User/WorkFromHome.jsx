import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  getTodayAttendanceByUserId,
  setAttendance,
} from "../../features/attendanceSlice";
import { checkinWfhFn, checkoutWfhFn } from "../../api/attendance/attendance";
import { createDailyReportFn } from "../../api/dailyReport/dailyReport";
import DoneWorking from "../../assets/done-working.png";
import WFO from "../../assets/wfo.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Webcam from "react-webcam";
import { BsCameraFill } from "react-icons/bs";

export default function WorkFromHome() {
  const [clock, setClock] = useState(new Date());
  const dispatch = useDispatch();
  const { attendance } = useSelector((state) => state.attendance);
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

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
    mutationFn: async (formData) => checkinWfhFn(formData),
    onSuccess: (res) => {
      toast.success("Successfully checked in, happy working!");
      dispatch(setAttendance(res));
      document.getElementById("wfh_modal").close();
    },
    onError: (error) => {
      toast.error(error.response.data.error, { position: "top-right" });
    },
  });

  const checkoutUser = useMutation({
    mutationFn: async (formData) => checkoutWfhFn(formData),
    onSuccess: (res) => {
      toast.success("Successfully checked out, go back safely!");
      dispatch(setAttendance(res));
      setImgSrc(null); // Reset the captured image
      document.getElementById("wfh_modal").close();
    },
    onError: (error) => {
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

  const handleCheckIn = async () => {
    if (!imgSrc) {
      toast.error("Please capture an image before checking in.");
      return;
    }
    const file = await fetch(imgSrc).then((res) => res.blob());
    const formData = new FormData();
    formData.append("checkin_image", file, "checkin.jpg");
    checkinUser.mutate(formData, {
      onSuccess: () => reset(),
    });
  };

  const handleDailyReportAndCheckout = async (data) => {
    if (!imgSrc) {
      toast.error("Please capture an image before checking out.");
      return;
    }
    if (!data.report_message) {
      toast.error("Please insert daily report before checking out.");
      return;
    }
    const file = imgSrc ? await fetch(imgSrc).then((res) => res.blob()) : null;
    const formData = new FormData();
    formData.append("checkout_image", file, "checkout.jpg");

    try {
      const dailyReportData = {
        ...data,
        report_date: new Date().toISOString(),
      };
      await createDailyReportFn(dailyReportData);
      await checkoutUser.mutateAsync(formData);
      toast.success("Successfully checked out, go back safely!");
    } catch (error) {
      console.error("Error creating daily report or checking out:", error);
      toast.error("Failed to create daily report or check out.");
    }
  };

  return (
    <div>
      <dialog id="wfh_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Work From Home!</h3>
          {!attendance?.check_in && (
            <>
              <div className="flex justify-center mt-5">
                <div className="w-full max-w-md">
                  <form onSubmit={handleSubmit(handleCheckIn)}>
                    <div className="w-full">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        mirrored={false}
                      />
                      <button
                        type="button"
                        className="btn my-3 bg-black text-white"
                        onClick={capture}
                      >
                        <BsCameraFill />
                        Capture Image
                      </button>
                    </div>
                    {imgSrc && (
                      <div>
                        <img src={imgSrc} alt="Captured" />
                        <button
                          type="button"
                          onClick={retake}
                          className="btn my-3 bg-black text-white"
                        >
                          <BsCameraFill />
                          Retake
                        </button>
                      </div>
                    )}
                    <div>
                      <button
                        type="submit"
                        className="btn w-full btn-info"
                        disabled={!imgSrc} // Disable the button if no image is captured
                      >
                        Check In
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
          {attendance?.checkin_image &&
            !attendance?.checkout_image &&
            attendance?.location_lat === null && (
              <div className="w-full">
                <div className="tabs tabs-boxed">
                  <button
                    className={`tab ${activeTab === 0 ? "tab-active" : ""}`}
                    onClick={() => setActiveTab(0)}
                  >
                    Daily Report
                  </button>
                  <button
                    className={`tab ${activeTab === 1 ? "tab-active" : ""}`}
                    onClick={() => setActiveTab(1)}
                  >
                    Check Out
                  </button>
                </div>
                {activeTab === 0 && attendance?.location_lat === null && (
                  <form
                    className="p-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setActiveTab(1);
                    }}
                  >
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
                      <button
                        className="btn w-full btn-info my-5"
                        type="submit"
                      >
                        Next
                      </button>
                    </div>
                  </form>
                )}
                {activeTab === 1 && (
                  <form
                    onSubmit={handleSubmit(handleDailyReportAndCheckout)}
                    className="p-5"
                  >
                    <div className="flex flex-col w-full my-10 items-center justify-center">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="50%"
                        mirrored={false}
                      />
                      <button
                        type="button"
                        className="btn mt-3"
                        onClick={capture}
                      >
                        <BsCameraFill />
                        Capture Image
                      </button>
                    </div>
                    {imgSrc && (
                      <div className="flex flex-col w-full my-10 items-center justify-center">
                        <img src={imgSrc} alt="Captured" />
                        <button
                          type="button"
                          onClick={retake}
                          className="btn mt-2"
                        >
                          <BsCameraFill />
                          Retake
                        </button>
                      </div>
                    )}
                    <div className="flex justify-end m-5">
                      <button
                        disabled={!imgSrc}
                        className="btn w-full btn-warning my-5"
                        type="submit"
                      >
                        Check Out
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          {attendance?.location_lat !== null &&
            attendance?.checkin_image === null &&
            attendance?.location_long !== null && attendance?.check_out === null && (
              <div className="w-full text-center">
                <p className="font-bold text-lg">
                  You're working at office today.
                </p>
                <div className="flex justify-center mt-3">
                  <img src={WFO} className="w-36" />
                </div>
              </div>
            )}
          {attendance?.check_out && (
            <div className="w-full text-center">
              <p className="font-bold text-lg">You have been working today.</p>
              <div className="flex justify-center mt-3">
                <img src={DoneWorking} alt="Done working" className="w-36" />
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}


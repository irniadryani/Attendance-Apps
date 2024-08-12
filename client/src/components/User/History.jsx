import React, { useEffect } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { getAttendanceByIdFn } from "../../api/attendance/attendance";
import { useQuery } from "@tanstack/react-query";

export default function History() {
  const { id } = useParams();
  const {
    data: dataSingleAttendance,
    refetch: refetchSingleAttendance,
    isLoading: loadingSingleAttendance,
  } = useQuery({
    queryKey: ["attendance", id],
    queryFn: () => getAttendanceByIdFn(id),
  });

  console.log("att", dataSingleAttendance)

  // useEffect(() => {
  //   dataSingleAttendance();
  //   }
  // ,[]);

  const getTitle = (attendance) => {
    const today = new Date();
    const attendanceDate = new Date(attendance.date);
    const isToday =
      attendanceDate.getUTCFullYear() === today.getUTCFullYear() &&
      attendanceDate.getUTCMonth() === today.getUTCMonth() &&
      attendanceDate.getUTCDate() === today.getUTCDate();
  
    if (attendance.check_in && attendance.check_out) {
      return "Worked";
    } else if (!attendance.check_in && !attendance.check_out) {
      return "Not Working";
    } else if (attendance.check_in && !isToday && !attendance.check_out) {
      return "Worked"; 
    }
    return "On Working";
  };
  

  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-screen">
      <div>
        <p className="font-bold text-2xl mx-10 mt-10">History</p>

        {/* <div className="flex justify-end mx-10">
          <div className="dropdown dropdown-hover mt-5">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-black text-white text-center w-24"
            >
              Sort
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="my-5">
          <Accordion variant="splitted" className="dark:bg-gray-800 text-black">
            {dataSingleAttendance?.map((attendance) => (
              <AccordionItem
                key={attendance.id}
                aria-label={`Accordion ${attendance.id}`}
                title={getTitle(attendance)}
                subtitle={attendance.date} // Make sure `date` is available in `attendance`
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">
                    Check in : {attendance.check_in}
                  </p>
                  <p className="text-sm font-semibold">
                    Check out : {attendance.check_out}
                  </p>
                  <p className="text-sm font-semibold">
                    Work Hours : {attendance.work_hours}
                  </p>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

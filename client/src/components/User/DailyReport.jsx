import React, { useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { getDailyReportByIdFn } from "../../api/dailyReport/dailyReport.js";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function DailyReport() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: dataSingleDailyReport,
    refetch: refetchDailyReport,
    isLoading: loadingDailyReport,
  } = useQuery({
    queryKey: ["dailyReport", user?.id],
    queryFn: () => getDailyReportByIdFn(user?.id),
  });

  console.log("Daily Report Data:", dataSingleDailyReport);

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
          <div className="flex my-5">
            <Accordion variant="splitted" className="dark:bg-gray-800 text-black">
            {dataSingleDailyReport?.map((dailyReport) => (
              <AccordionItem
                key={dailyReport.id}
                aria-label={`Accordion ${dailyReport.id}`}
                subtitle={dailyReport.report_date} 
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">
                    {dailyReport.report_message}
                  </p>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
          </div>
          
        </div>
      </dialog>
    </div>
  );
}

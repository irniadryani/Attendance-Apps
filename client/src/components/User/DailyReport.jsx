import React, { useState, useEffect } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { getDailyReportByIdFn } from "../../api/dailyReport/dailyReport.js";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";

export default function DailyReport() {
  const { user } = useSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [isDateRangeCleared, setIsDateRangeCleared] = useState(true);

  const {
    data: dataSingleDailyReport,
    refetch: refetchDailyReport,
    isLoading: loadingDailyReport,
  } = useQuery({
    queryKey: ["dailyReport", user?.id],
    queryFn: () => getDailyReportByIdFn(user?.id),
    enabled: !!user.id,
  });

  const filteredReports = dataSingleDailyReport?.filter((report) => {
    const reportDate = new Date(report.report_date);
    if (isDateRangeCleared) {
      return true; // Show all reports when date range is cleared
    }
    return reportDate >= dateRange[0].startDate && reportDate <= dateRange[0].endDate;
  });
  const handleClear = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setIsDateRangeCleared(true);
    refetchDailyReport(); // Clear and fetch again
  };

  const toggleDateRangePicker = () => {
    setShowDateRange(!showDateRange);
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
          <div>
            {showDateRange && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  setDateRange([item.selection]);
                  setIsDateRangeCleared(false);
                }}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
              />
            )}
          </div>
          <div className="flex justify-between my-4">
            <button
              onClick={toggleDateRangePicker}
              className="btn bg-black text-white"
            >
              {showDateRange ? "Hide Date Range" : "Show Date Range"}
            </button>
            <button onClick={handleClear} className="btn bg-red-500 text-white">
              Clear
            </button>
          </div>
          <div className="flex my-5">
            <Accordion
              variant="splitted"
              className="dark:bg-gray-800 text-black"
            >
              {filteredReports?.map((dailyReport) => (
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

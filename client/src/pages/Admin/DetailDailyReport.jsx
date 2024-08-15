import React, { useState } from "react";
import Layout from "../Layout";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDailyReportByIdFn } from "../../api/dailyReport/dailyReport";
import { Accordion, AccordionItem } from "@nextui-org/react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";

export default function DetailDailyReport() {
  const { id } = useParams();
  const location = useLocation();
  const employeeId = atob(id);
  const { employeeName, employeePosition } = location.state || {
    employeeName: "null",
    employeePosition: null,
  };

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [isDateRangeCleared, setIsDateRangeCleared] = useState(true);

  const { data: dataSingleDailyReport, isLoading: loadingSingleDailyReport, refetch: refetchDailyReport } =
    useQuery({
      queryKey: ["dailyReport", employeeId],
      queryFn: () => getDailyReportByIdFn(employeeId),
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

  const filteredReports = dataSingleDailyReport?.filter((report) => {
    const reportDate = new Date(report.report_date);
    if (isDateRangeCleared) {
      return true; // Show all reports when date range is cleared
    }
    return reportDate >= dateRange[0].startDate && reportDate <= dateRange[0].endDate;
  });

  // const sortedDailyReports = dataSingleDailyReport?.sort((a, b) => {
  //   return new Date(a.report_date) - new Date(b.report_date);
  // });

  // const filteredDailyReport = sortedDailyReports?.filter((dailyReport) => {
  //   const reportDate = new Date(dailyReport.report_date);
  //   const startDate = dateRange[0].startDate;
  //   const endDate = dateRange[0].endDate;

  //   // Check if the report date falls within the selected date range
  //   return reportDate >= startDate && reportDate <= endDate;
  // });

  return (
    <Layout>
      <div className="flex flex-col mx-5">
        <p className="mt-10 font-bold text-4xl text-black">{employeeName}</p>
        <p className="font-medium text-xl text-black">{employeePosition}</p>
      </div>
      <div>
        {showDateRange && (
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              setDateRange([item.selection]);
              setIsDateRangeCleared(false);
              refetchDailyReport(); // Refetch data when date range changes
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
      <div className="my-5">
        <Accordion variant="splitted" className="dark:bg-gray-800 text-black">
          {filteredReports?.map((dailyreport) => (
            <AccordionItem
              key={dailyreport.id}
              aria-label={`Accordion ${dailyreport.id}`}
              subtitle={dailyreport.report_date}
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">
                  {dailyreport.report_message}
                </p>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
}

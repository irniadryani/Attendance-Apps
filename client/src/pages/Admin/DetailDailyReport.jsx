import React, { useState } from "react";
import Layout from "../Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDailyReportByIdFn } from "../../api/dailyReport/dailyReport";
import { Accordion, AccordionItem } from "@nextui-org/react";

export default function DetailDailyReport() {
  const [date, setDate] = useState(null);
  const { id } = useParams();
  const location = useLocation();
  const employeeId = atob(id);
  const { employeeName, employeePosition } = location.state || {
    employeeName: "null",
    employeePosition: null,
  };

  const { data: dataSingleDailyReport, isLoading: loadingSingleDailyReport } =
    useQuery({
      queryKey: ["dailyReport", employeeId],
      queryFn: () => getDailyReportByIdFn(employeeId),
    });

  const sortedDailyReports = dataSingleDailyReport?.sort((a, b) => {
    return new Date(a.report_date) - new Date(b.report_date);
  });

  const filteredDailyReport = sortedDailyReports?.filter((dailyReport) => {
    const matchingDate =
      !date ||
      new Date(dailyReport?.report_date).toDateString() === date.toDateString();
    return matchingDate;
  });

  return (
    <Layout>
      <div className="flex flex-col mx-5">
        <p className="mt-10 font-bold text-4xl text-black">{employeeName}</p>
        <p className="font-medium text-xl text-black">{employeePosition}</p>
      </div>
      <div className="mt-10">
        <div className="flex flex-row p-3 bg-black text-white w-72 rounded-xl mx-3">
          <div>
            <p className="font-semibold text-sm items-center ">
              Sort By Date:
            </p>
          </div>

          <div className="ml-1 w-36 rounded-lg">
            <DatePicker
            className="rounded-lg text-black"
              selected={date}
              onChange={(date) => setDate(date)}
              isClearable
              placeholderText=" Select a date"
            />
          </div>
        </div>
      </div>
      <div className="my-5">
        <Accordion variant="splitted" className="dark:bg-gray-800 text-black">
          {filteredDailyReport?.map((dailyreport) => (
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

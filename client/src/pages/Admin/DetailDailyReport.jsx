import React from "react";
import Layout from "../Layout";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDailyReportByIdFn } from "../../api/dailyReport/dailyReport";
import { Accordion, AccordionItem } from "@nextui-org/react";

export default function DetailDailyReport() {
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

  console.log("dp", dataSingleDailyReport);

  return (
    <Layout>
      <div className="flex flex-col">
        <p className="mt-10 font-bold text-4xl text-black">{employeeName}</p>
        <p className="font-medium text-xl text-black">{employeePosition}</p>
      </div>
      <div className="my-5">
        <Accordion variant="splitted" className="dark:bg-gray-800 text-black">
          {dataSingleDailyReport?.map((dailyreport) => (
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

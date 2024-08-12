import React from "react";
import NotFoundImg from "../../assets/not-found.png";
import { tailspin } from "ldrs";

export default function RecapEmployeeTable({ data, loading }) {
  tailspin.register();

  console.log({ data });

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <l-tailspin size="40" stroke="5" speed="0.9" color="black"></l-tailspin>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div>
          <img src={NotFoundImg} className="w-full max-w-xs" />
        </div>
        <div>
          <p className="text-center font-semibold text-lg my-5">
            No data available
          </p>
        </div>
      </div>
    );
  }

  const renderTable = (recapData) => (
    <div className="overflow-x-auto flex justify-center">
      <table className="table table-zebra w-full max-w-4xl">
        <thead>
          <tr className="text-sm text-center text-white bg-black">
            <th>No</th>
            <th>Name</th>
            <th>
              Total
              <br /> Attendances
            </th>
            <th>
              Total
              <br /> Absences
            </th>
            <th>
              Total
              <br /> WFO
            </th>
            <th>
              Total
              <br /> WFH
            </th>
            <th>
              Total
              <br />
              Permission
            </th>
            <th>
              Total
              <br /> Leaves
            </th>
            <th>
              Average
              <br />
              Working Hours
            </th>
          </tr>
        </thead>
        <tbody>
          {recapData.map((recap, index) => (
            <tr key={index} className="hover font-base text-sm text-center text-black">
              <td>{index + 1}</td>
              <td>{recap.full_name}</td>
              <td>{recap.total_attendance}</td>
              <td>{recap.total_absences}</td>
              <td>{recap.total_work_from_office}</td>
              <td>{recap.total_work_from_home}</td>
              <td>{recap.total_permissions}</td>
              <td>{recap.total_leaves}</td>
              <td>{recap.average_work_hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSingleData = (recap) => (
    <div className="flex flex-col items-center justify-center">
      <div className="overflow-x-auto flex justify-center">
        <table className="table table-zebra w-full max-w-4xl">
          <thead>
            <tr className="text-sm text-center text-white bg-black">
              <th>Name</th>
              <th>
                Total
                <br /> Attendances
              </th>
              <th>
                Total
                <br /> Absences
              </th>
              <th>
                Total
                <br /> WFO
              </th>
              <th>
                Total
                <br /> WFH
              </th>
              <th>
                Total
                <br />
                Permission
              </th>
              <th>
                Total
                <br /> Leaves
              </th>
              <th>
                Average
                <br />
                Working Hours
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover font-base text-sm text-center text-black">
              <td>{recap.full_name}</td>
              <td>{recap.total_attendance}</td>
              <td>{recap.total_absences}</td>
              <td>{recap.total_work_from_office}</td>
              <td>{recap.total_work_from_home}</td>
              <td>{recap.total_permissions}</td>
              <td>{recap.total_leaves}</td>
              <td>{recap.average_work_hours}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      {Array.isArray(data) ? renderTable(data) : renderSingleData(data)}
    </div>
  );
}

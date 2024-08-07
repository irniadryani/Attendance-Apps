import React, { useEffect, useState } from "react";
import { getUserByIdFn } from "../../api/user/user";
import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";

export default function DetailEmployee({ employeeId }) {
  const [employeeDetail, setEmployeeDetail] = useState(null);

  useEffect(() => {
    fetchEmployeeDetail();
  }, [employeeId]);

  const fetchEmployeeDetail = async () => {
    try {
      const data = await getUserByIdFn(employeeId);
      setEmployeeDetail(data);
    } catch (error) {
      console.error(`Error fetching employee with id ${employeeId}:`, error);
    }
  };

  if (!employeeDetail) {
    return null;
  }

  return (
    <div>
      <dialog id="detail_employee_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="card lg:card-side bg-base-100">
            <figure>
              <img
                src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                  /\/$/,
                  ""
                )}${employeeDetail?.url}`}
                alt="Album"
                className="h-auto w-60 object-cover object-center"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title mb-5">
                {employeeDetail.full_name} Details
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row">
                  <p className="w-24 font-semibold">Name</p>
                  <p className="w-36 font-medium text-start">
                    {employeeDetail.full_name}
                  </p>
                </div>
                <div className="flex flex-row">
                  <p className="w-24 font-semibold">Email</p>
                  <p className="text-start flex justify-start">
                    <a
                      href={`mailto:${employeeDetail.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-36 font-medium text-start"
                    >
                      {employeeDetail.email}
                    </a>
                  </p>
                </div>
                <div className="flex flex-row">
                  <p className="w-24 font-semibold">Phone Number</p>
                  <p className="text-start flex justify-start">
                    <Link
                      target="_blank"
                      to={`https://wa.me/${employeeDetail.phone_number}`}
                    >
                      <p className="w-36 font-medium text-start">
                        {employeeDetail.phone_number}
                      </p>
                    </Link>
                  </p>
                </div>
                <div className="flex flex-row">
                  <p className="w-24 font-semibold">Position</p>
                  <p className="w-36 font-medium text-start">
                    {employeeDetail.position}
                  </p>
                </div>
              </div>

              <div className="modal-action">
                <form method="dialog">
                  <Button color="primary" type="submit">
                    Close
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

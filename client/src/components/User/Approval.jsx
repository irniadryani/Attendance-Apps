import { Accordion, AccordionItem } from "@nextui-org/react";
import React from "react";
import { getPermissionByIdFn } from "../../api/permission/permission";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

export default function Approval() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: dataSinglePermission,
    refetch: refetchSinglePermission,
    isLoading: loadingSinglePermission,
  } = useQuery({
    queryKey: ["permission", user?.id],
    queryFn: () => getPermissionByIdFn(user?.id),
  });

  console.log("data", dataSinglePermission);
  return (
    <div>
      <dialog id="approval_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-2xl text-center">Approval List</h3>
          <div className="modal-action">
            <div className="card bg-base-100 w-full shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-5">Permission Approval</h2>
                {dataSinglePermission?.map((permission) => (
                <div className="card bg-black w-full shadow-xl flex flex-row justify-between">
                  <div className="p-2 mx-2">
                    <p className="text-white font-semibold text-lg">{permission.notes}</p>
                    <p className="text-white font-semibold text-sm">
                    {`${permission.start_date} - ${permission.end_date}`}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white text-black w-24 h-10 text-center m-3 items-center">
                    <p className="flex text-center justify-center items-center mt-2 font-medium">
                     {permission.status}
                    </p>
                  </div>
                </div>))}
              </div>
            </div>
          </div>
          <div className="modal-action">
            <div className="card bg-base-100 w-full shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Leaves Approval</h2>

                <div className="card bg-black w-full shadow-xl flex flex-row justify-between">
                  <div className="p-2 mx-2">
                    <p className="text-white font-semibold text-lg">Vacation</p>
                    <p className="text-white font-semibold text-sm">
                      2024-08-09
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white text-black w-24 h-10 text-center m-3 items-center">
                    <p className="flex text-center justify-center items-center  mt-2 font-medium">
                      Submitted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-action flex justify-end">
            <form method="dialog">
              <button className="btn bg-black text-white justify-end my-5">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

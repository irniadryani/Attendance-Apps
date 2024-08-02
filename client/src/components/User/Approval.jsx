import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import React from "react";
import { getPermissionByIdFn } from "../../api/permission/permission";
import { getLeavesByIdFn } from "../../api/leaves/leaves";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

export default function Approval() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: dataSingleLeaves,
    refetch: refetchSingleLeaves,
    isLoading: loadingSingleLeaves,
  } = useQuery({
    queryKey: ["Llaves", user?.id],
    queryFn: () => getLeavesByIdFn(user?.id),
  });

  return (
    <div>
      <dialog id="approval_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="modal-action">
            <div className="card bg-base-100 w-full shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-5">Leaves Approval</h2>
                {dataSingleLeaves?.leaves.map((leaves) => (
                  <div className="card bg-black w-full shadow-xl flex flex-row justify-between">
                    <div className="p-2 mx-2">
                      <p className="text-white font-semibold text-lg">
                        {leaves.notes}
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {`${leaves.start_date} - ${leaves.end_date}`}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white text-black w-24 h-10 text-center m-3 items-center">
                      <p className="flex text-center justify-center items-center mt-2 font-medium">
                        {leaves.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-action flex justify-end m-5">
            <form method="dialog">
              <Button color="primary" type="submit">
                Close
              </Button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

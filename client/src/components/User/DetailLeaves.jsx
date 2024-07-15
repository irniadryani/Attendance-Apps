import { Accordion, AccordionItem } from "@nextui-org/react";
import React from "react";
import { getLeavesByIdFn } from "../../api/leaves/leaves";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";


export default function DetailLeaves() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: dataSingleLeaves,
    refetch: refetchSingleLeaves,
    isLoading: loadingSingleLeaves,
  } = useQuery({
    queryKey: ["leaves", user?.id],
    queryFn: () => getLeavesByIdFn(user?.id),
  });

  return (
    <dialog
      id="detail_leaves_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box  w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Leaves History</h3>
        <div className="my-5">
          <Accordion variant="splitted">
          {dataSingleLeaves?.leaves.map((leaves) => (
            <AccordionItem
              key={leaves.id}
              aria-label={`Accordion ${leaves.id}`}
              title= {leaves.status}
              subtitle={`${leaves.start_date} - ${leaves.end_date}`}
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Notes : {leaves.notes}</p>
              </div>
            </AccordionItem>
          ))}
          </Accordion>
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

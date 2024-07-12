import { Accordion, AccordionItem } from "@nextui-org/react";
import React from "react";
import { getPermissionByIdFn } from "../../api/permission/permission";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";


export default function DetailPemission() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: dataSinglePermission,
    refetch: refetchSinglePermission,
    isLoading: loadingSinglePermission,
  } = useQuery({
    queryKey: ["permission", user?.id],
    queryFn: () => getPermissionByIdFn(user?.id),
  });

  console.log("datasinglepermission", dataSinglePermission)

  return (
    <dialog
      id="detail_permission_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Permission History</h3>
        <div className="my-5">
          <Accordion variant="splitted">
          {dataSinglePermission?.map((permission) => (
            <AccordionItem
              key={permission.id}
              aria-label={`Accordion ${permission.id}`}
              title= {permission.notes}
              subtitle={`${permission.start_date} - ${permission.end_date}`}
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Notes : {permission.notes}</p>
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

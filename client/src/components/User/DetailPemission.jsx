import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import React, { useState } from "react";
import { getPermissionByIdFn } from "../../api/permission/permission";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import UpdatePermission from "./UpdatePermission";

export default function DetailPermission() {
  const [permissionToUpdate, setPermissionToUpdate] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const {
    data: dataSinglePermission,
    refetch: refetchSinglePermission,
    isLoading: loadingSinglePermission,
  } = useQuery({
    queryKey: ["permission", user?.id],
    queryFn: () => getPermissionByIdFn(user?.id),
  });

  const openUpdateModal = (permissionId) => {
    document.getElementById("update_permission_modal").showModal();
  };

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  return (
    <dialog
      id="detail_permission_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Permission History</h3>
        <div className="my-5">
          <Accordion variant="splitted">
            {dataSinglePermission?.map((permission) => {
              const currentTime = new Date();
              const createdAt = new Date(permission.created_at);
              const timeDifference = currentTime - createdAt;
              const buttonUpdate = timeDifference <= oneDayInMilliseconds;

              return (
                <AccordionItem
                  key={permission.id}
                  aria-label={`Accordion ${permission.id}`}
                  subtitle={`${permission.start_date} - ${permission.end_date}`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-end">
                      {buttonUpdate && (
                        <button
                          className="btn btn-xs bg-yellow-500 mb-3 text-white rounded-lg"
                          onClick={() => {
                            setPermissionToUpdate(permission);
                            openUpdateModal(permission.id);
                          }}
                        >
                          Edit Permission
                        </button>
                      )}
                    </div>
                    <p className="text-sm font-semibold">
                      Notes : {permission.notes}
                    </p>
                    {permission?.file?.endsWith(".pdf") ? (
                      <iframe
                        src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                          /\/$/,
                          ""
                        )}${permission?.url}`}
                        title="PDF Viewer"
                        width="100%"
                        height="200px"
                      />
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                          /\/$/,
                          ""
                        )}${permission?.url}`}
                        alt="proof"
                        className="h-auto w-60 object-cover object-center"
                      />
                    )}
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="modal-action">
          <form method="dialog">
            <Button color="primary" type="submit">
              Close
            </Button>
          </form>
        </div>
      </div>
      <UpdatePermission
        permission={permissionToUpdate}
        refetch={refetchSinglePermission}
        loading={loadingSinglePermission}
      />
    </dialog>
  );
}

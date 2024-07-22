import React from "react";
import {
  createAnnouncementFn,
  deleteAnnouncementFn,
} from "../../api/announcement/announcement";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Button } from "@nextui-org/react";

export default function CreateAnnouncement({ refetch }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleCreateAnnouncement = useMutation({
    mutationFn: (data) => createAnnouncementFn(data),
    onMutate() {},
    onSuccess: (res) => {
      console.log(res);
      refetch();
      reset();
      Swal.fire({
        icon: "success",
        title: "Announcement Created!",
        text: "The Announcement has been successfully created.",
      });
    },
    onError: (error) => {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "An error occurred",
      });
    },
  });

  const addAnnouncement = (data) => {
    handleCreateAnnouncement.mutateAsync(data);
  };

  return (
    <dialog id="create_announcement_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Create Announcement</h3>
        <form onSubmit={handleSubmit(addAnnouncement)}>
          <div className="w-full my-5">
            <label htmlFor="message">
              <textarea
                className="textarea textarea-bordered textarea-lg w-full"
                {...register("message", { required: true })}
              ></textarea>
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              color="primary"
              onClick={() =>
                document.getElementById("create_announcement_modal").close()
              }
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { updateAnnouncementFn } from "../../api/announcement/announcement";
import { Button } from "@nextui-org/react";

export default function UpdateAnnouncement({ announcement, refetch }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const handleUpdateAnnouncement = useMutation({
    mutationFn: (data) => updateAnnouncementFn(announcement.id, data),
    onSuccess: async () => {
      await refetch();
      Swal.fire({
        icon: "success",
        title: "Announcement Updated!",
        text: "The announcement has been successfully updated.",
      });
      document.getElementById("update_announcement_modal").close();
    },
    onError: async (error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error updating Announcement!",
        text: "An error occurred while updating the announcement.",
      });
    },
  });

  useEffect(() => {
    if (announcement) {
      setValue("message", announcement.message);
    }
  }, [announcement, setValue]);

  const onSubmit = (data) => {
    console.log("data message", data);
    handleUpdateAnnouncement.mutateAsync(data);
  };

  return (
    <dialog id="update_announcement_modal" className="modal">
      <div className="modal-box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            type="button"
            onClick={() => {
              document.getElementById("update_announcement_modal").close();
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>

          <h3 className="font-bold text-lg">Update Announcement</h3>
          <div className="w-full my-5 h-full">
            <label htmlFor="message">
              <textarea
                className="textarea textarea-bordered textarea-lg w-full h-full text-sm"
                {...register("message", { required: true })}
              ></textarea>
              {errors.message && (
                <span className="text-red-500">This field is required</span>
              )}
            </label>
          </div>
          <div className="flex justify-end">
            <Button color="primary" type="submit">
              Update
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

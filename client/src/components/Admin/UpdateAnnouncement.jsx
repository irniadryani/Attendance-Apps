import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { updateAnnouncementFn } from "../../api/announcement/announcement";

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
    handleUpdateAnnouncement.mutate(data);
  };

  return (
    <dialog id="update_announcement_modal" className="modal">
      <div className="modal-box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
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
            <button
              type="submit"
              className="btn bg-black text-white text-xs text-center rounded-lg font-semibold p-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

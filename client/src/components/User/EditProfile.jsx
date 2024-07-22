import React, { useEffect } from "react";
import { getUserByIdFn, updateUserFn } from "../../api/user/user";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export default function EditProfile() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: dataSingleUser,
    refetch: refetchSingleUser,
    isLoading: loadingSingleUser,
  } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserByIdFn(user?.id),
  });

  const {
    register,
    handleSubmit: submitEditProfile,
    formState: { errors },
    reset: resetEditProfile,
    setValue,
  } = useForm({
    defaultValues: {
      full_name: "",
      photo_profil: "",
    },
  });

  useEffect(() => {
    if (user.id !== null || user.id !== undefined) {
      refetchSingleUser();
    }
  }, [user.id, refetchSingleUser]);

  // useEffect(() => {
  //   if (!loadingSingleUser && dataSingleUser) {
  //     resetEditProfile({
  //       full_name: dataSingleUser.full_name,
  //     });
  //   }
  // }, [loadingSingleUser, dataSingleUser]);

  useEffect(() => {
    if (!loadingSingleUser && dataSingleUser) {
      resetEditProfile({
        full_name: dataSingleUser.full_name,
      });

      setValue("photo_profil", dataSingleUser.url);
    }
  }, [loadingSingleUser, dataSingleUser, resetEditProfile]);

  const handleUpdateProfile = useMutation({
    mutationFn: (data) => updateUserFn(user.id, data),

    onMutate() {},
    onSuccess: async (res) => {
      console.log(res);
      document?.getElementById("edit_profil_modal")?.close();
      await refetchSingleUser();
      resetEditProfile();
      await Swal.fire({
        icon: "success",
        title: "Account Changed!",
        text: "The account has been successfully changed.",
      });
    },
    onError: async (error) => {
      console.log(error);

      await document.getElementById("edit_profil_modal").close();
      resetEditProfile();
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to change account.",
      });
    },
  });

  const updateProfile = (data) => {
    const pengajarData = new FormData();
    console.log("data update", data);

    pengajarData.append("full_name", data.full_name);

    if (data.photo_profil[0]) {
      pengajarData.append("photo_profil", data.photo_profil[0]);
    }

    handleUpdateProfile.mutateAsync(pengajarData);
  };


  return (
    <div>
      <dialog
        id="edit_profil_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Edit Profile</h3>
          <form onSubmit={submitEditProfile(updateProfile)}>
            <div>
              <label
                htmlFor="full_name"
                className="form-control w-full max-w-xs"
              >
                <div className="label mt-3 justify-start">
                  <span className="label-text">Change Full Name</span>
                </div>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs rounded-lg"
                {...register("full_name")}
              />
            </div>
            <div>
              <label htmlFor="photo_profil">
                <div className="label mt-3 justify-start">
                  <span className="label-text">Change The Photos</span>
                </div>
              </label>
              <input
                type="file"
                accept=".png, .jpeg, .jpg"
                className="file-input file-input-bordered w-full max-w-xs"
                {...register("photo_profil")}
              />
            </div>

            <div className="w-full flex justify-end">
              <button
                className="btn btn-ghost btn-xl bg-black text-white rounded-xl mt-2"
                type="submit"
              >
                Change
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

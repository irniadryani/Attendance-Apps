import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Layout from "../Layout";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import {
  updateDefaultPasswordFn,
  updateLatitudeFn,
  updateLeavesLimitFn,
  updateLongitudeFn,
  updateMaximumDistanceFn,
  getUserContentFn,
} from "../../api/setting/setting";
import {getLimitLeavesFn} from "../../api/limit/limit"
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Settings() {
  const { register, handleSubmit, setValue } = useForm();

  const { data: settings, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: getUserContentFn,
  });

  const { data: limits, refetch: refetchLimit } = useQuery({
    queryKey: ["limits"],
    queryFn: getLimitLeavesFn,
  });

  console.log("limit", limits)

  useEffect(() => {
    if (settings && settings.length > 0) {
      const setting = settings[0];
      setValue("default_password", setting.default_password);
      setValue("latitude", setting.latitude);
      setValue("longitude", setting.longitude);
      setValue("maximum", setting.maximum);
      setValue("maximum_distance", setting.maximum_distance);
    }
  }, [settings, setValue]);

  useEffect(() => {
    if (limits) {
      setValue("maximum", limits.maximum);
    }
  }, [limits, setValue]);

  const updatePasswordMutation = useMutation({
    mutationFn: updateDefaultPasswordFn,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Default Password updated!",
        text: "The Default Password has been successfully updated.",
      });
      refetch();
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error updating Default Password!",
        text: "An error occurred while updating the default password.",
      });
    },
  });

  const updateMaximumDistanceMutation = useMutation({
    mutationFn: updateMaximumDistanceFn,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Maximum Distance updated!",
        text: "The Maximum Distance has been successfully updated.",
      });
      refetch();
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error updating Maximum Distance!",
        text: "An error occurred while updating the Maximum Distance.",
      });
    },
  });

  const updateLatitudeMutation = useMutation({
    mutationFn: updateLatitudeFn,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Latitude updated!",
        text: "The Latitude has been successfully updated.",
      });
      refetch();
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error updating Latitude!",
        text: "An error occurred while updating the latitude.",
      });
    },
  });

  const updateLongitudeMutation = useMutation({
    mutationFn: updateLongitudeFn,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Longitude updated!",
        text: "The Longitude has been successfully updated.",
      });
      refetch();
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error updating Longitude!",
        text: "An error occurred while updating the longitude.",
      });
    },
  });

  const updateLeavesLimitMutation = useMutation({
    mutationFn: updateLeavesLimitFn,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Leaves Limit updated!",
        text: "The Leaves Limit has been successfully updated.",
      });
      refetchLimit();
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error updating Leaves Limit!",
        text: "An error occurred while updating the leaves limit.",
      });
    },
  });

  const onSubmitPassword = (data) => {
    updatePasswordMutation.mutateAsync({ default_password: data.default_password });
  };

  const onSubmitLatitude = (data) => {
    updateLatitudeMutation.mutateAsync({ latitude: data.latitude });
  };

  const onSubmitLongitude = (data) => {
    updateLongitudeMutation.mutateAsync({ longitude: data.longitude });
  };

  const onSubmitLeavesLimit = (data) => {
    updateLeavesLimitMutation.mutateAsync({ maximum: data.maximum });
  };

  const onSubmitMaximumDistance = (data) => {
    updateMaximumDistanceMutation.mutateAsync({ maximum_distance: data.maximum_distance });
  };

  return (
    <Layout>
      <div>
        <p className="font-bold text-5xl mx-5">Settings</p>
      </div>
      <div className="flex my-10 bg-gray-100 rounded-lg">
        <div className="p-5 w-full">
          <form onSubmit={handleSubmit(onSubmitPassword)}>
            <div>
              <p className="font-bold text-xl">Password</p>
              <div className="flex flex-row gap-5 w-full">
                <div className="w-full">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Default Password User</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full"
                      {...register("default_password")}
                    />
                  </label>
                </div>
                <div className="items-center mt-10 justify-center">
                  <Button color="primary" type="submit">Edit</Button>
                </div>
              </div>
            </div>
          </form>

          <form onSubmit={handleSubmit(onSubmitLatitude)}>
            <div>
              <p className="font-bold text-xl mt-5">Check In Location</p>
              <div className="flex flex-row gap-5 w-full">
                <div className="w-full">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Latitude</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full"
                      {...register("latitude")}
                    />
                  </label>
                </div>
                <div className="items-center mt-10 justify-center">
                  <Button color="primary" type="submit">Edit</Button>
                </div>
              </div>
            </div>
          </form>

          <form onSubmit={handleSubmit(onSubmitLongitude)}>
            <div className="flex flex-row gap-5 w-full">
              <div className="w-full">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Longitude</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    {...register("longitude")}
                  />
                </label>
              </div>
              <div className="items-center mt-10 justify-center">
                <Button color="primary" type="submit">Edit</Button>
              </div>
            </div>
          </form>

          <form onSubmit={handleSubmit(onSubmitMaximumDistance)}>
            <div className="flex flex-row gap-5 w-full">
              <div className="w-full">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Maximum Distance (meters)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    {...register("maximum_distance")}
                  />
                </label>
              </div>
              <div className="items-center mt-10 justify-center">
                <Button color="primary" type="submit">Edit</Button>
              </div>
            </div>
          </form>

          <form onSubmit={handleSubmit(onSubmitLeavesLimit)}>
            <div>
              <p className="font-bold text-xl mt-5">Limit</p>
              <div className="flex flex-row gap-5 w-full">
                <div className="w-full">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Leaves Limit</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full"
                      {...register("maximum")}
                    />
                  </label>
                </div>
                <div className="items-center mt-10 justify-center">
                  <Button color="primary" type="submit">Edit</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

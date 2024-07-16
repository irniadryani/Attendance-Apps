import React from "react";
import { createUserFn } from "../../api/user/user";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

export default function CreateAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleCreateAccountResponse = useMutation({
    mutationFn: (userData) => createUserFn(userData), // Pass userData directly to createUserFn
    onMutate: (data) => {
      console.log("Mutation initiated with data:", data);
      // You can add any onMutate logic here if needed
    },
    onSuccess: (res) => {
      console.log("Success response:", res);
      reset(); // Reset form after successful account creation
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "The Account has been successfully created.",
      });
    },
    onError: (error) => {
      console.log("Error response:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "An error occurred",
      });
    },
  });

  const onSubmit = (formData) => {
    console.log(formData);
    const userData = {
      ...formData,
      role_name: "Admin",
    }; // Ensure role_name is added to userData
    console.log("Form data submitted:", userData);
    handleCreateAccountResponse.mutate(userData); // Call mutate with userData
  };

  return (
    <div className="flex justify-center">
      <div className="card bg-black text-neutral-content w-11/12 shadow-2xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title font-bold text-xl">
            Create Account Employee
          </h2>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-start w-full">
              <div className="w-full">
                <div className="mb-4">
                  <span className="label-text text-white text-start font-semibold block mb-1">
                    Role
                  </span>
                  <label
                    htmlFor="role_name"
                    className="input input-bordered flex items-center gap-2 w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                    >
                      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                      <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                      type="text"
                      className="grow w-full text-black"
                      placeholder="Role"
                      defaultValue="User"
                      disabled
                    />
                  </label>
                </div>

                <div className="mb-4">
                  <span className="label-text text-white text-start font-semibold block mb-1">
                    Full Name
                  </span>
                  {errors.email && (
                    <div className="flex justify-start items-start text-start">
                      <span className="text-red-500 text-xs text-start">
                        Full name is required
                      </span>
                    </div>
                  )}
                  <label
                    htmlFor="full_name"
                    className="input input-bordered flex items-center gap-2 w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                    >
                      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                      <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>

                    <input
                      type="text"
                      className="grow w-full text-black"
                      placeholder="Email"
                      {...register("full_name", { required: true })}
                    />
                  </label>
                </div>
                
                <div className="mb-4">
                  <span className="label-text text-white text-start font-semibold block mb-1">
                    Email
                  </span>
                  {errors.email && (
                    <div className="flex justify-start items-start text-start">
                      <span className="text-red-500 text-xs text-start">
                        Email is required
                      </span>
                    </div>
                  )}
                  <label
                    htmlFor="email"
                    className="input input-bordered flex items-center gap-2 w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                    >
                      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                      <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>

                    <input
                      type="text"
                      className="grow w-full text-black"
                      placeholder="Email"
                      {...register("email", { required: true })}
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn bg-white text-black"
                    onClick={() => {
                      console.log("clicked");
                    }}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

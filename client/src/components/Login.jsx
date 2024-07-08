import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import LoginBG2 from "../assets/login2.png";
import { useDispatch, useSelector } from "react-redux";
import { getMe, loginUser, reset } from "../features/authSlice"; //panggil action dari redux
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //   }
  // }, [user]);

  useEffect(() => {
    if (user?.role === "User") {
      navigate("/");
    }else if (user?.role === "Admin"){
      navigate("/dashboard-admin")
    }
  }, [user]);

  const Auth = (data, e) => {
    e.preventDefault();
    let email = data.email;
    let password = data.password;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="">
            <div className="flex items-center justify-center">
              <img className="h-24 w-40" alt="Logo WGS" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Sign In
            </h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <FormProvider {...useForm}>
                <form className="space-y-6" onSubmit={handleSubmit(Auth)}>
                  {/* {isError && <p className="text-center">{message}</p>} */}
                  <div className="flex flex-col">
                    <label className="mb-2" htmlFor="">
                      Email
                    </label>
                    <input
                      type="text"
                      className="rounded-md border h-12 outline-none appearance-none px-4"
                      {...register("email", { required: true })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="">Password</label>
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="rounded-md border h-12 outline-none appearance-none px-4 w-full"
                        {...register("password", { required: true })}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          togglePassword();
                        }}
                        className="focus:ring-primary-500 absolute top-1/2 -translate-y-1/2 right-3 flex items-center rounded-lg p-1 focus:outline-none focus:ring"
                      >
                        {showPassword ? (
                          <HiEyeOff className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                        ) : (
                          <HiEye className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="btn bg-[#000000] btn-xs sm:btn-sm md:btn-md text-white w-full"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full">
        <img className=" h-full w-full object-center" src={LoginBG2} alt="" />
      </div>
    </div>
  );
}

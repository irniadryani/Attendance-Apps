import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout, reset } from "../features/authSlice";
import { useEffect } from "react";
import EditProfile from "./User/EditProfile";
import { getUserByIdFn } from "../api/user/user";
import { useQuery } from "@tanstack/react-query";
import ChangePassword from "./User/ChangePassword";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError } = useSelector((state) => state.auth);

  const logoutFn = () => {
    dispatch(logout());
    dispatch(reset());
  };

  useEffect(() => {
    if (!user && isError) {
      navigate("/login");
    }
  }, [user, isError]);

  const {
    data: dataSingleUser,
    refetch: refetchSingleUser,
    isLoading: loadingSingleUser,
  } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserByIdFn(user?.id),
  });

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">DailyCheck</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="photo"
                  src={`${process.env.REACT_APP_BACKEND_HOST?.replace(
                    /\/$/,
                    ""
                  )}${dataSingleUser?.url}`}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <button
                  className="justify-between"
                  onClick={() =>
                    document.getElementById("edit_profil_modal").showModal()
                  }
                >
                  Profile
                  <span className="badge">New</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document.getElementById("change_password_modal").showModal()
                  }
                >
                  <a>Password</a>
                </button>
              </li>
              {user.role !== "User" && (
                <li>
                  <Link to="/">
                    <button>
                      <a>Self Attendance</a>
                    </button>
                  </Link>
                </li>
              )}

              <li>
                <button
                  onClick={() => logoutFn()}
                  className="menu-item"
                  activeClassName="font-bold"
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <EditProfile />
      <ChangePassword />
    </div>
  );
};

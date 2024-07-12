import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, reset } from "../features/authSlice";
import { useEffect } from "react";
import EditProfile from "./User/EditProfile";
import { getUserByIdFn} from "../api/user/user"
import { useQuery } from "@tanstack/react-query";

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

  console.log("profil", dataSingleUser?.photo_profil)


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
                  src={dataSingleUser?.photo_profil}
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
                <a>Settings</a>
              </li>
              <li>
                {" "}
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
    </div>
  );
};

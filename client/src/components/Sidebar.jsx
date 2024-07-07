import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, reset } from "../features/authSlice";
import { useEffect } from "react";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError } = useSelector((state) => state.auth);

  const logoutFn = () => {
    dispatch(logout());
    dispatch(reset());
  };

  useEffect(() => {
    if (user) {
      console.log(user.role);
    }
  }, [user]);

  useEffect(() => {
    if (!user && isError) {
      navigate("/login");
    }
  }, [user, isError]);

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <li>
              <NavLink
                to="/dashboard"
                className="menu-item"
                activeClassName="font-bold"
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/users"
                className="menu-item"
                activeClassName="font-bold"
              >
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/permission"
                className="menu-item"
                activeClassName="font-bold"
              >
                Permission List
              </NavLink>
            </li>
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
  );
};

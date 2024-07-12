import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, reset } from "../features/authSlice";
import { useEffect } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { GrGroup } from "react-icons/gr";
import { RiHistoryFill } from "react-icons/ri";
import { LuUserCheck2 } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdApproval } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { TbReportAnalytics } from "react-icons/tb";

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
          <ul className="menu bg-black text-white font-semibold min-h-full w-80 p-4">
            <li>
              <NavLink
                to="/dashboard-admin"
                className="menu-item rounded-xl mb-2"
                activeClassName="font-bold"
              >
                <HiOutlineHome />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/employee-list"
                className="menu-item rounded-xl mb-2"
                activeClassName="font-bold"
              >
                <GrGroup />
                Employee List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance-history"
                className="menu-item rounded-xl mb-2"
                activeClassName="font-bold"
              >
                <RiHistoryFill />
                Employee Attendance
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/approval"
                className="menu-item rounded-xl mb-2"
                activeClassName="font-bold"
              >
                <MdApproval />
                Approval
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/announcement"
                className="menu-item rounded-xl mb-2"
                activeClassName="font-bold"
              >
                <TfiAnnouncement />
               Announcement
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/daily-report"
                className="menu-item rounded-xl mb-2"
                activeClassName="font-bold"
              >
                <TbReportAnalytics />
               Daily Report
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className="menu-item rounded-xl mb-2"
                activeClassName="font-bold"
              >
                <LuUserCheck2 />
                Self Attendance
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/create-account-employee"
                className="menu-item rounded-xl mb-2"
                activeClassName="font-bold"
              >
                <AiOutlineUserAdd />
                Create Account
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => logoutFn()}
                className="menu-item"
                activeClassName="font-bold"
              >
                <TbLogout />
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

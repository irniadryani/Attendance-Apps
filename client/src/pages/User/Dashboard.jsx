import React, { useEffect } from "react";
import Layout from "../Layout";
import { useDispatch, useSelector } from "react-redux";
import Employee from "../../assets/employee.png";
import Calendarr from "../../components/User/Calendar";
import Menu from "../../components/User/Menu";
import History from "../../components/User/History";
import Announcement from "../../components/User/Announcement";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError } = useSelector((state) => state.auth);
  const { attendance, isLoading } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  if (isError) {
    navigate("/login");
  }

  if (user) {
    return (
      <Layout>
        <div className="flex">
          <div className="w-2/3 m-5">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body flex flex-row justify-between">
                <div>
                  <h2 className="card-title font-bold">{`Hello ${user.full_name}`}</h2>
                  <p className="font-semibold">{user.position}</p>
                  <div className="rounded-full bg-black w-full max-w-24 h-8 flex items-center mt-2">
                    <p className="text-white text-center text-xs font-medium">
                      {!attendance && !isLoading && "Not Working"}
                      {attendance &&
                        attendance?.check_in &&
                        attendance?.check_out === null &&
                        "On Work"}
                      {attendance &&
                        attendance?.check_in &&
                        attendance?.check_out &&
                        "Done Working"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-right">
                  <img
                    src={Employee}
                    className="justify-end w-48 " //sm:max-w-sm md:max-w-md lg:max-w-lg h-auto
                    alt="Employee"
                  />
                </div>
              </div>
            </div>

            <Menu />
            <History />
          </div>

          <div className="w-1/3 m-5">
            <Announcement />
          </div>
        </div>
      </Layout>
    );
  }
}

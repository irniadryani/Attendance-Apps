import React, { useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice";

export default function Layout({ children }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  if (user) {
    return (
      <React.Fragment>
        <Navbar />
        <div className="flex h-screen overflow-hidden">
          {user.role !== "User" && <Sidebar />}
          <div className="flex-grow overflow-auto p-4">
            <main>{children}</main>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

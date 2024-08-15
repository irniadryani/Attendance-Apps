import React, { useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice";

export default function Layout({ children }) {
  const { user, isLoadingUser } = useSelector((state) => state.auth);

  if (user) {
    return (
      <div className="overflow-hidden">
        <Navbar />
        <div className="flex h-screen overflow-hidden">
          {user.role !== "User" && <Sidebar />}
          <div className="flex-grow overflow-auto">
            <main>{children}</main>
          </div>
        </div>
      </div>
    );
  }
}

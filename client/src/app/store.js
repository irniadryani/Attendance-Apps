import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import attendanceReducer from "../features/attendanceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
  },
});

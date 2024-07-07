import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../lib/common";
import { checkinFn } from "../api/attendance/attendance";

const initialState = {
  attendance: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getTodayAttendanceByUserId = createAsyncThunk(
  "attendance/getTodayAttendanceByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.get(
        "http://localhost:5000/check-today-attendance"
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        return rejectWithValue(message);
      } else {
        return rejectWithValue("Network error occurred");
      }
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    reset: (state) => initialState,
    setAttendance: (state, action) => {
      state.attendance = action.payload;
    },
  },
  extraReducers: (builder) => {
    // check today attendance
    builder
      .addCase(getTodayAttendanceByUserId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getTodayAttendanceByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendance = action.payload;
      })
      .addCase(getTodayAttendanceByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;

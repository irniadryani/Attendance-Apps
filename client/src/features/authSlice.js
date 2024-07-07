import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { Api } from "../lib/common";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isRefreshing: false,
  isLoggingOut: false,
  message: "",
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await Api.post("http://localhost:5000/login", {
        email,
        password,
      });
      const { accessToken, refreshToken, ...user } = response.data;

      // Set tokens in cookies
      Cookies.set("accessToken", accessToken, { expires: 0.25 }); // 15 minutes
      Cookies.set("refreshToken", refreshToken, { expires: 7 });

      // Navigate to home page after successful login

      return user;
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

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = Cookies.get("refreshToken"); // Access refreshToken from cookies

      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post(
        "http://localhost:5000/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const { accessToken } = response.data;
      Cookies.set("accessToken", accessToken, { expires: 0.25 }); // 15 minutes
      return accessToken;
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

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.get("http://localhost:5000/me");
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

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await Api.post("http://localhost:5000/logout");

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/login";
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
    setUser: (state, action) => {
      state.attendance = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });

    // getMe
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });

    // refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.user = { ...state.user, accessToken: action.payload };
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isRefreshing = false;
        state.isError = true;
        state.message = action.payload;
      });

    // logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.user = null;
        state.isSuccess = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoggingOut = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;

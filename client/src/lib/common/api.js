import axios from "axios";
import { getBackendHost } from "../backend";
import Cookies from "js-cookie";
import { refreshToken } from "../../features/authSlice";
import { store } from "../../app/store";

// Konfigurasi Headers
const headersReg = {
  "Content-Type": "application/json",
  Authorization: "",
  Accept: "*/*",
};

// Konfigurasi URL API menggunakan AXIOS
// getBackendHost() manggil dari .env
export const Api = axios.create({
  baseURL: getBackendHost(),
  headers: headersReg,
});

// Setiap pemanggilan API dia bakal secara dinamis pake
// token yang user dapet setelah login
Api.interceptors.request.use(
  async (config) => {
    // token diambil dari store
    const token = Cookies.get("accessToken");

    if (config?.headers) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const resultAction = await store.dispatch(refreshToken());

        if (refreshToken.fulfilled.match(resultAction)) {
          const accessToken = resultAction.payload;
          Cookies.set("accessToken", accessToken, { expires: 0.25 });

          Api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          return Api(originalRequest);
        }
      } catch (refreshError) {
        if (
          refreshError.response &&
          refreshError.response.data.msg === "Refresh token expired"
        ) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
